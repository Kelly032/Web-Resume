import fs from "fs"
import path from "path"
import {
  detectQueryIntent,
  detectKnowledgeTiers,
  getOrderedKnowledgeFiles,
  type QueryIntent,
} from "@/lib/resume-agent-prompt"

const KNOWLEDGE_DIR = path.join(process.cwd(), "data", "knowledge")

const INTENT_FILES: Record<QueryIntent, string[]> = {
  self_intro: ["01_profile.md", "04_interview.md"],
  profile: ["01_profile.md", "04_interview.md"],
  project: ["02_projects.md", "02_projects1.md", "04_interview.md"],
  tech: ["05_ai_technology.md", "03_ai_product.md", "02_projects.md", "02_projects1.md"],
  interview: ["04_interview.md", "01_profile.md"],
  general: ["01_profile.md", "02_projects.md", "02_projects1.md", "03_ai_product.md", "04_interview.md", "05_ai_technology.md"],
}

const STOPWORDS = new Set([
  "一下",
  "简要",
  "简单",
  "请",
  "的",
  "吗",
  "呢",
  "啊",
  "是",
  "什么",
  "如何",
  "怎么",
  "能否",
  "可以",
  "关于",
  "自己",
  "你自己",
  "介绍",
  "说说",
  "告诉",
  "一下下",
])

const INTENT_SEARCH_TERMS: Partial<Record<QueryIntent, string[]>> = {
  self_intro: ["成凯丽", "北京师范大学", "河南大学", "个人介绍", "自我定位", "AI产品经理"],
  profile: ["成凯丽", "教育", "背景", "技能", "规划"],
}

type ScoredChunk = {
  score: number
  text: string
  source: string
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s,，。！？；：、（）()【】\[\]「」"'""\-_/]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !STOPWORDS.has(token))
}

function chunkText(text: string, source: string, chunkSize = 520): ScoredChunk[] {
  const normalized = text.replace(/\r\n/g, "\n").trim()
  if (!normalized) return []

  const paragraphs = normalized.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean)
  const chunks: ScoredChunk[] = []

  let buffer = ""
  for (const paragraph of paragraphs) {
    const candidate = buffer ? `${buffer}\n\n${paragraph}` : paragraph
    if (candidate.length <= chunkSize) {
      buffer = candidate
      continue
    }

    if (buffer) {
      chunks.push({ score: 0, text: buffer, source })
    }

    if (paragraph.length <= chunkSize) {
      buffer = paragraph
      continue
    }

    for (let index = 0; index < paragraph.length; index += chunkSize) {
      chunks.push({
        score: 0,
        text: paragraph.slice(index, index + chunkSize),
        source,
      })
    }
    buffer = ""
  }

  if (buffer) {
    chunks.push({ score: 0, text: buffer, source })
  }

  return chunks
}

function readFileChunks(filename: string): ScoredChunk[] {
  const filePath = path.join(KNOWLEDGE_DIR, filename)
  if (!fs.existsSync(filePath)) return []

  const content = fs.readFileSync(filePath, "utf-8")
  return chunkText(content, filename)
}

function scoreChunk(queryTokens: string[], chunk: ScoredChunk, intent: QueryIntent): number {
  const chunkLower = chunk.text.toLowerCase()
  const chunkTokens = new Set(tokenize(chunk.text))
  let score = 0

  const intentFiles = INTENT_FILES[intent]
  if (intentFiles.includes(chunk.source)) score += 30
  if (intent === "self_intro" && chunk.source === "01_profile.md") score += 40

  for (const token of queryTokens) {
    if (chunkTokens.has(token)) score += 8
    if (chunkLower.includes(token)) score += 4
  }

  return score
}

function dedupeChunks(chunks: ScoredChunk[]): ScoredChunk[] {
  const seen = new Set<string>()
  return chunks.filter((chunk) => {
    const key = `${chunk.source}:${chunk.text.slice(0, 80)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function getForcedIntroChunks(limit = 4): ScoredChunk[] {
  return readFileChunks("01_profile.md").slice(0, limit)
}

export function searchKnowledge(query: string, limit = 6): string[] {
  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true })
    return []
  }

  const intent = detectQueryIntent(query)
  const intentFiles = INTENT_FILES[intent]
  const queryTokens = [
    ...tokenize(query),
    ...(INTENT_SEARCH_TERMS[intent] ?? []).flatMap((term) => tokenize(term)),
  ]

  const uniqueTokens = [...new Set(queryTokens)]
  const chunks = intentFiles.flatMap((file) => readFileChunks(file))

  if (chunks.length === 0) return []

  let ranked = dedupeChunks(
    chunks
      .map((chunk) => ({
        ...chunk,
        score: scoreChunk(uniqueTokens, chunk, intent),
      }))
      .filter((chunk) => chunk.score > 0)
      .sort((a, b) => b.score - a.score),
  )

  if (intent === "self_intro") {
    ranked = dedupeChunks([...getForcedIntroChunks(4), ...ranked])
  }

  if (ranked.length === 0 && intent !== "self_intro") {
    const fallbackFiles = getOrderedKnowledgeFiles(detectKnowledgeTiers(query))
    ranked = dedupeChunks(
      fallbackFiles
        .flatMap((file) => readFileChunks(file))
        .map((chunk) => ({
          ...chunk,
          score: scoreChunk(uniqueTokens, chunk, intent),
        }))
        .filter((chunk) => chunk.score > 0)
        .sort((a, b) => b.score - a.score),
    )
  }

  if (ranked.length === 0) return []

  return ranked.slice(0, limit).map((chunk) => `[${chunk.source}]\n${chunk.text}`)
}
