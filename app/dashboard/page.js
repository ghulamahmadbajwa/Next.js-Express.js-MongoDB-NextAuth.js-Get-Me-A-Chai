"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchuser, updateProfile } from "@/actions/useractions";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({});

  // Redirect or fetch user data
  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else {
      getData();
    }
  }, [session]);

  const getData = async () => {
    const user = await fetchuser(session.user.name);
    setForm(user);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    const formData = new FormData(e.target); // Extract form data
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    let a = await updateProfile(formData, session.user.name);

    toast('Profile Updated', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  if (!session) return null; // Prevent rendering before redirect

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <ToastContainer />
      {/* Main Content */}
      <div className="max-w-6xl mx-auto mt-5 p-5 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {session.user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          You are now logged in to your dashboard.
        </p>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap justify-around mt-10 bg-white shadow-md rounded-lg p-6 w-full"
      >
        {/* User Details */}
        <div className="mt-4 space-y-4 w-full md:w-1/3 px-2">
          <h2 className="text-xl font-bold my-4 text-gray-800">User Details</h2>
          <p className="text-gray-600">Update your name and email.</p>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />

        </div>

        {/* Stripe /Stripe Credentials */}
        <div className="mt-4 space-y-4 w-full md:w-1/3 px-2">
          <h2 className="text-xl font-bold my-4 text-gray-800">
            Stripe Credentials
          </h2>
          <p className="text-gray-600">Enter your Stripe Key ID & Secret.</p>
          <input
            type="text"
            name="stripeId"
            placeholder="stripe Key ID"
            value={form.stripeId || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <input
            name="stripeSecretKey"
            placeholder="stripe Secret Key"
            type="password"
            value={form.stripeSecretKey || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Profile & Cover Picture */}
        <div className="mt-4 space-y-4 w-full md:w-1/3 px-2">
          <h2 className="text-xl font-bold my-4 text-gray-800">
            Profile & Cover Picture
          </h2>
          <p className="text-gray-600">Enter image URLs.</p>
          <input
            type="text"
            name="coverpic"
            placeholder="Cover Picture URL"
            value={form.coverpic || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <input
            type="text"
            name="profilepic"
            placeholder="Profile Picture URL"
            value={form.profilepic || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Save Button */}
        <div className="w-full text-center mt-8">
          <button
            type="submit"
            className="bg-blue-600 px-8 py-3 rounded-lg text-white hover:bg-blue-700 transition"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;
