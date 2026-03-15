#!/usr/bin/env python3
"""
Test script to verify Grok API key is working
"""
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


def _mask_api_key(key: str) -> str:
    if len(key) <= 8:
        return "*" * len(key)
    return f"{key[:6]}...{key[-4:]}"


def test_api_key():
    api_key = _load_api_key()

    print("=" * 70)
    print("Testing Grok API Key")
    print("=" * 70)
    print(f"API Key: {_mask_api_key(api_key)}")
    print(f"Endpoint: {BASE_URL}")
    print(f"Model: {MODEL}")
    print()

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a diagnostic assistant."},
            {"role": "user", "content": "Reply with the sentence 'Hello, API is working!' if you can read this."},
        ],
        "temperature": 0.2,
        "max_tokens": 100,
    }

    try:
        print("Sending test request...")
        response = requests.post(BASE_URL, headers=headers, json=payload, timeout=30)

        print(f"Response Status: {response.status_code}")
        print()

        if response.status_code == 200:
            result = response.json()

            if 'choices' in result and len(result['choices']) > 0:
                content = result['choices'][0]['message']['content']
                print("[SUCCESS] API KEY IS WORKING!")
                print(f"Response: {content}")
                return True
            else:
                print("[WARNING] Unexpected response structure:")
                print(json.dumps(result, indent=2))
                return False
        else:
            print("[ERROR] API REQUEST FAILED")
            try:
                error_json = response.json()
                print(json.dumps(error_json, indent=2))
            except json.JSONDecodeError:
                print(response.text)
            return False

    except Exception as e:
        print(f"[EXCEPTION] {str(e)}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = test_api_key()
    print()
    print("=" * 70)
    if success:
        print("[SUCCESS] API KEY TEST PASSED - Your Grok API key is working!")
    else:
        print("[ERROR] API KEY TEST FAILED - Please check your Grok API key")
    print("=" * 70)

