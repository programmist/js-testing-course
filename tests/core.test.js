import { describe, expect, test } from "vitest";
import {
  calculateDiscount,
  canDrive,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  validateUserInput,
} from "../src/core";

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
  // FIXME: Typescript makes this obsolete
  test("should handle non-numeric price", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/gi);
  });

  test("should handle when price <= 0", () => {
    expect(calculateDiscount(0, "SAVE10")).toMatch(/invalid/gi);
    expect(calculateDiscount(-1, "SAVE10")).toMatch(/invalid/gi);
  });

  // FIXME: Typescript makes this obsolete
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

describe("validateUserInput", () => {
  test("should validate successfully when given valid user name", () => {
    expect(validateUserInput("tlc", 18)).toMatch(/successful/gi);
  });

  // FIXME: Typescript makes this obsolete
  test("should handle non-string username", () => {
    expect(validateUserInput(0xcafebabe, 30)).toMatch(/invalid/gi);
  });

  test("should handle username < 3 chars", () => {
    expect(validateUserInput("tl", 18)).toMatch(/invalid/gi);
  });

  test("should handle username > 255 chars", () => {
    expect(validateUserInput("t".repeat(256), 18)).toMatch(/invalid/gi);
  });

  // FIXME: Typescript makes this obsolete
  test("should handle non-numeric age", () => {
    expect(validateUserInput("tlc", "18")).toMatch(/invalid/gi);
  });

  test("should handle age < 18", () => {
    expect(validateUserInput("tlc", 17)).toMatch(/invalid/gi);
  });

  test("should handle age > 100", () => {
    expect(validateUserInput("tlc", 101)).toMatch(/invalid/gi);
  });

  test("should handle both username and age are invalid", () => {
    const result = validateUserInput("a", 1);
    expect(result).toMatch(/invalid username/gi);
    expect(result).toMatch(/invalid age/gi);
  });
});

describe("isPriceInRange", () => {
  test("should return false when price is not in range", () => {
    expect(isPriceInRange(6, 0, 5)).toBe(false);
    expect(isPriceInRange(-6, 0, 5)).toBe(false);
  });

  test("should return true when price is at boundary", () => {
    expect(isPriceInRange(5, 0, 5)).toBe(true);
    expect(isPriceInRange(0, 0, 5)).toBe(true);
  });

  test("should return true when price is in range", () => {
    expect(isPriceInRange(4, 0, 5)).toBe(true);
  });
});

describe("isValidUsername", () => {
  const minLength = 5;
  const maxLength = 15;
  test("should return false when length of username is out of valid range", () => {
    expect(isValidUsername("a".repeat(minLength - 1))).toBe(false);
    expect(isValidUsername("a".repeat(maxLength + 1))).toBe(false);
  });

  test("should return true when length of username is within valid range", () => {
    expect(isValidUsername("a".repeat((minLength + maxLength) / 2))).toBe(true);
  });

  test("should return true when length of username is exactly the min or max of valid range", () => {
    expect(isValidUsername("a".repeat(minLength))).toBe(true);
    expect(isValidUsername("a".repeat(maxLength))).toBe(true);
  });

  // FIXME: Typescript makes this obsolete
  test("should return false when username is invalid type", () => {
    expect(isValidUsername()).toBe(false);
    expect(isValidUsername(1)).toBe(false);
    expect(isValidUsername(" ".repeat(minLength + 1))).toBe(false);
  });
});

describe("canDrive", () => {
  test.each([
    { age: 17, country: "US", result: true },
    { age: 16, country: "US", result: true },
    { age: 15, country: "US", result: false },
    { age: 18, country: "UK", result: true },
    { age: 17, country: "UK", result: true },
    { age: 16, country: "UK", result: false },
  ])("should return $result for $age, $country", ({ age, country, result }) => {
    expect(canDrive(age, country)).toBe(result);
  });

  test("should handle invalid country code", () => {
    expect(canDrive(18, "XX")).toMatch(/invalid/i);
  });
});
