import { isNumber, isInteger } from "./number.ts";
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
    assertEquals(await validate(value, isNumber), []);
  }
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
    assertNotEquals(await validate(value, isNumber), []);
  }
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
    assertEquals(await validate(value, isInteger), []);
  }
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
    assertNotEquals(await validate(value, isInteger), []);
  }
});
