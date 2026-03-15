#!/usr/bin/env python3
"""
Symptom Analyzer Routes
Provides API endpoints for comprehensive medical symptom analysis using Grok AI
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys
import os
import traceback

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.medical_ai_service import get_medical_ai_service

router = APIRouter()

class SymptomAnalysisRequest(BaseModel):
    symptoms: str

class SymptomAnalysisResponse(BaseModel):
    success: bool
    data: dict
    message: Optional[str] = None


@router.post("/analyze", response_model=SymptomAnalysisResponse)
async def analyze_symptoms(request: SymptomAnalysisRequest):
    """
    Comprehensive symptom analysis including:
    - Medical diagnosis
    - Risk prediction
    - Doctor recommendations
    - Prevention techniques
    - Home care advice
    """
    try:
        if not request.symptoms or not request.symptoms.strip():
            raise HTTPException(status_code=400, detail="Symptoms description cannot be empty")
        
        print(f"\n{'='*70}")
        print(f"[INFO] Received symptom analysis request")
        print(f"[INFO] Symptoms: {request.symptoms[:200]}...")
        print(f"{'='*70}\n")
        
        medical_service = get_medical_ai_service()
        result = medical_service.analyze_symptoms(request.symptoms.strip())
        
        if result.get("error"):
            error_message = result.get("error") or "Gemini AI analysis is currently unavailable."
            print(f"[ERROR] Analysis fallback triggered: {error_message}")
            raise HTTPException(
                status_code=503,
                detail=error_message
            )
        
        print(f"[SUCCESS] Analysis completed successfully\n")
        
        return SymptomAnalysisResponse(
            success=True,
            data=result,
            message="Analysis completed successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Error in analyze_symptoms: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint to verify API connectivity"""
    try:
        medical_service = get_medical_ai_service()
        test_response = medical_service._call_gemini_api("Say 'OK' if you can read this.")
        
        return {
            "status": "healthy" if test_response else "unhealthy",
            "service": "Medical AI Symptom Analyzer",
            "api_key_configured": True,
            "features": [
                "Medical diagnosis",
                "Risk prediction",
                "Doctor recommendations",
                "Prevention techniques",
                "Home care advice"
            ]
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "Medical AI Symptom Analyzer",
            "api_key_configured": False,
            "error": str(e)
        }


