"use client"
import SectionTitle from "@/components/SectionTitle";
import { useThemeContext } from "@/context/ThemeContext";
import { companiesLogo } from "@/data/companiesLogo";
import { featuresData } from "@/data/featuresData";
import { FaqSection } from "@/sections/FaqSection";
import Pricing from "@/sections/Pricing";
import { Heart, Brain, Stethoscope, Apple } from "lucide-react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { CometCard } from "@/components/ui/comet-card";

export default function Page() {
    const { theme } = useThemeContext();
    
    const words = [
        {
            text: "AI-Powered",
            className: "text-black dark:text-white"
        },
        {
            text: "Health",
            className: "bg-gradient-to-r from-[#923FEF] to-[#C35DE8] bg-clip-text text-transparent"
        },
        {
            text: "Companion",
            className: "bg-gradient-to-r from-[#923FEF] to-[#C35DE8] bg-clip-text text-transparent"
        }
    ];
    
    return (
        <>
            <div className="h-screen w-full bg-white dark:bg-black relative flex flex-col items-center justify-center overflow-hidden rounded-md">
                <BackgroundBeamsWithCollision>
                    <div className="flex flex-col items-center justify-center text-center px-4 relative z-10">
                        <div className="flex flex-wrap items-center justify-center gap-3 p-1.5 pr-4 mt-46 rounded-full border border-slate-300/20 dark:border-slate-600/20 bg-black/10 dark:bg-white/10 backdrop-blur-sm">
                            <div className="flex items-center -space-x-3">
                                <Image className="size-7 rounded-full" height={50} width={50}
                                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=50"
                                    alt="doctor1" />
                                <Image className="size-7 rounded-full" height={50} width={50}
                                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=50"
                                    alt="doctor2" />
                                <Image className="size-7 rounded-full" height={50} width={50}
                                    src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=50&h=50&auto=format&fit=crop"
                                    alt="doctor3" />
                            </div>
                            <p className="text-xs text-black/90 dark:text-white/90">Trusted by 500K+ healthcare professionals worldwide</p>
                        </div>
                        <div className="mt-2 max-w-3xl">
                            <TypewriterEffectSmooth 
                                words={words} 
                                className="text-5xl/15 md:text-[64px]/19 font-semibold justify-center"
                                cursorClassName="bg-gradient-to-r from-[#923FEF] to-[#C35DE8]"
                            />
                        </div>
                        <p className="text-base text-black/80 dark:text-white/80 max-w-2xl mt-2">
                            Advanced AI technology to predict migraine risks, assess heart health, detect diseases, and provide personalized diet plans for optimal wellness.
                        </p>
                        <div className="flex items-center gap-4 mt-8">
                            <button className="bg-purple-600 hover:bg-purple-700 transition text-white rounded-md px-6 h-11">
                                Start Health Assessment
                            </button>
                            <button className="flex items-center gap-2 border border-black/20 dark:border-white/20 transition text-black dark:text-white rounded-md px-6 h-11 backdrop-blur-sm bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20">
                                <Stethoscope strokeWidth={1} />
                                <span>Book Consultation</span>
                            </button>
                        </div>
                        <h3 className="text-base text-center text-black/60 dark:text-white/60 mt-28 pb-14 font-medium">
                            Partnered with leading healthcare institutions —
                        </h3>
                        <Marquee className="max-w-5xl mx-auto" gradient={true} speed={25} gradientColor="transparent">
                            <div className="flex items-center justify-center">
                                {[...companiesLogo, ...companiesLogo].map((company, index) => (
                                    <Image key={index} className="mx-11 opacity-60 hover:opacity-100 transition-opacity" src={company.logo} alt={company.name} width={100} height={100} />
                                ))}
                            </div>
                        </Marquee>
                    </div>
                </BackgroundBeamsWithCollision>
            </div>

            <SectionTitle text1="HEALTH SERVICES" text2="Comprehensive AI Health Solutions" text3="From migraine prediction to heart risk assessment, we provide cutting-edge health insights powered by artificial intelligence." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 px-6 md:px-16 lg:px-24 xl:px-32">
                {featuresData.map((feature, index) => (
                    <CometCard key={index} className="group">
                        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 border border-gray-200 dark:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300">
                            {/* Background gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Icon with enhanced styling */}
                            <div className="relative z-10 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="text-white size-8" strokeWidth={1.5} />
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </div>
                            
                            {/* Hover indicator */}
                            <div className="absolute bottom-4 right-4 w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    </CometCard>
                ))}
            </div>

            <Pricing />

            <FaqSection />

            <div className="flex flex-col items-center text-center justify-center mt-20">
                <h3 className="text-3xl font-semibold mt-16 mb-4 text-gray-900 dark:text-white">Ready to Take Control of Your Health?</h3>
                <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                    Join thousands of users who have improved their health outcomes with our AI-powered platform.
                </p>
                <div className="flex items-center gap-4 mt-8">
                    <button className="bg-purple-600 hover:bg-purple-700 transition text-white rounded-md px-6 h-11">
                        Start Free Assessment
                    </button>
                    <button className="border border-purple-600 dark:border-purple-400 transition text-slate-600 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md px-6 h-11">
                        Speak to Health Expert
                    </button>
                </div>
            </div>

        </>
    );
}