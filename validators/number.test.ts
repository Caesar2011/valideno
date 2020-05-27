import { isNumber, isInteger, isInRange, hasParity } from "./number.ts";
import { validate } from "../mod.ts";
import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.53.0/testing/asserts.ts";

Deno.test("isNumber (match)", async () => {
  const values = [
    undefined,
    null,
    0,
    1,
    2e64,
    -1,
    0.1,
    Math.PI,
  ];
  for (const value of values) {
    assertEquals(await validate(value, isNumber()), []);
  }
  assertEquals(await validate(NaN, isNumber({ allowNaN: true })), []);
});

Deno.test("isNumber (no match)", async () => {
  const values = [
    NaN,
    "0",
    true,
    false,
    () => {},
    function named() {},
    new Object(),
    Symbol(),
  ];
  for (const value of values) {
    assertNotEquals(await validate(value, isNumber()), []);
  }
  assertNotEquals(await validate(NaN, isNumber({ allowNaN: false })), []);
});

Deno.test("isInteger (match)", async () => {
  const values = [
    undefined,
    null,
    0,
    1,
    2e64,
    -1,
  ];
  for (const value of values) {
    assertEquals(await validate(value, isInteger()), [], String(value));
  }
  assertEquals(
    await validate(NaN, isInteger({ allowNaN: true })),
    [],
    String(NaN),
  );
});

Deno.test("isInteger (no match)", async () => {
  const values = [
    NaN,
    "0",
    true,
    false,
    () => {},
    function named() {},
    new Object(),
    Symbol(),
    0.1,
  ];
  for (const value of values) {
    assertNotEquals(await validate(value, isInteger()), [], String(value));
  }
  assertNotEquals(
    await validate(NaN, isInteger({ allowNaN: false })),
    [],
    String(NaN),
  );
});

Deno.test("isInRange (match)", async () => {
  const values: [number[], object][] = [
    [[10.5, 11], { greaterThan: 10 }],
    [[10, 10.5, 11], { greaterThanOrEqualTo: 10 }],
    [[10], { equalTo: 10 }],
    [[9.5, 9], { lessThan: 10 }],
    [[10, 9.5, 9], { lessThanOrEqualTo: 10 }],
    [[11, 11.5], { greaterThan: 10, lessThan: 12 }],
    [[10, 11, 11.5], { greaterThanOrEqualTo: 10, lessThan: 12 }],
    [[NaN], { allowNaN: true }],
  ];
  for (const [vals, options] of values) {
    for (const value of vals) {
      assertEquals(
        await validate(value, isInRange(options)),
        [],
        `${String(value)} - ${JSON.stringify(options)}`,
      );
    }
  }
});

Deno.test("isInRange (no match)", async () => {
  const values: [number[], any][] = [
    [[8.5, 9, 10], { greaterThan: 10 }],
    [[8.5, 9], { greaterThanOrEqualTo: 10 }],
    [[9, 9.5, 11], { equalTo: 10 }],
    [[10, 10.5, 11], { lessThan: 10 }],
    [[10.5, 11], { lessThanOrEqualTo: 10 }],
    [[9.5, 10, 12, 13], { greaterThan: 10, lessThan: 12 }],
    [[9.5, 12, 13], { greaterThanOrEqualTo: 10, lessThan: 12 }],
    [[NaN], { allowNaN: false }],
    [[NaN], {}],
  ];
  for (const [vals, options] of values) {
    for (const value of vals) {
      assertNotEquals(
        await validate(value, isInRange(options)),
        [],
        `${String(value)} - ${JSON.stringify(options)}`,
      );
    }
  }
});

Deno.test("hasParity (match)", async () => {
  const values: [number[], object][] = [
    [[-2, -1, 0, 1, 2, 3, 4, 5, 6], {}],
    [[-2, 0, 2, 4, 6], { odd: false }],
    [[-1, 1, 3, 5], { even: false }],
    [[0, 3, 6], { divisibleBy: 3 }],
    [[], { odd: false, even: false }],
    [[0, 6], { odd: false, divisibleBy: 3 }],
    [[3], { even: false, divisibleBy: 3 }],
    [[NaN], { allowNaN: true }],
  ];
  for (const [vals, options] of values) {
    for (const value of vals) {
      assertEquals(
        await validate(value, hasParity(options)),
        [],
        `${String(value)} - ${JSON.stringify(options)}`,
      );
    }
  }
});

Deno.test("hasParity (no match)", async () => {
  const values: [number[], any][] = [
    [[], {}],
    [[-1, 1, 3, 5], { odd: false }],
    [[-2, 0, 2, 4, 6], { even: false }],
    [[-2, -1, 1, 2, 4, 5], { divisibleBy: 3 }],
    [[-2, -1, 0, 1, 2, 3, 4, 5, 6], { odd: false, even: false }],
    [[-2, -1, 1, 2, 3, 4, 5], { odd: false, divisibleBy: 3 }],
    [[-2, -1, 0, 1, 2, 4, 5, 6], { even: false, divisibleBy: 3 }],
    [[NaN], { allowNaN: false }],
    [[NaN], {}],
    [[0.5], {}],
  ];
  for (const [vals, options] of values) {
    for (const value of vals) {
      assertNotEquals(
        await validate(value, hasParity(options)),
        [],
        `${String(value)} - ${JSON.stringify(options)}`,
      );
    }
  }
});
