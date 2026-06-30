import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch accounts linked via NextAuth (Google, LinkedIn)
    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id },
      select: {
        provider: true,
        providerAccountId: true,
      }
    });

    // Format them for the frontend
    const formattedAccounts = accounts.map((acc, index) => ({
      id: index,
      platform: acc.provider,
      username: acc.provider === 'google' ? session.user.email : `@${acc.provider}_user`, // we don't store raw username for oauth without extra api calls
      status: 'active'
    }));

    return NextResponse.json({ accounts: formattedAccounts });
  } catch (error) {
    console.error('Error fetching social accounts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
