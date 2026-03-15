"use client"
import { useState, useEffect } from "react";
import { User, Settings, LogOut, ArrowLeft, Shield, Activity, Heart, Brain } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!userData || !token) {
            window.location.href = '/login';
            return;
        }

        try {
            setUser(JSON.parse(userData));
        } catch (error) {
            console.error('Error parsing user data:', error);
            window.location.href = '/login';
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link href="/" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors">
                            <ArrowLeft size={20} />
                            <span>Back to Home</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">U</span>
                                </div>
                                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    UpHealth
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                            <div className="text-center mb-6">
                                <div className="h-24 w-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User size={40} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {user?.firstName} {user?.lastName}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                    <Shield size={14} />
                                    <span>Verified User</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Dashboard Button */}
                                <Link href="/dashboard" className="block">
                                    <button className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-colors font-medium">
                                        <Activity size={20} />
                                        <span>Go to Dashboard</span>
                                    </button>
                                </Link>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <Activity size={20} className="text-purple-600" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Member Since</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <Heart size={20} className="text-red-500" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Health Status</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                >
                                    <LogOut size={20} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Profile Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
                                <div className="flex items-center gap-3">
                                    <Link href="/dashboard">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-colors">
                                            <Activity size={20} />
                                            <span>Dashboard</span>
                                        </button>
                                    </Link>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                                        <Settings size={20} />
                                        <span>Edit Profile</span>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Full Name
                                            </label>
                                            <p className="text-gray-900 dark:text-white">
                                                {user?.firstName} {user?.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Email
                                            </label>
                                            <p className="text-gray-900 dark:text-white">{user?.email}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Phone
                                            </label>
                                            <p className="text-gray-900 dark:text-white">{user?.phone || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Gender
                                            </label>
                                            <p className="text-gray-900 dark:text-white capitalize">{user?.gender || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Date of Birth
                                            </label>
                                            <p className="text-gray-900 dark:text-white">
                                                {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Health Services</h3>
                                    <div className="space-y-4">
                                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Brain size={20} className="text-purple-600" />
                                                <h4 className="font-medium text-gray-900 dark:text-white">Migraine Prediction</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                AI-powered migraine risk assessment
                                            </p>
                                            <Link href="/migraine" className="inline-block mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium">
                                                Try Now →
                                            </Link>
                                        </div>

                                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Heart size={20} className="text-red-500" />
                                                <h4 className="font-medium text-gray-900 dark:text-white">Heart Assessment</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Cardiovascular health risk evaluation
                                            </p>
                                            <Link href="/heart-assessment" className="inline-block mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium">
                                                Try Now →
                                            </Link>
                                        </div>

                                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Activity size={20} className="text-green-600" />
                                                <h4 className="font-medium text-gray-900 dark:text-white">Disease Detection</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Symptom-based disease identification
                                            </p>
                                            <Link href="/disease-detection" className="inline-block mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium">
                                                Try Now →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Welcome to UpHealth! 🎉
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Your profile is now set up. You can access all our AI-powered health services including migraine prediction, 
                                    heart risk assessment, and disease detection. Your health data is protected by HIPAA compliance standards.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
