import { describe, expect, test } from "vitest";
import { calculateAvg, factorial, fizzBuzz, max } from "../src/intro";

describe("max", () => {
  test("First argument should be greater", () => {
    expect(max(2, 1)).toEqual(2);
  });

  test("Second argument should be greater", () => {
    expect(max(2, 3)).toBe(3);
  });

  test("Arguments should be equal", () => {
    expect(max(2, 2)).toBe(2);
  });
});

describe("fizzbuzz", () => {
  test("Should return 'Fizz' if arg is be divisible by 3 only", () => {
    expect(fizzBuzz(6)).toBe("Fizz");
  });

  test("Should return 'Buzz' if arg is be divisible by 5 only", () => {
    expect(fizzBuzz(10)).toBe("Buzz");
  });

  test("Should return 'FizzBuzz' if arg is be divisible by 3 and 5", () => {
    expect(fizzBuzz(15)).toBe("FizzBuzz");
  });

  test("Should return string value of arg when arg is divisible by neither 3 nor 5", () => {
    expect(fizzBuzz(11)).toBe("11");
  });
});

describe("arrayAvg", () => {
  test("Should return the average when all values are numbers", () => {
    expect(calculateAvg([1, 2, 3, 4, 5])).toBe(3);
  });

  test("Should return the average when array contains one number", () => {
    expect(calculateAvg([1])).toBe(1);
  });

  test("Should return NaN when the array is empty", () => {
    expect(calculateAvg([])).toBe(NaN);
  });
});

describe("factorial", () => {
  test("Factorial of a negative number should return undefined", () => {
    expect(factorial(-3)).toBeUndefined();
  });

  test("Zero factorial should return 0", () => {
    expect(factorial(0)).toBe(1);
  });

  test("One factorial should return 0", () => {
    expect(factorial(1)).toBe(1);
  });

  test("Two factorial should return 2", () => {
    expect(factorial(2)).toBe(2);
  });

  test("Three factorial should return 6", () => {
    expect(factorial(3)).toBe(6);
  });

  test("Four factorial should return 24", () => {
    expect(factorial(4)).toBe(24);
  });
});
