"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession(); // Get current session from NextAuth
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to toggle dropdown
  const dropdownRef = useRef(null); // Ref for dropdown menu to detect outside clicks

  // -------------------------
  // Close dropdown when clicking outside
  // -------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close dropdown if click is outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-yellow-700 text-white flex justify-between items-center h-16 px-6 border-b border-[#ffffff33]">

      {/* -------------------------
          Logo Section
          ------------------------- */}
      <Link href="/" className="font-bold text-xl cursor-pointer">
        GETMEACHAI / گیٹ می چائے
      </Link>

      {/* -------------------------
          Navigation / User Section
          ------------------------- */}
      <div className="relative z-50" ref={dropdownRef}>
        {session ? (
          <>
            {/* User Button to toggle dropdown */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onBlur={() => {
                setTimeout(() => {
                  setDropdownOpen(!dropdownOpen)
                }, 300); // Small delay to allow click inside dropdown before closing
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300 flex items-center gap-2"
            >
              "User / صارف"  {/* {session.user?.email || "User / صارف"} Show email or fallback text */}
              {/* Down arrow icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-gray-900 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 ease-out transform origin-top scale-95">
                <ul className="py-2">
                  {/* Dashboard Link */}
                  <li>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 text-sm font-medium hover:bg-gray-100 transition rounded-t-lg"
                    >
                      📊 Dashboard / ڈیش بورڈ
                    </Link>
                  </li>
                  {/* User Page Link */}
                  <li>
                    <Link
                      href={`/${session.user.name}`} // Dynamic link to user's page
                      className="block px-4 py-3 text-sm font-medium hover:bg-gray-100 transition"
                    >
                      👤 Your Page / آپ کا صفحہ
                    </Link>
                  </li>
                  {/* Sign Out Button */}
                  <li>
                    <button
                      onClick={() => signOut()} // NextAuth sign out
                      className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-100 transition rounded-b-lg"
                    >
                      🚪 Sign Out / لاگ آوٹ
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          // Login Button if no session
          <Link href="/login">
            <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300">
              Login / لاگ ان
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
