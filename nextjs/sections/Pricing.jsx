"use client"
import SectionTitle from "@/components/SectionTitle";
import { useThemeContext } from "@/context/ThemeContext";
import { pricingData } from "@/data/pricingData";
import { SparklesIcon } from "lucide-react";
import Image from "next/image";
import { DraggableCardBody, DraggableCardContainer } from "@/components/ui/draggable-card";
import { useState, useEffect } from "react";

export default function Pricing() {
    const { theme } = useThemeContext();
    const [cardPositions, setCardPositions] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Generate consistent positions for cards
    useEffect(() => {
        const positions = pricingData.map((_, index) => ({
            x: 0, // No random X offset
            y: 0, // No random Y offset
            rotation: 0, // No rotation
            scale: 1, // Normal scale
            delay: index * 0.2, // Staggered animation delay
        }));
        setCardPositions(positions);
        setIsLoaded(true);
    }, []);

    return (
        <div className="relative">
            <Image className="absolute -mt-20 md:-mt-100 md:left-20 pointer-events-none" src={theme === "dark" ? "/assets/color-splash.svg" : "/assets/color-splash-light.svg"} alt="color-splash" width={1000} height={1000} priority fetchPriority="high" />
            <SectionTitle text1="PRICING" text2="Our Pricing Plans" text3="Flexible pricing options designed to meet your needs — whether you're just getting started or scaling up." />

            <DraggableCardContainer className="flex flex-wrap items-stretch justify-center gap-8 mt-16 px-4">
                {pricingData.map((plan, index) => {
                    const position = cardPositions[index] || { x: 0, y: 0, rotation: 0, scale: 1, delay: 0 };
                    
                    return (
                        <DraggableCardBody 
                            key={index} 
                            className={`cursor-grab active:cursor-grabbing transition-all duration-500 hover:z-10 w-80 ${
                                plan.mostPopular 
                                    ? "relative bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 border-2 border-purple-400 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40" 
                                    : "bg-white/95 dark:bg-gray-800/95 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl backdrop-blur-lg hover:bg-white dark:hover:bg-gray-800"
                            }`}
                            style={{
                                opacity: isLoaded ? 1 : 0,
                                transform: isLoaded ? 'scale(1)' : 'scale(0.9)',
                                transition: `all 0.6s ease-out ${position.delay}s`,
                            }}
                        >
                        {/* Popular Badge */}
                        {plan.mostPopular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                <div className="flex items-center text-xs gap-1 py-2 px-4 text-purple-600 bg-white rounded-full font-medium shadow-lg animate-pulse">
                                    <SparklesIcon size={14} className="animate-spin" />
                                    <p>Most Popular</p>
                                </div>
                            </div>
                        )}

                        {/* Card Content */}
                        <div className="pt-4">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <h3 className={`text-xl font-bold mb-2 ${
                                    plan.mostPopular ? "text-white" : "text-gray-900 dark:text-white"
                                }`}>
                                    {plan.title}
                                </h3>
                                <div className="flex items-baseline justify-center">
                                    <span className={`text-4xl font-bold ${
                                        plan.mostPopular ? "text-white" : "text-gray-900 dark:text-white"
                                    }`}>
                                        ${plan.price}
                                    </span>
                                    <span className={`text-sm font-medium ml-2 ${
                                        plan.mostPopular ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                                    }`}>
                                        /mo
                                    </span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-3 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-center gap-3">
                                        <div className={`p-1 rounded-full ${
                                            plan.mostPopular ? "bg-white/20" : "bg-purple-100 dark:bg-purple-900/30"
                                        }`}>
                                            <feature.icon size={16} className={`${
                                                plan.mostPopular ? "text-white" : "text-purple-600 dark:text-purple-400"
                                            }`} />
                                        </div>
                                        <span className={`text-sm ${
                                            plan.mostPopular ? "text-white/90" : "text-gray-600 dark:text-gray-300"
                                        }`}>
                                            {feature.name}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <button 
                                className={`w-full py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-95 ${
                                    plan.mostPopular 
                                        ? "bg-white text-purple-600 hover:bg-gray-50 shadow-lg hover:shadow-2xl hover:shadow-white/50" 
                                        : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-2xl hover:shadow-purple-500/50"
                                }`}
                                style={{
                                    opacity: isLoaded ? 1 : 0,
                                    transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                                    transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${position.delay + 0.3}s`,
                                }}
                            >
                                <span className="relative z-10">{plan.buttonText}</span>
                                {plan.mostPopular && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                )}
                            </button>
                        </div>
                    </DraggableCardBody>
                );
                })}
            </DraggableCardContainer>
        </div>
    );
}