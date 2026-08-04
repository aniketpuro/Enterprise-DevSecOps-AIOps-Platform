"""
=============================================================================
KIRA — AIOps Assistant (VPS Edition)
=============================================================================
Replaces: AWS Bedrock Agent + 3 Lambda Functions
Works on: Any VPS with Docker (and optionally Kubernetes + Prometheus)

Architecture:
  ┌─────────────┐     function_calling     ┌──────────────────┐
  │  LLM Brain  │ ──────────────────────►  │  fetch_logs()    │
  │  (Any API)  │ ──────────────────────►  │  fetch_metrics() │
  │             │ ──────────────────────►  │  fetch_health()  │
  └─────────────┘                          └──────────────────┘
        ▲                                          │
        │  user question                           ▼
  ┌─────────────┐                     ┌──────────────────────┐
  │ Streamlit   │                     │  Docker / K8s / VPS  │
  │ Chat UI     │                     │  (your infra)        │
  └─────────────┘                     └──────────────────────┘

Setup:
  1. pip install streamlit openai python-dotenv requests
  2. cp .env.vps.example .env
  3. Fill in your LLM API key
  4. streamlit run kira-vps.py
=============================================================================
"""

import streamlit as st
import subprocess
import requests
import json
import os
import re
import shutil
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Import OpenAI (optional — only needed for openai provider)
try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

# Import boto3 (optional — only needed for bedrock provider)
try:
    import boto3
except ImportError:
    boto3 = None

load_dotenv(override=True)

# =============================================================================
# CONFIG — Change these in .env
# =============================================================================
# LLM Provider: "bedrock" or "openai"
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "bedrock")

# --- OpenAI-compatible provider settings ---
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.ai.kodekloud.com/v1")
LLM_MODEL = os.getenv("LLM_MODEL", "kodekey-pro")

# --- AWS Bedrock provider settings ---
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "")
AWS_SESSION_TOKEN = os.getenv("AWS_SESSION_TOKEN", "")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
BEDROCK_MODEL_ID = os.getenv("BEDROCK_MODEL_ID", "qwen.qwen3-32b-v1:0")

PROMETHEUS_URL = os.getenv("PROMETHEUS_URL", "http://localhost:9090")
# "docker" or "kubernetes"
INFRA_MODE = os.getenv("INFRA_MODE", "docker")
# For kubernetes mode
KUBE_NAMESPACE = os.getenv("KUBE_NAMESPACE", "default")


# =============================================================================
# PAGE CONFIG & CUSTOM CSS (Kira Dark Theme)
# =============================================================================
st.set_page_config(
    page_title="Kira — AIOps Assistant",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;700&display=swap');

    .stApp {
        background-color: #0a0e14;
        color: #c5c8c6;
    }

    .main-header {
        padding: 1.5rem 0 1rem 0;
        border-bottom: 1px solid #1a1f2e;
        margin-bottom: 1.5rem;
    }
    .main-header h1 {
        font-family: 'JetBrains Mono', monospace;
        color: #22d3ee;
        font-size: 1.6rem;
        font-weight: 700;
        margin: 0;
        letter-spacing: -0.5px;
    }
    .main-header p {
        font-family: 'DM Sans', sans-serif;
        color: #5a6270;
        font-size: 0.85rem;
        margin: 0.3rem 0 0 0;
    }

    .status-bar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: #0d1117;
        border: 1px solid #1a1f2e;
        border-radius: 6px;
        margin-bottom: 1rem;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
    }
    .status-dot {
        width: 8px;
        height: 8px;
        background: #22d3ee;
        border-radius: 50%;
        box-shadow: 0 0 6px #22d3ee;
        animation: pulse 2s infinite;
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
    }

    .status-dot-error {
        width: 8px;
        height: 8px;
        background: #ef4444;
        border-radius: 50%;
        box-shadow: 0 0 6px #ef4444;
    }

    .stChatMessage {
        background: #0d1117 !important;
        border: 1px solid #1a1f2e !important;
        border-radius: 8px !important;
        font-family: 'DM Sans', sans-serif !important;
    }

    [data-testid="stChatMessage"]:has([data-testid="chatAvatarIcon-user"]) {
        background: #111820 !important;
        border-left: 3px solid #22d3ee !important;
    }

    [data-testid="stChatMessage"]:has([data-testid="chatAvatarIcon-assistant"]) {
        background: #0d1117 !important;
        border-left: 3px solid #f97316 !important;
    }

    .stChatInput textarea {
        font-family: 'DM Sans', sans-serif !important;
        background: #0d1117 !important;
        color: #c5c8c6 !important;
    }

    [data-testid="stSidebar"] {
        background: #0d1117;
        border-right: 1px solid #1a1f2e;
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0a0e14; }
    ::-webkit-scrollbar-thumb { background: #1a1f2e; border-radius: 3px; }

    .stButton > button {
        background: #111820 !important;
        border: 1px solid #1a1f2e !important;
        color: #8b95a5 !important;
        font-family: 'JetBrains Mono', monospace !important;
        font-size: 0.75rem !important;
        padding: 0.4rem 0.8rem !important;
        border-radius: 4px !important;
        transition: all 0.2s !important;
    }
    .stButton > button:hover {
        border-color: #22d3ee !important;
        color: #22d3ee !important;
        background: #0d1117 !important;
    }

    .tool-call-box {
        background: #111820;
        border: 1px solid #1a1f2e;
        border-left: 3px solid #f97316;
        border-radius: 6px;
        padding: 0.6rem 1rem;
        margin: 0.3rem 0;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        color: #8b95a5;
    }

    #MainMenu { visibility: hidden; }
    footer { visibility: hidden; }
    header { visibility: hidden; }
</style>
""", unsafe_allow_html=True)


# =============================================================================
# TOOL 1: fetch_logs  (replaces Lambda: aiops-fetch-logs)
# =============================================================================
# Instead of CloudWatch, reads from Docker logs / K8s pod logs / journalctl
# =============================================================================

def fetch_logs(container_name: str = "", filter_pattern: str = "ERROR",
               lines: int = 100) -> str:
    """
    Fetches logs from a container or service, filtered by a pattern.
    For Docker: runs 'docker logs' and greps for the pattern.
    For Kubernetes: reads pod logs via kubectl.
    """
    try:
        if INFRA_MODE == "kubernetes":
            # --- Kubernetes mode ---
            ns_args = ["-A"] if KUBE_NAMESPACE == "all" else ["-n", KUBE_NAMESPACE]
            cmd = ["kubectl", "logs", "--tail=50"] + ns_args
            if container_name:
                cmd.append(container_name)
            else:
                # Get logs from all pods
                cmd.extend(["--all-containers=true", "-l", "app"])

            result = subprocess.run(cmd, capture_output=True, text=True,
                                    timeout=15)
            raw_logs = result.stdout + result.stderr

        else:
            # --- Docker mode ---
            if container_name:
                cmd = ["docker", "logs", "--tail", str(lines),
                       container_name]
                result = subprocess.run(cmd, capture_output=True, text=True,
                                        timeout=15)
                raw_logs = result.stdout + "\n" + result.stderr
            else:
                # Get logs from ALL running containers
                ps_result = subprocess.run(
                    ["docker", "ps", "--format", "{{.Names}}"],
                    capture_output=True, text=True, timeout=10
                )
                container_names = [n.strip() for n in
                                   ps_result.stdout.strip().split("\n") if n.strip()]
                raw_logs = ""
                for name in container_names[:10]:  # limit to 10 containers
                    log_result = subprocess.run(
                        ["docker", "logs", "--tail", "30", name],
                        capture_output=True, text=True, timeout=10
                    )
                    container_logs = log_result.stdout + "\n" + log_result.stderr
                    if container_logs.strip():
                        raw_logs += f"\n=== [{name}] ===\n{container_logs}"

        # Filter by pattern
        if filter_pattern and raw_logs:
            filtered_lines = []
            for line in raw_logs.split("\n"):
                if re.search(filter_pattern, line, re.IGNORECASE):
                    filtered_lines.append(line)
            if filtered_lines:
                result_data = {
                    "status": "logs_found",
                    "filter": filter_pattern,
                    "container": container_name or "all",
                    "total_matches": len(filtered_lines),
                    "logs": filtered_lines[:50],  # cap at 50 entries
                }
            else:
                result_data = {
                    "status": "no_logs_found",
                    "message": f"No logs matching '{filter_pattern}' found"
                              f" in {container_name or 'all containers'}.",
                    "filter": filter_pattern,
                }
        else:
            # Return raw logs (truncated)
            result_data = {
                "status": "logs_found",
                "container": container_name or "all",
                "total_lines": len(raw_logs.split("\n")),
                "logs": raw_logs[:5000],
            }

        return json.dumps(result_data, indent=2)

    except subprocess.TimeoutExpired:
        return json.dumps({"status": "error",
                           "message": "Command timed out after 15s"})
    except FileNotFoundError:
        return json.dumps({
            "status": "error",
            "message": f"'{INFRA_MODE}' CLI not found. Is Docker/kubectl "
                       f"installed?"
        })
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})


# =============================================================================
# TOOL 2: fetch_metrics  (replaces Lambda: aiops-fetch-metrics)
# =============================================================================
# Instead of CloudWatch Metrics, queries Prometheus or Docker stats
# =============================================================================

def fetch_metrics(metric_type: str = "cpu",
                  container_name: str = "",
                  promql_query: str = "") -> str:
    """
    Fetches resource metrics. Tries Prometheus first, falls back to docker stats.
    metric_type: cpu, memory, network, disk, or custom (for promql_query).
    """
    # --- Try Prometheus first ---
    if promql_query or _prometheus_available():
        return _fetch_from_prometheus(metric_type, container_name, promql_query)

    # --- Fallback: Docker stats ---
    return _fetch_from_docker_stats(metric_type, container_name)


def _prometheus_available() -> bool:
    """Check if Prometheus is reachable."""
    try:
        r = requests.get(f"{PROMETHEUS_URL}/api/v1/status/buildinfo",
                         timeout=2)
        return r.status_code == 200
    except Exception:
        return False


def _fetch_from_prometheus(metric_type: str, container_name: str,
                           promql_query: str) -> str:
    """Query Prometheus for metrics."""
    # Default PromQL queries for common metric types
    default_queries = {
        "cpu": 'rate(container_cpu_usage_seconds_total{name!=""}[5m]) * 100',
        "memory": 'container_memory_usage_bytes{name!=""} / 1024 / 1024',
        "network": 'rate(container_network_receive_bytes_total{name!=""}[5m])',
        "disk": 'container_fs_usage_bytes{name!=""} / 1024 / 1024',
    }

    query = promql_query or default_queries.get(metric_type, default_queries["cpu"])

    # Filter by container name if specified
    if container_name and not promql_query:
        query = query.replace('{name!=""}',
                              f'{{name=~".*{container_name}.*"}}')

    try:
        response = requests.get(
            f"{PROMETHEUS_URL}/api/v1/query",
            params={"query": query},
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()

        if data["status"] != "success":
            return json.dumps({"status": "error",
                               "message": f"Prometheus error: {data}"})

        results = data["data"]["result"]
        if not results:
            return json.dumps({
                "status": "no_data",
                "message": f"No data for query: {query}",
                "source": "prometheus"
            })

        formatted = []
        for r in results[:20]:  # cap at 20
            labels = r["metric"]
            name = (labels.get("name") or labels.get("container")
                    or labels.get("pod") or "unknown")
            value = round(float(r["value"][1]), 2)
            formatted.append({"name": name, "value": value})

        # Sort by value descending (top consumers first)
        formatted.sort(key=lambda x: x["value"], reverse=True)

        unit_map = {"cpu": "%", "memory": "MB", "network": "bytes/sec",
                    "disk": "MB"}

        return json.dumps({
            "status": "data_found",
            "source": "prometheus",
            "metric_type": metric_type,
            "query_used": query,
            "unit": unit_map.get(metric_type, ""),
            "total_results": len(formatted),
            "summary": {
                "highest": formatted[0] if formatted else None,
                "lowest": formatted[-1] if formatted else None,
            },
            "data": formatted,
        }, indent=2)

    except Exception as e:
        return json.dumps({"status": "error",
                           "message": f"Prometheus query failed: {str(e)}"})


def _fetch_from_docker_stats(metric_type: str,
                             container_name: str) -> str:
    """Fallback: use docker stats for metrics."""
    try:
        fmt = "{{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}"
        cmd = ["docker", "stats", "--no-stream", "--format", fmt]
        if container_name:
            cmd.append(container_name)

        result = subprocess.run(cmd, capture_output=True, text=True,
                                timeout=15)

        if result.returncode != 0:
            return json.dumps({"status": "error",
                               "message": result.stderr.strip()})

        containers = []
        for line in result.stdout.strip().split("\n"):
            if not line.strip():
                continue
            parts = line.split("\t")
            if len(parts) >= 6:
                containers.append({
                    "name": parts[0].lstrip("/"),
                    "cpu_percent": parts[1],
                    "memory_usage": parts[2],
                    "memory_percent": parts[3],
                    "network_io": parts[4],
                    "disk_io": parts[5],
                })

        if not containers:
            return json.dumps({"status": "no_data",
                               "message": "No running containers found.",
                               "source": "docker_stats"})

        # Parse CPU values for summary
        cpu_vals = []
        for c in containers:
            try:
                cpu_vals.append(
                    (c["name"],
                     float(c["cpu_percent"].replace("%", "")))
                )
            except ValueError:
                pass

        cpu_vals.sort(key=lambda x: x[1], reverse=True)

        return json.dumps({
            "status": "data_found",
            "source": "docker_stats",
            "metric_type": "all (cpu, memory, network, disk)",
            "total_containers": len(containers),
            "summary": {
                "highest_cpu": {"name": cpu_vals[0][0],
                                "value": f"{cpu_vals[0][1]}%"}
                if cpu_vals else None,
                "total_containers": len(containers),
            },
            "data": containers,
        }, indent=2)

    except subprocess.TimeoutExpired:
        return json.dumps({"status": "error",
                           "message": "docker stats timed out"})
    except FileNotFoundError:
        return json.dumps({"status": "error",
                           "message": "Docker CLI not found"})
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})


# =============================================================================
# TOOL 3: fetch_health  (replaces Lambda: aiops-fetch-health)
# =============================================================================
# Instead of ECS/RDS/ALB, checks Docker containers or K8s pods
# =============================================================================

def fetch_health(service_type: str = "all",
                 container_name: str = "") -> str:
    """
    Checks the health/status of running services.
    Docker mode: checks container status, health, restart count.
    Kubernetes mode: checks pod status, restarts, crash reasons.
    """
    try:
        if INFRA_MODE == "kubernetes":
            return _fetch_k8s_health(service_type)
        else:
            return _fetch_docker_health(service_type, container_name)
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})


def _fetch_docker_health(service_type: str,
                         container_name: str) -> str:
    """Check Docker container health."""
    fmt = (
        '{\"name\":\"{{.Names}}\", \"status\":\"{{.Status}}\", '
        '\"state\":\"{{.State}}\", \"image\":\"{{.Image}}\", '
        '\"ports\":\"{{.Ports}}\", \"created\":\"{{.CreatedAt}}\"}'
    )
    cmd = ["docker", "ps", "-a", "--format", fmt]
    if container_name:
        cmd.extend(["--filter", f"name={container_name}"])

    result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
    containers = []
    unhealthy = []

    for line in result.stdout.strip().split("\n"):
        if not line.strip():
            continue
        try:
            c = json.loads(line)
            is_healthy = c["state"] == "running"
            c["healthy"] = is_healthy
            containers.append(c)
            if not is_healthy:
                unhealthy.append(c["name"])
        except json.JSONDecodeError:
            pass

    # Get restart counts via docker inspect
    for c in containers:
        try:
            inspect = subprocess.run(
                ["docker", "inspect", "--format",
                 "{{.RestartCount}}", c["name"]],
                capture_output=True, text=True, timeout=5
            )
            c["restart_count"] = int(inspect.stdout.strip() or "0")
        except Exception:
            c["restart_count"] = 0

    overall_healthy = len(unhealthy) == 0 and len(containers) > 0

    return json.dumps({
        "status": "success",
        "source": "docker",
        "overall_healthy": overall_healthy,
        "total_containers": len(containers),
        "running": sum(1 for c in containers if c["healthy"]),
        "stopped_or_unhealthy": unhealthy if unhealthy else "none",
        "containers": containers,
    }, indent=2)


def _fetch_k8s_health(service_type: str) -> str:
    """Check Kubernetes pod/service health."""
    results = {}

    # Pods
    if service_type in ("pods", "all"):
        ns_args = ["-A"] if KUBE_NAMESPACE == "all" else ["-n", KUBE_NAMESPACE]
        cmd = ["kubectl", "get", "pods"] + ns_args + ["-o", "json"]
        result = subprocess.run(cmd, capture_output=True, text=True,
                                timeout=15)
        if result.returncode == 0:
            pods_data = json.loads(result.stdout)
            pods = []
            for pod in pods_data.get("items", []):
                pod_info = {
                    "name": pod["metadata"]["name"],
                    "phase": pod["status"].get("phase", "Unknown"),
                    "restarts": 0,
                    "reason": "Healthy",
                }
                for cs in (pod["status"].get("containerStatuses") or []):
                    pod_info["restarts"] += cs.get("restartCount", 0)
                    if not cs.get("ready", False):
                        waiting = cs.get("state", {}).get("waiting", {})
                        if waiting:
                            pod_info["reason"] = waiting.get("reason",
                                                             "NotReady")
                pods.append(pod_info)
            results["pods"] = {
                "items": pods,
                "all_healthy": all(p["phase"] == "Running" and
                                   p["reason"] == "Healthy" for p in pods),
            }

    # Nodes
    if service_type in ("nodes", "all"):
        cmd = ["kubectl", "get", "nodes", "-o", "json"]
        result = subprocess.run(cmd, capture_output=True, text=True,
                                timeout=15)
        if result.returncode == 0:
            nodes_data = json.loads(result.stdout)
            nodes = []
            for node in nodes_data.get("items", []):
                conditions = {c["type"]: c["status"]
                              for c in node["status"].get("conditions", [])}
                nodes.append({
                    "name": node["metadata"]["name"],
                    "ready": conditions.get("Ready") == "True",
                    "memory_pressure": conditions.get(
                        "MemoryPressure") == "True",
                    "disk_pressure": conditions.get(
                        "DiskPressure") == "True",
                })
            results["nodes"] = {
                "items": nodes,
                "all_healthy": all(n["ready"] for n in nodes),
            }

    # Services
    if service_type in ("services", "all"):
        ns_args = ["-A"] if KUBE_NAMESPACE == "all" else ["-n", KUBE_NAMESPACE]
        cmd = ["kubectl", "get", "svc"] + ns_args + ["-o", "json"]
        result = subprocess.run(cmd, capture_output=True, text=True,
                                timeout=15)
        if result.returncode == 0:
            svc_data = json.loads(result.stdout)
            services = []
            for svc in svc_data.get("items", []):
                services.append({
                    "name": svc["metadata"]["name"],
                    "type": svc["spec"].get("type", "ClusterIP"),
                    "cluster_ip": svc["spec"].get("clusterIP", ""),
                    "ports": [
                        f"{p.get('port')}/{p.get('protocol', 'TCP')}"
                        for p in svc["spec"].get("ports", [])
                    ],
                })
            results["services"] = {"items": services}

    overall_healthy = all(
        results.get(k, {}).get("all_healthy", True)
        for k in ["pods", "nodes"]
        if k in results
    )

    return json.dumps({
        "status": "success",
        "source": "kubernetes",
        "namespace": KUBE_NAMESPACE,
        "overall_healthy": overall_healthy,
        "checks": list(results.keys()),
        "details": results,
    }, indent=2)


# =============================================================================
# TOOL DEFINITIONS FOR LLM (OpenAI function-calling format)
# =============================================================================
# These map exactly to the 3 Lambda functions / Bedrock action groups
# =============================================================================

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "fetch_logs",
            "description": (
                "Fetches and searches application logs from running "
                "containers/pods. Use when investigating errors, exceptions, "
                "warnings, timeouts, connection issues, or any log-level "
                "problems. Can search all containers or a specific one."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "container_name": {
                        "type": "string",
                        "description": (
                            "Name of the container/pod to get logs from. "
                            "Leave empty to search ALL containers."
                        ),
                    },
                    "filter_pattern": {
                        "type": "string",
                        "description": (
                            "Pattern to search for in logs. Examples: ERROR, "
                            "503, timeout, OOM, connection refused, Exception, "
                            "WARN, FATAL. Supports regex."
                        ),
                    },
                    "lines": {
                        "type": "integer",
                        "description": "Number of recent log lines to fetch "
                                       "(default: 100).",
                    },
                },
                "required": ["filter_pattern"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "fetch_metrics",
            "description": (
                "Fetches resource usage metrics (CPU, memory, network, disk) "
                "for containers/pods. Uses Prometheus if available, otherwise "
                "falls back to docker stats. Use when investigating "
                "performance issues, high CPU, memory leaks, resource "
                "exhaustion, or capacity problems."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "metric_type": {
                        "type": "string",
                        "enum": ["cpu", "memory", "network", "disk",
                                 "custom"],
                        "description": (
                            "Type of metric to fetch. Use 'custom' with "
                            "promql_query for advanced Prometheus queries."
                        ),
                    },
                    "container_name": {
                        "type": "string",
                        "description": "Filter metrics for a specific "
                                       "container. Leave empty for all.",
                    },
                    "promql_query": {
                        "type": "string",
                        "description": (
                            "Custom PromQL query (only when metric_type is "
                            "'custom'). Example: "
                            "rate(http_requests_total[5m])"
                        ),
                    },
                },
                "required": ["metric_type"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "fetch_health",
            "description": (
                "Checks the live health status of all running services — "
                "container states, restart counts, crash reasons. Use when "
                "the user asks 'are services healthy?', 'is anything down?', "
                "'what is the status?', or for a general system health check."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "service_type": {
                        "type": "string",
                        "enum": ["all", "pods", "nodes", "services"],
                        "description": (
                            "What to check. 'all' for full health check. "
                            "In Docker mode, always checks all containers."
                        ),
                    },
                    "container_name": {
                        "type": "string",
                        "description": "Check a specific container only.",
                    },
                },
                "required": [],
            },
        },
    },
]

# Map function names to actual functions
TOOL_FUNCTIONS = {
    "fetch_logs": fetch_logs,
    "fetch_metrics": fetch_metrics,
    "fetch_health": fetch_health,
}


# =============================================================================
# KIRA SYSTEM PROMPT (same SRE persona as Bedrock Agent)
# =============================================================================

SYSTEM_PROMPT = f"""You are Kira, a senior Site Reliability Engineer with 12 years of experience managing large-scale production systems. You have deep expertise in distributed systems, database performance tuning, container orchestration, and incident response.

You think like a real SRE during an incident — calm, methodical, and data-driven. You never guess. You always look at the data first before drawing conclusions.

You have 3 tools:
- fetch_logs: Search container/pod logs for errors, warnings, patterns
- fetch_metrics: Get CPU, memory, network, disk usage metrics
- fetch_health: Check container/pod health, restart counts, crash status

Current infrastructure mode: {INFRA_MODE}
{"Kubernetes namespace: " + KUBE_NAMESPACE if INFRA_MODE == "kubernetes" else "Docker containers on this host"}

When an engineer comes with a problem:
Step 1: Understand the symptom.
Step 2: Form a hypothesis.
Step 3: Gather evidence using your tools — call MULTIPLE tools if needed.
Step 4: Diagnose by correlating the data across logs, metrics, and service health.
Step 5: Respond with:
  - 🔴 Root Cause (what's actually wrong)
  - 📊 Evidence (specific log entries, metric values, health statuses)
  - 🛠️ Immediate Fix (exact commands to run)
  - 🛡️ Prevention (how to stop it happening again)

Always cite specific log entries or metric values when drawing conclusions. Be concise but thorough.
If you need more information, call multiple tools before responding.
IMPORTANT: Always use your tools to get real data. Never fabricate data."""


# =============================================================================
# LLM CLIENT
# =============================================================================

@st.cache_resource
def get_llm_client():
    """Get OpenAI-compatible client (for openai provider)."""
    if OpenAI is None:
        return None
    return OpenAI(api_key=LLM_API_KEY, base_url=LLM_BASE_URL)


@st.cache_resource
def get_bedrock_client():
    """Get AWS Bedrock runtime client."""
    if boto3 is None:
        return None
    kwargs = {"service_name": "bedrock-runtime", "region_name": AWS_REGION}
    if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
        kwargs["aws_access_key_id"] = AWS_ACCESS_KEY_ID
        kwargs["aws_secret_access_key"] = AWS_SECRET_ACCESS_KEY
        if AWS_SESSION_TOKEN:
            kwargs["aws_session_token"] = AWS_SESSION_TOKEN
        else:
            kwargs["aws_session_token"] = None
    return boto3.client(**kwargs)


def _convert_tools_to_bedrock_format():
    """Convert OpenAI-format tools to Bedrock converse toolConfig."""
    bedrock_tools = []
    for tool in TOOLS:
        func = tool["function"]
        bedrock_tools.append({
            "toolSpec": {
                "name": func["name"],
                "description": func["description"],
                "inputSchema": {
                    "json": func["parameters"]
                }
            }
        })
    return {"tools": bedrock_tools}


def run_agent_bedrock(user_prompt: str, message_history: list) -> str:
    """
    Agent loop using AWS Bedrock Converse API with tool calling.
    Same pattern: LLM decides which tools to call → executes → reasons → answers.
    """
    client = get_bedrock_client()
    tool_config = _convert_tools_to_bedrock_format()

    # Build messages in Bedrock format
    messages = []
    for msg in message_history:
        if msg["role"] == "user":
            messages.append({"role": "user",
                             "content": [{"text": msg["content"]}]})
        elif msg["role"] == "assistant":
            messages.append({"role": "assistant",
                             "content": [{"text": msg["content"]}]})
    messages.append({"role": "user", "content": [{"text": user_prompt}]})

    try:
        max_iterations = 5
        iteration = 0

        while iteration <= max_iterations:
            iteration += 1

            # Call Bedrock
            response = client.converse(
                modelId=BEDROCK_MODEL_ID,
                messages=messages,
                system=[{"text": SYSTEM_PROMPT}],
                toolConfig=tool_config,
                inferenceConfig={
                    "maxTokens": 4096,
                    "temperature": 0.3,
                },
            )

            stop_reason = response.get("stopReason", "end_turn")
            output_message = response["output"]["message"]
            messages.append(output_message)

            # If no tool use, extract final text
            if stop_reason == "end_turn" or stop_reason != "tool_use":
                text_parts = []
                for block in output_message["content"]:
                    if "text" in block:
                        text_parts.append(block["text"])
                return "\n".join(text_parts) or "⚠️ No response from Kira."

            # Handle tool calls
            tool_results = []
            for block in output_message["content"]:
                if "toolUse" in block:
                    tool_use = block["toolUse"]
                    func_name = tool_use["name"]
                    args = tool_use.get("input", {})
                    tool_use_id = tool_use["toolUseId"]

                    # Show which tool is being called
                    st.markdown(
                        f'<div class="tool-call-box">'
                        f'🔧 Calling <b>{func_name}</b>'
                        f'({", ".join(f"{k}={v!r}" for k, v in args.items())})'
                        f'</div>',
                        unsafe_allow_html=True,
                    )

                    # Execute the tool
                    if func_name in TOOL_FUNCTIONS:
                        tool_result = TOOL_FUNCTIONS[func_name](**args)
                    else:
                        tool_result = json.dumps(
                            {"error": f"Unknown tool: {func_name}"}
                        )

                    tool_results.append({
                        "toolResult": {
                            "toolUseId": tool_use_id,
                            "content": [{"text": tool_result}],
                        }
                    })

            # Send tool results back to Bedrock
            if tool_results:
                messages.append({"role": "user", "content": tool_results})

        return "⚠️ Max tool iterations reached."

    except Exception as e:
        return f"⚠️ Error: {str(e)}"


def run_agent_openai(user_prompt: str, message_history: list) -> str:
    """
    Agent loop using OpenAI-compatible API with tool calling.
    Works with: OpenAI, Gemini, KodeKloud, Ollama, etc.
    """
    client = get_llm_client()

    # Build messages with system prompt
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in message_history:
        if msg["role"] in ("user", "assistant"):
            messages.append({"role": msg["role"], "content": msg["content"]})
    messages.append({"role": "user", "content": user_prompt})

    try:
        response = client.chat.completions.create(
            model=LLM_MODEL,
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
        )
        response_message = response.choices[0].message

        max_iterations = 5
        iteration = 0

        while response_message.tool_calls and iteration < max_iterations:
            iteration += 1
            messages.append(response_message)

            for tool_call in response_message.tool_calls:
                func_name = tool_call.function.name
                try:
                    args = json.loads(tool_call.function.arguments)
                except json.JSONDecodeError:
                    args = {}

                st.markdown(
                    f'<div class="tool-call-box">'
                    f'🔧 Calling <b>{func_name}</b>'
                    f'({", ".join(f"{k}={v!r}" for k, v in args.items())})'
                    f'</div>',
                    unsafe_allow_html=True,
                )

                if func_name in TOOL_FUNCTIONS:
                    tool_result = TOOL_FUNCTIONS[func_name](**args)
                else:
                    tool_result = json.dumps(
                        {"error": f"Unknown tool: {func_name}"}
                    )

                messages.append({
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": func_name,
                    "content": tool_result,
                })

            response = client.chat.completions.create(
                model=LLM_MODEL,
                messages=messages,
                tools=TOOLS,
                tool_choice="auto",
            )
            response_message = response.choices[0].message

        return response_message.content or "⚠️ No response from Kira."

    except Exception as e:
        return f"⚠️ Error: {str(e)}"


def run_agent(user_prompt: str, message_history: list) -> str:
    """Route to the correct LLM provider."""
    if LLM_PROVIDER == "bedrock":
        return run_agent_bedrock(user_prompt, message_history)
    else:
        return run_agent_openai(user_prompt, message_history)


# =============================================================================
# VALIDATE CONFIG
# =============================================================================
if LLM_PROVIDER == "bedrock":
    config_ok = bool(AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY)
    display_model = BEDROCK_MODEL_ID
else:
    config_ok = bool(LLM_API_KEY)
    display_model = LLM_MODEL

# Detect infrastructure
docker_available = shutil.which("docker") is not None
kubectl_available = shutil.which("kubectl") is not None


# =============================================================================
# HEADER
# =============================================================================
st.markdown("""
<div class="main-header">
    <h1>⚡ KIRA</h1>
    <p>AIOps Assistant — Root Cause Analysis Engine (VPS Edition)</p>
</div>
""", unsafe_allow_html=True)


# =============================================================================
# CONFIG ERROR
# =============================================================================
if not config_ok:
    st.markdown("""
    <div class="status-bar">
        <div class="status-dot-error"></div>
        <span style="color: #ef4444;">NOT CONFIGURED</span>
    </div>
    """, unsafe_allow_html=True)

    st.error("Missing LLM API key. Create a `.env` file with:")
    st.code("""# LLM Configuration (any OpenAI-compatible API)
LLM_API_KEY=your_api_key_here
LLM_BASE_URL=https://api.ai.kodekloud.com/v1
LLM_MODEL=kodekey-pro

# Or use OpenAI:
# LLM_BASE_URL=https://api.openai.com/v1
# LLM_MODEL=gpt-4o

# Or use local Ollama:
# LLM_BASE_URL=http://localhost:11434/v1
# LLM_MODEL=llama3
# LLM_API_KEY=ollama

# Infrastructure mode: docker or kubernetes
INFRA_MODE=docker

# Optional: Prometheus URL (if you have monitoring)
# PROMETHEUS_URL=http://localhost:9090""", language="bash")
    st.stop()


# =============================================================================
# STATUS BAR
# =============================================================================
infra_icon = "🐳" if INFRA_MODE == "docker" else "☸️"
infra_status = ("Docker ✓" if docker_available else "Docker ✗") if INFRA_MODE == "docker" else ("K8s ✓" if kubectl_available else "K8s ✗")
prom_status = "Prometheus ✓" if _prometheus_available() else "Prometheus ✗"

st.markdown(f"""
<div class="status-bar">
    <div class="status-dot"></div>
    <span style="color: #22d3ee;">ONLINE</span>
    <span style="color: #2a3040;">|</span>
    <span style="color: #5a6270;">{infra_icon} {infra_status}</span>
    <span style="color: #2a3040;">|</span>
    <span style="color: #5a6270;">📊 {prom_status}</span>
    <span style="color: #2a3040;">|</span>
    <span style="color: #5a6270;">🧠 {display_model}</span>
</div>
""", unsafe_allow_html=True)


# =============================================================================
# SESSION STATE
# =============================================================================
if "messages" not in st.session_state:
    st.session_state.messages = []
if "session_id" not in st.session_state:
    import uuid
    st.session_state.session_id = str(uuid.uuid4())


# =============================================================================
# QUICK ACTION BUTTONS
# =============================================================================
col1, col2, col3, col4 = st.columns(4)
with col1:
    if st.button("🔴 Check errors"):
        st.session_state.quick_action = "Are there any errors in the logs? Check all containers for ERROR, FATAL, or exception patterns."
with col2:
    if st.button("📊 CPU & Memory"):
        st.session_state.quick_action = "Check CPU and memory usage across all services. Is anything running hot?"
with col3:
    if st.button("🏥 Health check"):
        st.session_state.quick_action = "Run a full health check — are all services running? Any restarts or crashes?"
with col4:
    if st.button("🔍 Full diagnosis"):
        st.session_state.quick_action = "Run a complete system diagnosis: check health, errors in logs, and resource usage. Give me a full status report."

st.markdown("<div style='height: 0.5rem'></div>", unsafe_allow_html=True)


# =============================================================================
# CHAT HISTORY
# =============================================================================
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])


# =============================================================================
# HANDLE INPUT
# =============================================================================
quick_action = st.session_state.pop("quick_action", None)
user_input = st.chat_input("Describe the issue... e.g. 'Why is the API container restarting?'")
prompt = quick_action or user_input

if prompt:
    # Show user message
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # Get agent response (with tool calling loop)
    with st.chat_message("assistant"):
        with st.spinner("🔍 Kira is investigating..."):
            response = run_agent(prompt, st.session_state.messages[:-1])
        st.markdown(response)

    st.session_state.messages.append(
        {"role": "assistant", "content": response}
    )


# =============================================================================
# SIDEBAR
# =============================================================================
with st.sidebar:
    st.markdown("""
    <div style="font-family: 'JetBrains Mono', monospace; padding: 1rem 0;">
        <h3 style="color: #22d3ee; font-size: 1rem;">⚡ KIRA</h3>
        <p style="color: #5a6270; font-size: 0.8rem;">AIOps Assistant v2.0 (VPS Edition)</p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")
    st.markdown("**🔧 Tools Available:**")
    st.markdown("- 📋 `fetch_logs` — Container/Pod Logs")
    st.markdown("- 📊 `fetch_metrics` — CPU/Memory/Network/Disk")
    st.markdown("- 🏥 `fetch_health` — Service Health & Restarts")

    st.markdown("---")
    st.markdown(f"**⚙️ Configuration:**")
    st.markdown(f"- Mode: `{INFRA_MODE}`")
    st.markdown(f"- Provider: `{LLM_PROVIDER}`")
    st.markdown(f"- Model: `{display_model}`")
    st.markdown(f"- Docker: {'✅' if docker_available else '❌'}")
    st.markdown(f"- Kubectl: {'✅' if kubectl_available else '❌'}")
    st.markdown(f"- Prometheus: {'✅' if _prometheus_available() else '❌'}")

    st.markdown("---")
    st.markdown("**💬 Sample Questions:**")
    st.markdown("""
    - Why is the API container crashing?
    - Are there any 503 errors?
    - Which container is using most CPU?
    - Is there a memory leak?
    - Run a full health check
    - Check for timeout errors
    """)

    st.markdown("---")
    if st.button("🔄 New Session"):
        st.session_state.messages = []
        import uuid
        st.session_state.session_id = str(uuid.uuid4())
        st.rerun()
