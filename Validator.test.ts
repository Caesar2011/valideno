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
    [
      "string",
      isString(),
    ],
    [
      "string",
      [isString()],
    ],
    [
      ["arr", "ay"],
      { [ArraySymbol]: isString() },
    ],
    [
      { foo: 3.1415, lorem: "ipsum" },
      { foo: isNumber(), lorem: [isString()] },
    ],
    [
      {},
      { optional: [isString()] },
    ],
    [
      { foo: { bar: "" } },
      { foo: { bar: [isRequired(), isString()] } },
    ],
    [
      { foo: { bar: "" } },
      { foo: { bar: [isString()] } },
    ],
    [
      { foo: {} },
      { foo: { bar: [isString()] } },
    ],
    [
      {},
      { foo: { bar: [isString()] } },
    ],
  ];
  for (const [value, constraints] of values) {
    const valueBefore = JSON.stringify(value);
    assertEquals(await validate(value, constraints), [], String(value));
    const valueAfter = JSON.stringify(value);
    assertEquals(valueAfter, valueBefore);
  }
});

Deno.test("validate schema (no match)", async () => {
  const values: [any, Validatable][] = [
    [
      6,
      isString(),
    ],
    [
      false,
      [isString()],
    ],
    [
      ["arr", ["ay"]],
      { [ArraySymbol]: isString() },
    ],
    [
      { foo: 3.1415, lorem: "ipsum" },
      { foo: isInteger(), lorem: [isString()] },
    ],
    [
      {},
      { required: [isRequired(), isString()] },
    ],
    [
      { foo: { bar: 1 } },
      { foo: { bar: [isRequired(), isString()] } },
    ],
    [
      { foo: {} },
      { foo: { bar: [isRequired(), isString()] } },
    ],
    [
      {},
      { foo: { bar: [isRequired(), isString()] } },
    ],
  ];
  for (const [value, constraints] of values) {
    const valueBefore = JSON.stringify(value);
    assertNotEquals(await validate(value, constraints), [], String(value));
    const valueAfter = JSON.stringify(value);
    assertEquals(valueAfter, valueBefore);
  }
});







Deno.test("validate doConversion (match)", async () => {
  const values: [any, Validatable, any][] = [
    [
      1,
      isNumber(),
      1
    ],
    [
      "2",
      isNumber(),
      2
    ],
    [
      "03",
      isNumber(),
      3
    ],
    [
      { foo: 3, bar: { baz: "4", other: "val" } },
      { foo: isNumber(), bar: { baz: isNumber() } },
      { foo: 3, bar: { baz: 4 } }
    ],
  ];
  for (const [value, constraints, conv] of values) {
    const valueBefore = JSON.stringify(value);
    const converted: any = {};
    assertEquals(await validate(value, constraints, {doConversion: true, converted}), [], String(value));
    const valueAfter = JSON.stringify(value);
    assertEquals(valueAfter, valueBefore);
    assertEquals(converted.hasOwnProperty("output"), true);
    assertEquals(converted?.output, conv);
  }
});

Deno.test("validate doConversion (no match)", async () => {
  const values: [any, Validatable][] = [
    [
      "1x",
      isNumber(),
    ],
    [
      Symbol(),
      isNumber(),
    ],
  ];
  for (const [value, constraints] of values) {
    const valueBefore = JSON.stringify(value);
    const converted: any = {};
    assertNotEquals(await validate(value, constraints, {doConversion: true, converted}), [], String(value));
    const valueAfter = JSON.stringify(value);
    assertEquals(valueAfter, valueBefore);
    assertEquals(converted.hasOwnProperty("output"), true);
    assertEquals(converted?.output, value);
  }
});