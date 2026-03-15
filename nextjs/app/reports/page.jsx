"use client"
import ProtectedRoute from "@/components/ProtectedRoute";
import { FileText, Download, Share2, Calendar } from "lucide-react";

export default function ReportsPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-12 w-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                                <FileText size={28} className="text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                                Health Reports
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Generate and manage your health assessment reports
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Coming Soon
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Our comprehensive reporting system is currently under development. 
                            It will allow you to generate detailed health reports and share them with healthcare providers.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                                    Report Types:
                                </h3>
                                <ul className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
                                    <li>• Health assessment summaries</li>
                                    <li>• Risk factor reports</li>
                                    <li>• Trend analysis reports</li>
                                    <li>• Provider-ready reports</li>
                                </ul>
                            </div>
                            
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                                    Features:
                                </h3>
                                <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                                    <li>• PDF export functionality</li>
                                    <li>• Secure sharing options</li>
                                    <li>• Customizable templates</li>
                                    <li>• Historical report access</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
