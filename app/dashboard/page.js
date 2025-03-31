"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect to home if not authenticated
  if (!session) {
    router.push("/");
    return null; // Prevent rendering before redirect
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-4">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto mt-5 p-5 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {session.user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">You are now logged in to your dashboard.</p>
      </div>

      {/* User Details Section */}
      <div className= "flex justify-around mt-10 bg-white shadow-md rounded-lg p-6 w-full  text-center">
        

        {/* Input Fields */}
        <div className="mt-4 space-y-4">
        <h2 className="text-xl font-bold my-4 text-gray-800">User Details</h2>
        <p className="text-gray-600 mt-2">Update your name and email.</p>
          <input
            type="text"
            placeholder="Name"
            // The ?. (optional chaining) ensures that if session or user is null or undefined, it doesn't throw an error.
            defaultValue={session.user?.name || ""}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <input
            type="email"
            placeholder="Email"
            defaultValue={session.user?.email || ""}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        

        {/* Input Fields */}
        <div className="mt-4 space-y-4">

        <h2 className="text-xl font-bold my-4 text-gray-800">JazzCash Credentials</h2>
        <p className="text-gray-600 mt-2">Enter your JazzCash Merchant ID & Secret.</p>
          <input
            type="text"
            placeholder="JazzCash Merchant ID"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <input
            type="password"
            placeholder="JazzCash Secret Key"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>


        {/* Input Fields */}
        <div className="mt-4 space-y-4">
          
        <h2 className="text-xl font-bold my-4 text-gray-800">Background/Profile Picture </h2>
        <p className="text-gray-600 mt-2">Enter your Background & Profile Picture.</p>

          <input
            type="text"
            placeholder="Background Picture"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <input
            type="password"
            placeholder="Profile Picture"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
      </div>

        {/* Save Button */}
        <button className="mt-8 bg-blue-600  px-10 py-10  rounded-4xl shadow-md hover:bg-blue-700 transition text-white">
          Save Credentials
        </button>

    </div>
  );
};

export default Dashboard;