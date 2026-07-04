import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface WorkerSession {
  worker_id:  string;
  partner_id: string;
  full_name:  string;
}

export async function signWorkerToken(session: WorkerSession): Promise<string> {
  return new SignJWT(session as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(secret);
}

export async function getWorkerSession(req: NextRequest): Promise<WorkerSession | null> {
  const token = req.cookies.get('worker_token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      worker_id:  payload.worker_id  as string,
      partner_id: payload.partner_id as string,
      full_name:  payload.full_name  as string,
    };
  } catch {
    return null;
  }
}
