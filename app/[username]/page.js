"use client";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const Username = ({ params }) => {
  // Unwrap the params object using React.use()
  const unwrappedParams = React.use(params);

  // State for payment form
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  // State for notifications
  const [notifications, setNotifications] = useState([
    { name: "Ahmad", amount: 500, message: "Keep up the great work!" },
    { name: "Ali", amount: 1000, message: "Amazing content!" },
    { name: "Sara", amount: 200, message: "Loved your latest video!" },
  ]);

  // Handle payment submission
  const handlePayment = (e) => {
    e.preventDefault();
    if (!name || !amount || !message) {
      alert("Please fill out all fields.");
      return;
    }

    // Add new donation to notifications
    setNotifications([{ name, amount: parseInt(amount), message }, ...notifications]);

    // Clear form fields
    setName("");
    setAmount("");
    setMessage("");

    alert("Payment successful! Thank you for your support.");
  };

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      <div className="w-full h-64 md:h-80 lg:h-96 relative">
        <img
          src="https://wallpapercave.com/wp/wp2089896.jpg"
          alt="Cover"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* Profile Image */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <img
            className="h-32 w-32 md:h-36 md:w-36 rounded-full border-4 border-white shadow-lg"
            src="https://w0.peakpx.com/wallpaper/419/208/HD-wallpaper-face-art-abstract-face-painting-profile.jpg"
            alt="Profile"
          />
        </div>
      </div>

      {/* User Info Section */}
      <div className="mt-20 text-center">
        <h1 className="text-3xl font-bold">{unwrappedParams.username}</h1>
        <p className="text-gray-600 mt-2">Content Creator | Digital Artist | Educator</p>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mt-3">
          <a href="#" className="text-blue-500 hover:underline">Twitter</a>
          <a href="#" className="text-red-500 hover:underline">YouTube</a>
          <a href="#" className="text-purple-600 hover:underline">Instagram</a>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex justify-center gap-8 mt-6 text-center">
        <div>
          <h2 className="text-xl font-bold">250</h2>
          <p className="text-gray-600">Members</p>
        </div>
        <div>
          <h2 className="text-xl font-bold">120</h2>
          <p className="text-gray-600">Posts</p>
        </div>
        <div>
          <h2 className="text-xl font-bold">15</h2>
          <p className="text-gray-600">Releases</p>
        </div>
      </div>

      {/* Notifications and Payment Sections Side by Side */}
      <div className="mt-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Notifications Section */}
        <div className="w-full md:w-1/2 bg-white text-black p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">🔔 Notifications</h2>
          <ul className="space-y-2">
            {notifications.map((notification, index) => (
              <li key={index} className="flex justify-between">

                <span className="font-medium items-center flex gap-3">
                  <span><FaUserCircle /></span>
                  {notification.name} donated {notification.amount}rs
                </span>
                <span className="text-gray-500">{notification.message}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Section */}
        <div className="w-full md:w-1/2 bg-white text-black p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">💸 Support {unwrappedParams.username}</h2>
          <form onSubmit={handlePayment}>
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-gray-700">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-gray-700">Amount (in Rs)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter amount"
                  required
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setAmount(500)}
                    className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    500
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(1000)}
                    className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    1000
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(2000)}
                    className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    2000
                  </button>
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-gray-700">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Leave a message"
                  required
                />
              </div>

              {/* Make Payment Button */}
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 shadow-md hover:bg-blue-700 transition w-full"
              >
                Make Payment
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-gray-500">
        <p>© 2025 GetMeAChai. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Username;