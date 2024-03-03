import { describe, expect, test, it } from "vitest";
import { max } from "../src/intro";

describe("max", () => {
  test("First agrument shoud be greater", () => {
    expect(max(2, 1)).toEqual(2);
  });

  test("Second agrument shoud be greater", () => {
    expect(max(2, 3)).toBe(3);
  });

  test("Agruments should be equal", () => {
    expect(max(2, 2)).toBe(2);
  });
});
