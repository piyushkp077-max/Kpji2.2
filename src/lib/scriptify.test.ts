import { describe, expect, it } from "vitest";
import { nextScriptBatch, readSavedScripts, reelText, scriptBank, SCRIPT_MAX_WORDS, SCRIPT_MAX_LINE_WORDS, scriptCategories, scriptLanguages, scriptsFor, toggleSavedScript, translateScriptBatch } from "./scriptify";

describe("Scriptify rules", () => {
  it("has more than 150 distinct scripts per language", () => {
    for (const language of scriptLanguages) {
      const all = scriptCategories.flatMap((category) => scriptsFor(category.id, language.id));
      expect(all.length).toBeGreaterThanOrEqual(160);
      expect(new Set(all.map((s) => `${s.hook}|${s.twist}|${s.punchline}`)).size).toBe(all.length);
    }
  });
  it("shows five fresh scripts, including at exhaustion, without overlapping the previous five", () => {
    for (const category of scriptCategories) {
      let seen: string[] = []; let previous: string[] = [];
      const drawn = new Set<string>();
      for (let i = 0; i < 30; i++) {
        const batch = nextScriptBatch(category.id, "hinglish", seen, previous);
        expect(batch.scripts).toHaveLength(5);
        for (const s of batch.scripts) { expect(previous.includes(s.storyId)).toBe(false); drawn.add(s.storyId); }
        seen = batch.seen; previous = batch.scripts.map((s) => s.storyId);
      }
      expect(drawn.size).toBeGreaterThanOrEqual(25);
      const reset = nextScriptBatch(category.id, "hinglish", seen, previous);
      expect(reset.scripts).toHaveLength(5);
      expect(reset.scripts.every((s) => !previous.includes(s.storyId))).toBe(true);
    }
  });
  it("makes each batch majority solo with one two-to-three-person script", () => {
    for (const category of scriptCategories) {
      const batch = nextScriptBatch(category.id, "hindi", []);
      expect(batch.scripts.filter((s) => s.people === 1)).toHaveLength(4);
      expect(batch.scripts.filter((s) => s.people >= 2 && s.people <= 3)).toHaveLength(1);
    }
  });
  it("keeps regional and Arabic versions distinct and timed sections complete", () => {
    for (const language of scriptLanguages) {
      const script = scriptsFor("funny", language.id)[0];
      if (!script) throw new Error("Missing script");
      expect(script.language).toBe(language.id);
      expect(script.hook.length).toBeGreaterThan(0);
      expect(script.twist.length).toBeGreaterThan(0);
      expect(script.punchline.length).toBeGreaterThan(0);
      if (language.id === "arabic") expect(script.hook).toMatch(/[\u0600-\u06ff]/);
      expect(reelText(script)).toContain(script.hook);
      expect(reelText(script)).toContain(script.twist);
      expect(reelText(script)).toContain(script.punchline);
    }
  });
  it("keeps every script to three short lines and at most 40 spoken words for 15–20 seconds", () => {
    expect(SCRIPT_MAX_WORDS).toBe(40);
    expect(SCRIPT_MAX_LINE_WORDS).toBe(14);
    for (const script of scriptBank) {
      const lines = [script.hook, script.twist, script.punchline];
      expect(lines).toHaveLength(3);
      for (const line of lines) {
        expect(line).not.toMatch(/[\r\n]/);
        expect(line.trim().split(/\s+/).length).toBeLessThanOrEqual(14);
      }
      expect(lines.join(" ").trim().split(/\s+/).length).toBeLessThanOrEqual(40);
    }
  });
  it("switches all five translations instantly without changing their story IDs", () => {
    const batch = nextScriptBatch("puneet", "hinglish", []).scripts;
    for (const language of scriptLanguages) {
      const translated = translateScriptBatch(batch, language.id);
      expect(translated.map((s) => s.storyId)).toEqual(batch.map((s) => s.storyId));
      expect(translated.every((s) => s.language === language.id)).toBe(true);
      expect(translated.map((s) => s.hook)).toEqual(translateScriptBatch(translated, language.id).map((s) => s.hook));
      if (language.id !== "hinglish") expect(translated.map((s) => s.hook)).not.toEqual(batch.map((s) => s.hook));
    }
  });
  it("persists saved script text and toggles it off without duplicates", () => {
    const script = scriptsFor("funny", "arabic")[0];
    if (!script) throw new Error("Missing script");
    const saved = toggleSavedScript([], script);
    expect(readSavedScripts(JSON.stringify(saved))).toEqual([script]);
    expect(toggleSavedScript(saved, script)).toEqual([]);
    expect(readSavedScripts('[{"id":"broken"}]')).toEqual([]);
    expect(readSavedScripts("broken")).toEqual([]);
  });
  it("exports the complete spoken script as one continuous paragraph", () => {
    for (const script of scriptBank) {
      expect(reelText(script)).toBe([script.hook, script.twist, script.punchline].join(" "));
      expect(reelText(script)).not.toMatch(/[\r\n]/);
    }
  });
});