import subprocess
import os
import sys
import json

REGION = "us-east-1"
CLUSTER_NAME = "eks-cluster"

def run_command(command, check=True, env=None):
    """Run command and return output"""
    print(f"Running: {command}")
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            env=env or os.environ.copy(),
            check=check
        )
        if result.stdout:
            print(result.stdout)
        if result.stderr and check:
            print(result.stderr, file=sys.stderr)
        return result
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr}")
        if check:
            raise
        return e

def main():
    # Set environment
    env = os.environ.copy()
    env["AWS_ENDPOINT_URL"] = "http://localhost:4566"
    env["AWS_ACCESS_KEY_ID"] = "test"
    env["AWS_SECRET_ACCESS_KEY"] = "test"
    env["AWS_DEFAULT_REGION"] = REGION

    print("🧹 Starting cleanup...")

    # Update kubeconfig
    print("\nConfiguring Kubeconfig...")
    run_command(
        f"python -m awscli eks update-kubeconfig --region {REGION} --name {CLUSTER_NAME} --endpoint-url http://localhost:4566",
        env=env
    )

    # Patch kubeconfig to use python -m awscli
    import pathlib
    kubeconfig_path = pathlib.Path.home() / '.kube' / 'config'
    if kubeconfig_path.exists():
        with open(kubeconfig_path, 'r') as f:
            content = f.read()
        if 'command: aws' in content:
            content = content.replace('command: aws', 'command: python')
            content = content.replace('      args:\n', '      args:\n      - -m\n      - awscli\n')
            with open(kubeconfig_path, 'w') as f:
                f.write(content)
            print("✓ Kubeconfig patched to use 'python -m awscli'")

    # Delete all Helm releases in argocd namespaces
    print("\nDeleting Helm releases...")
    releases_to_delete = [
        ("argocd", "argocd"),
        ("argocd-v2", "argocd"),
        ("argocd-sys", "argocd-sys"),
        ("kube-prometheus-stack", "monitoring"),
        ("kube-prometheus-stack-v2", "monitoring"),
        ("kube-prometheus-stack-sys", "monitoring-sys"),
    ]
    
    for release_name, namespace in releases_to_delete:
        run_command(f"helm uninstall {release_name} -n {namespace}", check=False)

    # Delete namespaces (this removes everything including CRDs scoped to namespace)
    print("\nDeleting namespaces...")
    namespaces = ["argocd", "argocd-sys", "monitoring", "monitoring-sys", "boutique"]
    for ns in namespaces:
        run_command(f"kubectl delete namespace {ns} --ignore-not-found=true --timeout=60s", check=False)

    # Force delete stuck namespaces (Windows compatible using Python)
    print("\nForce removing finalizers from stuck namespaces...")
    for ns in namespaces:
        res = subprocess.run(f"kubectl get namespace {ns} -o json", shell=True, capture_output=True, text=True)
        if res.returncode == 0 and res.stdout.strip():
            try:
                ns_data = json.loads(res.stdout)
                if "finalizers" in ns_data.get("spec", {}):
                    ns_data["spec"]["finalizers"] = []
                    import tempfile
                    with tempfile.NamedTemporaryFile('w', delete=False, suffix='.json') as temp_f:
                        json.dump(ns_data, temp_f)
                        temp_path = temp_f.name
                    run_command(f"kubectl replace --raw /api/v1/namespaces/{ns}/finalize -f {temp_path}", check=False)
                    os.remove(temp_path)
            except Exception as e:
                print(f"Could not remove finalizer for {ns}: {e}")

    # Delete ArgoCD CRDs (cluster-scoped resources)
    print("\nDeleting ArgoCD CRDs...")
    argocd_crds = [
        "applications.argoproj.io",
        "applicationsets.argoproj.io",
        "appprojects.argoproj.io"
    ]
    for crd in argocd_crds:
        run_command(f"kubectl delete crd {crd} --ignore-not-found=true", check=False)

    # Delete Prometheus CRDs
    print("\nDeleting Prometheus CRDs...")
    run_command("kubectl delete crd --selector=app.kubernetes.io/name=kube-prometheus-stack --ignore-not-found=true", check=False)
    
    # Also blindly delete known Prometheus CRDs just in case the label doesn't match
    prom_crds = [
        "alertmanagerconfigs.monitoring.coreos.com", "alertmanagers.monitoring.coreos.com", 
        "podmonitors.monitoring.coreos.com", "probes.monitoring.coreos.com", 
        "prometheuses.monitoring.coreos.com", "prometheusrules.monitoring.coreos.com", 
        "servicemonitors.monitoring.coreos.com", "thanosrulers.monitoring.coreos.com", 
        "scrapeconfigs.monitoring.coreos.com", "prometheusagents.monitoring.coreos.com"
    ]
    for crd in prom_crds:
        run_command(f"kubectl delete crd {crd} --ignore-not-found=true", check=False)

    # Clean Terraform state for Helm releases
    print("\nCleaning Terraform state...")
    tf_dir = "projects/Infrastructure"
    run_command(f"terraform state rm module.argocd.helm_release.argocd", cwd=tf_dir, check=False, env=env)
    run_command(f"terraform state rm module.argocd.helm_release.monitoring", cwd=tf_dir, check=False, env=env)

    print("\n✅ Cleanup complete! Wait 10 seconds for resources to be fully deleted...")
    import time
    time.sleep(10)
    
    print("\n✅ You can now run deploy_all.py again")

if __name__ == "__main__":
    main()
