import { NextResponse } from 'next/server';
import { prisma, getServices } from 'database';

// TODO use yup to validate input

export const POST = async (req: Request, { params, ...aaa }) => {
  try {
    const { accountId } = params; // TODO validate accountId
    const body = await req.json();

    return NextResponse.json({ success: 1 });
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({
        message: 'There was an error',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};
