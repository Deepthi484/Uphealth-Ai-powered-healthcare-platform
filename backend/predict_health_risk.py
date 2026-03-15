#!/usr/bin/env python3
import sys
import json
import joblib
import numpy as np
import pandas as pd
from pathlib import Path

def load_health_risk_model():
    """Load the trained health risk prediction model"""
    try:
        model_path = Path(__file__).parent / "models" / "health_risk_rf_smote (1).joblib"
        model_data = joblib.load(str(model_path))
        
        # Check if it's a dictionary with model and other components
        if isinstance(model_data, dict):
            # Extract the actual model from the dictionary
            if 'model' in model_data:
                return model_data['model']
            elif 'classifier' in model_data:
                return model_data['classifier']
            else:
                # Try to find the model in the dictionary
                for key, value in model_data.items():
                    if hasattr(value, 'predict'):
                        return value
                raise ValueError("No model found in loaded data")
        else:
            # Direct model
            return model_data
    except Exception as e:
        print(json.dumps({"error": f"Failed to load model: {str(e)}"}))
        sys.exit(1)

def analyze_vital_signs(data):
    """Analyze vital signs and provide insights"""
    analysis = []
    
    # Respiratory Rate analysis
    if data['Respiratory_Rate'] < 12:
        analysis.append("Respiratory rate is below normal (bradypnea)")
    elif data['Respiratory_Rate'] > 20:
        analysis.append("Respiratory rate is above normal (tachypnea)")
    else:
        analysis.append("Respiratory rate is within normal range")
    
    # Oxygen Saturation analysis
    if data['Oxygen_Saturation'] < 95:
        analysis.append("Oxygen saturation is below normal - may indicate respiratory issues")
    else:
        analysis.append("Oxygen saturation is within normal range")
    
    # Blood Pressure analysis
    if data['Systolic_BP'] < 90:
        analysis.append("Systolic blood pressure is low (hypotension)")
    elif data['Systolic_BP'] > 140:
        analysis.append("Systolic blood pressure is high (hypertension)")
    else:
        analysis.append("Blood pressure is within normal range")
    
    # Heart Rate analysis
    if data['Heart_Rate'] < 60:
        analysis.append("Heart rate is below normal (bradycardia)")
    elif data['Heart_Rate'] > 100:
        analysis.append("Heart rate is above normal (tachycardia)")
    else:
        analysis.append("Heart rate is within normal range")
    
    # Temperature analysis
    if data['Temperature'] < 36.0:
        analysis.append("Body temperature is below normal (hypothermia)")
    elif data['Temperature'] > 37.5:
        analysis.append("Body temperature is above normal (fever)")
    else:
        analysis.append("Body temperature is within normal range")
    
    return analysis

def predict_health_risk(data):
    """Make health risk prediction"""
    try:
        # Load model
        model = load_health_risk_model()
        
        # Convert input data to DataFrame
        input_df = pd.DataFrame([data])
        
        # Make prediction
        prediction = model.predict(input_df)[0]
        
        # Convert numpy types to Python native types
        if hasattr(prediction, 'item'):
            prediction = prediction.item()
        
        # Try to get prediction probabilities if available
        try:
            prediction_proba = model.predict_proba(input_df)[0]
            confidence = max(prediction_proba) * 100
            if hasattr(confidence, 'item'):
                confidence = confidence.item()
        except:
            confidence = 85.0  # Default confidence if proba not available
        
        # Define risk levels and recommendations
        risk_levels = {
            'Low': {
                'description': 'Low health risk - normal vital signs',
                'recommendations': [
                    'Continue with regular health monitoring',
                    'Maintain healthy lifestyle habits',
                    'Schedule routine check-ups',
                    'Stay hydrated and exercise regularly'
                ]
            },
            'Medium': {
                'description': 'Moderate health risk - some vital signs outside normal range',
                'recommendations': [
                    'Monitor symptoms closely',
                    'Consider lifestyle modifications',
                    'Schedule follow-up with healthcare provider',
                    'Avoid known risk factors'
                ]
            },
            'High': {
                'description': 'High health risk - multiple vital signs concerning',
                'recommendations': [
                    'Seek immediate medical attention',
                    'Monitor symptoms continuously',
                    'Avoid strenuous activities',
                    'Follow up with healthcare provider urgently'
                ]
            },
            'Normal': {
                'description': 'Normal health status',
                'recommendations': [
                    'Continue with regular health monitoring',
                    'Maintain current healthy habits',
                    'Schedule routine check-ups',
                    'Stay active and eat well'
                ]
            }
        }
        
        # Get risk level info
        risk_info = risk_levels.get(prediction, {
            'description': 'Unknown risk level',
            'recommendations': ['Consult a healthcare provider for proper assessment']
        })
        
        # Analyze vital signs
        vital_signs_analysis = analyze_vital_signs(data)
        
        result = {
            "prediction": prediction,
            "confidence": round(confidence, 2),
            "risk_level": risk_info['description'],
            "recommendations": risk_info['recommendations'],
            "vital_signs_analysis": vital_signs_analysis
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": f"Prediction failed: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Invalid arguments"}))
        sys.exit(1)
    
    model_type = sys.argv[1]
    input_data = json.loads(sys.argv[2])
    
    if model_type == "health_risk":
        predict_health_risk(input_data)
    else:
        print(json.dumps({"error": "Unknown model type"}))
        sys.exit(1)
