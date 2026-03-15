"use client"
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Brain, Heart, TrendingUp, Clock, BarChart3, Home, User, FileText, Settings, LogOut, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const [recentPredictions, setRecentPredictions] = useState([]);
    const [stats, setStats] = useState({
        totalPredictions: 0,
        migrainePredictions: 0,
        healthRiskPredictions: 0,
        averageConfidence: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUserPredictions();
    }, []);

    const loadUserPredictions = () => {
        // Get predictions from localStorage for now (you can change this to API later)
        const allPredictions = JSON.parse(localStorage.getItem('userPredictions') || '[]');
        
        // Calculate stats
        const migrainePreds = allPredictions.filter(p => p.type === 'migraine');
        const healthPreds = allPredictions.filter(p => p.type === 'health-risk');
        const avgConfidence = allPredictions.length > 0 ? 
            Math.round(allPredictions.reduce((sum, p) => sum + (p.confidence || 0), 0) / allPredictions.length) : 0;

        setStats({
            totalPredictions: allPredictions.length,
            migrainePredictions: migrainePreds.length,
            healthRiskPredictions: healthPreds.length,
            averageConfidence: avgConfidence
        });

        // Sort by date and get recent ones
        const sortedPredictions = allPredictions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        setRecentPredictions(sortedPredictions);
        setIsLoading(false);
    };

    const getRiskBadgeColor = (riskLevel) => {
        switch (riskLevel?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 48) return "Yesterday";
        return date.toLocaleDateString();
    };

    // Simple chart data for the last 7 days
    const getChartData = () => {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayPredictions = recentPredictions.filter(p => {
                const predDate = new Date(p.date);
                return predDate.toDateString() === date.toDateString();
            });
            last7Days.push({
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                count: dayPredictions.length
            });
        }
        return last7Days;
    };

    if (isLoading) {
        return (
            <ProtectedRoute>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    const chartData = getChartData();
    const maxCount = Math.max(...chartData.map(d => d.count), 1);

    // Sidebar navigation links
    const links = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Migraine Check",
            href: "/migraine",
            icon: <Brain className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Health Assessment",
            href: "/heart-assessment",
            icon: <Heart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "AI Symptom Analyzer",
            href: "/symptom-analyzer",
            icon: <Brain className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Reports",
            href: "/reports",
            icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Profile",
            href: "/profile",
            icon: <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Settings",
            href: "/settings",
            icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userPredictions');
        window.location.href = '/login';
    };

    return (
        <ProtectedRoute>
            <div className="rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen">
                <Sidebar>
                    <SidebarBody className="justify-between gap-10">
                        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                            <div className="flex items-center gap-2 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="bg-purple-600 rounded-lg p-2">
                                        <Activity className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                                        UpHealth
                                    </span>
                                </div>
                            </div>
                            <div className="mt-8 flex flex-col gap-2">
                                {links.map((link, idx) => (
                                    <SidebarLink key={idx} link={link} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full p-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </SidebarBody>
                </Sidebar>
                <div className="flex flex-1 overflow-hidden">
                    <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Health Dashboard</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">Track your health predictions and insights</p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
                                <Activity className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalPredictions}</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">All time predictions</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Migraine Predictions</CardTitle>
                                <Brain className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.migrainePredictions}</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Headache assessments</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Health Risk Checks</CardTitle>
                                <Heart className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.healthRiskPredictions}</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Vital sign analyses</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.averageConfidence}%</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Prediction accuracy</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts and Recent Predictions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Activity Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Weekly Activity
                                </CardTitle>
                                <CardDescription>Predictions made in the last 7 days</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {chartData.map((day, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-12 text-sm text-gray-600 dark:text-gray-400">{day.day}</div>
                                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative">
                                                <div 
                                                    className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                                                    style={{ width: `${(day.count / maxCount) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="w-8 text-sm font-medium">{day.count}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Predictions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Recent Predictions
                                </CardTitle>
                                <CardDescription>Your latest health assessments</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recentPredictions.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentPredictions.map((prediction, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    {prediction.type === 'migraine' ? (
                                                        <Brain className="h-5 w-5 text-blue-600" />
                                                    ) : (
                                                        <Heart className="h-5 w-5 text-red-600" />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">
                                                            {prediction.type === 'migraine' ? 'Migraine Assessment' : 'Health Risk Check'}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(prediction.date)}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge className={getRiskBadgeColor(prediction.riskLevel)}>
                                                        {prediction.riskLevel || 'Unknown'}
                                                    </Badge>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{prediction.confidence}% confidence</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No predictions yet</p>
                                        <p className="text-sm">Start by making your first health assessment</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Get started with a new health assessment</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Button 
                                    className="justify-start gap-3 h-12"
                                    variant="outline"
                                    onClick={() => window.location.href = '/migraine'}
                                >
                                    <Brain className="h-5 w-5" />
                                    Migraine Prediction
                                </Button>
                                
                                <Button 
                                    className="justify-start gap-3 h-12"
                                    variant="outline"
                                    onClick={() => window.location.href = '/heart-assessment'}
                                >
                                    <Heart className="h-5 w-5" />
                                    Health Risk Assessment
                                </Button>

                                <Button 
                                    className="justify-start gap-3 h-12 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                                    variant="outline"
                                    onClick={() => window.location.href = '/symptom-analyzer'}
                                >
                                    <Stethoscope className="h-5 w-5" />
                                    AI Symptom Analyzer
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
