"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userData && token) {
            try {
                JSON.parse(userData); // Validate JSON
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error parsing user data:', error);
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
        
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-16 w-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                                <Lock size={32} className="text-white" />
                            </div>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Access Restricted
                        </h2>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            This feature requires authentication. Please sign up or log in to access our AI-powered health services.
                        </p>
                        
                        <div className="space-y-4">
                            <Link 
                                href="/signup"
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
                            >
                                <User size={20} />
                                <span>Create Account</span>
                                <ArrowRight size={20} />
                            </Link>
                            
                            <Link 
                                href="/login"
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 rounded-lg transition-all duration-200 font-medium"
                            >
                                <span>Already have an account? Sign in</span>
                            </Link>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Your health data is protected by HIPAA compliance standards
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return children;
}
