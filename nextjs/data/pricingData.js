import { CheckIcon } from "lucide-react";

export const pricingData = [
    {
        title: "Basic Health Plan",
        price: 19,
        features: [
            {
                name: "Basic Health Assessment",
                icon: CheckIcon,
            },
            {
                name: "Migraine Risk Prediction",
                icon: CheckIcon,
            },
            {
                name: "Basic Diet Recommendations",
                icon: CheckIcon,
            },
            {
                name: "Health Tracking Dashboard",
                icon: CheckIcon,
            },
            {
                name: "Email Support",
                icon: CheckIcon,
            },
            {
                name: "Monthly Health Reports",
                icon: CheckIcon,
            },
        ],
        buttonText: "Start Free Trial",
    },
    {
        title: "Premium Health Plan",
        price: 49,
        mostPopular: true,
        features: [
            {
                name: "Advanced Health Assessments",
                icon: CheckIcon,
            },
            {
                name: "Heart Risk Analysis",
                icon: CheckIcon,
            },
            {
                name: "Disease Detection AI",
                icon: CheckIcon,
            },
            {
                name: "Personalized Diet Plans",
                icon: CheckIcon,
            },
            {
                name: "Priority Consultation Booking",
                icon: CheckIcon,
            },
            {
                name: "24/7 Health Monitoring",
                icon: CheckIcon,
            },
            {
                name: "Expert Health Coaching",
                icon: CheckIcon,
            },
            {
                name: "Family Health Management",
                icon: CheckIcon,
            }
        ],
        buttonText: "Get Premium Access",
    },
    {
        title: "Enterprise Health Plan",
        price: 99,
        features: [
            {
                name: "All Premium Features",
                icon: CheckIcon,
            },
            {
                name: "Corporate Health Programs",
                icon: CheckIcon,
            },
            {
                name: "Dedicated Health Manager",
                icon: CheckIcon,
            },
            {
                name: "Custom Health Integrations",
                icon: CheckIcon,
            },
            {
                name: "Advanced Analytics & Reports",
                icon: CheckIcon,
            },
            {
                name: "Telemedicine Integration",
                icon: CheckIcon,
            },
            {
                name: "Emergency Health Support",
                icon: CheckIcon,
            }
        ],
        buttonText: "Contact Enterprise Sales",
    }
];