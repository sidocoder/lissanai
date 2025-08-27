// src/app/api/email/write/route.ts

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. Authenticate the user (same as the draft route)
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Get the request body from the frontend
    const body = await request.json();
    const { prompt } = body; // For this route, we only need the English text prompt

    // Basic validation to ensure the prompt is present
    if (!prompt) {
        return NextResponse.json({ error: 'Missing required field: prompt is required.' }, { status: 400 });
    }

    // 3. Securely call the backend API
    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/email/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.accessToken}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        // --- KEY DIFFERENCE ---
        // This route is specifically for improving text, so we hardcode the type to 'EDIT'.
        type: 'EDIT', 
      }),
    });

    // 4. Handle the response from the backend
    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to process email request.' },
        { status: apiResponse.status }
      );
    }

    // 5. Send the successful response back to the frontend
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Email writing API error:", error);
    return NextResponse.json(
      { error: "An unexpected internal server error occurred." },
      { status: 500 }
    );
  }
}