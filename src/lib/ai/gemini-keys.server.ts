// Round-robin Gemini API key rotation with automatic failover,
// using the official @google/genai SDK (Google AI Studio API keys).
//
// REQUIRED ENVIRONMENT VARIABLES (server-side only — NO VITE_ prefix):
//   GEMINI_API_KEY_1  ... GEMINI_API_KEY_19
//
// On Vercel, set these 19 variables in Project Settings → Environment Variables.
// They are read from process.env at module load and never exposed to the browser.
// When a key hits a rate limit (429) or fails hard, it is benched for a
// cooldown and the next request moves to the following key, so generation
// keeps running as long as at least one key is healthy.

import { GoogleGenAI } from "@google/genai";

const KEY_COUNT = 19;
const RATE_LIMIT_COOLDOWN_MS = 60_000; // 1 minute for 429s
const HARD_FAILURE_COOLDOWN_MS = 15_000; // shorter bench for transient errors

type KeyState = {
  key: string;
  index: number;
  client: GoogleGenAI;
  benchedUntil: number; // epoch ms; 0 means available
  consecutiveFailures: number;
};

const keys: KeyState[] = [];
for (let i = 1; i <= KEY_COUNT; i++) {
  const value = process.env[`GEMINI_API_KEY_${i}`]?.trim();
  if (value) keys.push({ key: value, index: i, client: new GoogleGenAI({ apiKey: value }), benchedUntil: 0, consecutiveFailures: 0 });
}

// TEMP: log which GEMINI_API_KEY_1..19 are loaded vs undefined
const loaded = keys.map((k) => k.index);
const missing = Array.from({ length: KEY_COUNT }, (_, i) => i + 1).filter((i) => !loaded.includes(i));
console.log(
  `[gemini-keys] ${loaded.length}/${KEY_COUNT} keys active. ` +
    `loaded: [${loaded.join(", ")}]` +
    (missing.length ? ` | missing/undefined: [${missing.join(", ")}]` : "")
);
if (loaded.length === 0) {
  console.warn("[gemini-keys] WARNING: zero keys loaded — check process.env.GEMINI_API_KEY_1..19");
}

let cursor = 0;

export function getGeminiKeyCount(): number {
  return keys.length;
}

// Returns the next available key state, round-robin. Throws if none are configured.
function nextKeyState(now = Date.now()): KeyState {
  if (keys.length === 0) {
    throw new Error("No Gemini API keys configured. Set GEMINI_API_KEY_1..19.");
  }
  for (let attempt = 0; attempt < keys.length; attempt++) {
    const candidate = keys[cursor % keys.length];
    cursor = (cursor + 1) % keys.length;
    if (candidate.benchedUntil <= now) return candidate;
  }
  // Everything is benched: pick the one that comes off cooldown soonest.
  return keys.reduce((a, b) => (a.benchedUntil < b.benchedUntil ? a : b));
}

function reportFailure(state: KeyState, status: number): void {
  state.consecutiveFailures += 1;
  const cooldown = status === 429 ? RATE_LIMIT_COOLDOWN_MS : HARD_FAILURE_COOLDOWN_MS;
  state.benchedUntil = Date.now() + cooldown;
}

function reportSuccess(state: KeyState): void {
  state.consecutiveFailures = 0;
  state.benchedUntil = 0;
}

// Status snapshot for logging/admin UIs.
export function getGeminiKeyStatus(): Array<{
  index: number;
  available: boolean;
  benchedUntil: number | null;
  consecutiveFailures: number;
}> {
  const now = Date.now();
  return keys.map((k) => ({
    index: k.index,
    available: k.benchedUntil <= now,
    benchedUntil: k.benchedUntil > now ? k.benchedUntil : null,
    consecutiveFailures: k.consecutiveFailures,
  }));
}

// Error with an HTTP-ish status extracted from a Gemini SDK failure.
class GeminiCallError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "GeminiCallError";
    this.status = status;
  }
}

function statusFromError(error: unknown): number {
  if (error && typeof error === "object") {
    const e = error as { status?: unknown; code?: unknown; message?: unknown };
    if (typeof e.status === "number") return e.status;
    if (typeof e.code === "number") return e.code;
    const msg = typeof e.message === "string" ? e.message : "";
    if (/401|403|UNAUTHENTICATED|PERMISSION_DENIED/i.test(msg)) return 401;
    if (/429|RESOURCE_EXHAUSTED|rate.?limit/i.test(msg)) return 429;
  }
  return 0;
}

export type GeminiGenerateOptions = {
  model: string;
  contents: Parameters<GoogleGenAI["models"]["generateContent"]>[0]["contents"];
  config?: Parameters<GoogleGenAI["models"]["generateContent"]>[0]["config"];
  // Status codes that should trigger rotation (defaults to 429 and 401/403).
  retryStatuses?: number[];
  maxAttempts?: number;
  signal?: AbortSignal;
};

export type GeminiGenerateResult = {
  text: string;
  usedKeyIndex: number;
};

// Generates content via the official @google/genai SDK, rotating through all
// configured keys on rate-limit/auth failures. Returns the concatenated text
// from the first successful response. Throws GeminiCallError on terminal failure.
export async function callGemini({
  model,
  contents,
  config,
  retryStatuses = [429, 401, 403],
  maxAttempts,
  signal,
}: GeminiGenerateOptions): Promise<GeminiGenerateResult> {
  if (keys.length === 0) {
    throw new GeminiCallError("No Gemini API keys configured. Set GEMINI_API_KEY_1..19.", 500);
  }
  const attempts = maxAttempts ?? Math.min(keys.length, 8);
  let lastError: unknown;
  let lastStatus = 500;

  for (let attempt = 0; attempt < attempts; attempt++) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const state = nextKeyState();
    try {
      const response = await state.client.models.generateContent({ model, contents, config, abortSignal: signal });
      const text = response.text ?? "";
      reportSuccess(state);
      return { text, usedKeyIndex: state.index };
    } catch (error) {
      lastError = error;
      lastStatus = statusFromError(error);
      reportFailure(state, lastStatus);
      if (!retryStatuses.includes(lastStatus)) {
        // Non-retryable: surface immediately.
        throw error instanceof Error ? error : new GeminiCallError(String(error), lastStatus);
      }
    }
  }

  if (lastError instanceof Error) throw lastError;
  throw new GeminiCallError(`All ${attempts} Gemini key attempts failed (last status ${lastStatus}).`, lastStatus);
}

// Generates content and parses the response as JSON. Convenience wrapper.
export async function callGeminiJson<T>(options: GeminiGenerateOptions): Promise<T> {
  const { text } = await callGemini({ ...options, config: { ...options.config, responseMimeType: "application/json" } });
  return JSON.parse(text) as T;
}
