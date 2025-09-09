"use client";

import { useState } from "react";

export default function Home() {
  const [amount, setAmount] = useState("5.00");
  const [firstName, setFirstName] = useState("");
  const [selectedApi, setSelectedApi] = useState("old");
  const [gateway, setGateway] = useState("Network");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setErrorMsg("");

    const timestamp = Date.now();
    const txnId = `Txn-${timestamp}`;
    const email = `$Zain-${timestamp}@gmail.com`; 
    const orderId = `Ord-${timestamp}`;

    const isOldApi = selectedApi === "old";

    const url = isOldApi
      ? "http://localhost:55621/api/payment/v1/payments"
      : "http://localhost:55621/api/payment/v1/create";
      //: "http://localhost:55621/api/payment/v1/external/create";

    const headers = new Headers({
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudElkIjoxMTk4MSwicGFydG5lcklkIjowLCJ0ZWFtTWVtYmVySWQiOjAsIndlYnNpdGVJZCI6MTcsImd1ZXN0VXNlcklkIjoxNzQ4ODQxMjIwNzA3MTEwNzksInBlcm1pc3Npb25zIjoiW10iLCJleHBpcnkiOiIyMDI1LTA2LTAyVDA1OjQ3OjUyLjI0NTcxNjJaIiwiYWNjZXNzVG9rZW5FeHBpcnlNaW51dGVzIjo1LCJ0eXBlIjoiY3VzdG9tZXIiLCJpcEFkZHJlc3MiOiJbXSIsInNlcnZpY2VzIjoiW10iLCJUb2tlblR5cGUiOiJBY2Nlc3MiLCJzZXNzaW9uSWQiOiJjYzQzNjQwYS03YWYyLTRiMGItYThmNi1hOWI1MmJmMWEyZTEiLCJuYmYiOjE3NDg4NDI5NzIsImV4cCI6MTc0ODg0MzI3MiwiaWF0IjoxNzQ4ODQyOTcyfQ.GWmlgBlFIx82pdLoxanN_OihgFQ0QrxXUWUayYUV1qs",
      "Content-Type": "application/json",
    });

    const body = isOldApi
      ? {
          Amount: amount,
          FirstName: firstName || "Sumit",
          LastName: "User",
          Email: "tes268@test.com",
          Phone: "91322586589",
          CcNum: "5506900480000008",
          CcExpMon: "01",
          CcExpYr: "2039",
          Ccvv: "123",
          CcName: "Sumit Lagad",
          Gateway: gateway,
          DeviceInfo: "Mozilla/5.0",
          GuestUserId: "12125",
          TransactionId: txnId,
          RedirectUrl: "https://localhost:55622/success",
          OrderId: orderId,
        }
      : {
          orderId,
          paymentFor: "booking",
          redirectUrl: "http://localhost:3000/paymentSuccess",
          deviceInfo: "web",
          hostIp: "455.44.44.44",
          isClientPaymentGateway: true,
          customer: {
            firstName: firstName || "Test",
            lastName: "Dev",
            //email: "card.success@tabby.ai",
            email: email,
            phone: "+971500000001",
            currency: "AED",
            totalAmount: parseFloat(amount),
          },
          billing: {
            billingTotalAmountInAED: 1.5,
            billingChargeAmountInAED: 0,
          },
          paymentMode: "CreditCard",
          CreditCard: {
            CcNum: "4111111111111111",
            //CcNum: "1800000522366344",
            //CcNum: "4855020025306446", //Tabby Card
            //CcNum: "5381230100931477",
            CcExpMon: "10",
            CcExpYr: "2029",
            Ccvv: "489",
            CcName: "Zain Ul Hasan",
          },
          gateway: gateway,
        };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      // Try parsing JSON; if fails, it might be HTML (PayU 3D Secure)
      let result = null;
      try {
        result = await response.json();
      } catch {
        // Ignore JSON parse error
      }

      if (result?.html) {
        // PayU / Checkout HTML form handling
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = result.html;
        const form = tempDiv.querySelector("form");

        if (form) {
          document.body.appendChild(form);
          form.submit();
        } else if (result.paymentGateway === "Checkout") {
          window.location.href = result.html;
        } else {
          setErrorMsg("Payment form not found in response.");
        }

      } else if (
        result?.referenceId &&
        result?.paymentGateway?.toLowerCase() === "network"
      ) {
        // Network gateway TermUrl
        const termUrl = `http://localhost:55622/api/payment/v1/termurl?referenceId=${result.referenceId}&gatewayName=NETWORK`;
        const termResp = await fetch(termUrl);
        if (termResp.ok) {
          const htmlText = await termResp.text();
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = htmlText;
          const form = tempDiv.querySelector("form");
          if (form) {
            document.body.appendChild(form);
            form.submit();
          } else {
            setErrorMsg("TermUrl form not found.");
          }
        } else {
          setErrorMsg("TermUrl call failed.");
        }

      } else {
        setErrorMsg("Payment failed: Unexpected response.");
      }

    } catch (error) {
      setErrorMsg(`Payment Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <label htmlFor="apiSelect" className="text-sm font-medium">
            Choose API to Call:
          </label>
          <select
            id="apiSelect"
            value={selectedApi}
            onChange={(e) => setSelectedApi(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="old">Old API - /payment/v1/payments</option>
            <option value="new">New API - /payment/v1/create</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="gatewaySelect" className="text-sm font-medium">
            Choose Payment Gateway:
          </label>
          <select
            id="gatewaySelect"
            value={gateway}
            onChange={(e) => setGateway(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="Network">Network</option>
            <option value="Checkout">Checkout</option>
            <option value="PayU">PayU</option>
            <option value="Tabby">Tabby</option>
            <option value="Shukran">Shukran</option>
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
  );
}






