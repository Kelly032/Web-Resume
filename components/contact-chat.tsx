"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, Loader2, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CHAT_SESSION_ID_KEY,
  CHAT_STORAGE_KEY,
  CHAT_WELCOME_MESSAGE,
  MAX_CHAT_TURNS,
} from "@/lib/chat-config"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

type StoredChatSession = {
  turnCount: number
  messages: ChatMessage[]
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createWelcomeMessage(): ChatMessage {
  return { id: createId(), role: "assistant", content: CHAT_WELCOME_MESSAGE }
}

function loadStoredSession(): StoredChatSession {
  if (typeof window === "undefined") {
    return { turnCount: 0, messages: [createWelcomeMessage()] }
  }

  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY)
    if (!raw) {
      return { turnCount: 0, messages: [createWelcomeMessage()] }
    }

    const parsed = JSON.parse(raw) as StoredChatSession
    if (!Array.isArray(parsed.messages) || typeof parsed.turnCount !== "number") {
      return { turnCount: 0, messages: [createWelcomeMessage()] }
    }

    return {
      turnCount: parsed.turnCount,
      messages: parsed.messages.length > 0 ? parsed.messages : [createWelcomeMessage()],
    }
  } catch {
    return { turnCount: 0, messages: [createWelcomeMessage()] }
  }
}

function saveStoredSession(session: StoredChatSession) {
  window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(session))
}

function getOrCreateSessionId() {
  const existing = window.localStorage.getItem(CHAT_SESSION_ID_KEY)
  if (existing) return existing

  const sessionId = `sess-${createId()}`
  window.localStorage.setItem(CHAT_SESSION_ID_KEY, sessionId)
  return sessionId
}

function formatChatError(message: string): string {
  if (message.includes("LLM_API_KEY")) {
    const onVercel =
      typeof window !== "undefined" &&
      !window.location.hostname.includes("localhost") &&
      !window.location.hostname.startsWith("127.")
    return onVercel
      ? "AI 服务未就绪：请在 Vercel 配置 LLM_API_KEY 后重新 Deploy。"
      : "AI 服务未就绪：请在 .env.local 配置 LLM_API_KEY 后重启 npm run dev。"
  }

  if (message.includes("localhost:8080")) {
    return "服务器暂时无法响应，请稍后重试。"
  }

  return message
}

export function ContactChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([createWelcomeMessage()])
  const [turnCount, setTurnCount] = useState(0)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const turnsRemaining = Math.max(0, MAX_CHAT_TURNS - turnCount)
  const limitReached = turnCount >= MAX_CHAT_TURNS

  useEffect(() => {
    const session = loadStoredSession()
    setMessages(session.messages)
    setTurnCount(session.turnCount)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveStoredSession({ turnCount, messages })
  }, [turnCount, messages, hydrated])

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, loading])

  useEffect(() => {
    if (!hydrated) return

    function focusChatInput() {
      if (window.location.hash === "#ai-chat") {
        window.setTimeout(() => inputRef.current?.focus(), 350)
      }
    }

    focusChatInput()
    window.addEventListener("hashchange", focusChatInput)
    return () => window.removeEventListener("hashchange", focusChatInput)
  }, [hydrated])

  async function handleSend() {
    const content = input.trim()
    if (!content || loading || limitReached) return

    const userMessage: ChatMessage = { id: createId(), role: "user", content }
    const nextMessages = [...messages, userMessage]
    const nextTurnCount = turnCount + 1
    const previousTurnCount = turnCount

    setMessages(nextMessages)
    setTurnCount(nextTurnCount)
    setInput("")
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnCount: nextTurnCount,
          sessionId: getOrCreateSessionId(),
          messages: nextMessages
            .filter((message) => message.role === "user" || message.role === "assistant")
            .map(({ role, content: text }) => ({ role, content: text })),
        }),
      })

      const raw = await response.text()
      let data: { reply?: string; error?: string; turnsRemaining?: number } = {}

      try {
        data = JSON.parse(raw) as { reply?: string; error?: string; turnsRemaining?: number }
      } catch {
        throw new Error(
          response.ok
            ? "服务器返回格式异常，请稍后重试。"
            : `服务器错误 (${response.status})，请稍后重试。`,
        )
      }

      if (!response.ok) {
        throw new Error(data.error ?? `发送失败 (${response.status})，请稍后重试。`)
      }

      setMessages((current) => [
        ...current,
        { id: createId(), role: "assistant", content: data.reply ?? "暂时无法生成回复。" },
      ])
      setError(null)
    } catch (sendError) {
      setTurnCount(previousTurnCount)
      const message = sendError instanceof Error ? sendError.message : "发送失败，请稍后重试"
      const friendly = formatChatError(message)
      setError(friendly)
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: `抱歉，这次没能成功回复。\n\n原因：${friendly}`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleResetSession() {
    const fresh = { turnCount: 0, messages: [createWelcomeMessage()] }
    setTurnCount(fresh.turnCount)
    setMessages(fresh.messages)
    setInput("")
    setError(null)
    saveStoredSession(fresh)
    window.localStorage.setItem(CHAT_SESSION_ID_KEY, `sess-${createId()}`)
  }

  return (
    <div className="chat-panel glass-panel rounded-3xl overflow-hidden flex flex-col h-[min(620px,72vh)]">
      <div className="chat-panel-header px-5 py-4 border-b border-white/20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="glass-icon p-2.5 rounded-xl shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-bold resume-text-glow truncate">AI 问答助手</h3>
            <p className="text-sm resume-body-copy-soft truncate">成凯丽的数字化面试助手</p>
          </div>
        </div>
        <div className="text-sm resume-body-copy-soft shrink-0 text-right">
          剩余 {turnsRemaining} / {MAX_CHAT_TURNS} 轮
        </div>
      </div>

      <div ref={listRef} className="chat-panel-body flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.map((message) => {
          const isUser = message.role === "user"
          return (
            <div key={message.id} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
              {!isUser && (
                <div className="glass-icon p-2 rounded-xl h-fit shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${isUser ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
                <p className="resume-body-copy text-[16px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
              {isUser && (
                <div className="glass-icon p-2 rounded-xl h-fit shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          )
        })}

        {loading && (
          <div className="flex items-center gap-2 resume-body-copy-soft text-sm px-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            正在检索资料并生成回复...
          </div>
        )}
      </div>

      <div className="chat-panel-footer px-4 py-4 border-t border-white/20 space-y-3">
        {limitReached ? (
          <div className="text-sm px-1 resume-body-copy-soft">
            本浏览器已达 {MAX_CHAT_TURNS} 轮对话上限。如需继续，请点击
            <button type="button" className="mx-1 underline text-white" onClick={handleResetSession}>
              开始新会话
            </button>
            （将清空当前对话记录）。
          </div>
        ) : null}

        {error && <div className="text-sm px-1 text-red-200">{error}</div>}

        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                void handleSend()
              }
            }}
            placeholder={
              limitReached
                ? "已达对话上限"
                : "输入问题，例如：介绍一下你的 AI 项目经历"
            }
            rows={2}
            disabled={limitReached}
            className="chat-input flex-1 resize-none rounded-2xl px-4 py-3 resume-body-copy outline-none disabled:opacity-50"
          />

          <Button
            type="button"
            className="hoverable glass-chip bg-white/14 hover:bg-white/20 text-white border-white/40 rounded-2xl h-12 px-5 shrink-0"
            disabled={loading || !input.trim() || limitReached}
            onClick={() => void handleSend()}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            发送
          </Button>
        </div>
      </div>
    </div>
  )
}
