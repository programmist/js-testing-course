import { describe, expect, test, beforeEach, beforeAll } from "vitest";
import {
  Stack,
  calculateDiscount,
  canDrive,
  fetchData,
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
  const min = 0;
  const max = 100;
  test.each([
    { scenario: "min < price < max", price: 50, result: true },
    { scenario: "price == min", price: 0, result: true },
    { scenario: "price == max", price: 100, result: true },
    { scenario: "price > max", price: 101, result: false },
    { scenario: "price < min", price: -1, result: false },
  ])(
    `should return $result when $scenario (price: $price, min: ${min}, max: ${max})`,
    ({ price, result }) => {
      expect(isPriceInRange(price, 0, 100)).toBe(result);
    }
  );
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

describe("fetchData", () => {
  test("should return an array of numbers", async() => {
    const r1 = await fetchData(1);
    expect(r1).instanceOf(Array);
    expect(r1.length).toBe(1);

    const r2 = await fetchData(5);
    expect(r2).instanceOf(Array);
    expect(r2.length).toBe(5);
  });

  test("should handle invalid count", async() => {
    try {
      await fetchData(0);
    } catch (error) {
      expect(error.reason).toHaveProperty("reason");
      expect(error.reason).toMatch(/fail/i);
    }
  });
});

describe("Stack test suite", () => {
  beforeAll(() => {
    console.log("beforeAll called");
  });
  beforeEach(() => {
    console.log("beforeEach called");
  });

  test("should 1", () => {});
  test("should 2", () => {});
});

describe("Stack", () => {
  let stack;
  beforeEach(() => {
    stack = new Stack();
  });

  test("should throw error on empty stack pop", () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  test("should throw error on empty stack peek", () => {
    expect(() => stack.peek()).toThrow(/empty/i);
  });

  test("should add item to the stack", () => {
    stack.push(5);

    expect(stack.size()).toBe(1);
  });

  test("pop should remove and return item from the top of stack", () => {
    stack.push(5);
    stack.push(6);

    const poppedItem = stack.pop();

    expect(poppedItem).toBe(6);
    expect(stack.size()).toBe(1);
  });

  test("peek should return item from the top of stack", () => {
    stack.push(5);
    stack.push(6);

    expect(stack.peek()).toBe(6);
    expect(stack.size()).toBe(2);
    stack.pop();
    expect(stack.peek()).toBe(5);
    expect(stack.size()).toBe(1);
  });

  test("clear should remove all items from stack", () => {
    stack.push(5);
    stack.push(6);
    stack.push(7);

    expect(stack.size()).toBe(3);
    stack.clear();
    expect(stack.size()).toBe(0);
  });

  test("isEmpty should return true when stack is empty", () => {
    expect(stack.size()).toBe(0);
    expect(stack.isEmpty()).toBe(true);
  });

  test("isEmpty should return false when stack is not empty", () => {
    stack.push(5);
    expect(stack.size()).toBe(1);
    expect(stack.isEmpty()).toBe(false);
  });
});
