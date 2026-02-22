import { describe, expect, it } from "vitest";
import { normalizePhone } from "../lib/normalizePhone";

describe("normalizePhone", () => {
  it.each([
    ["0812-333-444", "0812333444"],
    ["+62 812 333 444", "0812333444"],
    ["62812333444", "0812333444"]
  ])("normalizes %s", (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
  });

  it.each(["", "   ", "abc", "+1-234"])(
    "returns null for invalid input: %s",
    (input) => {
      expect(normalizePhone(input)).toBeNull();
    }
  );
});
