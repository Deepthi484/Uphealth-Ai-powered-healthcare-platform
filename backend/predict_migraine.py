#!/usr/bin/env python3
import sys
import json
import joblib
import numpy as np
import pandas as pd
from pathlib import Path

def load_migraine_model():
    """Load the trained migraine prediction model"""
    try:
        model_path = Path(__file__).parent / "models" / "migraine_type_model.joblib"
        model_data = joblib.load(str(model_path))
        
        # Check if it's a dictionary with model and other components
        if isinstance(model_data, dict):
            # Extract the actual model from the dictionary
            if 'model' in model_data:
                return model_data['model']
            elif 'classifier' in model_data:
                return model_data['classifier']
            elif 'pipeline' in model_data:
                return model_data['pipeline']
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

def predict_migraine(data):
    """Make migraine prediction"""
    try:
        # Load model
        model = load_migraine_model()
        
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
        
        # Define migraine types and their descriptions
        migraine_types = {
            'Typical aura with migraine': {
                'description': 'Migraine with visual, sensory, or speech symptoms that develop gradually',
                'risk_level': 'Medium',
                'recommendations': [
                    'Avoid known triggers (stress, certain foods, bright lights)',
                    'Keep a migraine diary to identify patterns',
                    'Consider preventive medications if attacks are frequent',
                    'Practice relaxation techniques and stress management'
                ]
            },
            'Migraine without aura': {
                'description': 'Migraine headache without warning symptoms',
                'risk_level': 'Low to Medium',
                'recommendations': [
                    'Identify and avoid personal triggers',
                    'Maintain regular sleep and meal schedules',
                    'Stay hydrated and exercise regularly',
                    'Consider over-the-counter pain relievers for mild attacks'
                ]
            },
            'Basilar-type aura': {
                'description': 'Migraine with brainstem symptoms like dizziness and visual disturbances',
                'risk_level': 'High',
                'recommendations': [
                    'Seek immediate medical attention for severe symptoms',
                    'Avoid activities that could be dangerous during attacks',
                    'Consider preventive medications',
                    'Regular follow-up with a neurologist'
                ]
            }
        }
        
        # Get migraine type info
        migraine_info = migraine_types.get(prediction, {
            'description': 'Unknown migraine type',
            'risk_level': 'Unknown',
            'recommendations': ['Consult a healthcare provider for proper diagnosis']
        })
        
        result = {
            "prediction": prediction,
            "confidence": round(confidence, 2),
            "migraine_type": migraine_info['description'],
            "risk_level": migraine_info['risk_level'],
            "recommendations": migraine_info['recommendations']
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": f"Prediction failed: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Invalid arguments"}))
        sys.exit(1)
    
    model_type = sys.argv[1]
    
    # Join all remaining arguments in case JSON was split
    json_string = ' '.join(sys.argv[2:])
    
    try:
        input_data = json.loads(json_string)
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON: {str(e)}"}))
        sys.exit(1)
    
    if model_type == "migraine":
        predict_migraine(input_data)
    else:
        print(json.dumps({"error": "Unknown model type"}))
        sys.exit(1)
