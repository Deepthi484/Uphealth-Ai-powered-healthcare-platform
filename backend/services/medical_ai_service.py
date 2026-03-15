#!/usr/bin/env python3
"""
Medical AI Service using Gemini API
Provides comprehensive medical diagnosis, risk prediction, doctor recommendations, and prevention techniques
"""
import json
import re
import os
import requests
import datetime
import time
from pathlib import Path
from typing import Dict, Any, Optional
import traceback

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None


class MedicalAIService:
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("Gemini API key is required but was not provided.")

        self.api_key = api_key.strip()
        # Try different Gemini models as fallback
        self.base_urls = [
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        ]
        self.current_url_index = 0
        self.last_error_message: Optional[str] = None
    
    @staticmethod
    def _mask_api_key(key: str) -> str:
        """Mask API key for logging"""
        if not key:
            return "undefined"
        if len(key) <= 8:
            return "*" * len(key)
        return f"{key[:6]}...{key[-4:]}"
        
    def _call_gemini_api(self, prompt: str, max_retries: int = 3, retry_delay: float = 1.5) -> Optional[str]:
        """Call Gemini API with error handling and retries"""
        self.last_error_message = None
        
        # Try each model endpoint
        for url_index in range(len(self.base_urls)):
            self.current_url_index = url_index
            base_url = self.base_urls[url_index]
            
            for attempt in range(1, max_retries + 1):
                try:
                    headers = {'Content-Type': 'application/json'}
                    payload = {
                        "contents": [{
                            "parts": [{"text": prompt}]
                        }],
                        "generationConfig": {
                            "temperature": 0.3,
                            "topK": 40,
                            "topP": 0.95,
                            "maxOutputTokens": 4096,
                            "responseMimeType": "application/json",
                        },
                        "safetySettings": [
                            {
                                "category": "HARM_CATEGORY_HARASSMENT",
                                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                "category": "HARM_CATEGORY_HATE_SPEECH",
                                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                            }
                        ]
                    }
                    
                    url = f"{base_url}?key={self.api_key}"
                    print(f"[INFO] Using API Key: {self._mask_api_key(self.api_key)}")
                    print(f"[INFO] Sending request to Gemini API (attempt {attempt}/{max_retries}, model {url_index + 1}/{len(self.base_urls)})...")
                    
                    response = requests.post(url, headers=headers, json=payload, timeout=60)
                    
                    print(f"[INFO] Response Status Code: {response.status_code}")
                    
                    if response.status_code == 200:
                        result = response.json()
                        print(f"[SUCCESS] API Response received successfully")
                        
                        # Check for errors in response
                        if 'error' in result:
                            error_message = json.dumps(result['error'], indent=2)
                            print(f"[ERROR] API Error in response: {error_message}")
                            self.last_error_message = f"Gemini API returned an error in response: {error_message}"
                            return None
                        
                        # Check for blocked content
                        if 'candidates' in result and len(result['candidates']) > 0:
                            candidate = result['candidates'][0]
                            
                            # Check if content was blocked
                            if 'finishReason' in candidate:
                                finish_reason = candidate['finishReason']
                                if finish_reason in ['SAFETY', 'RECITATION', 'OTHER']:
                                    self.last_error_message = f"Gemini content blocked by safety filter (finishReason={finish_reason})"
                                    print(f"[WARNING] Content blocked - finishReason: {finish_reason}")
                                    return None
                            
                            if 'content' in candidate and 'parts' in candidate['content']:
                                content = candidate['content']['parts'][0]['text']
                                print(f"[SUCCESS] Successfully extracted content ({len(content)} characters)")
                                self.last_error_message = None
                                return content.strip()
                            else:
                                self.last_error_message = "Gemini API returned an unexpected response format."
                                print(f"[WARNING] Unexpected response structure")
                                print(f"[DEBUG] Candidate keys: {list(candidate.keys())}")
                        else:
                            self.last_error_message = "Gemini API did not return any candidates."
                            print(f"[WARNING] No candidates in response")
                            print(f"[DEBUG] Response keys: {list(result.keys())}")
                        
                        return None
                    
                    error_text = response.text
                    print(f"[ERROR] Gemini API Error: {response.status_code}")
                    print(f"[ERROR] Error Response: {error_text[:500]}")
                    
                    error_message = f"Gemini API error {response.status_code}: {response.reason or 'Unknown error'}"
                    
                    # Try to parse error details
                    try:
                        error_json = response.json()
                        if 'error' in error_json:
                            error_details = error_json['error']
                            message = error_details.get('message', 'Unknown error')
                            status = error_details.get('status', 'Unknown status')
                            error_message = f"Gemini API error ({status}): {message}"
                            print(f"[ERROR] Error Message: {message}")
                            print(f"[ERROR] Error Status: {status}")
                    except Exception:
                        pass
                    
                    self.last_error_message = error_message
                    
                    if response.status_code in (429, 503):
                        if attempt < max_retries:
                            sleep_seconds = min(8.0, retry_delay * (2 ** (attempt - 1)))
                            print(f"[INFO] Retrying Gemini API call in {sleep_seconds} seconds due to temporary error...")
                            time.sleep(sleep_seconds)
                            continue
                        elif url_index < len(self.base_urls) - 1:
                            # Try next model endpoint
                            print(f"[INFO] Model unavailable, trying alternative Gemini model...")
                            break
                    
                    return None
                
                except requests.exceptions.Timeout:
                    self.last_error_message = "Gemini API request timed out."
                    print(f"[ERROR] Request timeout - API took too long to respond")
                    if attempt < max_retries:
                        sleep_seconds = min(8.0, retry_delay * (2 ** (attempt - 1)))
                        print(f"[INFO] Retrying Gemini API call in {sleep_seconds} seconds after timeout...")
                        time.sleep(sleep_seconds)
                        continue
                    elif url_index < len(self.base_urls) - 1:
                        # Try next model endpoint
                        print(f"[INFO] Model timed out, trying alternative Gemini model...")
                        break
                    return None
                except requests.exceptions.RequestException as e:
                    self.last_error_message = f"Gemini API request failed: {str(e)}"
                    print(f"[ERROR] Request Exception: {str(e)}")
                    print(traceback.format_exc())
                    if attempt < max_retries:
                        sleep_seconds = min(8.0, retry_delay * (2 ** (attempt - 1)))
                        print(f"[INFO] Retrying Gemini API call in {sleep_seconds} seconds after request exception...")
                        time.sleep(sleep_seconds)
                        continue
                    elif url_index < len(self.base_urls) - 1:
                        # Try next model endpoint
                        print(f"[INFO] Request failed, trying alternative Gemini model...")
                        break
                    return None
                except Exception as e:
                    self.last_error_message = f"Unexpected error calling Gemini API: {e}"
                    print(f"[ERROR] Unexpected Error calling Gemini API: {e}")
                    print(traceback.format_exc())
                    if url_index < len(self.base_urls) - 1:
                        # Try next model endpoint
                        print(f"[INFO] Unexpected error, trying alternative Gemini model...")
                        break
                    return None
        
        return None
    
    def _extract_json(self, text: str) -> Optional[Dict]:
        """Extract JSON from text response, handling markdown code blocks"""
        if not text:
            return None
            
        # Try multiple extraction strategies
        strategies = [
            # Strategy 1: Try to parse the entire text as JSON first
            lambda t: json.loads(t.strip()),
            # Strategy 2: Extract from markdown code blocks (```json ... ```)
            lambda t: self._extract_from_markdown(t),
            # Strategy 3: Find JSON object between first { and last }
            lambda t: self._extract_between_braces(t),
        ]
        
        for strategy in strategies:
            try:
                result = strategy(text)
                if result and isinstance(result, dict):
                    print(f"[SUCCESS] Successfully extracted JSON")
                    return result
            except Exception as e:
                print(f"[DEBUG] Strategy failed: {str(e)[:100]}")
                continue
        
        print(f"[WARNING] Failed to extract JSON from response")
        print(f"[DEBUG] Response preview: {text[:500]}")
        return None
    
    def _extract_from_markdown(self, text: str) -> Optional[Dict]:
        """Extract JSON from markdown code blocks"""
        patterns = [
            r'```json\s*(.*?)\s*```',
            r'```\s*(\{.*?\})\s*```',
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.DOTALL)
            if match:
                json_str = match.group(1).strip()
                return json.loads(json_str)
        return None
    
    def _extract_between_braces(self, text: str) -> Optional[Dict]:
        """Extract JSON object between first { and matching }"""
        start = text.find('{')
        if start == -1:
            return None
        
        # Find the matching closing brace
        brace_count = 0
        for i in range(start, len(text)):
            if text[i] == '{':
                brace_count += 1
            elif text[i] == '}':
                brace_count -= 1
                if brace_count == 0:
                    json_str = text[start:i+1]
                    return json.loads(json_str)
        return None
    
    def _validate_and_normalize_result(self, result: Dict) -> Optional[Dict]:
        """Validate and normalize the analysis result"""
        try:
            # Ensure required top-level keys exist
            required_keys = [
                "symptom_summary", "possible_diagnoses", "risk_assessment",
                "doctor_recommendations", "prevention_techniques", "home_care"
            ]
            
            for key in required_keys:
                if key not in result:
                    print(f"[WARNING] Missing required key: {key}, adding default value")
                    if key == "symptom_summary":
                        result[key] = "Unable to summarize symptoms"
                    elif key == "possible_diagnoses":
                        result[key] = []
                    elif key == "risk_assessment":
                        result[key] = {"overall_risk_level": "Unknown", "risk_factors": [], "complications": [], "prognosis": "Unknown"}
                    elif key == "doctor_recommendations":
                        result[key] = {"specialist_type": "General Practitioner", "urgency": "Non-urgent", "preparation": [], "tests_suggested": [], "questions_to_ask": []}
                    elif key == "prevention_techniques":
                        result[key] = {"immediate_actions": [], "lifestyle_changes": [], "diet_recommendations": [], "exercise_recommendations": [], "avoid_triggers": []}
                    elif key == "home_care":
                        result[key] = {"self_care_tips": [], "over_the_counter": [], "home_remedies": [], "when_to_seek_emergency": []}
            
            # Normalize possible_diagnoses
            if "possible_diagnoses" in result and isinstance(result["possible_diagnoses"], list):
                for diagnosis in result["possible_diagnoses"]:
                    if isinstance(diagnosis, dict):
                        # Ensure probability is a number
                        if "probability" in diagnosis:
                            try:
                                prob = diagnosis["probability"]
                                if isinstance(prob, str):
                                    num_match = re.search(r'\d+', prob)
                                    diagnosis["probability"] = int(num_match.group()) if num_match else 0
                                elif isinstance(prob, (int, float)):
                                    diagnosis["probability"] = max(0, min(100, int(prob)))
                                else:
                                    diagnosis["probability"] = 0
                            except:
                                diagnosis["probability"] = 0
                        
                        # Ensure required diagnosis fields exist
                        if "condition" not in diagnosis:
                            diagnosis["condition"] = "Unknown condition"
                        if "severity" not in diagnosis:
                            diagnosis["severity"] = "Unknown"
                        if "urgency" not in diagnosis:
                            diagnosis["urgency"] = "Non-urgent"
                        if "explanation" not in diagnosis:
                            diagnosis["explanation"] = "No explanation provided"
            
            # Ensure risk_assessment structure
            if "risk_assessment" in result and isinstance(result["risk_assessment"], dict):
                risk = result["risk_assessment"]
                if "overall_risk_level" not in risk:
                    risk["overall_risk_level"] = "Unknown"
                if "risk_factors" not in risk or not isinstance(risk["risk_factors"], list):
                    risk["risk_factors"] = []
                if "complications" not in risk or not isinstance(risk["complications"], list):
                    risk["complications"] = []
                if "prognosis" not in risk:
                    risk["prognosis"] = "Unknown"
            
            # Ensure doctor_recommendations structure
            if "doctor_recommendations" in result and isinstance(result["doctor_recommendations"], dict):
                doc = result["doctor_recommendations"]
                if "specialist_type" not in doc:
                    doc["specialist_type"] = "General Practitioner"
                if "urgency" not in doc:
                    doc["urgency"] = "Non-urgent"
                if "preparation" not in doc or not isinstance(doc["preparation"], list):
                    doc["preparation"] = []
                if "tests_suggested" not in doc or not isinstance(doc["tests_suggested"], list):
                    doc["tests_suggested"] = []
                if "questions_to_ask" not in doc or not isinstance(doc["questions_to_ask"], list):
                    doc["questions_to_ask"] = []
            
            # Ensure prevention_techniques structure
            if "prevention_techniques" in result and isinstance(result["prevention_techniques"], dict):
                prev = result["prevention_techniques"]
                for key in ["immediate_actions", "lifestyle_changes", "diet_recommendations", "exercise_recommendations", "avoid_triggers"]:
                    if key not in prev or not isinstance(prev[key], list):
                        prev[key] = []
            
            # Ensure home_care structure
            if "home_care" in result and isinstance(result["home_care"], dict):
                care = result["home_care"]
                if "self_care_tips" not in care or not isinstance(care["self_care_tips"], list):
                    care["self_care_tips"] = []
                if "over_the_counter" not in care or not isinstance(care["over_the_counter"], list):
                    care["over_the_counter"] = []
                if "home_remedies" not in care or not isinstance(care["home_remedies"], list):
                    care["home_remedies"] = []
                if "when_to_seek_emergency" not in care or not isinstance(care["when_to_seek_emergency"], list):
                    care["when_to_seek_emergency"] = []
            
            # Ensure education exists
            if "education" not in result:
                result["education"] = {
                    "what_is_happening": "Unable to analyze",
                    "common_causes": [],
                    "when_to_worry": "Consult a healthcare provider"
                }
            
            # Ensure disclaimer exists
            if "disclaimer" not in result:
                result["disclaimer"] = "This analysis is for educational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for proper medical care."
            
            return result
            
        except Exception as e:
            print(f"[ERROR] Error validating result: {str(e)}")
            print(traceback.format_exc())
            return None
    
    def analyze_symptoms(self, symptom_description: str) -> Dict[str, Any]:
        """
        Comprehensive medical analysis including:
        - Medical diagnosis
        - Risk prediction
        - Doctor recommendations
        - Prevention techniques
        """
        
        prompt = f"""You are an expert medical AI assistant. Analyze the following symptoms and provide a comprehensive medical analysis.

Patient Symptoms: "{symptom_description}"

CRITICAL INSTRUCTIONS:
- You MUST respond with ONLY valid JSON, no markdown code blocks, no explanations, no additional text
- The response must be a single, valid JSON object that can be parsed directly
- Do NOT wrap the JSON in ```json or ``` blocks
- Do NOT add any text before or after the JSON
- All probability values must be numbers (0-100), not strings
- All string values must be properly escaped if they contain quotes

Required JSON structure:

{{
    "symptom_summary": "Brief summary of the described symptoms",
    
    "possible_diagnoses": [
        {{
            "condition": "Name of the condition/disease",
            "probability": 75,
            "explanation": "Why this condition matches the symptoms",
            "severity": "Low",
            "urgency": "Non-urgent"
        }}
    ],
    
    "risk_assessment": {{
        "overall_risk_level": "Low",
        "risk_factors": ["List of risk factors identified"],
        "complications": ["Potential complications if untreated"],
        "prognosis": "Expected outcome with proper treatment"
    }},
    
    "doctor_recommendations": {{
        "specialist_type": "Type of doctor/specialist to consult (e.g., General Practitioner, Cardiologist, Neurologist)",
        "urgency": "When to see a doctor (Immediate/Within 24 hours/Within a week/Non-urgent)",
        "preparation": ["What to prepare before the visit"],
        "tests_suggested": ["Recommended medical tests or examinations"],
        "questions_to_ask": ["Important questions to ask the doctor"]
    }},
    
    "prevention_techniques": {{
        "immediate_actions": ["Actions to take right now"],
        "lifestyle_changes": ["Long-term lifestyle modifications"],
        "diet_recommendations": ["Dietary changes if applicable"],
        "exercise_recommendations": ["Exercise recommendations if applicable"],
        "avoid_triggers": ["Things to avoid that might worsen symptoms"]
    }},
    
    "home_care": {{
        "self_care_tips": ["Self-care measures to take at home"],
        "over_the_counter": [
            {{
                "medication": "Name of OTC medication",
                "purpose": "What it's for",
                "dosage": "Recommended dosage",
                "precautions": "Important warnings"
            }}
        ],
        "home_remedies": ["Natural home remedies to try"],
        "when_to_seek_emergency": ["Red flags that require immediate emergency care"]
    }},
    
    "education": {{
        "what_is_happening": "Explanation of what might be happening in the body",
        "common_causes": ["Common causes of these symptoms"],
        "when_to_worry": "Guidance on when symptoms are concerning"
    }},
    
    "disclaimer": "This analysis is for educational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for proper medical care."
}}

Analyze the symptoms carefully and provide specific, tailored advice based on what is described. Be thorough and consider all possibilities while prioritizing the most likely conditions based on the symptoms described.

Remember: Respond with ONLY the JSON object, nothing else.
"""
        
        print(f"\n{'='*70}")
        print(f"[INFO] Analyzing symptoms: {symptom_description[:100]}...")
        print(f"{'='*70}\n")
        
        response = self._call_gemini_api(prompt)
        
        if response:
            print(f"[SUCCESS] Received response from Gemini API ({len(response)} characters)")
            result = self._extract_json(response)
            
            if result:
                # Validate and normalize the result
                validated_result = self._validate_and_normalize_result(result)
                if validated_result:
                    print(f"[SUCCESS] Successfully parsed and validated JSON response")
                    # Add metadata
                    validated_result["analysis_timestamp"] = datetime.datetime.now().isoformat()
                    validated_result["original_symptoms"] = symptom_description
                    return validated_result
                else:
                    print(f"[WARNING] JSON structure validation failed, using extracted data with defaults")
                    result["analysis_timestamp"] = datetime.datetime.now().isoformat()
                    result["original_symptoms"] = symptom_description
                    return result
            else:
                print(f"[WARNING] Failed to parse JSON from response")
                print(f"[DEBUG] Full response: {response[:1000]}")
        else:
            print(f"[ERROR] No response received from Grok API")
        
        # Fallback response if API fails
        print(f"[WARNING] Using fallback response")
        return {
            "symptom_summary": symptom_description,
            "possible_diagnoses": [{
                "condition": "Unable to analyze - please consult a healthcare provider",
                "probability": 0,
                "explanation": "AI analysis unavailable. Please see a doctor for proper evaluation.",
                "severity": "Unknown",
                "urgency": "Non-urgent"
            }],
            "risk_assessment": {
                "overall_risk_level": "Unknown",
                "risk_factors": [],
                "complications": [],
                "prognosis": "Consult healthcare provider for assessment"
            },
            "doctor_recommendations": {
                "specialist_type": "General Practitioner",
                "urgency": "Non-urgent",
                "preparation": ["List your symptoms", "Note when symptoms started", "Bring any relevant medical history"],
                "tests_suggested": ["Consult doctor for recommendations"],
                "questions_to_ask": ["What might be causing these symptoms?", "What tests are needed?", "What treatment options are available?"]
            },
            "prevention_techniques": {
                "immediate_actions": ["Rest", "Stay hydrated", "Monitor symptoms"],
                "lifestyle_changes": ["Maintain healthy lifestyle", "Get adequate sleep", "Manage stress"],
                "diet_recommendations": ["Eat balanced meals", "Stay hydrated"],
                "exercise_recommendations": ["Consult doctor before starting exercise"],
                "avoid_triggers": ["Avoid known triggers if identified"]
            },
            "home_care": {
                "self_care_tips": ["Rest adequately", "Monitor symptoms", "Keep a symptom diary"],
                "over_the_counter": [],
                "home_remedies": ["Rest and hydration"],
                "when_to_seek_emergency": ["Severe symptoms", "Difficulty breathing", "Chest pain", "Loss of consciousness"]
            },
            "education": {
                "what_is_happening": "Unable to analyze - please consult healthcare provider",
                "common_causes": [],
                "when_to_worry": "Seek immediate care if symptoms are severe or worsening"
            },
            "disclaimer": "This analysis is for educational purposes only. Always consult healthcare professionals for proper medical care.",
            "analysis_timestamp": datetime.datetime.now().isoformat(),
            "original_symptoms": symptom_description,
            "error": self.last_error_message or "Gemini AI analysis unavailable. Please check your GEMINI_API_KEY in backend/config.env and ensure it's valid."
        }


def get_medical_ai_service():
    """Initialize and return MedicalAIService with API key from config"""
    env_loaded = False
    loaded_path = None

    # Try to load from config.env file
    if load_dotenv is not None:
        # Look for config.env in backend directory (parent of services directory)
        possible_paths = [
            Path(__file__).parent.parent / "config.env",  # backend/config.env
            Path(__file__).parent.parent / ".env",  # backend/.env
            Path(__file__).parent / "config.env",  # backend/services/config.env (fallback)
            Path(__file__).parent / ".env",  # backend/services/.env (fallback)
        ]
        
        for env_path in possible_paths:
            if env_path.exists() and not env_loaded:
                try:
                    load_dotenv(dotenv_path=env_path, override=False)
                    env_loaded = True
                    loaded_path = env_path
                    print(f"[INFO] Loaded environment from: {env_path}")
                    break
                except Exception as e:
                    print(f"[WARNING] Failed to load {env_path}: {e}")
    else:
        print("[WARNING] python-dotenv is not installed. Install it with: pip install python-dotenv")

    # Try to get API key from environment
    api_key = os.getenv("GEMINI_API_KEY")
    
    # If not found in environment, try reading directly from config.env
    if not api_key:
        config_path = Path(__file__).parent.parent / "config.env"
        if config_path.exists():
            print(f"[INFO] Reading API key directly from {config_path}")
            try:
                with open(config_path, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line.startswith('GEMINI_API_KEY=') and not line.startswith('#'):
                            api_key = line.split('=', 1)[1].strip()
                            print(f"[INFO] Gemini API key loaded from file (length: {len(api_key)})")
                            break
            except Exception as e:
                print(f"[WARNING] Failed to read config file directly: {e}")
    
    # Strip whitespace
    if api_key:
        api_key = api_key.strip()
        if not api_key:
            print("[WARNING] API key is empty after stripping whitespace")

    if not api_key:
        message = (
            "GEMINI_API_KEY environment variable is not set. "
            "Please add your Gemini API key to backend/config.env file."
        )
        print(f"[ERROR] {message}")
        if loaded_path:
            print(f"[ERROR] Config file was loaded from: {loaded_path}")
        raise RuntimeError(message)

    return MedicalAIService(api_key)


