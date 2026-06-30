import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"
import { anthropic } from "@ai-sdk/anthropic"
import { deepseek } from "@ai-sdk/deepseek"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { model, contentType, tone, platform, prompt } = await req.json()

    // Select the appropriate model based on the request
    let selectedModel;
    switch (model) {
      case "openai":
        // Fallback to a default if process.env.OPENAI_API_KEY is not set (will throw error gracefully in SDK if actually missing)
        selectedModel = openai("gpt-4o");
        break;
      case "claude":
        selectedModel = anthropic("claude-3-5-sonnet-20241022");
        break;
      case "deepseek":
        selectedModel = deepseek("deepseek-chat");
        break;
      case "gemini":
      default:
        selectedModel = google("gemini-1.5-pro-latest");
        break;
    }

    // Construct the system prompt
    const systemPrompt = `You are OmniAI, a world-class AI marketing and copywriting expert.
Your task is to generate high-quality content based on the user's requirements.

Context Parameters:
- Content Type: ${contentType}
- Tone of Voice: ${tone}
- Target Platform: ${platform}

Guidelines:
1. Ensure the output strictly matches the format expected for the chosen Content Type (e.g., if it's a social post, keep it concise; if it's a blog, format with markdown headers).
2. Adopt the requested Tone of Voice perfectly.
3. Optimize the content for the Target Platform (e.g., use hashtags for Instagram/X, professional formatting for LinkedIn, engaging hook for TikTok).
4. Do not include introductory filler like "Here is your post:". Just output the final ready-to-publish content.`

    const result = streamText({
      model: selectedModel,
      system: systemPrompt,
      prompt: prompt,
    })

    return result.toDataStreamResponse()
    
  } catch (error) {
    console.error("Error in AI Studio route:", error)
    return NextResponse.json({ error: "Failed to generate content. Please check API keys." }, { status: 500 })
  }
}
