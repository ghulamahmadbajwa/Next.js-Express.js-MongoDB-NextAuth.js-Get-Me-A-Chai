"use client";

// === Imports ===
// Core React and hooks for state and lifecycle management
import React, { useState, use, useEffect } from "react";
// Icon for user avatars in notifications
import { FaUserCircle } from "react-icons/fa";
// Stripe library for loading Stripe.js
import { loadStripe } from "@stripe/stripe-js";
// Stripe React components for payment form integration
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// Custom server-side actions for Stripe and user data operations
import { initiateStripe, fetchPaymentsByUsername, fetchuser } from "@/actions/useractions";

// === PaymentForm Component ===
// Handles the payment form UI and logic for initiating and processing Stripe payments
const PaymentForm = ({
  username,          // Username of the recipient
  name, setName,     // Donor's name and state setter
  amount, setAmount, // Donation amount and state setter
  message, setMessage, // Donor's message and state setter
  notifications, setNotifications // Payment notifications and state setter
}) => {
  // === Stripe Hooks ===
  const stripe = useStripe();   // Provides Stripe instance for payment operations
  const elements = useElements(); // Accesses Stripe form elements (e.g., CardElement)

  // === State Variables ===
  const [loading, setLoading] = useState(false); // Tracks payment processing status
  const [error, setError] = useState("");       // Stores error messages for validation or API failures
  const [clientSecret, setClientSecret] = useState(null); // Stores Stripe client secret for payment confirmation
  const [parsedAmount, setParsedAmount] = useState(null); // Stores validated payment amount
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Tracks if payment was successful

  // === Function: Initiate Payment ===
  // Validates inputs and requests a client secret from Stripe to start payment
  const handlePayment = async (e) => {
    e.preventDefault(); // Prevents default form submission

    // Validate form inputs
    if (!name || !amount || !message) {
      setError("Please fill out all fields. / براہ کرم تمام فیلڈز پُر کریں۔");
      return;
    }

    const amountInt = parseInt(amount); // Convert amount to integer
    if (isNaN(amountInt) || amountInt <= 0) {
      setError("Please enter a valid amount. / براہ کرم درست رقم درج کریں۔");
      return;
    }

    setParsedAmount(amountInt); // Store validated amount
    setLoading(true);          // Show loading state
    setError("");              // Clear previous errors
    setPaymentSuccess(false);   // Reset payment success state

    try {
      const amountInPaise = amountInt * 100; // Convert amount to paise (Stripe's smallest currency unit)
      // Call server action to initiate Stripe payment
      const { clientSecret } = await initiateStripe(amountInPaise, username, { name, message });
      setClientSecret(clientSecret); // Store client secret for card payment
    } catch (err) {
      console.error(err); // Log error for debugging
      setError("Failed to initiate payment. Please try again. / ادائیگی شروع کرنے میں ناکام۔ دوبارہ کوشش کریں۔");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // === Function: Submit Card Payment ===
  // Processes the card payment using Stripe's client secret
  const handleCardSubmit = async (e) => {
    e.preventDefault(); // Prevents default form submission

    // Check if Stripe and elements are loaded
    if (!stripe || !elements) {
      setError("Stripe.js hasn't loaded yet. / اسٹرائپ ابھی لوڈ نہیں ہوا۔");
      return;
    }

    setLoading(true); // Show loading state
    setError("");     // Clear previous errors

    try {
      // Confirm card payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement), // Get card details from Stripe CardElement
          billing_details: { name },              // Include donor's name in billing details
        },
      });

      if (stripeError) {
        setError(stripeError.message); // Show Stripe-specific error
        return;
      }

      // Handle successful payment
      if (paymentIntent.status === "succeeded") {
        // Add new payment to notifications
        setNotifications([{ name, amount: parsedAmount, message }, ...notifications]);
        // Reset form fields
        setName("");
        setAmount("");
        setMessage("");
        setClientSecret(null);
        setParsedAmount(null);
        setPaymentSuccess(true); // Show success message
      }
    } catch (err) {
      console.error(err); // Log error for debugging
      setError("An error occurred during payment. Please try again. / ادائیگی کے دوران خرابی ہوئی۔ دوبارہ کوشش کریں۔");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // === Render Payment Form UI ===
  return (
    <div className="w-full md:w-1/2 bg-white text-black p-4 rounded-lg shadow-md">
      {/* Form header with recipient's username */}
      <h2 className="text-lg font-bold mb-3">💸 Support {username} / {username} کی مدد کریں</h2>

      {/* Display error message if present */}
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {/* Display success message after payment */}
      {paymentSuccess && (
        <p className="text-green-600 font-semibold text-sm text-center mb-3">
          🎉 Payment successful! Thank you. / ادائیگی کامیاب! شکریہ۔
        </p>
      )}

      {/* Conditionally render card details form or initial payment form */}
      {clientSecret ? (
        // === Card Details Form ===
        <form onSubmit={handleCardSubmit}>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-700 text-sm">Card Details / کارڈ کی تفصیلات</label>
              {/* Stripe CardElement for secure card input */}
              <CardElement
                className="w-full p-2 border rounded text-sm"
                options={{
                  style: {
                    base: {
                      fontSize: "14px",
                      color: "#424770",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#9e2146" },
                  },
                }}
              />
            </div>
            {/* Submit button for card payment */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm mt-3 shadow hover:bg-blue-700 transition w-full"
              disabled={loading || !stripe || !elements} // Disable during loading or if Stripe isn't ready
            >
              {loading ? "Processing... / پراسیس ہو رہا ہے..." : "Pay Now / ابھی ادائیگی کریں"}
            </button>
          </div>
        </form>
      ) : (
        // === Initial Payment Form ===
        <form onSubmit={handlePayment}>
          <div className="space-y-3">
            {/* Name input */}
            <div>
              <label className="block text-gray-700 text-sm">Your Name / آپ کا نام</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                placeholder="Enter your name / اپنا نام درج کریں"
                required
              />
            </div>
            {/* Amount input with quick-select buttons */}
            <div>
              <label className="block text-gray-700 text-sm">Amount (in Rs) / رقم (روپے میں)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                placeholder="Enter amount / رقم درج کریں"
                required
              />
              <div className="flex gap-2 mt-1">
                {[500, 1000, 2000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className="bg-gray-200 text-black px-3 py-1 rounded text-xs hover:bg-gray-300"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
            {/* Message input */}
            <div>
              <label className="block text-gray-700 text-sm">Message / پیغام</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                placeholder="Leave a message / پیغام چھوڑیں"
                required
              />
            </div>
            {/* Submit button to initiate payment */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm mt-3 shadow hover:bg-blue-700 transition w-full"
              disabled={loading}
            >
              {loading ? "Processing... / پراسیس ہو رہا ہے..." : "Make Payment / ادائیگی کریں"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// === Username Component ===
// Main component for rendering user profile, payment form, and payment history
const Username = ({ params }) => {
  // === URL Parameter Handling ===
  const unwrappedParams = use(params); // Access URL params using React's `use` hook
  const username = decodeURIComponent(unwrappedParams.username); // Decode username from URL

  // === State Variables ===
  const [name, setName] = useState("");           // Donor's name
  const [amount, setAmount] = useState("");       // Donation amount
  const [message, setMessage] = useState("");     // Donor's message
  const [notifications, setNotifications] = useState([]); // List of payments/donations
  const [userData, setUserData] = useState(null); // User profile data
  const [stripePromise, setStripePromise] = useState(null); // Stripe.js instance

  // === Function: Fetch Payment History ===
  // Retrieves payment history for the user from the server
  const fetchPayments = async () => {
    try {
      const payments = await fetchPaymentsByUsername(username);
      if (Array.isArray(payments)) {
        setNotifications(payments); // Update notifications with payment data
      } else {
        console.error("fetchPaymentsByUsername did not return an array");
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  // === Function: Fetch User Data ===
  // Retrieves user profile and initializes Stripe with their public key
  const getUser = async () => {
    try {
      const user = await fetchuser(username);
      setUserData(user); // Store user data
      if (user?.stripeId) {
        const stripePromise = loadStripe(user.stripeId); // Load Stripe.js
        setStripePromise(stripePromise);
      } else {
        console.error("No Stripe public key found for user");
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  // === Effect: Initialize Data ===
  // Fetch user data and payments when component mounts or username changes
  useEffect(() => {
    getUser();
    fetchPayments();
  }, [username]);

  // === Render Main UI ===
  return (
    <div className="pb-7">
      {/* === Cover Photo Section === */}
      <div className="w-full h-48 md:h-56 lg:h-64 relative">
        <img
          src={userData?.coverpic || "https://static.vecteezy.com/system/resources/thumbnails/049/483/787/small/abstract-white-background-photo.jpg"}
          alt="Cover"
          className="absolute left-0 w-full h-3/4 object-cover"
        />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <img
            className="h-24 w-24 md:h-28 md:w-28 rounded-full border-4 border-white shadow"
            src={userData?.profilepic || "https://thumbs.dreamstime.com/z/faceless-male-avatar-hoodie-illustration-minimalist-default-photo-placeholder-wearing-light-gray-background-ideal-377566416.jpg?ct=jpeg"}
            alt="Profile"
          />
        </div>
      </div>

      {/* === User Info Section === */}
      <div className="mt-5 text-center">
        <h1 className="text-2xl font-bold">{username}</h1>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Buy them a cup and brighten their day! / ان کے لئے ایک کپ خریدیں اور ان کا دن خوشگوار بنائیں!
        </p>
      </div>

      {/* === Payment Summary === */}
      <div className="mt-5 text-center">
        <h1 className="font-bold">
          {notifications.length} payments / ادائیگیاں . ₨{notifications.reduce((a, b) => a + b.amount, 0)} raised / جمع
        </h1>
      </div>

      {/* === Notifications and Payment Form === */}
      <div className="mt-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 px-4">
        {/* === Notifications Box === */}
        <div className="w-full md:w-1/2 bg-white text-black p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-3">🔔 Notifications / اطلاع</h2>
          <div className="max-h-64 overflow-y-auto pr-1">
            <ul className="space-y-2">
              {notifications.length === 0 ? (
                <li className="text-sm text-gray-500 text-center py-2">
                  No Payment Yet / ابھی تک کوئی ادائیگی نہیں
                </li>
              ) : (
                notifications.map((notification, index) => (
                  <li key={index} className="border-b border-gray-200 pb-2">
                    <div className="flex items-center gap-2 text-gray-800 font-medium">
                      <FaUserCircle size={16} className="text-gray-600" />
                      {notification.name}
                    </div>
                    <div className="ml-6 text-sm text-gray-700">
                      donated <span className="font-semibold">{notification.amount} rs</span> / <span dir="rtl">نے {notification.amount} روپے دیے</span>
                    </div>
                    {notification.message && (
                      <div className="ml-6 text-xs text-gray-500 mt-1">
                        {notification.message}
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* === Payment Form Section === */}
        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <PaymentForm
              username={username}
              name={name}
              setName={setName}
              amount={amount}
              setAmount={setAmount}
              message={message}
              setMessage={setMessage}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </Elements>
        ) : (
          <div className="w-full md:w-1/2 bg-white text-black p-4 rounded-lg shadow-md">
            <p className="text-red-500">Payment system not configured / اس صارف کے لیے ادائیگی کا نظام ترتیب نہیں دیا گیا</p>
          </div>
        )}
      </div>
    </div>
  );
};

// === Export ===
export default Username;