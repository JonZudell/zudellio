import { NextResponse } from 'next/server';

// The Helm chart's liveness and readiness probes hit this exact path.
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ status: 'healthy' }, { status: 200 });
}
