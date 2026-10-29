import { scriptifyScenes } from "./scriptify-scenes";

export const scriptCategories = [
  { id: "funny", label: "Viral Funny Scripts", emoji: "🔥" },
  { id: "puneet", label: "Puneet Style Solo Reels", emoji: "🤪" },
  { id: "love", label: "Love & Dating Twists", emoji: "💕" },
  { id: "friendzone", label: "Friendzone & Bro-zone Tales", emoji: "💔" },
  { id: "daily", label: "Daily Relatable Memes & Jokes", emoji: "🤣" },
] as const;
export const scriptLanguages = [
  { id: "bihari", label: "Bihari", emoji: "🌾" },
  { id: "desi", label: "Desi Theth / Haryanvi Roast", emoji: "🔥" },
  { id: "hinglish", label: "Hinglish", emoji: "💬" },
  { id: "hindi", label: "Hindi", emoji: "🇮🇳" },
  { id: "arabic", label: "Arabic Vibe", emoji: "🌍" },
] as const;
export type ScriptCategory = typeof scriptCategories[number]["id"];
export type ScriptLanguage = typeof scriptLanguages[number]["id"];
export type ReelScript = { id: string; storyId: string; category: ScriptCategory; language: ScriptLanguage; title: string; cast: "solo" | "group"; people: number; hook: string; twist: string; punchline: string };
export const SCRIPT_BATCH_SIZE = 5;
export const SAVED_SCRIPTS_KEY = "scriptify-saved-scripts";
export const SCRIPT_MAX_WORDS = 40;
export const SCRIPT_MAX_LINE_WORDS = 14;

function regional(text: string, language: ScriptLanguage): string {
  if (language === "bihari") return "भइया, " + text.replace(/मैंने/g, "हमने").replace(/मुझे/g, "हमके").replace(/मेरा/g, "हमार").replace(/मेरी/g, "हमार").replace(/मैं /g, "हम ").replace(/तुम्हारा/g, "तोहार").replace(/तुम्हारी/g, "तोहार").replace(/ है/g, " बा").replace(/ हूँ/g, " बानी").replace(/बोली/g, "बोलीं");
  if (language === "desi") return "भाई, " + text.replace(/मुझे/g, "मन्ने").replace(/मैंने/g, "मन्ने").replace(/तुम्हारा/g, "तेरा").replace(/तुम्हारी/g, "तेरी").replace(/ है/g, " सै").replace(/ हैं/g, " सैं").replace(/यह /g, "यो ").replace(/अब /g, "इब ").replace(/बहुत/g, "घणा").replace(/क्यों/g, "क्यूँ");
  return text;
}

export function scriptsFor(category: ScriptCategory, language: ScriptLanguage): ReelScript[] {
  return scriptifyScenes.filter((scene) => scene.category === category).map((scene, sceneIndex) => {
      const source = language === "arabic" ? scene.arabic : language === "hinglish" ? scene.hinglish : scene.hindi;
      const parts = source.map((text) => regional(text, language));
      const storyId = `short-v2-${category}-${sceneIndex}`;
      return { id: `${storyId}-${language}`, storyId, category, language, title: scene.title, cast: scene.cast, people: scene.cast === "solo" ? 1 : category === "friendzone" && sceneIndex < 28 ? 3 : 2, hook: parts[0] ?? "", twist: parts[1] ?? "", punchline: parts[2] ?? "" };
  });
}

// Materialize the full 160-scene bank once; language changes only select translations.
export const scriptBank: ReelScript[] = scriptLanguages.flatMap((language) => scriptCategories.flatMap((category) => scriptsFor(category.id, language.id)));

export function translateScriptBatch(scripts: ReelScript[], language: ScriptLanguage): ReelScript[] {
  return scripts.map((script) => scriptBank.find((item) => item.storyId === script.storyId && item.language === language) ?? script);
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const a = copy[i]; const b = copy[j];
    if (a !== undefined && b !== undefined) { copy[i] = b; copy[j] = a; }
  }
  return copy;
}

export function nextScriptBatch(category: ScriptCategory, language: ScriptLanguage, seen: string[], previous: string[] = [], random = Math.random): { scripts: ReelScript[]; seen: string[] } {
  const pool = scriptBank.filter((script) => script.category === category && script.language === language);
  let history = new Set(seen);
  let available = pool.filter((script) => !history.has(script.storyId) && !previous.includes(script.storyId));
  // Every batch contains four solo scripts and one easy group script. Reset only after exhaustion.
  if (available.filter((s) => s.cast === "solo").length < 4 || !available.some((s) => s.cast === "group")) {
    history = new Set();
    available = pool.filter((script) => !previous.includes(script.storyId));
  }
  // Fisher–Yates gives a true unbiased shuffle, unlike a random sort comparator.
  const solo = shuffle(available.filter((s) => s.cast === "solo"), random);
  const selected: ReelScript[] = [];
  // Prefer distinct topics without discarding unseen variations.
  for (const script of solo) if (!selected.some((s) => s.title === script.title) && selected.length < 4) selected.push(script);
  for (const script of solo) if (!selected.some((s) => s.id === script.id) && selected.length < 4) selected.push(script);
  const group = shuffle(available.filter((s) => s.cast === "group"), random)[0];
  if (group) selected.push(group);
  selected.forEach((script) => history.add(script.storyId));
  return { scripts: selected, seen: [...history] };
}

export function reelText(script: ReelScript): string {
  return [script.hook, script.twist, script.punchline].join(" ").replace(/\s+/g, " ").trim();
}

export function readSavedScripts(value: string | null): ReelScript[] {
  try {
    const parsed: unknown = JSON.parse(value ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is ReelScript => !!item && typeof item === "object" && typeof item.id === "string" && typeof item.storyId === "string" && typeof item.title === "string" && typeof item.hook === "string" && typeof item.twist === "string" && typeof item.punchline === "string" && scriptLanguages.some((l) => l.id === item.language) && scriptCategories.some((c) => c.id === item.category) && (item.cast === "solo" || item.cast === "group") && [1, 2, 3].includes(item.people));
  } catch { return []; }
}

export function toggleSavedScript(saved: ReelScript[], script: ReelScript): ReelScript[] {
  return saved.some((item) => item.id === script.id) ? saved.filter((item) => item.id !== script.id) : [script, ...saved];
}