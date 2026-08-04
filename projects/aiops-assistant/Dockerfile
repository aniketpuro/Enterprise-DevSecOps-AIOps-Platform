FROM python:3.11-slim

# Install kubectl and required system packages
RUN apt-get update && apt-get install -y curl && \
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY kira-vps.py .

EXPOSE 8501

CMD ["python", "-m", "streamlit", "run", "kira-vps.py", "--server.port=8501", "--server.address=0.0.0.0"]
