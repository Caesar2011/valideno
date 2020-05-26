import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.53.0/testing/asserts.ts";
import {
  validate,
  Validatable,
  ArraySymbol,
  isString,
  isNumber,
  isInteger,
  isRequired,
} from "./mod.ts";

Deno.test("validate schema (match)", async () => {
  const values: [any, Validatable][] = [
    ["string", isString],
    ["string", [isString]],
    [["arr", "ay"], { [ArraySymbol]: isString }],
    [{ foo: 3.1415, lorem: "ipsum" }, { foo: isNumber, lorem: [isString] }],
    [{}, { optional: [isString] }],
    [{ foo: { bar: "" } }, { foo: { bar: [isRequired, isString] } }],
    [{ foo: { bar: "" } }, { foo: { bar: [isString] } }],
    [{ foo: {} }, { foo: { bar: [isString] } }],
    [{}, { foo: { bar: [isString] } }],
  ];
  for (const [value, constraints] of values) {
    assertEquals([], await validate(value, constraints));
  }
});

Deno.test("validate schema (no match)", async () => {
  const values: [any, Validatable][] = [
    [6, isString],
    [false, [isString]],
    [["arr", ["ay"]], { [ArraySymbol]: isString }],
    [{ foo: 3.1415, lorem: "ipsum" }, { foo: isInteger, lorem: [isString] }],
    [{}, { required: [isRequired, isString] }],
    [{ foo: { bar: 1 } }, { foo: { bar: [isRequired, isString] } }],
    [{ foo: {} }, { foo: { bar: [isRequired, isString] } }],
    [{}, { foo: { bar: [isRequired, isString] } }],
  ];
  for (const [value, constraints] of values) {
    assertNotEquals([], await validate(value, constraints));
  }
});
