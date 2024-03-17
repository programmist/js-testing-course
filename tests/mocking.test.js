import { vi, test, expect, describe } from "vitest";
import {
  getPriceInCurrency,
  getShippingInfo,
  renderPage,
  submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";

// Mock functions in this imported file (getExchangeRate)
// Note: this is run before the import
vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");

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

describe("renderPage", () => {
  test("should return correct content", async () => {
    const result = await renderPage();
    expect(result).toMatch(/content/i);
  });

  test("should return correct content", async () => {
    await renderPage();
    expect(trackPageView).toHaveBeenCalledWith("/home");
  });
});

describe("submitOrder", () => {
  test("should successfully submit order when given correct info", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });
    const order = { totalAmount: 10 };
    const cc = { creditCardNumber: "123-456-789" };

    const result = await submitOrder(order, cc);

    expect(result).toMatchObject({ success: true });
    expect(charge).toHaveBeenCalledWith(cc, order.totalAmount);
  });

  test("should handle failed payment result", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "failed" });
    const result = await submitOrder({}, {});
    expect(result).toMatchObject({ success: false, error: "payment_error" });
  });

  // TODO: Adding Typescript makes this unnecessary
  test("should handle incorrect order object type", () => {});
  test("should handle incorrect payment object type", () => {});
});
