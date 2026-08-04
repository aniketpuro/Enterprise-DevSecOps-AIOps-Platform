import sys
import json
import urllib.request

BASE_URL = "https://api.ai.kodekloud.com/v1"
API_KEY = "sk-gJ78Srk2iN-3A4zgXcH8uA"

def ask_claude(prompt):
    payload = json.dumps({
        "model": "claude-3-5-sonnet",
        "messages": [{"role": "user", "content": prompt}]
    }).encode("utf-8")

    request = urllib.request.Request(
        f"{BASE_URL}/chat/completions",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        },
        method="POST"
    )

    with urllib.request.urlopen(request) as response:
        data = json.loads(response.read().decode("utf-8"))
        print(data["choices"][0]["message"]["content"])

if __name__ == "__main__":
    if len(sys.argv) > 1:
        ask_claude(sys.argv[1])
    else:
        print("Please provide a prompt. Example: python pthy.py 'Hello'")