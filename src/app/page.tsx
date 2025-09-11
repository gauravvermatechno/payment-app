


"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { getCardOptions } from "../config/test-cards.js";
import DefaultGatewayManager from "../components/DefaultGatewayManager";
import ApiLogger from "../components/ApiLogger";
import { installApiWrapper } from "../utils/apiLogger";

declare global {
  interface Window {
    PaymentSDK?: {
      processPayment: (paymentResponse: unknown) => void;
    };
  }
}

export default function Home() {
  const [amount, setAmount] = useState("5.00");
  const [firstName, setFirstName] = useState("");
  const [selectedCard, setSelectedCard] = useState("NETWORK_3DS");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    installApiWrapper();
  }, []);

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
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Payment Gateway Management</h1>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Payment Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Processing</h2>
              <div className="flex flex-col gap-4 items-center">
                <p className="text-xl font-semibold">Hello</p>

                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="px-4 py-2 border rounded w-full max-w-sm"
                />

                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="px-4 py-2 border rounded w-full max-w-sm"
                />

                <div className="flex flex-col gap-2 w-full max-w-sm">
                  <label htmlFor="cardSelect" className="text-sm font-medium">
                    Choose Test Card:
                  </label>
                  <select
                    id="cardSelect"
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.target.value)}
                    className="px-4 py-2 border rounded"
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
                  className={`px-6 py-2 rounded text-white w-full max-w-sm ${
                    loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Pay Now"}
                </button>

                {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
              </div>
            </div>

            {/* Gateway Management Section */}
            <DefaultGatewayManager />
            
            {/* API Logger Section */}
            <div className="xl:col-span-1">
              <ApiLogger />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}