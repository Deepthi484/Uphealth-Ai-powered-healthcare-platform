#!/usr/bin/env python3
"""Quick sanity check for Grok chat completion API"""
import os
from pathlib import Path
import requests
import json

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None

BASE_URL = "https://api.x.ai/v1/chat/completions"
MODEL = "grok-3"


def _load_api_key() -> str:
    if load_dotenv is not None:
        possible_paths = [
            Path(__file__).parent / "config.env",
            Path(__file__).parent / ".env",
            Path(__file__).resolve().parent.parent / ".env",
        ]
        for env_path in possible_paths:
            if env_path.exists():
                load_dotenv(dotenv_path=env_path, override=False)
                break

    api_key = os.getenv("GROK_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GROK_API_KEY environment variable is not set. "
            "Please configure your Grok API key before running this test."
        )
    return api_key


def main():
    api_key = _load_api_key()

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a test assistant."},
            {"role": "user", "content": "Reply with the word OK if you can read this."},
        ],
        "temperature": 0.1,
        "max_tokens": 50,
    }

    print("=" * 70)
    print(f"Testing Grok API ({MODEL})")
    print("=" * 70)

    try:
        response = requests.post(BASE_URL, headers=headers, json=payload, timeout=20)
        print(f"Status: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            print("[SUCCESS] Grok API responded successfully!")
            print(f"Response: {content}")
        else:
            print("[ERROR] Grok API request failed")
            try:
                print(json.dumps(response.json(), indent=2))
            except json.JSONDecodeError:
                print(response.text[:500])
            exit(1)
    except Exception as exc:
        print(f"[EXCEPTION] {exc}")
        raise


if __name__ == "__main__":
    main()
