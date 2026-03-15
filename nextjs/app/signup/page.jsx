"use client"
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Calendar, Phone } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
        agreeToPrivacy: false,
        agreeToMarketing: false
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            // Validate passwords match
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                setIsLoading(false);
                return;
            }

            // Call backend API
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess("Account created successfully! Redirecting to profile...");
                // Store token in localStorage
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                
                // Redirect to profile after 2 seconds
                setTimeout(() => {
                    window.location.href = '/profile';
                }, 2000);
            } else {
                setError(data.message || "Signup failed");
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Back to Home */}
                <div className="text-center">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors mb-4"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>

                {/* Signup Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">U</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                UpHealth
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Create Account
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Join UpHealth for personalized health insights
                        </p>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    First Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        placeholder="First name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        placeholder="Last name"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>

                        {/* Date of Birth and Gender */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Date of Birth
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        type="date"
                                        required
                                        value={formData.dateOfBirth}
                                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    required
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    className="block w-full py-3 px-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <input
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    type="checkbox"
                                    required
                                    checked={formData.agreeToTerms}
                                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                                />
                                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    I agree to the{" "}
                                    <a href="#" className="text-purple-600 hover:text-purple-500">Terms of Service</a>
                                </label>
                            </div>
                            <div className="flex items-start">
                                <input
                                    id="agreeToPrivacy"
                                    name="agreeToPrivacy"
                                    type="checkbox"
                                    required
                                    checked={formData.agreeToPrivacy}
                                    onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                                />
                                <label htmlFor="agreeToPrivacy" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    I agree to the{" "}
                                    <a href="#" className="text-purple-600 hover:text-purple-500">Privacy Policy</a>
                                </label>
                            </div>
                            <div className="flex items-start">
                                <input
                                    id="agreeToMarketing"
                                    name="agreeToMarketing"
                                    type="checkbox"
                                    checked={formData.agreeToMarketing}
                                    onChange={(e) => handleInputChange('agreeToMarketing', e.target.checked)}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                                />
                                <label htmlFor="agreeToMarketing" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    I agree to receive health tips and updates via email
                                </label>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Already have an account?{" "}
                                <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>Protected by HIPAA compliance standards</p>
                </div>
            </div>
        </div>
    );
}
