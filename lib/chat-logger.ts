import fs from "fs"
import path from "path"
import { put, list } from "@vercel/blob"

export type ChatLogEntry = {
  id: string
  timestamp: string
  sessionId: string
  turnCount: number
  userMessage: string
  assistantReply: string
  sources: string[]
}

const LOCAL_LOG_DIR = path.join(process.cwd(), "data", "chat-logs")
const LOCAL_LOG_FILE = path.join(LOCAL_LOG_DIR, "conversations.jsonl")
const BLOB_PREFIX = "chat-logs/"

function createLogId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

async function appendLocalLog(entry: ChatLogEntry) {
  fs.mkdirSync(LOCAL_LOG_DIR, { recursive: true })
  fs.appendFileSync(LOCAL_LOG_FILE, `${JSON.stringify(entry)}\n`, "utf-8")
}

async function appendBlobLog(entry: ChatLogEntry) {
  await put(`${BLOB_PREFIX}${entry.id}.json`, JSON.stringify(entry), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json",
  })
}

export async function appendChatLog(input: Omit<ChatLogEntry, "id" | "timestamp">) {
  const entry: ChatLogEntry = {
    id: createLogId(),
    timestamp: new Date().toISOString(),
    ...input,
  }

  try {
    if (useBlobStorage()) {
      await appendBlobLog(entry)
    } else {
      await appendLocalLog(entry)
    }
  } catch (error) {
    console.error("[chat-log] failed to persist conversation:", error)
  }

  return entry
}

async function readLocalLogs(limit: number): Promise<ChatLogEntry[]> {
  if (!fs.existsSync(LOCAL_LOG_FILE)) return []

  const lines = fs
    .readFileSync(LOCAL_LOG_FILE, "utf-8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  return lines
    .slice(-limit)
    .map((line) => JSON.parse(line) as ChatLogEntry)
    .reverse()
}

async function readBlobLogs(limit: number): Promise<ChatLogEntry[]> {
  const result = await list({ prefix: BLOB_PREFIX, limit: Math.min(limit, 1000) })

  const entries = await Promise.all(
    result.blobs.map(async (blob) => {
      const response = await fetch(blob.url, { cache: "no-store" })
      if (!response.ok) return null
      return (await response.json()) as ChatLogEntry
    }),
  )

  return entries
    .filter((entry): entry is ChatLogEntry => entry !== null)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit)
}

export async function listChatLogs(limit = 100): Promise<ChatLogEntry[]> {
  if (useBlobStorage()) {
    return readBlobLogs(limit)
  }
  return readLocalLogs(limit)
}

export function getChatLogStorageMode(): "blob" | "local" {
  return useBlobStorage() ? "blob" : "local"
}

export function getLocalLogFilePath() {
  return LOCAL_LOG_FILE
}
