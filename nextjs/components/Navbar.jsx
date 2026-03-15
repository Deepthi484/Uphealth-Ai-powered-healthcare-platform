"use client";
import { navLinks } from "@/data/navLinks";
import { MenuIcon, XIcon, User, LogOut, Activity } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useThemeContext } from "@/context/ThemeContext";

export default function Navbar() {
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const { theme } = useThemeContext();

    useEffect(() => {
        if (openMobileMenu) {
            document.body.classList.add("max-md:overflow-hidden");
        } else {
            document.body.classList.remove("max-md:overflow-hidden");
        }
    }, [openMobileMenu]);

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userData && token) {
            try {
                setUser(JSON.parse(userData));
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error parsing user data:', error);
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
        window.location.href = '/';
    };

    return (
        <nav className={`flex items-center justify-between fixed z-50 top-0 w-full px-6 md:px-16 lg:px-24 xl:px-32 py-4 ${openMobileMenu ? '' : 'backdrop-blur'}`}>
            <Link href="/">
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">U</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        UpHealth
                    </span>
                </div>
            </Link>
            <div className="hidden items-center md:gap-8 lg:gap-9 md:flex lg:pl-20">
                {navLinks.map((link) => (
                    <Link key={link.name} href={link.href} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        {link.name}
                    </Link>
                ))}
            </div>
            {/* Mobile menu */}
            <div className={`fixed inset-0 flex flex-col items-center justify-center gap-6 text-lg font-medium bg-white/60 dark:bg-black/40 backdrop-blur-md md:hidden transition duration-300 ${openMobileMenu ? "translate-x-0" : "-translate-x-full"}`}>
                {navLinks.map((link) => (
                    <Link key={link.name} href={link.href} onClick={() => setOpenMobileMenu(false)}>
                        {link.name}
                    </Link>
                ))}
                {isLoggedIn ? (
                    <>
                        <Link 
                            href="/dashboard" 
                            className="flex items-center gap-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            onClick={() => setOpenMobileMenu(false)}
                        >
                            <Activity size={20} />
                            Dashboard
                        </Link>
                        <Link 
                            href="/profile" 
                            className="flex items-center gap-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            onClick={() => setOpenMobileMenu(false)}
                        >
                            <User size={20} />
                            Profile
                        </Link>
                        <button 
                            onClick={() => {
                                handleLogout();
                                setOpenMobileMenu(false);
                            }}
                            className="flex items-center gap-2 hover:text-red-600 transition-colors"
                        >
                            <LogOut size={20} />
                            Sign Out
                        </button>
                    </>
                ) : (
                    <Link 
                        href="/login" 
                        className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        onClick={() => setOpenMobileMenu(false)}
                    >
                        Sign in
                    </Link>
                )}
                <button className="aspect-square size-10 p-1 items-center justify-center bg-purple-600 hover:bg-purple-700 transition text-white rounded-md flex" onClick={() => setOpenMobileMenu(false)}>
                    <XIcon />
                </button>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                {isLoggedIn ? (
                    <div className="hidden md:flex items-center gap-3">
                        <Link 
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition text-white rounded-md"
                        >
                            <Activity size={20} />
                            <span>Dashboard</span>
                        </Link>
                        <Link 
                            href="/profile"
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 transition text-white rounded-md"
                        >
                            <User size={20} />
                            <span>{user?.firstName}</span>
                        </Link>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950 transition text-red-600 rounded-md"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <>
                        <Link 
                            href="/login"
                            className="hidden md:block hover:bg-slate-100 dark:hover:bg-purple-950 transition px-4 py-2 border border-purple-600 rounded-md"
                        >
                            Sign in
                        </Link>
                        <Link 
                            href="/signup"
                            className="hidden md:block px-4 py-2 bg-purple-600 hover:bg-purple-700 transition text-white rounded-md"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
                <button onClick={() => setOpenMobileMenu(!openMobileMenu)} className="md:hidden">
                    <MenuIcon size={26} className="active:scale-90 transition" />
                </button>
            </div>
        </nav>
    );
}