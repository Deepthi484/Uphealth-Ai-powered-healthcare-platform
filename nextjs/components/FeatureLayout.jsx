"use client"
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Activity, Brain, Heart, Home, User, FileText, Settings, LogOut, Stethoscope } from "lucide-react";

export default function FeatureLayout({ children }) {
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
            icon: <Stethoscope className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
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
                <div className="p-2 md:p-6 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
