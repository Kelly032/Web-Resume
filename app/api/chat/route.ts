import { appendChatLog } from "@/lib/chat-logger"
import { NextResponse } from "next/server"
import { MAX_CHAT_TURNS, MAX_OUTPUT_TOKENS } from "@/lib/chat-config"
import { createChatCompletion, type ChatMessage } from "@/lib/llm"
import { searchKnowledge } from "@/lib/knowledge"
import { buildAgentSystemPrompt } from "@/lib/resume-agent-prompt"

export const runtime = "nodejs"

type IncomingMessage = {
  role: "user" | "assistant"
  content: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      messages?: IncomingMessage[]
      turnCount?: number
      sessionId?: string
    }
    const history = body.messages ?? []

    const userTurns = history.filter((message) => message.role === "user").length
    const clientTurnCount = body.turnCount ?? userTurns

    if (clientTurnCount > MAX_CHAT_TURNS || userTurns > MAX_CHAT_TURNS) {
      return NextResponse.json(
        {
          error: `本浏览器已达 ${MAX_CHAT_TURNS} 轮对话上限。请点击「开始新会话」后再继续。`,
        },
        { status: 429 },
      )
    }

    const lastUserMessage = [...history].reverse().find((message) => message.role === "user")
    if (!lastUserMessage?.content.trim()) {
      return NextResponse.json({ error: "请输入问题" }, { status: 400 })
    }

    const contextChunks = searchKnowledge(lastUserMessage.content.trim())
    const systemPrompt = buildAgentSystemPrompt(contextChunks)

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...history
        .filter((message) => message.role === "user" || message.role === "assistant")
        .slice(-8)
        .map((message) => ({
          role: message.role,
          content: message.content.trim(),
        })),
    ]

    const reply = await createChatCompletion(messages, {
      maxTokens: MAX_OUTPUT_TOKENS,
      temperature: 0.15,
    })

    const sources = contextChunks.map((chunk) => chunk.split("\n")[0].replace(/^\[|\]$/g, ""))

    await appendChatLog({
      sessionId: body.sessionId?.trim() || "anonymous",
      turnCount: clientTurnCount,
      userMessage: lastUserMessage.content.trim(),
      assistantReply: reply,
      sources,
    })

    return NextResponse.json({
      reply,
      sources,
      turnsRemaining: MAX_CHAT_TURNS - clientTurnCount,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "对话请求失败"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
