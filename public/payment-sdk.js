class PaymentSDK {
  constructor() {
    console.log('PaymentSDK: Ultra-simple version initialized');
  }

  /**
   * Handle network payment (POST form submission)
   * Creates form, submits to payment gateway, redirects main window
   */
  handleNetworkPayment(redirectUrl, base64code) {
    console.log('PaymentSDK: Direct network payment submission', {
      redirectUrl,
      base64code,
    });

    // Create form and submit directly to main window
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = redirectUrl;
    form.style.display = 'none';

    // Add the creq parameter
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'creq';
    input.value = base64code;
    form.appendChild(input);

    // Submit form (this will redirect the main window)
    document.body.appendChild(form);
    console.log('PaymentSDK: Submitting form and redirecting to:', redirectUrl);
    form.submit();
  }

  /**
   * Handle checkout payment (direct redirect)
   * Simply redirects the main window to the checkout URL
   */
  handleCheckoutPayment(redirectUrl) {
    console.log('PaymentSDK: Direct checkout redirect to:', redirectUrl);
    window.location.href = redirectUrl;
  }

  /**
   * Main processing method - extracts gateway and processes payment
   */
  processPayment(paymentResponse) {
    console.log('PaymentSDK: Processing payment response');

    // Check if it's a simple status response (success/failed)
    if (paymentResponse.status && paymentResponse.redirectUrl) {
      console.log('PaymentSDK: Simple redirect based on status:', paymentResponse.status);
      window.location.href = paymentResponse.redirectUrl;
      return;
    }

    // Extract gateway from response
    let gateway = null;
    if (paymentResponse.type) {
      const gatewayName = paymentResponse.type.toLowerCase();
      if (gatewayName === 'n') {
        gateway = 'n';
      } else if (gatewayName === 'c') {
        gateway = 'c';
      }
    }

    // Auto-detect if gateway not found in response
    if (!gateway) {
      // Check nested paymentResponse first
      const nestedResponse = paymentResponse.paymentResponse || paymentResponse;
      
      if (nestedResponse.base64code && nestedResponse.redirectUrl) {
        gateway = 'n'; // Network payment
      } else if (nestedResponse.redirectUrl) {
        gateway = 'c'; // Checkout payment
      }
    }

    // Process based on gateway type
    switch (gateway) {
      case 'n':
        // Check both direct response and nested paymentResponse
        const networkData = paymentResponse.paymentResponse || paymentResponse;
        
        if (
          networkData &&
          networkData.base64code &&
          networkData.redirectUrl
        ) {
          this.handleNetworkPayment(
            networkData.redirectUrl,
            networkData.base64code,
          );
        } else {
          console.error('PaymentSDK: Network payment missing required fields', paymentResponse);
        }
        break;

      case 'c':
        // Check both direct response and nested paymentResponse
        const checkoutData = paymentResponse.paymentResponse || paymentResponse;
        
        if (checkoutData && checkoutData.redirectUrl) {
          this.handleCheckoutPayment(checkoutData.redirectUrl);
        } else {
          console.error('PaymentSDK: Checkout payment missing redirectUrl', paymentResponse);
        }
        break;

      default:
        console.error('PaymentSDK: Unable to determine payment type');
        break;
    }
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  window.PaymentSDK = new PaymentSDK();
  console.log('PaymentSDK: Global instance created');
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PaymentSDK;
}
