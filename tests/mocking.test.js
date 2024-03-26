import { vi, test, expect, describe } from "vitest";
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";
import { sendEmail } from "../src/libs/email";
import security from "../src/libs/security";

// Mock functions in this imported file (getExchangeRate)
// Note: this is run before the import
vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");
vi.mock("../src/libs/email", async(importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

describe("Mocking Demonstrations", () => {
  test("mocking return value", () => {
    const greet = vi.fn();
    greet.mockReturnValue("hello");
    expect(greet()).toBe("hello");
  });

  test("mocking return Promise", async() => {
    const greet = vi.fn();
    greet.mockResolvedValue("hello");
    expect(await greet()).toBe("hello");
  });

  test("mocking implementation", async() => {
    const greet = vi.fn();
    greet.mockImplementation((name) => {
      return `Hello ${name}`;
    });
    expect(await greet("Tony")).toBe("Hello Tony");
  });

  test("detecting mock calls", async() => {
    const greet = vi.fn();
    greet("test");
    expect(greet).toHaveBeenCalledOnce();
    expect(greet).toHaveBeenCalledWith("test");
    greet();
    expect(greet).toHaveBeenCalledTimes(2);
  });
});

describe("getPriceInCurrency\"", () => {
  test("should return price in target currency", () => {
    // JS doesn't know this file has been mocked
    // Must use `vi.mocked` so that autocompletion works
    vi.mocked(getExchangeRate).mockReturnValue(1.5);
    const price = getPriceInCurrency(100, "AUD");
    expect(price).toBe(150);
  });
});

describe("getShippingInfo\"", () => {
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
  test("should return correct content", async() => {
    const result = await renderPage();
    expect(result).toMatch(/content/i);
  });

  test("should return correct content", async() => {
    await renderPage();
    expect(trackPageView).toHaveBeenCalledWith("/home");
  });
});

describe("submitOrder", () => {
  test("should successfully submit order when given correct info", async() => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });
    const order = { totalAmount: 10 };
    const cc = { creditCardNumber: "123-456-789" };

    const result = await submitOrder(order, cc);

    expect(result).toMatchObject({ success: true });
    expect(charge).toHaveBeenCalledWith(cc, order.totalAmount);
  });

  test("should handle failed payment result", async() => {
    vi.mocked(charge).mockResolvedValue({ status: "failed" });
    const result = await submitOrder({}, {});
    expect(result).toMatchObject({ success: false, error: "payment_error" });
  });

  // TODO: Adding Typescript makes this unnecessary
  test("should handle incorrect order object type", () => {});
  test("should handle incorrect payment object type", () => {});
});

describe("signUp", () => {
  const email = "email@domain.com";

  // Not necessary - just use vitest. config.
  // beforeEach(() => {
  //   vi.mocked(sendEmail).mockClear();
  // });

  test("should return false if email is not valid", async() => {
    const result = await signUp("123");
    expect(result).toBe(false);
  });

  test("should return true if email is` valid", async() => {
    const result = await signUp(email);
    expect(result).toBe(true);
  });

  test("should send welcome email email is` valid", async() => {
    await signUp(email);

    // Attempt #1. Can do better
    // expect(sendEmail).toHaveBeenCalledWith(email, "Welcome aboard!");

    // Attempt #2
    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(sendEmail).toHaveBeenCalledOnce();
    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/welcome/i);
  });
});

describe("login", () => {
  test("should email onetime login code", async() => {
    const email = "test@example.com";
    const spy = vi.spyOn(security, "generateCode");

    await login(email);

    const code = spy.mock.results[0].value.toString();
    expect(sendEmail).toHaveBeenCalledWith(email, `${code}`);
    expect(spy).toHaveBeenCalledOnce();
  });
});

describe("isOnline", () => {
  test("should show online if within available hours", () => {
    vi.setSystemTime("2024-03-25 07:59");
    expect(isOnline()).toBe(false);

    vi.setSystemTime("2024-03-25 20:01");
    expect(isOnline()).toBe(false);
  });

  test("should show not online if outside available hours", () => {
    vi.setSystemTime("2024-03-25 08:00");
    expect(isOnline()).toBe(true);

    vi.setSystemTime("2024-03-25 19:59");
    expect(isOnline()).toBe(true);
  });
});

describe("getDiscount", () => {
  test("should return 20% discount if date is Christmas day", () => {
    vi.setSystemTime("2023-12-25 00:01");
    expect(getDiscount()).toBe(0.2);

    vi.setSystemTime("2023-12-25 23:59");
    expect(getDiscount()).toBe(0.2);
  });

  test("should return 0% discount if date is not Christmas day", () => {
    vi.setSystemTime("2023-12-24 23:59");
    expect(getDiscount()).toBe(0);

    vi.setSystemTime("2023-12-26 00:01");
    expect(getDiscount()).toBe(0);
  });
});
