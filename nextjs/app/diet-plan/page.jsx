"use client"
import ProtectedRoute from "@/components/ProtectedRoute";
import { Utensils, CheckCircle, AlertTriangle } from "lucide-react";

export default function DietPlanPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-12 w-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                                <Utensils size={28} className="text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                                Personalized Diet Plan
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Your AI-generated nutrition plan based on your health profile
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Coming Soon
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Our AI-powered diet plan generator is currently under development. 
                            It will analyze your health data, preferences, and restrictions to create 
                            personalized meal plans tailored to your needs.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                                    Features Coming Soon:
                                </h3>
                                <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={16} />
                                        Personalized meal plans
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={16} />
                                        Calorie tracking
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={16} />
                                        Dietary restrictions support
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={16} />
                                        Recipe suggestions
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                    How it works:
                                </h3>
                                <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                                    <li>• AI analyzes your health data</li>
                                    <li>• Considers your preferences</li>
                                    <li>• Generates balanced meal plans</li>
                                    <li>• Provides nutritional guidance</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle size={20} className="text-yellow-600 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                                        Important Note
                                    </h4>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                        Always consult with a healthcare provider or registered dietitian 
                                        before making significant changes to your diet.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
