d#!/usr/bin/env python3
"""
Simple test to verify predictions work without FastAPI server
"""
import pandas as pd
from fastapi_app import load_health_risk_model, load_migraine_model

def test_health_risk_prediction():
    """Test health risk prediction directly"""
    print("🏥 Testing Health Risk Prediction...")
    
    # Load model
    model = load_health_risk_model()
    print("✅ Model loaded successfully")
    
    # Test data
    test_data = {
        'Patient_ID': 'TEST001',
        'Respiratory_Rate': 16.0,
        'Oxygen_Saturation': 98.0,
        'O2_Scale': 1,
        'Systolic_BP': 120.0,
        'Heart_Rate': 72.0,
        'Temperature': 37.0,
        'Consciousness': 'A',
        'On_Oxygen': 0
    }
    
    # Convert to DataFrame
    input_df = pd.DataFrame([test_data])
    
    # Make prediction
    prediction = model.predict(input_df)[0]
    print(f"✅ Prediction: {prediction}")
    
    # Try to get probabilities
    try:
        prediction_proba = model.predict_proba(input_df)[0]
        confidence = max(prediction_proba) * 100
        print(f"✅ Confidence: {confidence:.2f}%")
    except:
        print("⚠️ Probabilities not available")
    
    return True

def test_migraine_prediction():
    """Test migraine prediction directly"""
    print("\n🧠 Testing Migraine Prediction...")
    
    # Load model
    model = load_migraine_model()
    print("✅ Model loaded successfully")
    
    # Test data
    test_data = {
        'Age': 30,
        'Duration': 1,
        'Frequency': 5,
        'Location': 1,
        'Character': 1,
        'Intensity': 2,
        'Nausea': 1,
        'Vomit': 0,
        'Phonophobia': 1,
        'Photophobia': 1,
        'Visual': 1,
        'Sensory': 2,
        'Dysphasia': 0,
        'Dysarthria': 0,
        'Vertigo': 0,
        'Tinnitus': 0,
        'Hypoacusis': 0,
        'Diplopia': 0,
        'Defect': 0,
        'Ataxia': 0,
        'Conscience': 0,
        'Paresthesia': 0,
        'DPF': 0
    }
    
    # Convert to DataFrame
    input_df = pd.DataFrame([test_data])
    
    # Make prediction
    prediction = model.predict(input_df)[0]
    print(f"✅ Prediction: {prediction}")
    
    # Try to get probabilities
    try:
        prediction_proba = model.predict_proba(input_df)[0]
        confidence = max(prediction_proba) * 100
        print(f"✅ Confidence: {confidence:.2f}%")
    except:
        print("⚠️ Probabilities not available")
    
    return True

if __name__ == "__main__":
    print("🧪 Testing Prediction Models Directly...")
    print("=" * 50)
    
    try:
        health_success = test_health_risk_prediction()
        migraine_success = test_migraine_prediction()
        
        print("\n" + "=" * 50)
        print("📊 Test Results:")
        print(f"Health Risk: {'✅ WORKING' if health_success else '❌ FAILED'}")
        print(f"Migraine: {'✅ WORKING' if migraine_success else '❌ FAILED'}")
        
        if health_success and migraine_success:
            print("\n🎉 ALL PREDICTIONS ARE WORKING! 🎉")
        else:
            print("\n⚠️ Some predictions failed")
            
    except Exception as e:
        print(f"\n❌ Error during testing: {e}")

