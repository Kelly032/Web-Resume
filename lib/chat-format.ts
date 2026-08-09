/**
 * Chat replies are plain text (no markdown renderer). Strip model markdown
 * emphasis and use Chinese quotes only where emphasis was intended.
 */
export function sanitizeChatReply(text: string): string {
  return text
    .replace(/\*\*([^*\n]+?)\*\*/g, "「$1」")
    .replace(/\*\*/g, "")
}
