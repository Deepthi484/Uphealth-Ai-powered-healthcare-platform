import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeContextProvider } from "@/context/ThemeContext";

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const metadata = {
    title: "UpHealth - AI-Powered Health Platform",
    description: "Advanced AI technology for migraine prediction, heart risk assessment, disease detection, and personalized diet plans. Take control of your health with UpHealth.",
    keywords: "health, AI, migraine prediction, heart risk, disease detection, diet plans, healthcare, telemedicine",
    authors: [{ name: "UpHealth Team" }],
    creator: "UpHealth",
    publisher: "UpHealth",
    robots: "index, follow",
    openGraph: {
        title: "UpHealth - AI-Powered Health Platform",
        description: "Advanced AI technology for migraine prediction, heart risk assessment, disease detection, and personalized diet plans.",
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "UpHealth - AI-Powered Health Platform",
        description: "Advanced AI technology for migraine prediction, heart risk assessment, disease detection, and personalized diet plans.",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={poppins.variable}>
                <ThemeContextProvider>
                    {children}
                </ThemeContextProvider>
            </body>
        </html>
    );
}