"use client"
import { useThemeContext } from "@/context/ThemeContext";
import { navLinks } from "@/data/navLinks";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    const { theme } = useThemeContext();
    return (
        <footer className="relative px-6 md:px-16 lg:px-24 xl:px-32 mt-40 w-full dark:text-slate-50">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-200 dark:border-slate-700 pb-6">
                <div className="md:max-w-114">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">U</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            UpHealth
                        </span>
                    </div>
                    <p className="mt-6">
                        Your AI-powered health companion for migraine prediction, heart risk assessment, disease detection, and personalized nutrition plans. Empowering you to take control of your health with cutting-edge technology and expert insights.
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5">Health Services</h2>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/migraine" className="hover:text-purple-600 transition">Migraine Prediction</Link>
                            </li>
                            <li>
                                <Link href="/heart" className="hover:text-purple-600 transition">Heart Assessment</Link>
                            </li>
                            <li>
                                <Link href="/diagnosis" className="hover:text-purple-600 transition">Disease Detection</Link>
                            </li>
                            <li>
                                <Link href="/nutrition" className="hover:text-purple-600 transition">Diet Plans</Link>
                            </li>
                            <li>
                                <Link href="/consultations" className="hover:text-purple-600 transition">Medical Consultations</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5">Support</h2>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/help" className="hover:text-purple-600 transition">Help Center</Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-purple-600 transition">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-purple-600 transition">Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="/hipaa" className="hover:text-purple-600 transition">HIPAA Compliance</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5">Contact Us</h2>
                        <div className="space-y-2">
                            <p>24/7 Health Support: +1-800-UPHEALTH</p>
                            <p>Email: support@uphealth.ai</p>
                            <p>Emergency: Always call 911</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center pb-5">
                Copyright 2024 © <span className="font-semibold">UpHealth</span>. All Rights Reserved. | HIPAA Compliant | FDA Registered
            </p>
        </footer>
    );
};