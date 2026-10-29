import { describe, expect, it } from "vitest";
import { SPLASH_DURATION_MS } from "./splash-settings";

describe("startup timing", () => {
  it("dismisses automatically after two seconds", () => {
    expect(SPLASH_DURATION_MS).toBe(2000);
  });
});