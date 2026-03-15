"use client"
import ProtectedRoute from "@/components/ProtectedRoute";
import { BarChart3, TrendingUp, Activity } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                <BarChart3 size={28} className="text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                                Health Analytics
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Comprehensive health insights and data visualization
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Coming Soon
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Our advanced health analytics dashboard is currently under development. 
                            It will provide detailed insights into your health trends, patterns, and recommendations.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                    Analytics Features:
                                </h3>
                                <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                                    <li>• Health trend analysis</li>
                                    <li>• Risk factor tracking</li>
                                    <li>• Predictive insights</li>
                                    <li>• Custom reports</li>
                                </ul>
                            </div>
                            
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                                    Data Visualization:
                                </h3>
                                <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                                    <li>• Interactive charts</li>
                                    <li>• Real-time monitoring</li>
                                    <li>• Comparative analysis</li>
                                    <li>• Export capabilities</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
