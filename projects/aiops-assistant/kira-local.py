import streamlit as st
import subprocess
import requests
import json
from openai import OpenAI

st.set_page_config(page_title="Kira - Docker AIOps", page_icon="🤖")

API_KEY = "sk-gJ78Srk2iN-3A4zgXcH8uA"
BASE_URL = "https://api.ai.kodekloud.com/v1"
MODEL_NAME = "kodekey-pro"

try:
    client = OpenAI(
        api_key=API_KEY,
        base_url=BASE_URL
    )
except Exception as e:
    st.error(f"Failed to initialize API client: {e}")
    st.stop()

# --- SRE TOOLS FOR KIRA ---
def fetch_docker_health():
    """Fetches health of local docker containers."""
    try:
        result = subprocess.run(["docker", "ps", "--format", '{"name":"{{.Names}}", "status":"{{.Status}}", "state":"{{.State}}"}'], capture_output=True, text=True)
        containers = []
        for line in result.stdout.strip().split('\n'):
            if line:
                try:
                    containers.append(json.loads(line))
                except:
                    pass
        return json.dumps(containers)
    except Exception as e:
        return str(e)

def fetch_docker_logs(container_name):
    """Fetches last 50 lines of logs for a docker container."""
    try:
        result = subprocess.run(["docker", "logs", "--tail", "50", container_name], capture_output=True, text=True)
        logs = result.stdout + "\n" + result.stderr
        return logs[-3000:] if len(logs) > 3000 else logs
    except Exception as e:
        return str(e)

tools = [
    {
        "type": "function",
        "function": {
            "name": "fetch_docker_health",
            "description": "Checks the status and health of all running Docker containers in the local environment.",
            "parameters": {"type": "object", "properties": {}, "required": []}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "fetch_docker_logs",
            "description": "Retrieves the last 50 lines of logs for a specific docker container.",
            "parameters": {
                "type": "object",
                "properties": {
                    "container_name": {"type": "string", "description": "Name of the docker container (e.g. boutique-gateway, boutique-postgres)"}
                },
                "required": ["container_name"]
            }
        }
    }
]

# --- UI ---
st.title("🤖 Kira: Local AI SRE")
st.caption("Powered by KodeKloud API (Anthropic - Claude Sonnet 4.6)")

if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "system", "content": "You are Kira, a Senior Site Reliability Engineer. Your job is to help the user diagnose issues in their local Docker environment. Use your tools to check container health and logs. Be concise and professional."}
    ]

# Display history
for msg in st.session_state.messages:
    if msg["role"] not in ["system", "tool"] and getattr(msg, "tool_calls", None) is None:
        content = msg.get("content") if isinstance(msg, dict) else getattr(msg, "content", None)
        role = msg.get("role") if isinstance(msg, dict) else getattr(msg, "role", None)
        if content:
            with st.chat_message(role):
                st.markdown(content)

if prompt := st.chat_input("Ask Kira to check the system (e.g. 'Are all containers running?')"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        
        try:
            # We use the exact model string provided by the user
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=st.session_state.messages,
                tools=tools,
                tool_choice="auto"
            )
            
            response_message = response.choices[0].message
            
            if response_message.tool_calls:
                st.session_state.messages.append(response_message)
                for tool_call in response_message.tool_calls:
                    func_name = tool_call.function.name
                    args = json.loads(tool_call.function.arguments)
                    
                    with st.status(f"Kira is running `{func_name}`..."):
                        if func_name == "fetch_docker_health":
                            result = fetch_docker_health()
                        elif func_name == "fetch_docker_logs":
                            result = fetch_docker_logs(args.get("container_name", ""))
                        st.write(result)
                        
                    st.session_state.messages.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": func_name,
                        "content": result
                    })
                
                # Second call to get final answer
                final_response = client.chat.completions.create(
                    model=MODEL_NAME,
                    messages=st.session_state.messages
                )
                full_text = final_response.choices[0].message.content
            else:
                full_text = response_message.content
                
            message_placeholder.markdown(full_text)
            st.session_state.messages.append({"role": "assistant", "content": full_text})
            
        except Exception as e:
            st.error(f"Error communicating with API: {e}")
