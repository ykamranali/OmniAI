import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const provider = searchParams.get('provider');

  // In a real application, you would generate an OAuth URL using passport or next-auth
  // and redirect the user to the provider's consent screen.
  // After authorization, the provider would redirect back to a callback URL (e.g. /api/auth/social/callback)
  
  console.log(`[OAuth Mock] Initiating connection with ${provider}...`);
  
  // Simulate the redirect back from the provider after successful auth
  const redirectUrl = new URL('/social?connected=true&provider=' + provider, request.url);
  
  // We use a small delay on the frontend, so here we can just immediately redirect to simulate coming back
  return NextResponse.redirect(redirectUrl);
}
