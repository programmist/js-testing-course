import { describe, expect, test } from "vitest";
import { calculateDiscount, getCoupons } from "../src/core";

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

describe("calculateDiscount", () => {
  test("should handle non-numeric price", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/gi);
  });

  test("should handle when price <= 0", () => {
    expect(calculateDiscount(0, "SAVE10")).toMatch(/invalid/gi);
    expect(calculateDiscount(-1, "SAVE10")).toMatch(/invalid/gi);
  });

  test("should handle non-string discount code", () => {
    expect(calculateDiscount(10, 99)).toMatch(/invalid/gi);
  });

  test("should return discounted price when given valid code", () => {
    expect(calculateDiscount(100, "SAVE10")).toBe(90);
    expect(calculateDiscount(100, "SAVE20")).toBe(80);
  });

  test("should handle invalid discount code", () => {
    expect(calculateDiscount(100, "INVALID")).toBe(100);
    expect(calculateDiscount(100, "")).toBe(100);
  });
});
