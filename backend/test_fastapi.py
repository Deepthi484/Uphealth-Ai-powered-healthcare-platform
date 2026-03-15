#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:8000"

# Test data for migraine prediction
migraine_test_data = {
    "Age": 30,
    "Duration": 1,
    "Frequency": 5,
    "Location": 1,
    "Character": 1,
    "Intensity": 2,
    "Nausea": 1,
    "Vomit": 0,
    "Phonophobia": 1,
    "Photophobia": 1,
    "Visual": 1,
    "Sensory": 2,
    "Dysphasia": 0,
    "Dysarthria": 0,
    "Vertigo": 0,
    "Tinnitus": 0,
    "Hypoacusis": 0,
    "Diplopia": 0,
    "Defect": 0,
    "Ataxia": 0,
    "Conscience": 0,
    "Paresthesia": 0,
    "DPF": 0
}

# Test data for health risk prediction
health_risk_test_data = {
    "Patient_ID": "TEST001",
    "Respiratory_Rate": 16.0,
    "Oxygen_Saturation": 98.0,
    "O2_Scale": 1,
    "Systolic_BP": 120.0,
    "Heart_Rate": 72.0,
    "Temperature": 37.0,
    "Consciousness": "A",
    "On_Oxygen": 0
}

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed with status {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")

def test_migraine_prediction():
    """Test migraine prediction endpoint"""
    print("\n🧠 Testing Migraine Prediction...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/predictions/migraine",
            json=migraine_test_data,
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 200:
            result = response.json()
            print("✅ Migraine prediction successful")
            print(f"   Prediction: {result.get('prediction')}")
            print(f"   Confidence: {result.get('confidence')}%")
            print(f"   Risk Level: {result.get('risk_level')}")
        else:
            print(f"❌ Migraine prediction failed with status {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Migraine prediction error: {e}")

def test_health_risk_prediction():
    """Test health risk prediction endpoint"""
    print("\n❤️ Testing Health Risk Prediction...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/predictions/health-risk",
            json=health_risk_test_data,
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 200:
            result = response.json()
            print("✅ Health risk prediction successful")
            print(f"   Prediction: {result.get('prediction')}")
            print(f"   Confidence: {result.get('confidence')}%")
            print(f"   Risk Level: {result.get('risk_level')}")
        else:
            print(f"❌ Health risk prediction failed with status {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Health risk prediction error: {e}")

if __name__ == "__main__":
    print("🚀 Testing FastAPI Prediction Endpoints...")
    print("📌 Make sure the FastAPI server is running on http://localhost:8000")
    print("   Start with: python fastapi_app.py")
    print("-" * 50)
    
    test_health_check()
    test_migraine_prediction()
    test_health_risk_prediction()
    
    print("\n" + "=" * 50)
    print("🏁 Testing completed!")

