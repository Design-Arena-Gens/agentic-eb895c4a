import { NextRequest, NextResponse } from 'next/server';
import { rewriteResume } from '@/lib/rewrite';

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription } = await req.json();
    if (typeof resumeText !== 'string' || typeof jobDescription !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const result = rewriteResume(resumeText, jobDescription);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}
