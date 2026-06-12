// AI Moderation Engine
// In production, replace keyword heuristics with a real ML API (Perspective API, OpenAI moderation, etc.)

export interface ModerationResult {
  flagged: boolean;
  categories: {
    toxicity: number;
    spam: number;
    scam: number;
    phishing: number;
    hateSpeech: number;
    nsfw: number;
  };
  primaryCategory: string | null;
  severity: number;
  action: "none" | "warn" | "timeout" | "delete";
  reason: string | null;
}

const TOXICITY_PATTERNS = [
  /\b(idiot|stupid|moron|loser|trash|garbage|worthless|dumb)\b/i,
  /\b(hate|kill|die|destroy)\s+(you|them|him|her|it)\b/i,
];

const SPAM_PATTERNS = [
  /(.)\1{8,}/,
  /(\b\w+\b)(\s+\1){4,}/i,
  /(https?:\/\/[^\s]+\s*){4,}/i,
  /[A-Z]{20,}/,
];

const SCAM_PATTERNS = [
  /\b(free\s+nitro|gift\s+card|you\s+won|claim\s+your|limited\s+time|act\s+now)\b/i,
  /\b(send\s+\$|bitcoin|crypto|wallet\s+address)\b/i,
  /\b(dm\s+me\s+for|message\s+me\s+to\s+get|click\s+here\s+to\s+win)\b/i,
];

const PHISHING_PATTERNS = [
  /discordapp\.com\.[a-z]{2,}|discord\.gg\.[a-z]{2,}/i,
  /\b(verify\s+your\s+account|suspended|banned\s+unless)\b.*http/i,
  /bit\.ly|tinyurl|t\.co|goo\.gl/i,
];

const HATE_SPEECH_PATTERNS = [
  /\b(n[i1]gg|f[a4]gg|k[i1]k[e3]|ch[i1]nk|sp[i1]c)\b/i,
];

function scorePatterns(text: string, patterns: RegExp[]): number {
  let score = 0;
  for (const p of patterns) {
    if (p.test(text)) score += 0.35;
  }
  return Math.min(score, 1.0);
}

export function moderateContent(
  content: string,
  settings: { toxicityThreshold: number; spamThreshold: number; scamThreshold: number }
): ModerationResult {
  const categories = {
    toxicity: scorePatterns(content, TOXICITY_PATTERNS),
    spam: scorePatterns(content, SPAM_PATTERNS),
    scam: scorePatterns(content, SCAM_PATTERNS),
    phishing: scorePatterns(content, PHISHING_PATTERNS),
    hateSpeech: scorePatterns(content, HATE_SPEECH_PATTERNS),
    nsfw: 0,
  };

  // Add small random variance to simulate ML uncertainty
  Object.keys(categories).forEach((k) => {
    const key = k as keyof typeof categories;
    categories[key] = Math.min(1, categories[key] + (Math.random() * 0.05));
  });

  const maxScore = Math.max(...Object.values(categories));
  const primaryEntry = Object.entries(categories).find(([, v]) => v === maxScore);
  const primaryCategory = maxScore > 0.2 ? primaryEntry?.[0] ?? null : null;

  const flagged =
    categories.toxicity >= settings.toxicityThreshold ||
    categories.spam >= settings.spamThreshold ||
    categories.scam >= settings.scamThreshold ||
    categories.phishing >= 0.6 ||
    categories.hateSpeech >= 0.5;

  let action: ModerationResult["action"] = "none";
  let reason: string | null = null;

  if (flagged) {
    if (categories.hateSpeech >= 0.5 || categories.phishing >= 0.7 || categories.scam >= 0.85) {
      action = "timeout";
      reason = categories.hateSpeech >= 0.5 ? "Hate speech detected" :
                categories.phishing >= 0.7 ? "Phishing link detected" : "Scam content detected";
    } else if (categories.toxicity >= settings.toxicityThreshold || categories.spam >= settings.spamThreshold) {
      action = "warn";
      reason = categories.toxicity >= settings.toxicityThreshold ? "Toxic content" : "Spam detected";
    }
    if (maxScore >= 0.6) action = action === "none" ? "delete" : action;
  }

  return {
    flagged,
    categories,
    primaryCategory,
    severity: maxScore,
    action,
    reason,
  };
}

export function getCategoryLabel(cat: string): string {
  const map: Record<string, string> = {
    toxicity: "Toxicity",
    spam: "Spam",
    scam: "Scam",
    phishing: "Phishing",
    hateSpeech: "Hate Speech",
    nsfw: "NSFW",
  };
  return map[cat] ?? cat;
}

export function getCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    toxicity: "#dc2626",
    spam: "#b45309",
    scam: "#7c3aed",
    phishing: "#0369a1",
    hateSpeech: "#be185d",
    nsfw: "#9333ea",
  };
  return map[cat] ?? "#6D213C";
}
