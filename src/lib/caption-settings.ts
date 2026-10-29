import { z } from "zod";

export const globalCategories = ["Roast", "Attitude", "Friendship", "Romantic", "Love", "Lifestyle", "Party", "Instagram Reels", "Motivation", "Sad", "Life", "Friends", "Single/Breakup", "Daily Quotes", "Short & Aesthetic Captions", "Luxury & Success Attitude", "Gym & Fitness", "Still Quotes", "Travel", "Nature", "Fashion", "Selfie", "Birthday", "Family", "Wedding", "Funny", "Savage", "Success", "Royal", "Food", "Music", "Dance", "Festival", "Spiritual", "Study", "Work", "Sports", "Bollywood", "Hindi Shayari", "Nostalgia"] as const;
export const captionLanguages = ["Hinglish", "English", "العربية", "Français", "Español", "Deutsch", "Italiano", "शुद्ध हिंदी", "ठेठी / देसी स्लैंग"] as const;
export const MAX_CAPTIONS = 3;
export const MIN_CAPTIONS = 2;
export type CaptionLanguage = (typeof captionLanguages)[number];
export type GlobalCategory = (typeof globalCategories)[number];
export const captionInput = z.object({
  images: z.array(z.string().startsWith("data:image/").max(3_000_000)).max(4).default([]),
  kind: z.enum(["photo", "video", "prompt"]),
  language: z.enum(captionLanguages),
  category: z.enum(globalCategories).optional(),
  prompt: z.string().trim().max(2000).default(""),
  visitorId: z.string().max(64).optional(),
}).refine((data) => data.kind === "prompt" ? data.prompt.length > 0 : data.images.length > 0, { message: "Add a prompt or media." });

export function globalCategoryFor(category: string): GlobalCategory {
  return globalCategories.find((item) => item === category) ?? "Still Quotes";
}

export function captionToneInstruction(language: CaptionLanguage, category?: GlobalCategory): string {
  if (language === "शुद्ध हिंदी") return "Write in clean, formal Hindi in Devanagari. Use polished vocabulary, no slang or swear words. For Roast, use sharp wit without profanity.";
  const international: Partial<Record<CaptionLanguage, string>> = {
    Hinglish: "natural Hindi-English code-switching in Latin script",
    English: "fluent English",
    "العربية": "natural Arabic in Arabic script",
    "Français": "idiomatic French",
    "Español": "idiomatic Spanish",
    Deutsch: "idiomatic German",
    Italiano: "idiomatic Italian",
  };
  const requested = international[language];
  if (requested) return `Write only in ${requested}. Tailor phrasing to the subject, never default to Hindi. ${category === "Roast" ? "Use savage, witty punchlines targeting behavior or ego, not protected identities. No threats, sexual harassment, attacks on minors or protected-group hate." : "Match the selected category and the subject's mood."}`;
  const regional = "Write in ठेठी / देसी स्लैंग using Devanagari: authentic Bihari, Mumbaiya, Dehati or Kalkattiya street idioms. Match the region in the user's subject; otherwise choose one coherent regional voice per caption, not a caricature or a random mixture.";
  return category === "Roast"
    ? `${regional} Generate raw, aggressive street-comedy roasts with authentic regional gaali and uncensored non-hateful swear words. No asterisks, sanitized substitutes or moralizing. Roast behavior, ego or fictional personas, not protected identities. No threats, sexual harassment, attacks on minors or protected-group hate.`
    : `${regional} Use punchy regional phrasing; do not add aggressive roasts or gaali unless Roast is selected.`;
}

export const captionOutput = z.object({
  text: z.string().trim().min(1),
  translation: z.string().default(""),
  hashtags: z.array(z.string()).max(8),
});

export function limitCaptions<T>(captions: T[]): T[] {
  return captions.slice(0, MAX_CAPTIONS);
}