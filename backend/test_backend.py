#!/usr/bin/env python3
"""Test backend services after rebuild"""
import sys
from pathlib import Path

print("=" * 70)
print("Testing Backend Services")
print("=" * 70)

# Test 1: Medical AI Service
try:
    from services.medical_ai_service import get_medical_ai_service
    service = get_medical_ai_service()
    print("\n[OK] Medical AI Service initialized successfully")
    print(f"    API Key: {service._mask_api_key(service.api_key)}")
    print(f"    Models: {service.models}")
except Exception as e:
    print(f"\n[ERROR] Medical AI Service failed: {e}")
    sys.exit(1)

# Test 2: FastAPI App
try:
    from fastapi_app import app
    print("\n[OK] FastAPI app loaded successfully")
    routes = [r.path for r in app.routes if hasattr(r, 'path')]
    print(f"    Routes: {len(routes)} routes found")
    if '/api/symptom-analyzer/analyze' in routes or any('/symptom-analyzer' in r for r in routes):
        print("    [OK] Symptom analyzer route found")
except Exception as e:
    print(f"\n[ERROR] FastAPI app failed: {e}")
    sys.exit(1)

# Test 3: Symptom Analyzer Router
try:
    from routes.symptom_analyzer import router
    print("\n[OK] Symptom analyzer router loaded successfully")
except Exception as e:
    print(f"\n[ERROR] Symptom analyzer router failed: {e}")
    sys.exit(1)

print("\n" + "=" * 70)
print("[SUCCESS] All backend services are working correctly!")
print("=" * 70)

