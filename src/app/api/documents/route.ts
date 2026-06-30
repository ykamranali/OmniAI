import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("X-User-Id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const documents = await prisma.document.findMany({
      where: { userId },
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
    const userId = request.headers.get("X-User-Id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, size } = body

    if (!name || !type || !size) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newDoc = await prisma.document.create({
      data: {
        name,
        type,
        size,
        userId,
      }
    })

    return NextResponse.json(newDoc)
  } catch (error) {
    console.error("Error creating document:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
