import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const agents = await prisma.agent.findMany()
    return NextResponse.json(agents)
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
