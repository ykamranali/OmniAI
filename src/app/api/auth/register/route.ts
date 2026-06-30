import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user, organization, and membership in a transaction
    const { user, organization } = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        }
      })

      const newOrg = await tx.organization.create({
        data: {
          name: `${name}'s Workspace`,
          domain: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now()}.omniai.com`
        }
      })

      await tx.organizationMember.create({
        data: {
          userId: newUser.id,
          organizationId: newOrg.id,
          role: "OWNER"
        }
      })

      // Update user default org
      await tx.user.update({
        where: { id: newUser.id },
        data: { defaultOrganizationId: newOrg.id }
      })

      return { user: newUser, organization: newOrg }
    })

    const token = await signToken({ 
      userId: user.id, 
      email: user.email,
      organizationId: organization.id,
      role: "OWNER"
    })

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, organizationId: organization.id, role: "OWNER" }
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
    console.error("Register error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
