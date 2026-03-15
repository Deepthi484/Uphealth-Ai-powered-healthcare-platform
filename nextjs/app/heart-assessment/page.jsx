"use client"
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FeatureLayout from "@/components/FeatureLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, AlertTriangle, CheckCircle, Info, Activity } from "lucide-react";
import API_CONFIG from "@/config/api";

export default function HeartRiskAssessmentPage() {
    const [formData, setFormData] = useState({
        Patient_ID: "",
        Respiratory_Rate: "",
        Oxygen_Saturation: "",
        O2_Scale: "",
        Systolic_BP: "",
        Heart_Rate: "",
        Temperature: "",
        Consciousness: "",
        On_Oxygen: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState("");

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setPrediction(null);

        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json'
            };
            
            // Add authorization header if user is logged in
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
            
            const response = await fetch(API_CONFIG.PREDICTION_ENDPOINTS.HEALTH_RISK, {
                method: 'POST',
                headers,
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setPrediction(data);
                
                // Save prediction to user's history if logged in
                const token = localStorage.getItem('token');
                if (token) {
                    const userPredictions = JSON.parse(localStorage.getItem('userPredictions') || '[]');
                    const newPrediction = {
                        id: Date.now(),
                        type: 'health-risk',
                        date: new Date().toISOString(),
                        prediction: data.prediction,
                        confidence: data.confidence,
                        riskLevel: data.risk_level,
                        description: data.risk_level,
                        recommendations: data.recommendations || [],
                        vitalSignsAnalysis: data.vital_signs_analysis || []
                    };
                    userPredictions.unshift(newPrediction);
                    // Keep only last 50 predictions
                    if (userPredictions.length > 50) {
                        userPredictions.splice(50);
                    }
                    localStorage.setItem('userPredictions', JSON.stringify(userPredictions));
                }
            } else {
                setError(data.message || "Prediction failed");
            }
        } catch (error) {
            console.error('Prediction error:', error);
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getRiskColor = (riskLevel) => {
        switch (riskLevel?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <ProtectedRoute>
            <FeatureLayout>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Heart Risk Assessment
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Analyze your vital signs to assess cardiovascular health risk and get personalized recommendations
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Input Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart size={24} />
                                    Vital Signs Assessment
                                </CardTitle>
                                <CardDescription>
                                    Please provide accurate vital signs measurements
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Patient ID */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Patient ID
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.Patient_ID}
                                            onChange={(e) => handleInputChange('Patient_ID', e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            placeholder="e.g., P001"
                                            required
                                        />
                                    </div>

                                    {/* Respiratory Rate */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Respiratory Rate (breaths per minute)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.Respiratory_Rate}
                                            onChange={(e) => handleInputChange('Respiratory_Rate', e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            placeholder="e.g., 16"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Normal range: 12-20 breaths per minute
                                        </p>
                                    </div>

                                    {/* Oxygen Saturation */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Oxygen Saturation (%)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            value={formData.Oxygen_Saturation}
                                            onChange={(e) => handleInputChange('Oxygen_Saturation', e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            placeholder="e.g., 98"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Normal range: 95-100%
                                        </p>
                                    </div>

                                    {/* O2 Scale */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Oxygen Scale
                                        </label>
                                        <select
                                            value={formData.O2_Scale}
                                            onChange={(e) => handleInputChange('O2_Scale', e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            required
                                        >
                                            <option value="">Select oxygen scale</option>
                                            <option value="1">Normal (1)</option>
                                            <option value="2">Abnormal (2)</option>
                                        </select>
                                    </div>

                                    {/* Blood Pressure */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Systolic Blood Pressure (mmHg)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.Systolic_BP}
                                            onChange={(e) => handleInputChange('Systolic_BP', e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            placeholder="e.g., 120"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Normal range: 90-140 mmHg
                                        </p>
                                    </div>

                                    {/* Heart Rate */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Heart Rate (beats per minute)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.Heart_Rate}
                                            onChange={(e) => handleInputChange('Heart_Rate', e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            placeholder="e.g., 72"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Normal range: 60-100 beats per minute
                                        </p>
                                    </div>

                                    {/* Temperature */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Body Temperature (°C)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.Temperature}
                                            onChange={(e) => handleInputChange('Temperature', e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            placeholder="e.g., 37.0"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Normal range: 36.0-37.5°C
                                        </p>
                                    </div>

                                    {/* Consciousness */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Consciousness Level
                                        </label>
                                        <select
                                            value={formData.Consciousness}
                                            onChange={(e) => handleInputChange('Consciousness', e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            required
                                        >
                                            <option value="">Select consciousness level</option>
                                            <option value="A">Alert (A)</option>
                                            <option value="P">Pain responsive (P)</option>
                                            <option value="U">Unresponsive (U)</option>
                                            <option value="V">Voice responsive (V)</option>
                                        </select>
                                    </div>

                                    {/* On Oxygen */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            On Oxygen Support
                                        </label>
                                        <select
                                            value={formData.On_Oxygen}
                                            onChange={(e) => handleInputChange('On_Oxygen', e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            required
                                        >
                                            <option value="">Select</option>
                                            <option value="0">No</option>
                                            <option value="1">Yes</option>
                                        </select>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full bg-red-600 hover:bg-red-700"
                                    >
                                        {isLoading ? "Analyzing..." : "Assess Heart Risk"}
                                    </Button>

                                    {error && (
                                        <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg">
                                            {error}
                                        </div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>

                        {/* Results */}
                        <div className="space-y-6">
                            {prediction && (
                                <>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CheckCircle size={24} className="text-green-600" />
                                                Assessment Results
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Risk Level:</span>
                                                <Badge className={getRiskColor(prediction.risk_level)}>
                                                    {prediction.prediction}
                                                </Badge>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Confidence:</span>
                                                <span className="text-lg font-bold">{prediction.confidence}%</span>
                                            </div>
                                            
                                            <div>
                                                <h4 className="font-medium mb-2">Assessment:</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {prediction.risk_level}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Activity size={24} className="text-blue-600" />
                                                Vital Signs Analysis
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {prediction.vital_signs_analysis.map((analysis, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-sm">{analysis}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Info size={24} className="text-blue-600" />
                                                Recommendations
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {prediction.recommendations.map((rec, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-sm">{rec}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </>
                            )}

                            {/* Information Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle size={24} className="text-orange-600" />
                                        Important Notice
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        This assessment is for informational purposes only and should not replace professional medical advice. 
                                        Always consult with a healthcare provider for proper diagnosis and treatment, especially for high-risk results.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Normal Ranges Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info size={24} className="text-green-600" />
                                        Normal Vital Signs Ranges
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <strong>Respiratory Rate:</strong> 12-20 bpm
                                        </div>
                                        <div>
                                            <strong>Oxygen Saturation:</strong> 95-100%
                                        </div>
                                        <div>
                                            <strong>Blood Pressure:</strong> 90-140 mmHg
                                        </div>
                                        <div>
                                            <strong>Heart Rate:</strong> 60-100 bpm
                                        </div>
                                        <div>
                                            <strong>Temperature:</strong> 36.0-37.5°C
                                        </div>
                                        <div>
                                            <strong>Consciousness:</strong> Alert
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </FeatureLayout>
        </ProtectedRoute>
    );
}
