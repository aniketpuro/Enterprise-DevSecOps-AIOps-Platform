try:
    import streamlit as st
except Exception:
    # If Streamlit is not available in the environment (linting / import errors),
    # provide a clear runtime error so the developer knows to install it.
    st = None
import google.generativeai as genai
from kubernetes import client, config
import requests
import json
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- CONFIGURATION & AUTH ---


if st is None:
    raise SystemExit("Missing dependency: streamlit is not installed. Please run 'pip install streamlit' and try again.")

st.set_page_config(page_title="OpsAssist - Gemini AIOps", page_icon="🤖")

# Load Gemini API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    st.error("Missing GEMINI_API_KEY. Please set it in your environment variables.")
    st.stop()

genai.configure(api_key=GEMINI_API_KEY)

# Initialize Kubernetes Client
try:
    # Try in-cluster config first (if running in a Pod)
    config.load_incluster_config()
except Exception:
    try:
        # Fallback to local kubeconfig
        config.load_kube_config()
    except Exception as e:
        st.error(f"Could not connect to Kubernetes: {e}")
        st.stop()

# --- TOOL DEFINITIONS (SRE FUNCTIONS) ---

def fetch_cluster_health(namespace: str = "default"):
    """
    Checks the status of all pods in a given namespace.
    Returns a JSON summary of pod phases and container restart reasons.
    """
    v1 = client.CoreV1Api()
    try:
        pods = v1.list_namespaced_pod(namespace)
        summary = []
        for pod in pods.items:
            pod_status = {
                "name": pod.metadata.name,
                "phase": pod.status.phase,
                "restarts": 0,
                "reason": "Healthy"
            }
            if pod.status.container_statuses:
                for cs in pod.status.container_statuses:
                    pod_status["restarts"] += cs.restart_count
                    if not cs.ready and cs.state.waiting:
                        pod_status["reason"] = cs.state.waiting.reason
            summary.append(pod_status)
        return json.dumps(summary)
    except Exception as e:
        return f"Error fetching health: {str(e)}"

def fetch_pod_logs(pod_name: str, namespace: str = "default"):
    """
    Retrieves the last 50 lines of logs for a specific pod to diagnose crashes.
    """
    v1 = client.CoreV1Api()
    try:
        logs = v1.read_namespaced_pod_log(name=pod_name, namespace=namespace, tail_lines=50)
        return logs
    except Exception as e:
        return f"Error fetching logs for {pod_name}: {str(e)}"

def fetch_prometheus_metrics(query: str):
    """
    Executes a PromQL query against the local Prometheus instance.
    URL: http://prometheus-operated.monitoring.svc.cluster.local:9090
    """
    prometheus_url = "http://prometheus-operated.monitoring.svc.cluster.local:9090/api/v1/query"
    try:
        response = requests.get(prometheus_url, params={'query': query}, timeout=10)
        response.raise_for_status()
        return json.dumps(response.json()['data']['result'])
    except Exception as e:
        return f"Prometheus Query Failed: {str(e)}"

# --- GEMINI MODEL SETUP ---

SYSTEM_INSTRUCTION = (
    "You are OpsAssist, a Senior DevOps and Site Reliability Engineer. "
    "Your goal is to help users diagnose and troubleshoot production issues in Kubernetes clusters. "
    "The infrastructure is provisioned via Terraform and automated via Python scripts. "
    "You have access to real-time cluster health, logs, and Prometheus metrics. "
    "When a user reports an issue, use your tools to investigate. "
    "Always provide a root-cause analysis and suggest specific kubectl or terraform commands for remediation."
)

try:
    # Use 'gemini-flash-latest' from the confirmed available models list
    model = genai.GenerativeModel(
        model_name="gemini-flash-latest",
        tools=[fetch_cluster_health, fetch_pod_logs, fetch_prometheus_metrics],
        system_instruction=SYSTEM_INSTRUCTION
    )
    SYSTEM_INSTRUCTION_PREFIX = ""
except TypeError:
    # Fallback for older library versions
    model = genai.GenerativeModel(
        model_name="gemini-flash-latest",
        tools=[fetch_cluster_health, fetch_pod_logs, fetch_prometheus_metrics]
    )
    SYSTEM_INSTRUCTION_PREFIX = f"[SYSTEM: {SYSTEM_INSTRUCTION}]\n\n"
except Exception as e:
    st.error(f"Model Initialization Error: {e}")
    model = genai.GenerativeModel(model_name="gemini-pro-latest")
    SYSTEM_INSTRUCTION_PREFIX = ""

# --- STREAMLIT UI ---

st.title("📟 OpsAssist: Gemini AIOps")
st.caption("Open-Source Kubernetes Diagnostics powered by Gemini 1.5 Flash")

if "chat_session" not in st.session_state:
    st.session_state.chat_session = model.start_chat(enable_automatic_function_calling=True)

if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if prompt := st.chat_input("Explain the issue (e.g., 'Why is the gateway service failing?')"):
    # Apply fallback prefix if needed
    effective_prompt = f"{SYSTEM_INSTRUCTION_PREFIX}{prompt}"
    
    st.chat_message("user").markdown(prompt)
    st.session_state.messages.append({"role": "user", "content": prompt})

    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        try:
            # Use effective_prompt which might include system instructions
            response = st.session_state.chat_session.send_message(effective_prompt)
            full_response = response.text
            message_placeholder.markdown(full_response)
            st.session_state.messages.append({"role": "assistant", "content": full_response})
            
            # Reset prefix after first use in session
            if SYSTEM_INSTRUCTION_PREFIX != "":
                st.session_state.fallback_prefix_used = True
        except Exception as e:
            st.error(f"Error generating response: {e}")

with st.sidebar:
    st.header("Cluster Context")
    if st.button("Refresh Cluster Health"):
        health_data = fetch_cluster_health()
        st.json(health_data)
