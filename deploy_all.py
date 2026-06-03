import subprocess
import os
import sys
import time

# Configuration
TF_DIR = "projects/Infrastructure"
K8S_DIR = "gitops"
REGION = "us-east-1"
CLUSTER_NAME = "eks-cluster"

def run_command(command, cwd=None, env=None):
    """Runs a shell command and prints output in real-time."""
    print(f"\n[RUNNING]: {command}")
    process = subprocess.Popen(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        shell=True,
        cwd=cwd,
        env=env,
        text=True
    )
    
    for line in process.stdout:
        print(line, end="")
    
    process.wait()
    if process.returncode != 0:
        print(f"\n[ERROR]: Command failed with exit code {process.returncode}")
        sys.exit(1)

def main():
    print("🚀 Starting Full Automated Boutique Deployment...")

    # 1. Terraform Init & Apply
    print("\n--- Phase 1: Infrastructure Provisioning (Terraform) ---")
    run_command("terraform init", cwd=TF_DIR)
    run_command("terraform apply --auto-approve", cwd=TF_DIR)

    # 2. Update Kubeconfig
    print("\n--- Phase 2: Configuring Kubernetes Access ---")
    run_command(f"python -m awscli eks update-kubeconfig --region {REGION} --name {CLUSTER_NAME}")

    # 3. Apply K8s Manifests
    print("\n--- Phase 3: Deploying Microservices ---")
    run_command(f"kubectl apply -f {K8S_DIR}/namespace.yml")
    run_command(f"kubectl apply -f {K8S_DIR}/secrets.yml")
    run_command(f"kubectl apply -k {K8S_DIR}")

    # 4. Wait for Database
    print("\n--- Phase 4: Initializing Database ---")
    print("Waiting for PostgreSQL pod to be ready...")
    run_command("kubectl wait --for=condition=ready pod -l app=boutique-postgres -n boutique --timeout=300s")

    # 5. Run Restore Job
    print("Applying DB Restore Job...")
    run_command(f"kubectl apply -f {K8S_DIR}/k8s/database/restore-job.yml")

    print("\n✅ DEPLOYMENT COMPLETE!")
    print("\nNext Steps:")
    print(f"1. Access UI: kubectl port-forward svc/frontend 3000:3000 -n boutique")
    print(f"2. Access Grafana: kubectl port-forward svc/kube-prometheus-stack-grafana 8080:80 -n monitoring")

if __name__ == "__main__":
    main()
