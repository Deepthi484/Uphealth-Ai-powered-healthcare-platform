#!/usr/bin/env python3
"""Test Gemini API"""
from services.medical_ai_service import get_medical_ai_service

service = get_medical_ai_service()
result = service.analyze_symptoms('I have a headache')
if result.get('error'):
    print(f"Error: {result.get('error')}")
else:
    print("Success! Gemini API is working!")










