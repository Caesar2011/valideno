import { or } from "./logic.ts";
import { validate, Validator, isString, isInteger } from "../mod.ts";
import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.53.0/testing/asserts.ts";

Deno.test("or (match)", async () => {
  const values: [any, Validator[]][] = [
    ["", [isString, isInteger]],
    [1, [isString, isInteger]],
  ];
  for (const [value, validators] of values) {
    assertEquals(await validate(value, or(...validators)), []);
  }
});

Deno.test("or (no match)", async () => {
  const values: [any, Validator[]][] = [
    [true, [isString, isInteger]],
    [3.1415, [isString, isInteger]],
    [1, [isString]],
  ];
  for (const [value, validators] of values) {
    assertNotEquals(await validate(value, or(...validators)), []);
  }
});
