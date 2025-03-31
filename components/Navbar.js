"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-yellow-700 text-white flex justify-between items-center h-16 px-6 border-b border-[#ffffff33]">
      {/* Logo */}
      <Link href="/" className="font-bold text-xl cursor-pointer">
        GETMEACHAI
      </Link>

      {/* Navigation */}
      <div className="relative" ref={dropdownRef}>
        {session ? (
          <>
            {/* User Email Button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300 flex items-center gap-2"
            >
              {session.user?.email || "User"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-gray-900 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 ease-out transform origin-top scale-95">
                <ul className="py-2">
                  <li>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 text-sm font-medium hover:bg-gray-100 transition rounded-t-lg"
                    >
                      📊 Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${session.user.name}`}
                      className="block px-4 py-3 text-sm font-medium hover:bg-gray-100 transition"
                    >
                      👤 Your Page
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-100 transition rounded-b-lg"
                    >
                      🚪 Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <Link href="/login">
            <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition duration-300">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
