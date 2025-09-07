"use client";

// === Imports ===
// Core React and hooks for state and lifecycle management
import React, { useEffect, useState } from "react";
// NextAuth hook for accessing user session data
import { useSession } from "next-auth/react";
// Next.js hook for programmatic navigation
import { useRouter } from "next/navigation";
// Server actions for fetching and updating user profile data
import { fetchuser, updateProfile } from "@/actions/useractions";
// Toast library for displaying notifications
import { ToastContainer, toast, Bounce } from "react-toastify";
// Toast styles for notification UI
import "react-toastify/dist/ReactToastify.css";
// Custom loading component for displaying loading state
import Loading from "@/components/loading";

// === Dashboard Component ===
// Displays a user dashboard with a form to update profile details, including name, email, Stripe credentials, and images
const Dashboard = () => {
  // === Hooks ===
  const router = useRouter(); // Initialize router for navigation
  const [form, setForm] = useState({}); // State to store form data (user profile)
  const { data: session, status } = useSession(); // Get session data and authentication status

  // === Effect: Handle Authentication and Data Fetching ===
  // Redirects unauthenticated users to login or fetches user data for authenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login page if not authenticated
    } else if (status === "authenticated") {
      getData(); // Fetch user data when authenticated
    }
  }, [status]); // Re-run effect when authentication status changes

  // === Function: Fetch User Data ===
  // Retrieves user profile data from the server
  const getData = async () => {
    const user = await fetchuser(session.user.name); // Fetch user data by username
    setForm(user); // Update form state with user data
  };

  // === Function: Handle Form Input Changes ===
  // Updates form state when input fields change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // Update specific field in form state
  };

  // === Function: Handle Form Submission ===
  // Processes form submission to update user profile
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)
    const formData = new FormData(e.target); // Create FormData object from form inputs
    // Log form data for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Update user profile on the server
    let a = await updateProfile(formData, session.user.name);

    // Display success notification
    toast("Profile Updated / پروفائل اپ ڈیٹ ہو گئی ہے", {
      position: "top-right", // Position of toast notification
      autoClose: 5000,      // Auto-close after 5 seconds
      hideProgressBar: false, // Show progress bar
      closeOnClick: true,    // Close on click
      pauseOnHover: true,    // Pause on hover
      draggable: true,       // Allow dragging
      progress: undefined,   // Default progress behavior
      theme: "light",       // Light theme for toast
      transition: Bounce,    // Bounce animation for toast
    });
  };

  // === Loading State ===
  // Show loading component while session status is loading
  if (status === "loading") return <Loading />;

  // === Render Dashboard UI ===
  return (
    <div className="min-h-[83.5vh] flex flex-col items-center justify-center p-4">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* === Main Content Section === */}
      <div className="max-w-6xl mx-auto mt-5 p-5 bg-white shadow-md rounded-lg text-center">
        {/* Welcome Message */}
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {session.user?.name}! / خوش آمدید
        </h1>
        <p className="text-gray-600 mt-2">
          You are now logged in to your dashboard.
          آپ اب اپنے ڈیش بورڈ میں لاگ ان ہو گئے ہیں۔
        </p>
      </div>

      {/* === Form Section === */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap justify-around mt-10 bg-white shadow-md rounded-lg p-6 w-full"
      >
        {/* === User Details Section === */}
        <div className="mt-4 space-y-4 w-full md:w-1/3 px-2">
          <h2 className="text-xl font-bold my-4 text-gray-800">
            User Details / صارف کی تفصیلات
          </h2>
          <p className="text-gray-600">
            Update your name and email. / اپنا نام اور ای میل اپ ڈیٹ کریں۔
          </p>
          <input
            type="text"
            name="name"
            placeholder="Name / نام"
            value={form.name || ""} // Default to empty string if undefined
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <input
            type="email"
            name="email"
            placeholder="Email / ای میل"
            value={form.email || ""} // Default to empty string if undefined
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* === Stripe Credentials Section === */}
        <div className="mt-4 space-y-4 w-full md:w-1/3 px-2">
          <h2 className="text-xl font-bold my-4 text-gray-800">
            Stripe Credentials / اسٹرائپ کی تفصیلات
          </h2>
          <p className="text-gray-600">
            Stripe Key ID & Secret.
            اپنی اسٹرائپ کی آئی ڈی اور سیکرٹ درج کریں۔
          </p>
          <input
            type="text"
            name="stripeId"
            placeholder="Stripe Key ID / اسٹرائپ کی آئی ڈی"
            value={form.stripeId || ""} // Default to empty string if undefined
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <input
            name="stripeSecretKey"
            placeholder="Stripe Secret Key / اسٹرائپ سیکرٹ کی"
            type="password"
            value={form.stripeSecretKey || ""} // Default to empty string if undefined
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* === Profile & Cover Picture Section === */}
        <div className="mt-4 space-y-4 w-full md:w-1/3 px-2">
          <h2 className="text-xl font-bold my-4 text-gray-800">
            Profile & Cover Picture / پروفائل اور کور تصویر
          </h2>
          <p className="text-gray-600">
            Enter image URLs. / تصویر کے یو آر ایل درج کریں۔
          </p>
          <input
            type="text"
            name="coverpic"
            placeholder="Cover Picture URL / کور تصویر کا یو آر ایل"
            value={form.coverpic || ""} // Default to empty string if undefined
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <input
            type="text"
            name="profilepic"
            placeholder="Profile Picture URL / پروفائل تصویر کا یو آر ایل"
            value={form.profilepic || ""} // Default to empty string if undefined
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* === Save Button === */}
        <div className="w-full text-center mt-8">
          <button
            type="submit"
            className="bg-blue-600 px-8 py-3 rounded-lg text-white hover:bg-blue-700 transition"
          >
            Save Profile / پروفائل محفوظ کریں
          </button>
        </div>
      </form>
    </div>
  );
};

// === Export ===
export default Dashboard;