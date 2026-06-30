import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const messages = await prisma.message.findMany({
      where: { chatId: id },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { content, role } = body

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        chatId: id,
        content,
        role: role || "user",
      }
    })

    // If it's a user message, call Google Gemini
    if (userMessage.role === "user") {
      try {
        // Fetch chat to get associated agent for system prompt
        const chatData = await prisma.chat.findUnique({
          where: { id },
          include: { agent: true }
        })
        
        const systemInstruction = chatData?.agent?.systemPrompt || "You are OmniAI, a helpful, intelligent, and polite AI assistant. Always be concise and helpful."

        // Initialize Gemini API with the specialized prompt
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
        const model = genAI.getGenerativeModel({ 
          model: "gemini-2.5-flash",
          systemInstruction: systemInstruction
        })

        // Fetch previous messages for context
        const history = await prisma.message.findMany({
          where: { chatId: id },
          orderBy: { createdAt: "asc" },
        })

        // Convert history to Gemini format, excluding the message we just saved
        const geminiHistory = history
          .filter(msg => msg.id !== userMessage.id)
          .map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          }))

        // Start chat session with history
        const chat = model.startChat({
          history: geminiHistory,
        })

        // Send new message
        const result = await chat.sendMessage(content)
        const responseText = result.response.text()
        
        const aiMessage = await prisma.message.create({
          data: {
            chatId: id,
            content: responseText,
            role: "assistant",
          }
        })

        return NextResponse.json({ userMessage, aiMessage })
      } catch (aiError) {
        console.error("Gemini API Error:", aiError)
        return NextResponse.json({ 
          userMessage, 
          error: "Failed to get AI response",
          details: String(aiError)
        }, { status: 500 })
      }
    }

    return NextResponse.json({ userMessage })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
