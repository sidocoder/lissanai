// src/app/api/email/draft/route.ts

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. Authenticate the user
  // getToken will retrieve the JWT from the secure cookie
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // If no token is found, or if it's invalid, deny access
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Get the request body from the frontend
    const body = await request.json();
    const { prompt, template_type, tone, type } = body;

    // Basic validation to ensure required fields are present
    if (!prompt || !type) {
        return NextResponse.json({ error: 'Missing required fields: prompt and type are required.' }, { status: 400 });
    }

    // 3. Securely call the backend API with the user's access token
    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/email/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward the user's access token for authorization
        'Authorization': `Bearer ${token.accessToken}`,
      },
      body: JSON.stringify({
        prompt,
        template_type,
        tone,
        type,
      }),
    });

    // 4. Handle the response from the backend
    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      // If the backend returned an error, forward it to the client
      return NextResponse.json(
        { error: data.error || 'Failed to process email request.' },
        { status: apiResponse.status }
      );
    }


    console.log("this is the data from the backend for email drafting",data);
    // 5. Send the successful response back to the frontend
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Email drafting API error:", error);
    return NextResponse.json(
      { error: "An unexpected internal server error occurred." },
      { status: 500 }
    );
  }
}