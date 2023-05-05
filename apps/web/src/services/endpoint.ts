import { NextResponse } from 'next/server';

export interface IParams {
  params: Record<string, string>;
}

export const routeMiddleware =
  (fn: (req: Request, mix: IParams) => Promise<Response | NextResponse>) =>
  async (req: Request, mix: IParams) => {
    try {
      return await fn(req, mix);
    } catch (e) {
      console.error(e);
      let statusCode = 500;
      let data = { message: 'There was an unknown error' };

      if (e.statusCode) {
        statusCode = e.statusCode;
        data.message = e.message;
      }

      return new Response(JSON.stringify(data), {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
