import { describe, expect, test, it } from "vitest";
import { fizzBuzz, max } from "../src/intro";

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
