"use client"
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FeatureLayout from "@/components/FeatureLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, CheckCircle, Info } from "lucide-react";
import API_CONFIG from "@/config/api";

export default function MigrainePredictionPage() {
    const [formData, setFormData] = useState({
        Age: "",
        Duration: "",
        Frequency: "",
        Location: "",
        Character: "",
        Intensity: "",
        Nausea: "",
        Vomit: "",
        Phonophobia: "",
        Photophobia: "",
        Visual: "",
        Sensory: "",
        Dysphasia: "",
        Dysarthria: "",
        Vertigo: "",
        Tinnitus: "",
        Hypoacusis: "",
        Diplopia: "",
        Defect: "",
        Ataxia: "",
        Conscience: "",
        Paresthesia: "",
        DPF: ""
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
            
            const response = await fetch(API_CONFIG.PREDICTION_ENDPOINTS.MIGRAINE, {
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
                        type: 'migraine',
                        date: new Date().toISOString(),
                        prediction: data.prediction,
                        confidence: data.confidence,
                        riskLevel: data.risk_level,
                        description: data.migraine_type,
                        recommendations: data.recommendations || []
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
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <ProtectedRoute>
            <FeatureLayout>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Migraine Prediction
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Analyze your migraine symptoms to predict the type and get personalized recommendations
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Input Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain size={24} />
                                    Symptom Assessment
                                </CardTitle>
                                <CardDescription>
                                    Please provide accurate information about your migraine symptoms
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Age</label>
                                            <input
                                                type="number"
                                                value={formData.Age}
                                                onChange={(e) => handleInputChange('Age', e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Duration (hours)</label>
                                            <input
                                                type="number"
                                                value={formData.Duration}
                                                onChange={(e) => handleInputChange('Duration', e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Frequency (per month)</label>
                                            <input
                                                type="number"
                                                value={formData.Frequency}
                                                onChange={(e) => handleInputChange('Frequency', e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Intensity (1-3)</label>
                                            <select
                                                value={formData.Intensity}
                                                onChange={(e) => handleInputChange('Intensity', e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            >
                                                <option value="">Select intensity</option>
                                                <option value="1">Mild (1)</option>
                                                <option value="2">Moderate (2)</option>
                                                <option value="3">Severe (3)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Symptoms */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-lg">Symptoms</h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Nausea</label>
                                                <select
                                                    value={formData.Nausea}
                                                    onChange={(e) => handleInputChange('Nausea', e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    <option value="0">No</option>
                                                    <option value="1">Yes</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Vomiting</label>
                                                <select
                                                    value={formData.Vomit}
                                                    onChange={(e) => handleInputChange('Vomit', e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    <option value="0">No</option>
                                                    <option value="1">Yes</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Phonophobia (Sound sensitivity)</label>
                                                <select
                                                    value={formData.Phonophobia}
                                                    onChange={(e) => handleInputChange('Phonophobia', e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    <option value="0">No</option>
                                                    <option value="1">Yes</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Photophobia (Light sensitivity)</label>
                                                <select
                                                    value={formData.Photophobia}
                                                    onChange={(e) => handleInputChange('Photophobia', e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    <option value="0">No</option>
                                                    <option value="1">Yes</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Visual Symptoms */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Visual Symptoms</label>
                                            <select
                                                value={formData.Visual}
                                                onChange={(e) => handleInputChange('Visual', e.target.value)}
                                                className="w-full p-2 border rounded-md"
                                                required
                                            >
                                                <option value="">Select visual symptoms</option>
                                                <option value="0">None</option>
                                                <option value="1">Mild</option>
                                                <option value="2">Moderate</option>
                                                <option value="3">Severe</option>
                                                <option value="4">Very severe</option>
                                            </select>
                                        </div>

                                        {/* Additional Symptoms */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {['Sensory', 'Dysphasia', 'Dysarthria', 'Vertigo', 'Tinnitus', 'Hypoacusis', 'Diplopia', 'Defect', 'Ataxia', 'Conscience', 'Paresthesia', 'DPF'].map(symptom => (
                                                <div key={symptom}>
                                                    <label className="block text-sm font-medium mb-1">{symptom}</label>
                                                    <select
                                                        value={formData[symptom]}
                                                        onChange={(e) => handleInputChange(symptom, e.target.value)}
                                                        className="w-full p-2 border rounded-md"
                                                        required
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="0">No</option>
                                                        <option value="1">Yes</option>
                                                        {symptom === 'Sensory' && (
                                                            <>
                                                                <option value="2">Moderate</option>
                                                            </>
                                                        )}
                                                    </select>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Location and Character */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Location</label>
                                                <select
                                                    value={formData.Location}
                                                    onChange={(e) => handleInputChange('Location', e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                    required
                                                >
                                                    <option value="">Select location</option>
                                                    <option value="1">Unilateral</option>
                                                    <option value="2">Bilateral</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Character</label>
                                                <select
                                                    value={formData.Character}
                                                    onChange={(e) => handleInputChange('Character', e.target.value)}
                                                    className="w-full p-2 border rounded-md"
                                                    required
                                                >
                                                    <option value="">Select character</option>
                                                    <option value="1">Throbbing</option>
                                                    <option value="2">Pressure</option>
                                                    <option value="3">Stabbing</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full bg-purple-600 hover:bg-purple-700"
                                    >
                                        {isLoading ? "Analyzing..." : "Predict Migraine Type"}
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
                                                Prediction Results
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">Migraine Type:</span>
                                                <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700">
                                                    {prediction.prediction}
                                                </Badge>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">Confidence:</span>
                                                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{prediction.confidence}%</span>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">Risk Level:</span>
                                                <Badge className={getRiskColor(prediction.risk_level)}>
                                                    {prediction.risk_level}
                                                </Badge>
                                            </div>
                                            
                                            <div>
                                                <h4 className="font-medium mb-2">Description:</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {prediction.migraine_type}
                                                </p>
                                            </div>
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
                                        This prediction is for informational purposes only and should not replace professional medical advice. 
                                        Always consult with a healthcare provider for proper diagnosis and treatment.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </FeatureLayout>
        </ProtectedRoute>
    );
}
