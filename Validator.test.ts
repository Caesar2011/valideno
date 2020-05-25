import { assertEquals, assertNotEquals } from "https://deno.land/std@0.53.0/testing/asserts.ts";
import {
  validate, Validatable, ArraySymbol,
  isString
} from "./mod.ts";

Deno.test("validate schema (match)", async () => {
  const values: [any, Validatable][] = [
    ["string", isString],
    ["string", [isString]],
    [["arr", "ay"], {[ArraySymbol]: isString}],
    [{foo: "bar", lorem: "ipsum"}, {foo: isString, lorem: [isString]}],
  ];
  for (const [value, constraints] of values) {
    assertEquals([], await validate(value, constraints));
  }
});

Deno.test("validate schema (no match)", async () => {
  const values: [any, Validatable][] = [
    [6, isString],
    [false, [isString]],
    [["arr", ["ay"]], {[ArraySymbol]: isString}],
    [{foo: {}, lorem: "ipsum"}, {foo: isString, lorem: [isString]}],
  ];
  for (const [value, constraints] of values) {
    assertNotEquals([], await validate(value, constraints));
  }
});