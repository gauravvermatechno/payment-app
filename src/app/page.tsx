"use client";

import { useState } from "react";

export default function Home() {
  const [amount, setAmount] = useState("5.00");
  const [firstName, setFirstName] = useState("");
  const txnid = `trxID-${Date.now()}-${Math.floor(Math.random() * 100)}`;

  const handlePayment = async () => {
    const myHeaders = new Headers({
      Authorization:
        "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YzM4OWQzOS0wNzk0LTRmOTMtYWVkNC0zYjE3ZGUxODljMmYiLCJVc2VySWQiOiIzNTkwNiIsIlVzZXJUeXBlIjoiQWdlbnQiLCJQYXJlbnRJRCI6IjAiLCJFbWFpbElEIjoibWF5dXJpLnBAdGVjaG5vaGVhdmVuLmNvbSIsImlzcyI6Imh0dHA6Ly9yYXluYXdlYmFwaWF3cy5yYXluYXRvdXJzLmNvbSIsImF1ZCI6Imh0dHA6Ly9yYXluYXdlYmFwaWF3cy5yYXluYXRvdXJzLmNvbSJ9.orxLloGfgH2zv_MwHUL4vlJlUU0wsOqmblgQ_HkmL_s",
      "Content-Type": "application/json",
    });

    const paymentData = {
      Amount: amount,
      FirstName: firstName,
      LastName: "Khan",
      Email: "test@gmail.com",
      Phone: "9033661129",
      CcNum: "5506900480000008",
      //CcNum: "5381230100931477",
      CcExpMon: "09",
      CcExpYr: "2025",
      Ccvv: "123",
      CcName: "Sumit Lagad",
      Gateway: "Network",
      //Gateway: "Payu", 
      //Gateway: "Checkout", 
      DeviceInfo: "Mozilla/5.0",
      GuestUserId: "123456",
      TransactionId: txnid,
      RedirectUrl:  "https://raynatours.com/success",
      OrderId: `o-${Date.now()}-${Math.floor(Math.random() * 10)}`,
    };

    try {
      const response = await fetch("http://localhost:55621/api/v1/payments",
      //const response = await fetch("http://thorough-visually-drum.ngrok-free.app/api/payment/v1",
      {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(paymentData),
      });
      const result = await response.json();

      if (result.html) {
        // Handle PayU gateway
        if (result.paymentGateway === "PayU") {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = result.html;
          document.body.appendChild(tempDiv);
          const form = tempDiv.querySelector("form");
          if (form) form.submit();
        }

        // Handle Network gateway
        if (result.paymentGateway === "Network") {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = result.html;
        
          const form = tempDiv.querySelector("form");
          if (form) {
            document.body.appendChild(form); // optional, just for debug
            form.submit();
          } else {
            console.error("No form found in Network HTML response.");
          }
        }
        // Handle Checkout gateway
        if (result.paymentGateway === "Checkout") {
          window.location.href = result.html;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p>Hello</p>

        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
          className="px-4 py-2 border rounded mb-4"
        />

        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-4 py-2 border rounded mb-4"
        />

        <button
          onClick={handlePayment}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Pay Now
        </button>
      </main>
    </div>
  );
}
