"use client"
import ProtectedRoute from "@/components/ProtectedRoute";
import { Activity, ArrowLeft, Brain, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function DiseaseDetectionPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <Link href="/profile" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors">
                                <ArrowLeft size={20} />
                                <span>Back to Profile</span>
                            </Link>
                            <div className="flex items-center gap-2">
                                <Activity size={24} className="text-green-600" />
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    Disease Detection
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                    <Activity size={32} className="text-white" />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                AI-Powered Symptom Analysis
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Our advanced AI analyzes your symptoms to help identify potential health conditions and guide you toward appropriate care.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <Brain size={24} className="text-green-600" />
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        How It Works
                                    </h3>
                                </div>
                                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Describe your symptoms in detail</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>AI analyzes symptom patterns and combinations</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Get potential condition matches with confidence scores</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Receive guidance on next steps and when to seek care</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <AlertTriangle size={24} className="text-blue-600" />
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        What We Analyze
                                    </h3>
                                </div>
                                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Symptom severity and duration</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Associated symptoms and patterns</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Medical history and risk factors</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                        <span>Lifestyle and environmental factors</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-8">
                            <div className="flex items-start gap-3">
                                <AlertTriangle size={24} className="text-yellow-600 mt-1" />
                                <div>
                                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                                        Important Disclaimer
                                    </h3>
                                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                                        This AI tool is for informational purposes only and should not replace professional medical advice. 
                                        Always consult with a healthcare provider for proper diagnosis and treatment. 
                                        In case of emergency, call emergency services immediately.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg">
                                <Activity size={20} />
                                <span>Coming Soon - AI Model Training in Progress</span>
                            </div>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                Our AI model is being trained on extensive medical data to provide accurate symptom analysis.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
