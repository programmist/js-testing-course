import { describe, expect, test } from "vitest";
import { getCoupons } from "../src/core";

describe("getCoupons", () => {
  test("should return an array of coupons", () => {
    const result = getCoupons();
    expect(result).instanceOf(Array);
    expect(result.length).greaterThan(0);
  });

  test("should return an array of valid coupon codes", () => {
    const result = getCoupons();
    result.forEach((item) => {
      expect(item).toHaveProperty("code");
      expect(item.code).toBeTypeOf("string");
      expect(item.code).toBeTruthy();
    });
  });

  test("should return an array of valid discounts", () => {
    const result = getCoupons();
    result.forEach((item) => {
      expect(item).toHaveProperty("discount");
      expect(item.discount).toBeTypeOf("number");
      expect(item.discount).toBeGreaterThan(0);
      expect(item.discount).toBeLessThan(1);
    });
  });
});
