import { describe, expect, it } from "vitest";
import { khazanaCategories, localDay, scriptsForCategory, scriptText, shuffledScripts } from "./meme-khazana";

describe("Khazana story rotation", () => {
  it("features funny scripts first and gives every category complete unique scripts", () => {
    expect(khazanaCategories[0].id).toBe("funny");
    for (const category of khazanaCategories) {
      const scripts = scriptsForCategory(category.id);
      expect(scripts.length).toBeGreaterThanOrEqual(54);
      expect(new Set(scripts.map((script) => script.id)).size).toBe(scripts.length);
      for (const script of scripts) {
        expect(script.hook.length).toBeGreaterThan(80);
        expect(script.twist.length).toBeGreaterThan(80);
        expect(script.punchline.length).toBeGreaterThan(80);
      }
    }
  });
  it("rotates daily and keeps every variation in the deck without duplicates", () => {
    const today = shuffledScripts("funny", "2026-10-16");
    expect(today).toEqual(shuffledScripts("funny", "2026-10-16"));
    expect(today).not.toEqual(shuffledScripts("funny", "2026-10-17"));
    expect(today).not.toEqual(shuffledScripts("funny", "2026-10-16", 1));
    expect(today.length).toBe(scriptsForCategory("funny").length);
    expect(new Set(today.map((script) => script.id)).size).toBe(today.length);
    expect(new Set(today.slice(0, 5).map((script) => script.title)).size).toBe(5);
  });
  it("copies all timed sections and uses the visitor's local date", () => {
    const script = scriptsForCategory("funny")[0];
    if (!script) throw new Error("Missing funny scripts");
    const text = scriptText(script);
    expect(text).toContain("Hook (0–10s)");
    expect(text).toContain("Twist (10–20s)");
    expect(text).toContain("Punchline (20–30s)");
    expect(localDay(new Date(2026, 9, 16))).toBe("2026-10-16");
  });
});