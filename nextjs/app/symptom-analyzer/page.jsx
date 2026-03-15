"use client"
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import FeatureLayout from "@/components/FeatureLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
    Brain, 
    Heart, 
    Pill, 
    Stethoscope, 
    AlertTriangle, 
    User, 
    FileText, 
    Loader2,
    Shield,
    Lightbulb,
    Activity,
    ChevronRight
} from "lucide-react";

export default function SymptomAnalyzerPage() {
    const [symptoms, setSymptoms] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    const handleAnalyze = async () => {
        if (!symptoms.trim()) {
            setError("Please describe your symptoms");
            return;
        }

        setIsLoading(true);
        setError("");
        setAnalysis(null);

        try {
            const response = await fetch('http://localhost:8000/api/symptom-analyzer/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    symptoms: symptoms
                })
            });

            if (response.ok) {
                const result = await response.json();
                setAnalysis(result.data);
                setActiveTab("overview");
            } else {
                const errorData = await response.json();
                setError(errorData.detail || "Analysis failed. Please try again.");
            }
        } catch (error) {
            console.error('Analysis error:', error);
            setError("Network error. Please make sure the AI service is running on port 8000.");
        } finally {
            setIsLoading(false);
        }
    };

    const getRiskColor = (risk) => {
        const riskLower = risk?.toLowerCase() || "";
        if (riskLower.includes("critical") || riskLower.includes("high")) return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400";
        if (riskLower.includes("medium")) return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400";
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400";
    };

    const getSeverityColor = (severity) => {
        const severityLower = severity?.toLowerCase() || "";
        if (severityLower.includes("critical") || severityLower.includes("high")) return "bg-red-100 text-red-800 border-red-200";
        if (severityLower.includes("medium")) return "bg-yellow-100 text-yellow-800 border-yellow-200";
        return "bg-green-100 text-green-800 border-green-200";
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: FileText },
        { id: "diagnosis", label: "Diagnosis", icon: Stethoscope },
        { id: "risk", label: "Risk Assessment", icon: Heart },
        { id: "doctor", label: "Doctor Info", icon: User },
        { id: "prevention", label: "Prevention", icon: Shield },
        { id: "homecare", label: "Home Care", icon: Activity },
    ];

    return (
        <ProtectedRoute>
            <FeatureLayout>
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            AI Symptom Analyzer
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Describe your symptoms and get comprehensive medical analysis including diagnosis, 
                            risk assessment, doctor recommendations, and prevention techniques.
                        </p>
                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg max-w-2xl mx-auto">
                            <p className="text-yellow-800 dark:text-yellow-300 text-sm flex items-center justify-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                For educational purposes only. Always consult healthcare professionals for proper diagnosis.
                            </p>
                        </div>
                    </div>

                    {/* Input Section */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Stethoscope className="h-6 w-6" />
                                Describe Your Symptoms
                            </CardTitle>
                            <CardDescription>
                                Be as detailed as possible about your symptoms, when they started, and any other relevant information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                placeholder="Example: I've been experiencing severe headaches on the right side of my head for the past 3 days. The pain is throbbing and gets worse with bright lights. I also feel nauseous and have been avoiding loud noises. I'm a 35-year-old female and this happens about 2-3 times per month..."
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                className="min-h-32"
                                disabled={isLoading}
                            />
                            
                            <div className="flex gap-4">
                                <Button 
                                    onClick={handleAnalyze}
                                    disabled={isLoading || !symptoms.trim()}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Brain className="h-4 w-4 mr-2" />
                                            Analyze Symptoms
                                        </>
                                    )}
                                </Button>
                                
                                {symptoms && (
                                    <Button 
                                        variant="outline"
                                        onClick={() => {
                                            setSymptoms("");
                                            setAnalysis(null);
                                            setError("");
                                        }}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>

                            {error && (
                                <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg">
                                    {error}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Analysis Results */}
                    {analysis && (
                        <div className="space-y-6">
                            {/* Tab Navigation */}
                            <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-purple-600 text-white'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <tab.icon className="h-4 w-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Overview Tab */}
                            {activeTab === "overview" && (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Symptom Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {analysis.symptom_summary || analysis.original_symptoms}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Heart className="h-5 w-5" />
                                                    Risk Level
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Badge className={getRiskColor(analysis.risk_assessment?.overall_risk_level)}>
                                                    {analysis.risk_assessment?.overall_risk_level || "Unknown"}
                                                </Badge>
                                                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                                                    {analysis.risk_assessment?.prognosis || "No prognosis available"}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <User className="h-5 w-5" />
                                                    Recommended Specialist
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="font-medium text-gray-900 dark:text-white mb-2">
                                                    {analysis.doctor_recommendations?.specialist_type || "General Practitioner"}
                                                </p>
                                                <Badge variant="outline">
                                                    {analysis.doctor_recommendations?.urgency || "Non-urgent"}
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {analysis.possible_diagnoses && analysis.possible_diagnoses.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Top Possible Diagnoses</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {analysis.possible_diagnoses.slice(0, 3).map((diagnosis, index) => (
                                                        <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                                                            <div className="flex-1">
                                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                                    {diagnosis.condition}
                                                                </h4>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                    {diagnosis.explanation}
                                                                </p>
                                                            </div>
                                                            <div className="ml-4 text-right">
                                                                <Badge className={getSeverityColor(diagnosis.severity)}>
                                                                    {diagnosis.severity}
                                                                </Badge>
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    {diagnosis.probability}% likely
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* Diagnosis Tab */}
                            {activeTab === "diagnosis" && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Possible Diagnoses</CardTitle>
                                        <CardDescription>Based on your symptom description</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {analysis.possible_diagnoses?.map((diagnosis, index) => (
                                                <div key={index} className="border rounded-lg p-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                            {diagnosis.condition}
                                                        </h4>
                                                        <div className="flex gap-2">
                                                            <Badge className={getSeverityColor(diagnosis.severity)}>
                                                                {diagnosis.severity}
                                                            </Badge>
                                                            <Badge variant="outline">
                                                                {diagnosis.probability}% likely
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                                                        {diagnosis.explanation}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                                            Urgency: {diagnosis.urgency}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Risk Assessment Tab */}
                            {activeTab === "risk" && (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Risk Assessment</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Overall Risk Level
                                                </label>
                                                <Badge className={`mt-2 ${getRiskColor(analysis.risk_assessment?.overall_risk_level)}`}>
                                                    {analysis.risk_assessment?.overall_risk_level || "Unknown"}
                                                </Badge>
                                            </div>
                                            
                                            {analysis.risk_assessment?.risk_factors && analysis.risk_assessment.risk_factors.length > 0 && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                                        Risk Factors
                                                    </label>
                                                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                                        {analysis.risk_assessment.risk_factors.map((factor, index) => (
                                                            <li key={index}>{factor}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {analysis.risk_assessment?.complications && analysis.risk_assessment.complications.length > 0 && (
                                                <div>
                                                    <label className="text-sm font-medium text-red-700 dark:text-red-400 block mb-2">
                                                        Potential Complications
                                                    </label>
                                                    <ul className="list-disc list-inside space-y-1 text-red-600 dark:text-red-400">
                                                        {analysis.risk_assessment.complications.map((complication, index) => (
                                                            <li key={index}>{complication}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <div>
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                                    Prognosis
                                                </label>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {analysis.risk_assessment?.prognosis || "No prognosis available"}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Doctor Recommendations Tab */}
                            {activeTab === "doctor" && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Doctor Recommendations</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                Recommended Specialist
                                            </h4>
                                            <p className="text-lg text-purple-600 dark:text-purple-400">
                                                {analysis.doctor_recommendations?.specialist_type || "General Practitioner"}
                                            </p>
                                            <Badge className="mt-2" variant="outline">
                                                {analysis.doctor_recommendations?.urgency || "Non-urgent"}
                                            </Badge>
                                        </div>

                                        {analysis.doctor_recommendations?.preparation && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                    Preparation for Visit
                                                </h4>
                                                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                                    {analysis.doctor_recommendations.preparation.map((item, index) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {analysis.doctor_recommendations?.tests_suggested && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                    Suggested Tests
                                                </h4>
                                                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                                    {analysis.doctor_recommendations.tests_suggested.map((test, index) => (
                                                        <li key={index}>{test}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {analysis.doctor_recommendations?.questions_to_ask && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                    Questions to Ask Your Doctor
                                                </h4>
                                                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                                    {analysis.doctor_recommendations.questions_to_ask.map((question, index) => (
                                                        <li key={index}>{question}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Prevention Tab */}
                            {activeTab === "prevention" && (
                                <div className="space-y-6">
                                    {analysis.prevention_techniques?.immediate_actions && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                                    Immediate Actions
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                                                    {analysis.prevention_techniques.immediate_actions.map((action, index) => (
                                                        <li key={index}>{action}</li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {analysis.prevention_techniques?.lifestyle_changes && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Activity className="h-5 w-5" />
                                                    Lifestyle Changes
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                                                    {analysis.prevention_techniques.lifestyle_changes.map((change, index) => (
                                                        <li key={index}>{change}</li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {analysis.prevention_techniques?.diet_recommendations && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Diet Recommendations</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                                                    {analysis.prevention_techniques.diet_recommendations.map((rec, index) => (
                                                        <li key={index}>{rec}</li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {analysis.prevention_techniques?.avoid_triggers && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Things to Avoid</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                                                    {analysis.prevention_techniques.avoid_triggers.map((trigger, index) => (
                                                        <li key={index}>{trigger}</li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* Home Care Tab */}
                            {activeTab === "homecare" && (
                                <div className="space-y-6">
                                    {analysis.home_care?.self_care_tips && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Self-Care Tips</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                                                    {analysis.home_care.self_care_tips.map((tip, index) => (
                                                        <li key={index}>{tip}</li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {analysis.home_care?.over_the_counter && analysis.home_care.over_the_counter.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Pill className="h-5 w-5" />
                                                    Over-the-Counter Options
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {analysis.home_care.over_the_counter.map((med, index) => (
                                                        <div key={index} className="border rounded-lg p-4">
                                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                                {med.medication}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                                <span className="font-medium">Purpose:</span> {med.purpose}
                                                            </p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                                <span className="font-medium">Dosage:</span> {med.dosage}
                                                            </p>
                                                            {med.precautions && (
                                                                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                                                                    <p className="text-xs text-yellow-800 dark:text-yellow-300">
                                                                        <span className="font-medium">Precautions:</span> {med.precautions}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {analysis.home_care?.home_remedies && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Home Remedies</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                                                    {analysis.home_care.home_remedies.map((remedy, index) => (
                                                        <li key={index}>{remedy}</li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {analysis.home_care?.when_to_seek_emergency && (
                                        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-400">
                                                    <AlertTriangle className="h-5 w-5" />
                                                    When to Seek Emergency Care
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="list-disc list-inside space-y-2 text-red-700 dark:text-red-300">
                                                    {analysis.home_care.when_to_seek_emergency.map((emergency, index) => (
                                                        <li key={index}>{emergency}</li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* Disclaimer */}
                            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                        <div className="text-sm text-yellow-800 dark:text-yellow-300">
                                            <p className="font-medium mb-1">Important Medical Disclaimer</p>
                                            <p>
                                                {analysis.disclaimer || "This analysis is for educational and informational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </FeatureLayout>
        </ProtectedRoute>
    );
}
