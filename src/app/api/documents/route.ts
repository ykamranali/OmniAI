import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const documents = await prisma.document.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, size } = body

    if (!name || !type || !size) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Connect document to user's organization if available
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    const newDoc = await prisma.document.create({
      data: {
        name,
        type,
        size,
        userId: session.user.id,
        organizationId: user?.defaultOrganizationId || undefined
      }
    })

    return NextResponse.json(newDoc)
  } catch (error) {
    console.error("Error creating document:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
