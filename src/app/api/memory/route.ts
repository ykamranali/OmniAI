import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("X-User-Id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const items = await prisma.memoryItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    // Group items by section
    const grouped = items.reduce((acc: any, item) => {
      if (!acc[item.section]) acc[item.section] = []
      acc[item.section].push(item)
      return acc
    }, {})

    return NextResponse.json(grouped)
  } catch (error) {
    console.error("Error fetching memory:", error)
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
    const { content, section } = body

    if (!content || !section) {
      return NextResponse.json({ error: "Content and section are required" }, { status: 400 })
    }

    const newMemory = await prisma.memoryItem.create({
      data: {
        content,
        section,
        userId,
      }
    })

    return NextResponse.json(newMemory)
  } catch (error) {
    console.error("Error creating memory item:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
