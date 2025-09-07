// -------------------------------
// Import Google Fonts via Next.js font optimization
// Geist & Geist Mono fonts are being used with CSS variables
// -------------------------------
import { Geist, Geist_Mono } from "next/font/google";

// Global CSS
import "./globals.css";

// Common layout components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SesssionWrapper";

// -------------------------------
// Configure Geist Sans font
// -------------------------------
const geistSans = Geist({
  variable: "--font-geist-sans", // Expose the font as a CSS variable
  subsets: ["latin"], // Only load Latin characters to reduce bundle size
});

// -------------------------------
// Configure Geist Mono font
// -------------------------------
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// -------------------------------
// Metadata for SEO and social sharing
// -------------------------------
export const metadata = {
  title: "Get Me a Chai - Fuel Creativity, One Cup at a Time",
  description: "Love what they do? Buy them a chai! Get Me a Chai makes it easy for fans to support their favorite creators with hassle-free donations and memberships. Start funding creativity today!",
};

// -------------------------------
// RootLayout component wraps the entire app
// -------------------------------
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 
        Apply the font CSS variables and antialiasing globally 
        Antialiased improves text rendering for smoother fonts 
      */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 
          SessionWrapper ensures that user session is available 
          for all children components (Navbar, page content, Footer)
        */}
        <SessionWrapper>
          {/* Navbar is always visible */}
          <Navbar />

          {/* 
            Main content container:
            - min-h-[83.5vh] ensures full height minus header/footer
            - Background: radial gradient with subtle grid pattern
            - Text color white for readability
          */}
          <div className="min-h-[83.5vh] bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] text-white">
            {children} {/* Render the page-specific content */}
          </div>

          {/* Footer is always visible */}
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
