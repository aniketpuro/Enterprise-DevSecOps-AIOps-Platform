# Kira K3s VPS Deployment Guide

This guide will help you deploy Kira on your K3s cluster across different nodes and namespaces.

## 1. Build and Push the Docker Image
First, you need to build the Docker image and push it to a registry (like Docker Hub) so your K3s nodes can pull it.

```bash
cd ..
# Replace 'your-dockerhub-username' with your actual username
docker build -t your-dockerhub-username/kira-vps:latest .
docker push your-dockerhub-username/kira-vps:latest
```

## 2. Update the Deployment Manifest
Edit `kira-deployment.yaml`:
- Change `your-dockerhub-username/kira-vps:latest` on line 42 to the exact image you just pushed.
- If your Prometheus is running at a different URL in your cluster, update the `PROMETHEUS_URL` on line 53.

## 3. Create the AWS Secret
Since we don't want to store your AWS keys in plain text inside the yaml file, create a Kubernetes secret directly via `kubectl`:

```bash
kubectl create namespace aiops
kubectl create secret generic kira-secrets -n aiops \
  --from-literal=AWS_ACCESS_KEY_ID="AKIAYOURKEYHERE" \
  --from-literal=AWS_SECRET_ACCESS_KEY="YOURSECRETHERE"
```

## 4. Apply the Manifests
This will create the `ServiceAccount`, `ClusterRole` (which gives Kira access to read pods/logs across ALL namespaces), `ClusterRoleBinding`, `Deployment`, and `Service`.

```bash
kubectl apply -f kira-deployment.yaml
```

## 5. Access Kira
Kira is exposed via a NodePort on port `30001`.
You can access it by going to `http://<ANY_VPS_NODE_IP>:30001` in your browser!

### Note on Multi-Namespace Support
The deployment sets the environment variable `KUBE_NAMESPACE="all"`. The Python script has been updated so that when this variable is set to "all", Kira runs `kubectl get pods -A` and `kubectl logs -A` behind the scenes, allowing it to monitor applications across every single namespace in your K3s cluster!
