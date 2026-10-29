import { createFileRoute } from "@tanstack/react-router";
import { scriptBank, scriptLanguages, scriptCategories, type ReelScript, type ScriptCategory, type ScriptLanguage } from "@/lib/scriptify";

const fail = (error: string, status: number) => Response.json({ error }, { status });

const categoryThemes: Record<ScriptCategory, string> = {
  funny: "everyday Indian comedy — gym excuses, salary vanishing, online shopping fails, family WhatsApp chaos, alarm snooze loops, EMI lifestyle, traffic philosophy, rishtedaar interrogation",
  puneet: "Puneet-style loud solo reels — over-the-top public confidence, dance attacks in buses/markets/weddings, auto-rickshaw performances, oblivious self-belief",
  love: "modern dating mishaps — seen-zones, typing bubbles, coffee date budget shocks, profile-pic detective work, long-distance recharges disasters, gym crush reps gone wrong",
  friendzone: "friendzone & bro-zone tales — emergency contact not boyfriend, public bhai announcements, boyfriend interview coach, referral love stories",
  daily: "daily relatable memes — salary one-day world tour, five-more-minutes snooze, family Wi-Fi tribunal, OTP family emergencies, landlady radar, neighbour aunty CCTV",
};

const languageStyle: Record<ScriptLanguage, string> = {
  bihari: "Bihari-flavored Hinglish (use 'hum', 'ba', 'tohar')",
  desi: "Haryanvi/desi roast-flavored Hinglish (use 'manne', 'tera', 'sai', 'ghana')",
  hinglish: "natural conversational Hinglish — Hindi written in Roman script, sprinkled with English words",
  hindi: "Devanagari Hindi",
  arabic: "Arabic with Egyptian colloquial flavour, written in Arabic script",
};

type GeneratedScript = {
  title: string;
  cast: "solo" | "group";
  people: number;
  hook: string;
  twist: string;
  punchline: string;
  contentType: "meme" | "story";
};

const aiOutput = (raw: unknown): GeneratedScript[] => {
  if (!Array.isArray(raw)) return [];
  const out: GeneratedScript[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const title = typeof o.title === "string" ? o.title.trim() : "";
    const cast = o.cast === "group" ? "group" : "solo";
    const peopleRaw = typeof o.people === "number" ? o.people : cast === "group" ? 2 : 1;
    const hook = typeof o.hook === "string" ? o.hook.trim() : "";
    const twist = typeof o.twist === "string" ? o.twist.trim() : "";
    const punchline = typeof o.punchline === "string" ? o.punchline.trim() : "";
    const contentType = o.contentType === "story" ? "story" : "meme";
    if (!title || !hook || !twist || !punchline) continue;
    if (hook.length > 220 || twist.length > 220 || punchline.length > 220) continue;
    out.push({ title, cast, people: [1, 2, 3].includes(peopleRaw) ? peopleRaw : cast === "group" ? 2 : 1, hook, twist, punchline, contentType });
    if (out.length >= 5) break;
  }
  return out;
};

const buildScripts = (generated: GeneratedScript[], category: ScriptCategory, language: ScriptLanguage, batchId: string): ReelScript[] => {
  return generated.map((g, i) => {
    const storyId = `ai-${batchId}-${i}`;
    return {
      id: `${storyId}-${language}`,
      storyId,
      category,
      language,
      title: g.title,
      cast: g.cast,
      people: g.people,
      hook: g.hook,
      twist: g.twist,
      punchline: g.punchline,
    };
  });
};

const staticFallback = (category: ScriptCategory, language: ScriptLanguage, exclude: string[]): ReelScript[] => {
  const pool = scriptBank.filter((s) => s.category === category && s.language === language && !exclude.includes(s.storyId));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const solo = shuffled.filter((s) => s.cast === "solo").slice(0, 4);
  const group = shuffled.filter((s) => s.cast === "group").slice(0, 1);
  return [...solo, ...group].slice(0, 5);
};

export const Route = createFileRoute("/api/khazana")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null) as
          | { category?: string; language?: string; exclude?: string[] }
          | null;
        if (!body) return fail("Invalid request.", 400);
        const category = scriptCategories.find((c) => c.id === body.category);
        const language = scriptLanguages.find((l) => l.id === body.language);
        if (!category || !language) return fail("Unknown category or language.", 400);
        const exclude = Array.isArray(body.exclude) ? body.exclude.filter((x): x is string => typeof x === "string") : [];

        const { callGemini, getGeminiKeyCount } = await import("@/lib/ai/gemini-keys.server");
        if (getGeminiKeyCount() === 0) {
          console.warn("[/api/khazana] No Gemini keys found in process.env (expected GEMINI_API_KEY_1..19). Serving static fallback.");
          return Response.json({ scripts: staticFallback(category.id, language.id, exclude), source: "static" });
        }

        const prompt = `You are a viral Instagram content strategist for Indian audiences. Your job is to produce a BALANCED batch of 5 short-form scripts that mix two formats:

FORMAT 1 — FUNNY MEMES (write exactly 2 or 3 of these):
Relatable, punchy comedy sketches in the category "${category.label}". Draw from: ${categoryThemes[category.id]}. Each meme is a quick observational joke — setup, misdirection, punchline. Light, shareable, instantly relatable.

FORMAT 2 — VIRAL REEL STORIES (write exactly 2 or 3 of these, alternating with the memes):
Gripping, culturally relevant micro-stories with an UNEXPECTED OR SHOCKING TWIST in the final line. Think trending reel storytelling — a relatable Indian situation that starts normal, builds tension, then flips everything in the last sentence. The twist must genuinely surprise — a hidden reveal, a role reversal, an assumption shattered, a dark-comedy punch, a poetic irony. Make the viewer replay it. Themes: family secrets, double lives, relationship betrayals, societal hypocrisy, money shocks, status flips, wedding drama, office politics, neighbour revelations, exam-result twists, migration stories, generational clashes — all grounded in Indian cultural context.

Mix the two formats so they ALTERNATE (not all memes first, then all stories). Interleave them for variety.

Language/style: ${languageStyle[language.id]}.

Each script is a 15–20 second reel spoken to camera. Three short punchy lines: a hook, a twist, and a punchline. Each line max 14 words. No stage directions in brackets. No hashtags. No emojis. No repetition across scripts.

Return ONLY a JSON array (no markdown, no prose) of exactly 5 objects, each shaped like:
{"title":"short 2–4 word title","contentType":"meme" or "story","cast":"solo" or "group","people":1 or 2 or 3,"hook":"...","twist":"...","punchline":"..."}

CRITICAL: Include at least 2 scripts with contentType "meme" and at least 2 with contentType "story". Never output all 5 as the same type.`;

        let generatedText: string;
        try {
          const result = await callGemini({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: { temperature: 1.1, topP: 0.95, maxOutputTokens: 1200, responseMimeType: "application/json" },
            maxAttempts: 6,
            signal: request.signal,
          });
          generatedText = result.text;
        } catch {
          return Response.json({ scripts: staticFallback(category.id, language.id, exclude), source: "static" });
        }

        try {
          const parsed: unknown = JSON.parse(generatedText);
          const generated = aiOutput(parsed);
          if (generated.length < 3) {
            return Response.json({ scripts: staticFallback(category.id, language.id, exclude), source: "static" });
          }
          // Interleave memes and stories so they alternate in the output,
          // giving the viewer variety instead of all-memes-then-all-stories.
          const memes = generated.filter((g) => g.contentType === "meme");
          const stories = generated.filter((g) => g.contentType === "story");
          const interleaved: GeneratedScript[] = [];
          const [longer, shorter] = memes.length >= stories.length ? [memes, stories] : [stories, memes];
          for (let i = 0; i < longer.length; i++) {
            interleaved.push(longer[i]);
            if (i < shorter.length) interleaved.push(shorter[i]);
          }
          const batchId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
          const scripts = buildScripts(interleaved.slice(0, 5), category.id, language.id, batchId);
          return Response.json({ scripts, source: "ai" });
        } catch {
          return Response.json({ scripts: staticFallback(category.id, language.id, exclude), source: "static" });
        }
      },
    },
  },
});
