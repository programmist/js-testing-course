import { vi, test, expect, describe } from "vitest";

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
