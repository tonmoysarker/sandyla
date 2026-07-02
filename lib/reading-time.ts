const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(bodyText: string): number {
  const wordCount = bodyText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
