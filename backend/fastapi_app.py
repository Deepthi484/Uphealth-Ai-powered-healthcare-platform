#!/usr/bin/env python3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
import json
from typing import List, Dict, Any
from routes.symptom_analyzer import router as symptom_router

app = FastAPI(
    title="UpHealth AI Prediction API",
    description="AI-powered health platform for migraine prediction, health risk assessment, and intelligent symptom analysis",
    version="2.0.0"
)

# Include Symptom Analyzer routes
app.include_router(symptom_router, prefix="/api/symptom-analyzer", tags=["Symptom Analyzer"])

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store loaded models
health_risk_model = None
migraine_model = None

def load_health_risk_model():
    """Load the trained health risk prediction model"""
    global health_risk_model
    if health_risk_model is None:
        try:
            model_path = Path(__file__).parent / "models" / "health_risk_rf_smote (1).joblib"
            model_data = joblib.load(str(model_path))
            
            # Check if it's a dictionary with model and other components
            if isinstance(model_data, dict):
                # Extract the actual model from the dictionary
                if 'model' in model_data:
                    health_risk_model = model_data['model']
                elif 'classifier' in model_data:
                    health_risk_model = model_data['classifier']
                else:
                    # Try to find the model in the dictionary
                    for key, value in model_data.items():
                        if hasattr(value, 'predict'):
                            health_risk_model = value
                            break
                    if health_risk_model is None:
                        raise ValueError("No model found in loaded data")
            else:
                # Direct model
                health_risk_model = model_data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to load health risk model: {str(e)}")
    
    return health_risk_model

def load_migraine_model():
    """Load the trained migraine prediction model"""
    global migraine_model
    if migraine_model is None:
        try:
            model_path = Path(__file__).parent / "models" / "migraine_type_model.joblib"
            model_data = joblib.load(str(model_path))
            
            # Check if it's a dictionary with model and other components
            if isinstance(model_data, dict):
                # Extract the actual model from the dictionary
                if 'model' in model_data:
                    migraine_model = model_data['model']
                elif 'classifier' in model_data:
                    migraine_model = model_data['classifier']
                elif 'pipeline' in model_data:
                    migraine_model = model_data['pipeline']
                else:
                    # Try to find the model in the dictionary
                    for key, value in model_data.items():
                        if hasattr(value, 'predict'):
                            migraine_model = value
                            break
                    if migraine_model is None:
                        raise ValueError("No model found in loaded data")
            else:
                # Direct model
                migraine_model = model_data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to load migraine model: {str(e)}")
    
    return migraine_model

# Pydantic models for request validation
class HealthRiskInput(BaseModel):
    Patient_ID: str
    Respiratory_Rate: float
    Oxygen_Saturation: float
    O2_Scale: int
    Systolic_BP: float
    Heart_Rate: float
    Temperature: float
    Consciousness: str
    On_Oxygen: int

class MigraneInput(BaseModel):
    Age: int
    Duration: int
    Frequency: int
    Location: int
    Character: int
    Intensity: int
    Nausea: int
    Vomit: int
    Phonophobia: int
    Photophobia: int
    Visual: int
    Sensory: int
    Dysphasia: int
    Dysarthria: int
    Vertigo: int
    Tinnitus: int
    Hypoacusis: int
    Diplopia: int
    Defect: int
    Ataxia: int
    Conscience: int
    Paresthesia: int
    DPF: int

def analyze_vital_signs(data: dict) -> List[str]:
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

@app.get("/")
async def root():
    return {"message": "UpHealth AI Prediction API", "version": "1.0.0", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "models_loaded": {
        "health_risk": health_risk_model is not None,
        "migraine": migraine_model is not None
    }}

@app.post("/api/predictions/health-risk")
async def predict_health_risk(data: HealthRiskInput):
    """Predict health risk based on vital signs"""
    try:
        # Load model
        model = load_health_risk_model()
        
        # Convert input data to DataFrame
        input_dict = data.dict()
        input_df = pd.DataFrame([input_dict])
        
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
        vital_signs_analysis = analyze_vital_signs(input_dict)
        
        result = {
            "prediction": prediction,
            "confidence": round(confidence, 2),
            "risk_level": risk_info['description'],
            "recommendations": risk_info['recommendations'],
            "vital_signs_analysis": vital_signs_analysis,
            "success": True
        }
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/api/predictions/migraine")
async def predict_migraine(data: MigraneInput):
    """Predict migraine type based on symptoms"""
    try:
        # Load model
        model = load_migraine_model()
        
        # Convert input data to DataFrame
        input_dict = data.dict()
        input_df = pd.DataFrame([input_dict])
        
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
        
        # Map numeric prediction to migraine type name
        migraine_type_mapping = {
            0: 'Typical aura with migraine',
            1: 'Migraine without aura', 
            2: 'Basilar-type aura',
            3: 'Sporadic hemiplegic migraine',
            4: 'Familial hemiplegic migraine',
            5: 'Other',
            6: 'Typical aura without migraine'
        }
        
        # Convert numeric prediction to type name
        migraine_type_name = migraine_type_mapping.get(prediction, 'Unknown')
        
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
            },
            'Sporadic hemiplegic migraine': {
                'description': 'Rare migraine with temporary paralysis or weakness on one side',
                'risk_level': 'High',
                'recommendations': [
                    'Seek immediate medical attention during attacks',
                    'Avoid known triggers strictly',
                    'Require specialist neurological care',
                    'Consider genetic counseling'
                ]
            },
            'Familial hemiplegic migraine': {
                'description': 'Inherited migraine with temporary paralysis (genetic form)',
                'risk_level': 'High',
                'recommendations': [
                    'Genetic counseling recommended',
                    'Avoid specific triggers (certain medications, stress)',
                    'Regular neurological monitoring',
                    'Family screening may be advised'
                ]
            },
            'Other': {
                'description': 'Other migraine type not fitting standard categories',
                'risk_level': 'Medium',
                'recommendations': [
                    'Consult with a headache specialist',
                    'Detailed symptom tracking needed',
                    'Consider comprehensive neurological evaluation',
                    'Personalized treatment approach required'
                ]
            },
            'Typical aura without migraine': {
                'description': 'Aura symptoms without the headache phase',
                'risk_level': 'Low to Medium',
                'recommendations': [
                    'Monitor for development of headache phase',
                    'Track aura triggers and patterns',
                    'Consider preventive measures if frequent',
                    'Rule out other neurological conditions'
                ]
            }
        }
        
        # Get migraine type info
        migraine_info = migraine_types.get(migraine_type_name, {
            'description': 'Unknown migraine type',
            'risk_level': 'Unknown',
            'recommendations': ['Consult a healthcare provider for proper diagnosis']
        })
        
        result = {
            "prediction": migraine_type_name,
            "prediction_code": int(prediction),
            "confidence": round(confidence, 2),
            "migraine_type": migraine_info['description'],
            "risk_level": migraine_info['risk_level'],
            "recommendations": migraine_info['recommendations'],
            "success": True
        }
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
