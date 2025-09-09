// "use client";
// import { useState, useEffect, useRef } from "react";

// export default function Home() {
//   const [amount, setAmount] = useState("5.00");
//   const [firstName, setFirstName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [paymentResponse, setPaymentResponse] = useState(null);
//   const [show3DS, setShow3DS] = useState(false);
//   const [clientIP, setClientIP] = useState(null);
  
//   const iframeRef = useRef(null);
//   const sdkLoadedRef = useRef(false);

//   // Load WebSDK and get client IP when component mounts
//   useEffect(() => {
//     // Get client IP
//     const getClientIP = async () => {
//       try {
//         const response = await fetch('https://api.ipify.org?format=json');
//         const data = await response.json();
//         setClientIP(data.ip);
//       } catch (error) {
//         console.error('Failed to get client IP:', error);
//         setClientIP('127.0.0.1');
//       }
//     };

//     getClientIP();

//     if (sdkLoadedRef.current) return;

//     const loadWebSDK = () => {
//       if (window.NI) {
//         sdkLoadedRef.current = true;
//         return;
//       }

//       const webSdk = document.createElement('script');
//       webSdk.setAttribute('id', 'hosted-sessions-sdk');
//       webSdk.setAttribute('src', 'https://paypage.sandbox.ngenius-payments.com/hosted-sessions/sdk.js');
      
//       webSdk.addEventListener('load', () => {
//         console.log('WebSDK loaded successfully');
//         sdkLoadedRef.current = true;
//       });

//       webSdk.addEventListener('error', (error) => {
//         console.error('Failed to load WebSDK:', error);
//       });

//       document.head.appendChild(webSdk);
//     };

//     loadWebSDK();

//     return () => {
//       const existingScript = document.getElementById('hosted-sessions-sdk');
//       if (existingScript) {
//         existingScript.remove();
//       }
//     };
//   }, []);

//   // Listen for postMessage events to intercept redirects
//   useEffect(() => {
//     const handleMessage = (event) => {
//       console.log('Received message:', event);
      
//       // Check if the message is from the payment iframe
//       if (event.data && typeof event.data === 'object') {
//         // Look for success indicators in the message
//         if (event.data.type === 'payment_success' || 
//             event.data.status === 'success' ||
//             event.data.url && event.data.url.includes('paymentSuccess')) {
          
//           console.log('Payment success detected, redirecting to success page');
//           // Redirect to the success page in the same window
//           window.location.href = event.data.url || 'http://localhost:3000/paymentSuccess';
//           return;
//         }
//       }
      
//       // Also check if it's a string URL
//       if (typeof event.data === 'string' && event.data.includes('paymentSuccess')) {
//         console.log('Payment success URL detected, redirecting to success page');
//         window.location.href = event.data;
//       }
//     };

//     window.addEventListener('message', handleMessage);
    
//     return () => {
//       window.removeEventListener('message', handleMessage);
//     };
//   }, []);

//   // Monitor iframe for URL changes (alternative approach)
//   useEffect(() => {
//     if (show3DS && iframeRef.current) {
//       const checkIframeUrl = () => {
//         try {
//           const iframe = iframeRef.current.querySelector('iframe');
//           if (iframe) {
//             // Try to access the iframe's current URL
//             try {
//               const iframeUrl = iframe.contentWindow.location.href;
//               console.log('Iframe URL:', iframeUrl);
              
//               if (iframeUrl.includes('paymentSuccess')) {
//                 console.log('Success URL detected in iframe, redirecting');
//                 window.location.href = iframeUrl;
//               }
//             } catch (e) {
//               // Cross-origin restrictions prevent direct access
//               console.log('Cannot access iframe URL due to CORS');
//             }
//           }
//         } catch (error) {
//           console.log('Error checking iframe URL:', error);
//         }
//       };

//       // Check periodically for URL changes
//       const intervalId = setInterval(checkIframeUrl, 1000);
      
//       // Cleanup after 5 minutes
//       setTimeout(() => clearInterval(intervalId), 300000);

//       return () => clearInterval(intervalId);
//     }
//   }, [show3DS]);

//   // Handle 3DS authentication when paymentResponse changes
//   useEffect(() => {
//     if (paymentResponse && window.NI) {
//       setShow3DS(true);
//       setTimeout(() => {
//         handle3DSAuthentication();
//       }, 100);
//     }
//   }, [paymentResponse]);

//   // Monitor iframe content and adjust height dynamically
//   useEffect(() => {
//     if (show3DS && iframeRef.current) {
//       const checkIframeHeight = () => {
//         try {
//           const iframe = iframeRef.current.querySelector('iframe');
//           if (iframe) {
//             iframe.onload = () => {
//               try {
//                 const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
//                 if (iframeDoc) {
//                   const contentHeight = Math.max(
//                     iframeDoc.body.scrollHeight,
//                     iframeDoc.body.offsetHeight,
//                     iframeDoc.documentElement.clientHeight,
//                     iframeDoc.documentElement.scrollHeight,
//                     iframeDoc.documentElement.offsetHeight
//                   );
                  
//                   if (contentHeight > 0) {
//                     iframe.style.height = contentHeight + 'px';
//                     iframeRef.current.style.height = contentHeight + 'px';
//                   }
//                 }
//               } catch (e) {
//                 console.log('Cannot access iframe content for height adjustment due to CORS');
//               }
//             };
//           }
//         } catch (error) {
//           console.log('Error adjusting iframe height:', error);
//         }
//       };

//       const intervalId = setInterval(checkIframeHeight, 500);
//       setTimeout(() => clearInterval(intervalId), 30000);

//       return () => clearInterval(intervalId);
//     }
//   }, [show3DS]);

//   const handle3DSAuthentication = async () => {
//     if (!window.NI || !paymentResponse) {
//       console.error('WebSDK or payment response not available');
//       setErrorMsg('WebSDK not loaded or payment response missing');
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log('Starting 3DS authentication with response:', paymentResponse);
      
//       const viewportHeight = window.innerHeight;
//       const containerHeight = Math.max(600, viewportHeight - 200);
      
//       const outcomePromise = window.NI.handlePaymentResponse(
//         paymentResponse,
//         {
//           mountId: '3ds_iframe',
//           style: {
//             width: '100%',
//             height: containerHeight,
//             minHeight: 600,
//             maxHeight: '90vh'
//           }
//         }
//       );

//       const outcome = await outcomePromise;
//       console.log('3DS Outcome:', outcome);
      
//       // Handle the outcome
//       if (outcome.status === 'purchased' || outcome.status === 'PURCHASED') {
//         setErrorMsg("");
//         // Redirect to success page in the same window
//         console.log('Payment completed successfully, redirecting...');
//         window.location.href = 'http://localhost:3000/paymentSuccess';
//       } else if (outcome.status === 'purchased' || outcome.status === 'purchased') {
//         setErrorMsg('3DS Authentication failed');
//         setLoading(false);
//       } else {
//         setErrorMsg(`3DS Authentication status: ${outcome.status}`);
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error('3DS Authentication error:', error);
//       setErrorMsg(`3DS Error: ${error.message}`);
//       setLoading(false);
//     }
//   };

//   const handlePayment = async () => {
//     setLoading(true);
//     setErrorMsg("");
//     setPaymentResponse(null);
//     setShow3DS(false);

//     const maxWaitTime = 5000;
//     const startTime = Date.now();
    
//     while (!window.NI && (Date.now() - startTime) < maxWaitTime) {
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
    
//     if (!window.NI) {
//       setErrorMsg("Payment SDK failed to load. Please refresh and try again.");
//       setLoading(false);
//       return;
//     }

//     const timestamp = Date.now();
//     const email = `Zain-${timestamp}@gmail.com`;
//     const orderId = `Ord-${timestamp}`;

//     const url = "http://localhost:55621/api/payment/v1/create";
//     //const url = "https://global-api-alb-external-dev-1469721947.me-south-1.elb.amazonaws.com/api/payment/v1/create";


//     const headers = new Headers({
//       Authorization:
//         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudElkIjoxMTk4MSwicGFydG5lcklkIjowLCJ0ZWFtTWVtYmVySWQiOjAsIndlYnNpdGVJZCI6MTcsImd1ZXN0VXNlcklkIjoxNzU2MTM0NjM4MzgzNTM5NTMsInBlcm1pc3Npb25zIjoiW10iLCJleHBpcnkiOiIyMDI1LTA4LTI1VDE1OjE1OjUyLjcwMzA1NjBaIiwiYWNjZXNzVG9rZW5FeHBpcnlNaW51dGVzIjo1LCJ0eXBlIjoiY3VzdG9tZXIiLCJhdWQiOiIiLCJpcEFkZHJlc3MiOiJbXSIsInNlcnZpY2VzIjoiW10iLCJUb2tlblR5cGUiOiJBY2Nlc3MiLCJzZXNzaW9uSWQiOiI4NzUxMjhiNS05NjA3LTQzYmQtODEyNy04MjhmZjQ0ZmI0NmEiLCJuYmYiOjE3NTYxMzQ2NTIsImV4cCI6MTc1NjEzNDk1MiwiaWF0IjoxNzU2MTM0NjUyfQ.UpzFp_ItFuLbhj7PUcWfq1RtGsspukEM8ftzlEeICVI",
//       "Content-Type": "application/json",
//     });

//     const body = {
//       orderId,
//       paymentFor: "booking",
//       redirectUrl: "http://localhost:3000/paymentSuccess", // This will be used for redirection
//       deviceInfo: "web",
//       hostIp: clientIP || "127.0.0.1",
//       isClientPaymentGateway: true,
//       customer: {
//         firstName: firstName || "Test",
//         lastName: "Dev",
//         email: email,
//         phone: "+971500000001",
//         currency: "AED",
//         totalAmount: parseFloat(amount),
//       },
//       billing: {
//         billingTotalAmountInAED: 1.5,
//         billingChargeAmountInAED: 0,
//       },
//       paymentMode: "CreditCard",
//       CreditCard: {
//         CcNum: "4111111111111111",
//         //CcNum: "4451353106694465",
//         //CcNum: "5545761001160025",
//         CcExpMon: "01",
//         CcExpYr: "2029",
//         Ccvv: "615",
//         CcName: "MOHAMMED",
//       },
//       gateway: "Payu",
//     };

//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers,
//         body: JSON.stringify(body),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       let result = null;
//       try {
//         result = await response.json();
//       } catch {
//         setErrorMsg("Failed to parse server response");
//         setLoading(false);
//         return;
//       }

//       console.log('Network Gateway Response:', result);
      

//       if (result && result.html) {
//         try {
//           const paymentResponseData = JSON.parse(result.html);
//           console.log('Parsed payment response:', paymentResponseData);
//           setPaymentResponse(paymentResponseData);
//         } catch (parseError) {
//           console.error('Failed to parse payment response:', parseError);
//           setErrorMsg("Invalid payment response format");
//           setLoading(false);
//         }
//       } else {
//         setErrorMsg("Invalid response from payment gateway");
//         setLoading(false);
//       }
//     } catch (error) {
//       setErrorMsg(`Payment Error: ${error.message}`);
//       console.error('Payment error:', error);
//       setLoading(false);
//     }
//   };

//   const resetPayment = () => {
//     setPaymentResponse(null);
//     setShow3DS(false);
//     setErrorMsg("");
//     setLoading(false);
//   };

//   return (
//     <div className="grid items-center justify-items-center min-h-screen p-8 sm:p-20">
//       <main className="flex flex-col gap-6 items-center sm:items-start max-w-2xl w-full">
//         <p className="text-xl font-semibold">Network Gateway Payment</p>

//         {!show3DS ? (
//           <>
//             <input
//               type="text"
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//               placeholder="Enter your first name"
//               className="px-4 py-2 border rounded mb-2 w-64"
//             />

//             <input
//               type="text"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               placeholder="Enter amount"
//               className="px-4 py-2 border rounded mb-4 w-64"
//             />

//             <button
//               onClick={handlePayment}
//               className={`px-6 py-2 rounded text-white ${
//                 loading || !clientIP ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
//               }`}
//               disabled={loading || !clientIP}
//             >
//               {loading ? "Processing..." : !clientIP ? "Getting IP..." : "Pay with Network Gateway"}
//             </button>
//           </>
//         ) : (
//           <div className="w-full">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold">3D Secure Authentication</h2>
//               <button
//                 onClick={resetPayment}
//                 className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//             </div>
//             <div className="border border-gray-300 rounded p-4">
//               <div
//                 id="3ds_iframe"
//                 ref={iframeRef}
//                 className="w-full overflow-hidden"
//                 style={{ 
//                   minHeight: '600px',
//                   maxHeight: '90vh',
//                   height: 'auto'
//                 }}
//               />
//             </div>
//           </div>
//         )}

//         {errorMsg && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//             <p>{errorMsg}</p>
//           </div>
//         )}

//         {loading && paymentResponse && (
//           <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
//             <p>Loading 3DS Authentication...</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    PaymentSDK?: {
      processPayment: (paymentGateway: string, paymentResponse: any) => void;
    };
  }
}

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
      ? "http://localhost:55621/api/payment/v1/payments"
      : "http://localhost:55621/api/payment/v1/create";
      //:"https://global-api-alb-external-dev-1469721947.me-south-1.elb.amazonaws.com/api/payment/v1/create";

    const headers = new Headers({
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudElkIjo0MDQ0NCwicGFydG5lcklkIjowLCJ0ZWFtTWVtYmVySWQiOjAsIndlYnNpdGVJZCI6MTgsImd1ZXN0VXNlcklkIjowLCJwZXJtaXNzaW9ucyI6IltdIiwiZXhwaXJ5IjoiMjAyNS0wOS0wMVQwOTowNDowMy41OTUxMjkyWiIsImFjY2Vzc1Rva2VuRXhwaXJ5TWludXRlcyI6NSwidHlwZSI6ImIyYnVuYXV0aGVudGljYXRlZCIsImF1ZCI6IiIsImlwQWRkcmVzcyI6IltdIiwic2VydmljZXMiOiJbXSIsIlRva2VuVHlwZSI6IkFjY2VzcyIsInNlc3Npb25JZCI6IjkzNmVkYzFmLTYxODItNDE0Zi1hYTlmLWQyZTJiZDU5YzQ5NiIsIm5iZiI6MTc1NjcxNzE0MywiZXhwIjoxNzU2NzE3NDQzLCJpYXQiOjE3NTY3MTcxNDN9.nfd5v9MiR3Al-JPCKcLrlII9RCPGsnGmM2B__G1RuJA",
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
            billingTotalAmountInAED: 10.50,
            billingChargeAmountInAED: 0,
          },
          paymentMode: "CreditCard",
          CreditCard: {
            
            //CcNum: "5506900480000008",
            
            
            ////Non OTP
            CcNum: "4093191766216474",
            CcExpMon: "12",
            CcExpYr: "2025",
            Ccvv: "123",
            CcName: "John Doe",
          },
          gateway: gateway,
        };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const result = await response.json();
      
      // Call the PaymentSDK to process the payment response
      if (window.PaymentSDK) {
        window.PaymentSDK.processPayment(gateway, result.paymentResponse || result);
      }
      
     if ((result.status === true || result.status === "Success" || result.status === "Failure") && result.redirectUrl) {
  window.location.href = result.redirectUrl;
}

      else if(result.html) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = result.html;
        const form = tempDiv.querySelector("form");

        if (form) {
          document.body.appendChild(form);
          form.submit();
        } 
        
        else {
          setErrorMsg("Payment form not found in response.");
        }
      }
      else if (
  result.paymentGateway &&
  result.paymentGateway.toLowerCase() === "checkout"
) {
  if (result.paymentResponse && result.paymentResponse.redirectUrl) {
    window.location.href = result.paymentResponse.redirectUrl;
  } else {
    console.error("Checkout redirectUrl not found in response", result);
    setErrorMsg("Checkout payment failed: redirectUrl missing.");
  }
} 
      else if (
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
    <>
      <Script src="/s.js" strategy="beforeInteractive" />
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
    </>
  );
}