import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

interface Params {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: Params) {

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const quizId = params.id;
  if (!quizId) {
    return NextResponse.json({ error: 'Quiz ID is required.' }, { status: 400 });
  }

  try {

    const body = await request.json();
    const { answers } = body;

    if (!answers) {
      return NextResponse.json({ error: 'Answers are required.' }, { status: 400 });
    }


    
    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/learning/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.accessToken}`,
      },
      body: JSON.stringify({
        quiz_id: quizId,
        answers: answers,
      }),
    });


    
    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to submit quiz.' },
        { status: apiResponse.status }
      );
    }

    
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error(`Submit Quiz (ID: ${quizId}) API error:`, error);
    return NextResponse.json(
      { error: "An unexpected internal server error occurred." },
      { status: 500 }
    );
  }
}