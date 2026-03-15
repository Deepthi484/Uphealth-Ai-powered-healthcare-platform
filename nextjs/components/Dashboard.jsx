"use client"
import { useState, useEffect } from "react";
import { Sidebar, SidebarProvider, SidebarBody, DesktopSidebar, MobileSidebar, SidebarLink } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    User, 
    Brain, 
    Heart, 
    Activity, 
    Utensils, 
    AlertTriangle, 
    TrendingUp, 
    Clock,
    Shield,
    ArrowRight,
    LogOut,
    Home,
    BarChart3,
    FileText
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <div className="flex h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <SidebarBody>
                    <DesktopSidebar>
                        <div className="space-y-2">
                            <SidebarLink link={{ href: "/dashboard", icon: <Home size={20} />, label: "Dashboard" }} />
                            <SidebarLink link={{ href: "/profile", icon: <User size={20} />, label: "Profile" }} />
                            <SidebarLink link={{ href: "/migraine", icon: <Brain size={20} />, label: "Migraine Prediction" }} />
                            <SidebarLink link={{ href: "/heart-assessment", icon: <Heart size={20} />, label: "Heart Risk Assessment" }} />
                            <SidebarLink link={{ href: "/disease-detection", icon: <Activity size={20} />, label: "Disease Detection" }} />
                            <SidebarLink link={{ href: "/diet-plan", icon: <Utensils size={20} />, label: "Diet Plans" }} />
                            <SidebarLink link={{ href: "/analytics", icon: <BarChart3 size={20} />, label: "Health Analytics" }} />
                            <SidebarLink link={{ href: "/reports", icon: <FileText size={20} />, label: "Reports" }} />
                        </div>
                        <div className="mt-auto pt-6">
                            <Button onClick={handleLogout} variant="outline" className="w-full flex items-center justify-center">
                                <LogOut size={16} />
                            </Button>
                        </div>
                    </DesktopSidebar>

                    <MobileSidebar>
                        <div className="space-y-2">
                            <SidebarLink link={{ href: "/dashboard", icon: <Home size={20} />, label: "Dashboard" }} />
                            <SidebarLink link={{ href: "/profile", icon: <User size={20} />, label: "Profile" }} />
                            <SidebarLink link={{ href: "/migraine", icon: <Brain size={20} />, label: "Migraine Prediction" }} />
                            <SidebarLink link={{ href: "/heart-assessment", icon: <Heart size={20} />, label: "Heart Risk Assessment" }} />
                            <SidebarLink link={{ href: "/disease-detection", icon: <Activity size={20} />, label: "Disease Detection" }} />
                            <SidebarLink link={{ href: "/diet-plan", icon: <Utensils size={20} />, label: "Diet Plans" }} />
                            <SidebarLink link={{ href: "/analytics", icon: <BarChart3 size={20} />, label: "Health Analytics" }} />
                            <SidebarLink link={{ href: "/reports", icon: <FileText size={20} />, label: "Reports" }} />
                        </div>
                        <div className="mt-auto pt-6">
                            <Button onClick={handleLogout} variant="outline" className="w-full flex items-center justify-center">
                                <LogOut size={16} />
                            </Button>
                        </div>
                    </MobileSidebar>
                </SidebarBody>

                <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-6">
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
                                        <TrendingUp size={20} className="text-green-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">85%</div>
                                        <p className="text-xs text-muted-foreground">Excellent health score</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                                        <Shield size={20} className="text-blue-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">Low</div>
                                        <p className="text-xs text-muted-foreground">Current health risk</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Active Predictions</CardTitle>
                                        <Activity size={20} className="text-purple-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">3</div>
                                        <p className="text-xs text-muted-foreground">Ongoing assessments</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
                                        <BarChart3 size={20} className="text-orange-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">12</div>
                                        <p className="text-xs text-muted-foreground">All time assessments</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock size={20} />
                                            Recent Predictions
                                        </CardTitle>
                                        <CardDescription>Your latest health assessments and predictions</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <AlertTriangle size={16} className="text-yellow-600" />
                                                <div>
                                                    <p className="font-medium">Migraine Assessment</p>
                                                    <p className="text-sm text-muted-foreground">2 days ago</p>
                                                </div>
                                            </div>
                                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">medium risk</Badge>
                                        </div>
                                        <Button variant="outline" className="w-full">
                                            View All Predictions
                                            <ArrowRight size={16} className="ml-2" />
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <AlertTriangle size={20} className="text-red-600" />
                                            Health Alerts
                                        </CardTitle>
                                        <CardDescription>Important health notifications and warnings</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle size={20} className="text-red-600 mt-1" />
                                                <div>
                                                    <p className="font-medium text-red-800">High Risk Alert - Disease Assessment</p>
                                                    <p className="text-sm text-red-700 mt-1">Please consult a healthcare provider immediately</p>
                                                    <p className="text-xs text-red-600 mt-2">1 day ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>Access your health services quickly</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Link href="/migraine">
                                            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                                                <Brain size={24} />
                                                <span className="text-sm">Migraine</span>
                                            </Button>
                                        </Link>
                                        <Link href="/heart-assessment">
                                            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                                                <Heart size={24} />
                                                <span className="text-sm">Heart Risk</span>
                                            </Button>
                                        </Link>
                                        <Link href="/disease-detection">
                                            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                                                <Activity size={24} />
                                                <span className="text-sm">Disease</span>
                                            </Button>
                                        </Link>
                                        <Link href="/diet-plan">
                                            <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                                                <Utensils size={24} />
                                                <span className="text-sm">Diet Plan</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
