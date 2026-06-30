import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("X-User-Id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(chats)
  } catch (error) {
    console.error("Error fetching chats:", error)
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
    const { title, agentId } = body

    const newChat = await prisma.chat.create({
      data: {
        title: title || "New Conversation",
        userId,
        agentId: agentId || null,
      }
    })

    return NextResponse.json(newChat)
  } catch (error) {
    console.error("Error creating chat:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
