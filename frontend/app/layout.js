import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SesssionWrapper";

// Configure Geist Sans font
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configure Geist Mono font
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Get Me a Chai - Fuel Creativity, One Cup at a Time",
  description:
    "Love what they do? Buy them a chai! Get Me a Chai makes it easy for fans to support their favorite creators with hassle-free donations and memberships. Start funding creativity today!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-sm md:text-base lg:text-lg flex flex-col min-h-screen`}
      >
        <SessionWrapper>
          {/* Sticky Navbar */}
          <Navbar />

          {/* Main Content takes all available space */}
          <main className="flex-1 bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:16px_16px] sm:bg-[size:18px_18px] md:bg-[size:20px_20px] text-white">
            <div className="px-0 md:px-8 lg:px-12 xl:px-16">
              {children}
            </div>
          </main>

          {/* Footer stays at bottom */}
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
