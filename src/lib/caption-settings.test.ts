import { describe, expect, test } from "vitest";
import { captionInput, captionLanguages, captionToneInstruction, globalCategories, globalCategoryFor, limitCaptions, MAX_CAPTIONS, MIN_CAPTIONS } from "./caption-settings";

describe("caption generation settings", () => {
  test.each(["शुद्ध हिंदी", "ठेठी / देसी स्लैंग"])("accepts %s for a single text prompt", (language) => {
    const result = captionInput.safeParse({ kind: "prompt", prompt: "A sunset by the sea", language });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.language).toBe(language);
  });
  test("text generation requires a nonempty prompt", () => {
    expect(captionInput.safeParse({ kind: "prompt", prompt: " ", language: "शुद्ध हिंदी" }).success).toBe(false);
  });
  test("media generation still accepts images and requires them", () => {
    expect(captionInput.safeParse({ kind: "photo", images: ["data:image/jpeg;base64,abc"], language: "शुद्ध हिंदी" }).success).toBe(true);
    expect(captionInput.safeParse({ kind: "video", images: [], language: "शुद्ध हिंदी" }).success).toBe(false);
  });
  test("legacy categories stay available alongside Roast", () => {
    expect(globalCategories[0]).toBe("Roast");
    expect(globalCategoryFor("Attitude")).toBe("Attitude");
    expect(globalCategoryFor("Instagram Reels")).toBe("Instagram Reels");
    expect(globalCategoryFor("Life")).toBe("Life");
    expect(captionInput.safeParse({ kind: "prompt", prompt: "Training", language: "शुद्ध हिंदी", category: "Gym & Fitness" }).success).toBe(true);
    expect(captionInput.safeParse({ kind: "prompt", prompt: "Training", language: "शुद्ध हिंदी", category: "Attitude" }).success).toBe(true);
  });
  test.each(["Hinglish", "English", "العربية", "Français", "Español", "Deutsch", "Italiano", "शुद्ध हिंदी", "ठेठी / देसी स्लैंग"])("accepts front-facing language %s for text and media", (language) => {
    expect(captionLanguages).toContain(language);
    for (const kind of ["prompt", "photo", "video"]) expect(captionInput.safeParse({ kind, prompt: "Sunset", images: ["data:image/jpeg;base64,abc"], language }).success).toBe(true);
  });
  test.each(["Attitude", "Friendship", "Romantic", "Love", "Lifestyle", "Party", "Instagram Reels", "Motivation", "Sad", "Life", "Friends", "Single/Breakup", "Daily Quotes"])("restores category %s", (category) => {
    expect(globalCategories).toContain(category);
    expect(captionInput.safeParse({ kind: "prompt", prompt: "A moment", language: "English", category }).success).toBe(true);
  });
  test("international tones respect the requested language in Roast Mode", () => {
    expect(captionToneInstruction("English", "Roast")).toContain("fluent English");
    expect(captionToneInstruction("Hinglish", "Roast")).toContain("Latin script");
    expect(captionToneInstruction("العربية", "Roast")).toContain("Arabic script");
    expect(captionToneInstruction("Français", "Roast")).toContain("French");
  });
  test.each(["prompt", "photo", "video"])("%s results cannot exceed three captions", (kind) => {
    const input = { kind, prompt: "Sunset", images: ["data:image/jpeg;base64,abc"], language: "शुद्ध हिंदी" };
    expect(captionInput.safeParse(input).success).toBe(true);
    expect(MAX_CAPTIONS).toBe(3);
    expect(MIN_CAPTIONS).toBe(2);
    expect(limitCaptions([1, 2, 3, 4, 5])).toEqual([1, 2, 3]);
  });
  test("Desi Roast permits raw regional profanity without applying it to other categories", () => {
    expect(captionInput.safeParse({ kind: "prompt", prompt: "A fictional braggart", language: "ठेठी / देसी स्लैंग", category: "Roast" }).success).toBe(true);
    expect(captionToneInstruction("ठेठी / देसी स्लैंग", "Roast")).toContain("uncensored non-hateful swear words");
    expect(captionToneInstruction("ठेठी / देसी स्लैंग", "Gym & Fitness")).not.toContain("uncensored non-hateful swear words");
    expect(captionToneInstruction("शुद्ध हिंदी", "Roast")).toContain("no slang or swear words");
  });
});