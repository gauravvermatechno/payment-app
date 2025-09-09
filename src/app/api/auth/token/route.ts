import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch("https://dev.raynatours.com/api/common/getToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
      },
      body: JSON.stringify({
        websiteId: 17,
        type: "unauthenticated",
      }),
    });

    const data = await response.json();
    
    if (data.data?.accessToken) {
      return NextResponse.json({ 
        success: true, 
        token: data.data.accessToken 
      });
    }
    
    throw new Error("Failed to get access token");
  } catch (error) {
    console.error("Token fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch token" },
      { status: 500 }
    );
  }
}