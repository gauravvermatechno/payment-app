import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gateway, amount, firstName } = body;

    // Get token first
    const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/token`, {
      method: 'POST',
    });
    
    const tokenData = await tokenResponse.json();
    if (!tokenData.success || !tokenData.token) {
      throw new Error('Failed to get authentication token');
    }

    const orderId = `${Math.ceil(Math.random() * 10000)}${Math.ceil(Math.random() * 10000)}${Math.ceil(Math.random() * 10000)}`;

    const url = "http://localhost:55621/api/payment/v1/create";

    const headers = {
      Authorization: `Bearer ${tokenData.token}`,
      "Content-Type": "application/json",
    };

    const paymentBody = {
      orderId,
      paymentFor: "booking",
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/paymentSuccess`,
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
        CcNum: "4093191766216474",
        CcExpMon: "12",
        CcExpYr: "2025",
        Ccvv: "123",
        CcName: "John Doe",
      },
      gateway: gateway,
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(paymentBody),
    });

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      data: result,
      gateway: gateway
    });

  } catch (error) {
    console.error("Payment API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Payment failed" },
      { status: 500 }
    );
  }
}