import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        memberships: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password || "")
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Get primary organization if available
    const primaryMembership = user.memberships[0]
    const organizationId = primaryMembership?.organizationId || user.defaultOrganizationId || undefined
    const role = primaryMembership?.role || undefined

    const token = await signToken({ 
      userId: user.id, 
      email: user.email,
      organizationId,
      role
    })

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, organizationId, role }
    })

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
