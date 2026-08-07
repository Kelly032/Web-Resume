"use client"

import { useState } from "react"
import type { ChatLogEntry } from "@/lib/chat-logger"

export default function ChatLogsAdminPage() {
  const [password, setPassword] = useState("")
  const [logs, setLogs] = useState<ChatLogEntry[]>([])
  const [storage, setStorage] = useState<"local" | "blob" | "">("")
  const [localPath, setLocalPath] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLoad() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/chat-logs?limit=200", {
        headers: { "x-admin-password": password },
      })

      const data = (await response.json()) as {
        logs?: ChatLogEntry[]
        storage?: "local" | "blob"
        localPath?: string | null
        error?: string
      }

      if (!response.ok) {
        throw new Error(data.error ?? "加载失败")
      }

      setLogs(data.logs ?? [])
      setStorage(data.storage ?? "")
      setLocalPath(data.localPath ?? null)
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "加载失败"
      setError(message)
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1033] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI 问答助手 · 对话记录</h1>
          <p className="text-white/70 text-sm">
            仅管理员可访问。本地开发记录保存在服务器文件；Vercel 部署后保存在 Blob Storage。
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <label className="block text-sm text-white/80">管理密码（.env.local 中的 ADMIN_PASSWORD）</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="chat-input flex-1 rounded-xl px-4 py-3 outline-none"
              placeholder="输入管理密码"
            />
            <button
              type="button"
              onClick={() => void handleLoad()}
              disabled={loading || !password}
              className="glass-chip rounded-xl px-6 py-3 font-semibold disabled:opacity-50"
            >
              {loading ? "加载中..." : "查看记录"}
            </button>
          </div>
          {error && <p className="text-red-200 text-sm">{error}</p>}
          {storage && (
            <p className="text-white/70 text-sm">
              当前存储：{storage === "local" ? "本地文件" : "Vercel Blob"}
              {localPath ? ` · ${localPath}` : ""}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="glass-panel rounded-2xl p-5 space-y-3">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/65">
                <span>{new Date(log.timestamp).toLocaleString("zh-CN")}</span>
                <span>会话：{log.sessionId.slice(0, 12)}...</span>
                <span>第 {log.turnCount} 轮</span>
                {log.sources.length > 0 && <span>资料：{log.sources.join(", ")}</span>}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-violet-200 mb-1">用户</p>
                <p className="whitespace-pre-wrap leading-relaxed">{log.userMessage}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-violet-200 mb-1">AI 回复</p>
                <p className="whitespace-pre-wrap leading-relaxed text-white/90">{log.assistantReply}</p>
              </div>
            </div>
          ))}

          {logs.length === 0 && !loading && !error && (
            <p className="text-white/60 text-sm">输入密码后点击「查看记录」。</p>
          )}
        </div>
      </div>
    </div>
  )
}
