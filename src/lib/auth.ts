import { SignJWT, jwtVerify } from "jose"

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || "default_super_secret_key_for_omni_ai"
  return new TextEncoder().encode(secret)
}

export async function signToken(payload: { userId: string, email: string, organizationId?: string, role?: string }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey())

  return token
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload as { userId: string, email: string, organizationId?: string, role?: string }
  } catch (error) {
    return null
  }
}
