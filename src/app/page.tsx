// "use client";

// import { useState } from "react";

// export default function Home() {
//   const [amount, setAmount] = useState("5.00");
//   const [firstName, setFirstName] = useState("");
//   const [selectedApi, setSelectedApi] = useState("old");
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const handlePayment = async () => {
//     setLoading(true);
//     setErrorMsg("");

//     const timestamp = Date.now();
//     const txnid = `trxID-${timestamp}-${Math.floor(Math.random() * 100)}`;
//     const orderId = `o-${timestamp}-${Math.floor(Math.random() * 10)}`;

//     const isOldApi = selectedApi === "old";

//     const url = isOldApi
//       ? "http://localhost:55622/api/v1/payments"
//       : "http://localhost:55622/api/payment/v1/create";

//     const headers = new Headers({
//       Authorization: 
//       "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YzM4OWQzOS0wNzk0LTRmOTMtYWVkNC0zYjE3ZGUxODljMmYiLCJVc2VySWQiOiIzNTkwNiIsIlVzZXJUeXBlIjoiQWdlbnQiLCJQYXJlbnRJRCI6IjAiLCJFbWFpbElEIjoibWF5dXJpLnBAdGVjaG5vaGVhdmVuLmNvbSIsImlzcyI6Imh0dHA6Ly9yYXluYXdlYmFwaWF3cy5yYXluYXRvdXJzLmNvbSIsImF1ZCI6Imh0dHA6Ly9yYXluYXdlYmFwaWF3cy5yYXluYXRvdXJzLmNvbSJ9.orxLloGfgH2zv_MwHUL4vlJlUU0wsOqmblgQ_HkmL_s",
//       "Content-Type": "application/json",
//     });

//     const body = isOldApi
//       ? {
//           Amount: amount,
//           FirstName: firstName,
//           LastName: "Khan",
//           Email: "test@gmail.com",
//           Phone: "9033661129",
//           CcNum: "5506900480000008",
//           CcExpMon: "09",
//           CcExpYr: "2025",
//           Ccvv: "123",
//           CcName: "Sumit Lagad",
//           Gateway: "Network",
//           DeviceInfo: "Mozilla/5.0",
//           GuestUserId: "123456",
//           TransactionId: txnid,
//           RedirectUrl: "https://raynatours.com/success",
//           OrderId: orderId,
//         }
//       : {
//           orderId,
//           paymentFor: "booking",
//           redirectUrl: "http://localhost:3000/paymentSuccess",
//           deviceInfo: "web",
//           hostIp: "127.0.0.1", // Replaced with valid IP
//           isClientPaymentGateway: true,
//           customer: {
//             firstName: firstName || "John",
//             lastName: "Doe",
//             email: "tes245@test.com",
//             phone: "1234567890",
//             currency: "USD",
//             totalAmount: parseFloat(amount),
//           },
//           billing: {
//             billingTotalAmountInAED: 115,
//             billingChargeAmountInAED: 8,
//           },
//           paymentMode: "CreditCard",
//           CreditCard: {
//             CcNum: "4111111111111111",
//             CcExpMon: "12",
//             CcExpYr: "2025",
//             Ccvv: "123",
//             CcName: "John Doe",
//           },
//           Gateway: "Payu",
//         };

//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers,
//         body: JSON.stringify(body),
//       });

//       const result = await response.json();

//       if (result.html) {
//         const tempDiv = document.createElement("div");
//         tempDiv.innerHTML = result.html;
//         const form = tempDiv.querySelector("form");

//         if (form) {
//           document.body.appendChild(form);
//           form.submit();
//         } else if (result.paymentGateway === "Checkout") {
//           window.location.href = result.html;
//         } else {
//           setErrorMsg("Payment form not found in response.");
//         }
//       } else {
//         setErrorMsg("Payment failed: No HTML received.");
//       }
//     } catch (error) {
//       setErrorMsg(`Payment Error: ${error}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="grid items-center justify-items-center min-h-screen p-8 sm:p-20">
//       <main className="flex flex-col gap-6 items-center sm:items-start">
//         <p className="text-xl font-semibold">Hello</p>

//         <input
//           type="text"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//           placeholder="Enter your first name"
//           className="px-4 py-2 border rounded mb-2 w-64"
//         />

//         <input
//           type="text"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           placeholder="Enter amount"
//           className="px-4 py-2 border rounded mb-4 w-64"
//         />

//         <div className="flex flex-col gap-2 mb-4">
//           <label htmlFor="apiSelect" className="text-sm font-medium">
//             Choose API to Call:
//           </label>
//           <select
//             id="apiSelect"
//             value={selectedApi}
//             onChange={(e) => setSelectedApi(e.target.value)}
//             className="px-4 py-2 border rounded"
//           >
//             <option value="old">Old API - /v1/payments</option>
//             <option value="new">New API - /payment/v1/create</option>
//           </select>
//         </div>

//         <button
//           onClick={handlePayment}
//           className={`px-6 py-2 rounded text-white ${
//             loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
//           }`}
//           disabled={loading}
//         >
//           {loading ? "Processing..." : "Pay Now"}
//         </button>

//         {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
//       </main>
//     </div>
//   );
// }



// //New-with api selection
// "use client";

// import { useState } from "react";

// export default function Home() {
//   const [amount, setAmount] = useState("5.00");
//   const [firstName, setFirstName] = useState("");
//   const [selectedApi, setSelectedApi] = useState("old");
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
  

//   const handlePayment = async () => {
//     setLoading(true);
//     setErrorMsg("");

//     const timestamp = Date.now();
//     const txnId = `Txn-${timestamp}`;
//     const orderId = `Ord-${timestamp}`;

//     const isOldApi = selectedApi === "old";

//     const url = isOldApi
//       ? "http://localhost:55622/api/payment/v1/payments"
//       : "http://localhost:55622/api/payment/v1/create";

//     const headers = new Headers({
//       Authorization:
//         "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YzM4OWQzOS0wNzk0LTRmOTMtYWVkNC0zYjE3ZGUxODljMmYiLCJVc2VySWQiOiIzNTkwNiIsIlVzZXJUeXBlIjoiQWdlbnQiLCJQYXJlbnRJRCI6IjAiLCJFbWFpbElEIjoibWF5dXJpLnBAdGVjaG5vaGVhdmVuLmNvbSIsImlzcyI6Imh0dHA6Ly9yYXluYXdlYmFwaWF3cy5yYXluYXRvdXJzLmNvbSIsImF1ZCI6Imh0dHA6Ly9yYXluYXdlYmFwaWF3cy5yYXluYXRvdXJzLmNvbSJ9.orxLloGfgH2zv_MwHUL4vlJlUU0wsOqmblgQ_HkmL_s",
//       "Content-Type": "application/json",
//     });

//     const body = isOldApi
//       ? {
//           Amount: amount,
//           FirstName: firstName || "Sumit",
//           LastName: "User",
//           Email: "tes268@test.com",
//           Phone: "91322586589",
//           CcNum: "5506900480000008",
//           CcExpMon: "01",
//           CcExpYr: "2039",
//           Ccvv: "123",
//           CcName: "Sumit Lagad",
//           Gateway: "Network",
//           DeviceInfo: "Mozilla/5.0",
//           GuestUserId: "12125",
//           TransactionId: txnId,
//           RedirectUrl: "https://localhost:55622/success",
//           OrderId: orderId,
//         }
//       : {
//           orderId,
//           paymentFor: "booking",
//           redirectUrl: "http://localhost:3000/paymentSuccess",
//           deviceInfo: "web",
//           hostIp: "127.0.0.1",
//           isClientPaymentGateway: true,
//           customer: {
//             firstName: firstName || "John",
//             lastName: "Doe",
//             email: "tes245@test.com",
//             phone: "1234567890",
//             currency: "USD",
//             totalAmount: parseFloat(amount),
//           },
//           billing: {
//             billingTotalAmountInAED: 115,
//             billingChargeAmountInAED: 8,
//           },
//           paymentMode: "CreditCard",
//           CreditCard: {
//             CcNum: "4111111111111111",
//             CcExpMon: "12",
//             CcExpYr: "2025",
//             Ccvv: "123",
//             CcName: "John Doe",
//           },
//           Gateway: "Checkout",
//           //Gateway: "Payu",
//           //Gateway: "Network",
//         };

//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers,
//         body: JSON.stringify(body),
//       });

//       const result = await response.json();

//       if (result.html) {
//         const tempDiv = document.createElement("div");
//         tempDiv.innerHTML = result.html;
//         const form = tempDiv.querySelector("form");

//         if (form) {
//           document.body.appendChild(form);
//           form.submit();
//         } else if (result.paymentGateway === "Checkout") {
//           window.location.href = result.html;
//         } else {
//           setErrorMsg("Payment form not found in response.");
//         }
//       } else if (
//         result.referenceId &&
//         result.paymentGateway &&
//         result.paymentGateway.toLowerCase() === "network"
//       ) {
//         const termUrl = `http://localhost:55622/api/payment/v1/termurl?referenceId=${result.referenceId}&gatewayName=NETWORK`;
//         const termResp = await fetch(termUrl);
//         if (termResp.ok) {
//           const htmlText = await termResp.text();
//           const tempDiv = document.createElement("div");
//           tempDiv.innerHTML = htmlText;
//           const form = tempDiv.querySelector("form");

//           if (form) {
//             document.body.appendChild(form);
//             form.submit();
//           } else {
//             setErrorMsg("TermUrl form not found.");
//           }
//         } else {
//           setErrorMsg("TermUrl call failed.");
//         }
//       } else {
//         setErrorMsg("Payment failed: No HTML or reference ID received.");
//       }
//     } catch (error) {
//       setErrorMsg(`Payment Error: ${error}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="grid items-center justify-items-center min-h-screen p-8 sm:p-20">
//       <main className="flex flex-col gap-6 items-center sm:items-start">
//         <p className="text-xl font-semibold">Hello</p>

//         <input
//           type="text"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//           placeholder="Enter your first name"
//           className="px-4 py-2 border rounded mb-2 w-64"
//         />

//         <input
//           type="text"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           placeholder="Enter amount"
//           className="px-4 py-2 border rounded mb-4 w-64"
//         />

//         <div className="flex flex-col gap-2 mb-4">
//           <label htmlFor="apiSelect" className="text-sm font-medium">
//             Choose API to Call:
//           </label>
//           <select
//             id="apiSelect"
//             value={selectedApi}
//             onChange={(e) => setSelectedApi(e.target.value)}
//             className="px-4 py-2 border rounded"
//           >
//             <option value="old">Old API - /payment/v1/payments</option>
//             <option value="new">New API - /payment/v1/create</option>
//           </select>
//         </div>

//         <button
//           onClick={handlePayment}
//           className={`px-6 py-2 rounded text-white ${
//             loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
//           }`}
//           disabled={loading}
//         >
//           {loading ? "Processing..." : "Pay Now"}
//         </button>

//         {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
//       </main>
//     </div>
//   );
// }


//New with Gateway dropdown also
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
    const orderId = `Ord-${timestamp}`;

    const isOldApi = selectedApi === "old";

    const url = isOldApi
      ? "http://localhost:55622/api/payment/v1/payments"
      : "http://localhost:55622/api/payment/v1/create";

    const headers = new Headers({
      Authorization:
        "Bearer <add token vlue here>",
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
          hostIp: "127.0.0.1",
          isClientPaymentGateway: true,
          customer: {
            firstName: firstName || "John",
            lastName: "Doe",
            email: "tes245@test.com",
            phone: "1234567890",
            currency: "USD",
            totalAmount: parseFloat(amount),
          },
          billing: {
            billingTotalAmountInAED: 115,
            billingChargeAmountInAED: 8,
          },
          paymentMode: "CreditCard",
          CreditCard: {
            CcNum: "4111111111111111",
            CcExpMon: "12",
            CcExpYr: "2025",
            Ccvv: "123",
            CcName: "John Doe",
          },
          Gateway: gateway,
        };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.html) {
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
        result.referenceId &&
        result.paymentGateway &&
        result.paymentGateway.toLowerCase() === "network"
      ) {
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
        setErrorMsg("Payment failed: No HTML or reference ID received.");
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
            <option value="Payu">PayU</option>
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


