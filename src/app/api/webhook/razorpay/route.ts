// src/app/api/webhook/razorpay/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Placeholder - Razorpay webhook handler (not active for MVP)
  return NextResponse.json(
    { message: "Webhook endpoint not active" },
    { status: 200 }
  );
}