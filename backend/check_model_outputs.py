#!/usr/bin/env python3
"""
Check what values the models actually return to fix the mapping
"""
from fastapi_app import load_migraine_model, load_health_risk_model
import pandas as pd

def check_migraine_model():
    print("🧠 Checking Migraine Model...")
    model = load_migraine_model()
    
    # Check if model has classes
    if hasattr(model, 'classes_'):
        print(f"Classes found: {model.classes_}")
    else:
        print("No classes_ attribute")
    
    # Test prediction
    test_data = {
        'Age': 30, 'Duration': 1, 'Frequency': 5, 'Location': 1, 'Character': 1,
        'Intensity': 2, 'Nausea': 1, 'Vomit': 0, 'Phonophobia': 1, 'Photophobia': 1,
        'Visual': 1, 'Sensory': 2, 'Dysphasia': 0, 'Dysarthria': 0, 'Vertigo': 0,
        'Tinnitus': 0, 'Hypoacusis': 0, 'Diplopia': 0, 'Defect': 0, 'Ataxia': 0,
        'Conscience': 0, 'Paresthesia': 0, 'DPF': 0
    }
    
    input_df = pd.DataFrame([test_data])
    prediction = model.predict(input_df)[0]
    print(f"Raw prediction: {prediction} (type: {type(prediction)})")
    
    # Test multiple cases to see range of outputs
    test_cases = [
        {'Age': 25, 'Intensity': 1, 'Nausea': 0, 'Visual': 0},
        {'Age': 40, 'Intensity': 3, 'Visual': 1, 'Sensory': 1, 'Phonophobia': 1},
        {'Age': 35, 'Frequency': 10, 'Photophobia': 1, 'Dysphasia': 1}
    ]
    
    predictions = []
    for i, case in enumerate(test_cases):
        test_copy = test_data.copy()
        test_copy.update(case)
        input_df = pd.DataFrame([test_copy])
        pred = model.predict(input_df)[0]
        predictions.append(pred)
        print(f"Test case {i+1}: {pred}")
    
    print(f"Unique predictions: {set(predictions)}")
    return predictions

def check_health_risk_model():
    print("\n❤️ Checking Health Risk Model...")
    model = load_health_risk_model()
    
    # Check if model has classes
    if hasattr(model, 'classes_'):
        print(f"Classes found: {model.classes_}")
    else:
        print("No classes_ attribute")
    
    # Test prediction
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
    
    input_df = pd.DataFrame([test_data])
    prediction = model.predict(input_df)[0]
    print(f"Raw prediction: {prediction} (type: {type(prediction)})")
    
    # Test different scenarios
    scenarios = [
        {'Heart_Rate': 72, 'Systolic_BP': 120, 'Temperature': 37.0},  # Normal
        {'Heart_Rate': 120, 'Systolic_BP': 180, 'Temperature': 39.0},  # High risk
        {'Heart_Rate': 50, 'Systolic_BP': 80, 'Oxygen_Saturation': 90}  # Low values
    ]
    
    predictions = []
    for i, scenario in enumerate(scenarios):
        test_copy = test_data.copy()
        test_copy.update(scenario)
        input_df = pd.DataFrame([test_copy])
        pred = model.predict(input_df)[0]
        predictions.append(pred)
        print(f"Scenario {i+1}: {pred}")
    
    print(f"Unique predictions: {set(predictions)}")
    return predictions

if __name__ == "__main__":
    print("🔍 Checking Model Outputs to Fix Mapping...")
    print("=" * 50)
    
    migraine_preds = check_migraine_model()
    health_preds = check_health_risk_model()
    
    print("\n" + "=" * 50)
    print("📋 Summary:")
    print(f"Migraine model outputs: {set(migraine_preds)}")
    print(f"Health model outputs: {set(health_preds)}")

