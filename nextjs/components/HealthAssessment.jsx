"use client"
import { useState } from "react";
import { Brain, Heart, Stethoscope, Apple, Activity, CheckCircle, AlertCircle } from "lucide-react";

export default function HealthAssessment() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Personal Information
        name: "",
        age: "",
        gender: "",
        weight: "",
        height: "",
        
        // Medical History
        hasMigraines: false,
        migraineFrequency: "",
        migraineTriggers: [],
        hasHeartConditions: false,
        familyHeartHistory: false,
        bloodPressure: "",
        cholesterol: "",
        
        // Symptoms
        symptoms: [],
        currentMedications: "",
        allergies: "",
        
        // Lifestyle
        exerciseFrequency: "",
        dietType: "",
        sleepHours: "",
        stressLevel: "",
        smokingStatus: "",
        alcoholConsumption: "",
    });

    const migraineTriggers = [
        "Stress", "Lack of Sleep", "Certain Foods", "Weather Changes", 
        "Hormonal Changes", "Bright Lights", "Strong Smells", "Dehydration"
    ];

    const commonSymptoms = [
        "Headaches", "Dizziness", "Nausea", "Fatigue", "Chest Pain",
        "Shortness of Breath", "Palpitations", "Swelling", "Joint Pain",
        "Digestive Issues", "Vision Problems", "Memory Issues"
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleArrayChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value) 
                ? prev[field].filter(item => item !== value)
                : [...prev[field], value]
        }));
    };

    const nextStep = () => {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
                <p className="text-gray-600">Let's start with your basic information</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your full name"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Age</label>
                    <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your age"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Gender</label>
                    <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                    <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your weight"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Height (cm)</label>
                    <input
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your height"
                    />
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Medical History</h2>
                <p className="text-gray-600">Tell us about your health history</p>
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="hasMigraines"
                        checked={formData.hasMigraines}
                        onChange={(e) => handleInputChange('hasMigraines', e.target.checked)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="hasMigraines" className="text-sm font-medium">
                        Do you experience migraines?
                    </label>
                </div>
                
                {formData.hasMigraines && (
                    <div className="ml-7 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Migraine Frequency</label>
                            <select
                                value={formData.migraineFrequency}
                                onChange={(e) => handleInputChange('migraineFrequency', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="">Select frequency</option>
                                <option value="rarely">Rarely (1-2 times per year)</option>
                                <option value="occasionally">Occasionally (1-2 times per month)</option>
                                <option value="frequently">Frequently (1-2 times per week)</option>
                                <option value="very-frequently">Very frequently (3+ times per week)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Migraine Triggers (Select all that apply)</label>
                            <div className="grid grid-cols-2 gap-2">
                                {migraineTriggers.map(trigger => (
                                    <div key={trigger} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={trigger}
                                            checked={formData.migraineTriggers.includes(trigger)}
                                            onChange={() => handleArrayChange('migraineTriggers', trigger)}
                                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                                        />
                                        <label htmlFor={trigger} className="text-sm">{trigger}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="hasHeartConditions"
                        checked={formData.hasHeartConditions}
                        onChange={(e) => handleInputChange('hasHeartConditions', e.target.checked)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="hasHeartConditions" className="text-sm font-medium">
                        Do you have any heart conditions?
                    </label>
                </div>
                
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="familyHeartHistory"
                        checked={formData.familyHeartHistory}
                        onChange={(e) => handleInputChange('familyHeartHistory', e.target.checked)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="familyHeartHistory" className="text-sm font-medium">
                        Family history of heart disease?
                    </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Blood Pressure (if known)</label>
                        <input
                            type="text"
                            value={formData.bloodPressure}
                            onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., 120/80"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">Cholesterol Level (if known)</label>
                        <input
                            type="text"
                            value={formData.cholesterol}
                            onChange={(e) => handleInputChange('cholesterol', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., 200 mg/dL"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Current Symptoms</h2>
                <p className="text-gray-600">Tell us about any symptoms you're experiencing</p>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Current Symptoms (Select all that apply)</label>
                    <div className="grid grid-cols-2 gap-2">
                        {commonSymptoms.map(symptom => (
                            <div key={symptom} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={symptom}
                                    checked={formData.symptoms.includes(symptom)}
                                    onChange={() => handleArrayChange('symptoms', symptom)}
                                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                                />
                                <label htmlFor={symptom} className="text-sm">{symptom}</label>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Current Medications</label>
                    <textarea
                        value={formData.currentMedications}
                        onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows="3"
                        placeholder="List any medications you're currently taking..."
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Allergies</label>
                    <textarea
                        value={formData.allergies}
                        onChange={(e) => handleInputChange('allergies', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows="2"
                        placeholder="List any allergies (food, medication, environmental)..."
                    />
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Lifestyle Information</h2>
                <p className="text-gray-600">Help us understand your daily habits</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Exercise Frequency</label>
                    <select
                        value={formData.exerciseFrequency}
                        onChange={(e) => handleInputChange('exerciseFrequency', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="">Select frequency</option>
                        <option value="never">Never</option>
                        <option value="rarely">Rarely (1-2 times per month)</option>
                        <option value="sometimes">Sometimes (1-2 times per week)</option>
                        <option value="regularly">Regularly (3-4 times per week)</option>
                        <option value="daily">Daily</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Diet Type</label>
                    <select
                        value={formData.dietType}
                        onChange={(e) => handleInputChange('dietType', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="">Select diet type</option>
                        <option value="omnivore">Omnivore (Everything)</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="keto">Keto</option>
                        <option value="paleo">Paleo</option>
                        <option value="mediterranean">Mediterranean</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Sleep Hours (per night)</label>
                    <select
                        value={formData.sleepHours}
                        onChange={(e) => handleInputChange('sleepHours', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="">Select hours</option>
                        <option value="less-than-5">Less than 5 hours</option>
                        <option value="5-6">5-6 hours</option>
                        <option value="6-7">6-7 hours</option>
                        <option value="7-8">7-8 hours</option>
                        <option value="8-9">8-9 hours</option>
                        <option value="more-than-9">More than 9 hours</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Stress Level</label>
                    <select
                        value={formData.stressLevel}
                        onChange={(e) => handleInputChange('stressLevel', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="">Select stress level</option>
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                        <option value="very-high">Very High</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Smoking Status</label>
                    <select
                        value={formData.smokingStatus}
                        onChange={(e) => handleInputChange('smokingStatus', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="">Select status</option>
                        <option value="never">Never smoked</option>
                        <option value="former">Former smoker</option>
                        <option value="current">Current smoker</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Alcohol Consumption</label>
                    <select
                        value={formData.alcoholConsumption}
                        onChange={(e) => handleInputChange('alcoholConsumption', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="">Select frequency</option>
                        <option value="never">Never</option>
                        <option value="rarely">Rarely</option>
                        <option value="moderately">Moderately</option>
                        <option value="frequently">Frequently</option>
                        <option value="excessively">Excessively</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
                <p className="text-gray-600">Review your information before submitting</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold mb-2">Personal Information</h3>
                        <p><strong>Name:</strong> {formData.name || 'Not provided'}</p>
                        <p><strong>Age:</strong> {formData.age || 'Not provided'}</p>
                        <p><strong>Gender:</strong> {formData.gender || 'Not provided'}</p>
                        <p><strong>Weight:</strong> {formData.weight || 'Not provided'} kg</p>
                        <p><strong>Height:</strong> {formData.height || 'Not provided'} cm</p>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold mb-2">Health Summary</h3>
                        <p><strong>Migraines:</strong> {formData.hasMigraines ? 'Yes' : 'No'}</p>
                        <p><strong>Heart Conditions:</strong> {formData.hasHeartConditions ? 'Yes' : 'No'}</p>
                        <p><strong>Family Heart History:</strong> {formData.familyHeartHistory ? 'Yes' : 'No'}</p>
                        <p><strong>Current Symptoms:</strong> {formData.symptoms.length} selected</p>
                        <p><strong>Exercise:</strong> {formData.exerciseFrequency || 'Not specified'}</p>
                    </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-blue-800">Important Notice</h4>
                            <p className="text-blue-700 text-sm">
                                This assessment is for informational purposes only and should not replace professional medical advice. 
                                Always consult with healthcare professionals for diagnosis and treatment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            case 5: return renderStep5();
            default: return renderStep1();
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Step {currentStep} of 5
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                            {Math.round((currentStep / 5) * 100)}% Complete
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / 5) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Step Content */}
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`px-6 py-2 rounded-lg border transition-colors ${
                            currentStep === 1
                                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                                : 'border-purple-600 text-purple-600 hover:bg-purple-50'
                        }`}
                    >
                        Previous
                    </button>
                    
                    <button
                        onClick={nextStep}
                        disabled={currentStep === 5}
                        className={`px-6 py-2 rounded-lg transition-colors ${
                            currentStep === 5
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                    >
                        {currentStep === 5 ? 'Submit Assessment' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
}
