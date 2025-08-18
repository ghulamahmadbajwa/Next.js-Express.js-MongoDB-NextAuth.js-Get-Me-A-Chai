"use client";

import React, { useState, use, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { initiateStripe, fetchPaymentsByUsername, fetchuser } from "@/actions/useractions";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({
  username, name, setName, amount, setAmount,
  message, setMessage, notifications, setNotifications
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState(null);
  const [parsedAmount, setParsedAmount] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!name || !amount || !message) {
      setError("Please fill out all fields.");
      return;
    }

    const amountInt = parseInt(amount);
    if (isNaN(amountInt) || amountInt <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setParsedAmount(amountInt);
    setLoading(true);
    setError("");
    setPaymentSuccess(false);

    try {
      const amountInPaise = amountInt * 100;
      const { clientSecret } = await initiateStripe(amountInPaise, username, { name, message });
      setClientSecret(clientSecret);
    } catch (err) {
      console.error(err);
      setError("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setError("Stripe.js hasn't loaded yet.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name },
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        setNotifications([{ name, amount: parsedAmount, message }, ...notifications]);
        setName("");
        setAmount("");
        setMessage("");
        setClientSecret(null);
        setParsedAmount(null);
        setPaymentSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-white text-black p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-3">💸 Support {username}</h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {paymentSuccess && (
        <p className="text-green-600 font-semibold text-sm text-center mb-3">
          🎉 Payment successful! Thank you for your support.
        </p>
      )}

      {clientSecret ? (
        <form onSubmit={handleCardSubmit}>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-700 text-sm">Card Details</label>
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
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm mt-3 shadow hover:bg-blue-700 transition w-full"
              disabled={loading || !stripe || !elements}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePayment}>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-700 text-sm">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm">Amount (in Rs)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                placeholder="Enter amount"
                required
              />
              <div className="flex gap-2 mt-1">
                {[500, 1000, 2000].map(val => (
                  <button key={val} type="button" onClick={() => setAmount(val)}
                    className="bg-gray-200 text-black px-3 py-1 rounded text-xs hover:bg-gray-300">
                    {val}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                placeholder="Leave a message"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm mt-3 shadow hover:bg-blue-700 transition w-full"
              disabled={loading}
            >
              {loading ? "Processing..." : "Make Payment"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const Username = ({ params }) => {
  const unwrappedParams = use(params);
  const username = decodeURIComponent(unwrappedParams.username);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [userData, setUserData] = useState(null);
  const [stripePromise, setStripePromise] = useState(null); // Add state for stripePromise

  const fetchPayments = async () => {
    try {
      const payments = await fetchPaymentsByUsername(username); // This is already the data
      if (Array.isArray(payments)) {
        setNotifications(payments);
      } else {
        console.error("fetchPaymentsByUsername did not return an array");
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  const getUser = async () => {
    try {
      const user = await fetchuser(username);
      setUserData(user);
      // Initialize Stripe with the key from database
      if (user?.stripeId) {
        const stripePromise = loadStripe(user.stripeId);
        setStripePromise(stripePromise);
      } else {
        console.error("No Stripe public key found for user");
      }

    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };


  useEffect(() => {
    getUser();
    fetchPayments();
  }, [username])


  return (
    <div className="min-h-screen pb-7">
      <div className="w-full h-48 md:h-56 lg:h-64 relative">
        <img
          src={userData?.coverpic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF33NHxM7qEJwv1ouSYlpE_5WQmKRf4Qznyw&s"}
          alt="Cover"
          className="absolute  left-0 w-full h-3/4 object-cover"
        />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <img
            className="h-24 w-24 md:h-28 md:w-28 rounded-full border-4 border-white shadow"
            src={userData?.profilepic || "https://defaultprofile.com/profile.jpg"}
            alt="Profile"
          />
        </div>
      </div>
      <div className="mt-5 text-center">
        <h1 className="text-2xl font-bold">{username}</h1>
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-extrabold  text-orange-500 italic font-dancing">
          Help {username} get their chai fix!
        </h1>
        <p className="text-sm text-gray-600">
          Buy them a cup and brighten their day!
        </p>
      </div>
      <div className="mt-5 text-center">
        <h1 className="text- font-bold">{notifications.length} payments . ₨{notifications.reduce((a, b) => a + b.amount, 0)} raised {}</h1>
      </div>

      <div className="mt-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 px-4">
        <div className="w-full md:w-1/2 bg-white text-black p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-3">🔔 Notifications</h2>
          <ul className="space-y-1">
            {notifications.length === 0 ? (
              <li className="text-sm text-gray-500">No Payment Yet</li>
            ) : (
              notifications.map((notification, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span className="font-medium items-center flex gap-2">
                    <FaUserCircle size={14} />
                    {notification.name} donated {notification.amount}rs
                  </span>
                  <span className="text-gray-500 text-xs">{notification.message}</span>
                </li>
              ))
            )}
          </ul>
        </div>

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
            <p className="text-red-500">Payment system not configured for this user</p>
          </div>
        )}
      </div>


    </div>
  );
};

export default Username;