// Lesson: Writing your first tests
export function max(a, b) {
  return a > b ? a : b;
}

// Exercise
export function fizzBuzz(n) {
  if (n % 3 === 0 && n % 5 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return n.toString();
}

export function calculateAvg(arr) {
  if (arr.length === 0) return NaN;
  return arr.reduce((acc, val) => acc + val, 0) / arr.length;
}

export function factorial(n) {
  if (n < 0) return undefined;
  if (n < 2) return 1;
  return n * factorial(n - 1);
}
