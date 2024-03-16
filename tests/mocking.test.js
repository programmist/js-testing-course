import { vi, test, expect, describe } from "vitest";
import { getPriceInCurrency, getShippingInfo } from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";

// Mock functions in this imported file (getExchangeRate)
// Note: this is run before the import
vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");

describe("Mocking Demonstrations", () => {
  test("mocking return value", () => {
    const greet = vi.fn();
    greet.mockReturnValue("hello");
    expect(greet()).toBe("hello");
  });

  test("mocking return Promise", async () => {
    const greet = vi.fn();
    greet.mockResolvedValue("hello");
    expect(await greet()).toBe("hello");
  });

  test("mocking implementation", async () => {
    const greet = vi.fn();
    greet.mockImplementation((name) => {
      return `Hello ${name}`;
    });
    expect(await greet("Tony")).toBe("Hello Tony");
  });

  test("detecting mock calls", async () => {
    const greet = vi.fn();
    greet("test");
    expect(greet).toHaveBeenCalledOnce();
    expect(greet).toHaveBeenCalledWith("test");
    greet();
    expect(greet).toHaveBeenCalledTimes(2);
  });
});

describe('getPriceInCurrency"', () => {
  test("should return price in target currency", () => {
    // JS doesn't know this file has been mocked
    // Must use `vi.mocked` so that autocompletion works
    vi.mocked(getExchangeRate).mockReturnValue(1.5);
    const price = getPriceInCurrency(100, "AUD");
    expect(price).toBe(150);
  });
});

describe('getShippingInfo"', () => {
  test("should return the shipping info for the given destination", () => {
    vi.mocked(getShippingQuote).mockReturnValue({
      cost: 99,
      estimatedDays: 15,
    });
    const info = getShippingInfo("RUS");

    // Testing the string literal is too fragile. Use pattern matching
    // expect(info).toEqual("Shipping Cost: $99 (15 Days)");

    expect(info).toMatch("$99");
    expect(info).toMatch("15 Days");
  });

  test("should handle invalid destination", () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);
    const info = getShippingInfo("RUS");
    expect(info).toMatch(/unavailable/i);
  });
});
