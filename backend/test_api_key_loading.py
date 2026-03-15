#!/usr/bin/env python3
"""
Test script to verify API key loading from config.env
"""
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

try:
    from services.medical_ai_service import get_medical_ai_service
    
    print("=" * 70)
    print("Testing API Key Loading")
    print("=" * 70)
    print()
    
    try:
        service = get_medical_ai_service()
        print("\n[SUCCESS] API key loaded successfully!")
        print(f"[SUCCESS] Service initialized: {type(service).__name__}")
        print("\n" + "=" * 70)
        print("API key is properly configured. The symptom analyzer should work now.")
        print("=" * 70)
    except Exception as e:
        print(f"\n[ERROR] Failed to load API key")
        print(f"Error: {str(e)}")
        print("\n" + "=" * 70)
        print("Please check:")
        print("1. GROK_API_KEY is set in backend/config.env")
        print("2. No spaces around the = sign")
        print("3. The API key is valid")
        print("=" * 70)
        sys.exit(1)
        
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)

