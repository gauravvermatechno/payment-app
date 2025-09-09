


"use client";

import { useState } from "react";
import Script from "next/script";
import { getCardOptions } from "../config/test-cards.js";

declare global {
  interface Window {
    PaymentSDK?: {
      processPayment: (paymentResponse: any) => void;
    };
  }
}

export default function Home() {
  const [amount, setAmount] = useState("5.00");
  const [firstName, setFirstName] = useState("");
  const [selectedCard, setSelectedCard] = useState("NETWORK_3DS");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          firstName,
          cardType: selectedCard,
        }),
      });

      const result = await response.json();
      
 

       // Call the PaymentSDK to process the payment response
      if (window.PaymentSDK) {
        window.PaymentSDK.processPayment(result);
      } else {
        setErrorMsg("PaymentSDK not loaded");
      }
    } catch (error) {
      setErrorMsg(`Payment Error: ${error}`);
    } finally {
      setLoading(false);
    }
  
  
  };

  return (
    <>
      <Script src="/payment-sdk.js" strategy="beforeInteractive" />
      <div className="grid items-center justify-items-center min-h-screen p-8 sm:p-20">
        <main className="flex flex-col gap-6 items-center sm:items-start">
        <p className="text-xl font-semibold">Hello</p>

        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
          className="px-4 py-2 border rounded mb-2 w-64"
        />

        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="px-4 py-2 border rounded mb-4 w-64"
        />

        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="cardSelect" className="text-sm font-medium">
            Choose Test Card:
          </label>
          <select
            id="cardSelect"
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
            className="px-4 py-2 border rounded w-64"
          >
            {getCardOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.card.type} ({option.card.gateway})
              </option>
            ))}
          </select>
        </div>



        <button
          onClick={handlePayment}
          className={`px-6 py-2 rounded text-white ${
            loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
        </main>
      </div>
    </>
  );
}