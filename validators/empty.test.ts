import { isRequired, isDefined, isNotEmpty } from "./empty.ts";
import { validate } from "../mod.ts";
import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.53.0/testing/asserts.ts";

Deno.test("isRequired (match)", async () => {
  const values = [
    "",
    "  ",
    "foo",
    0,
    1,
    true,
    false,
    NaN,
    {},
    { foo: "bar" },
    [],
    ["foo"],
    Symbol("foo"),
  ];
  for (const value of values) {
    assertEquals(await validate(value, isRequired()), []);
  }
});

Deno.test("isRequired (no match)", async () => {
  const values = [
    undefined,
    null,
  ];
  for (const value of values) {
    assertNotEquals(await validate(value, isRequired()), []);
  }
});

Deno.test("isDefined (match)", async () => {
  const values = [
    null,
    "",
    "  ",
    "foo",
    0,
    1,
    true,
    false,
    NaN,
    {},
    { foo: "bar" },
    [],
    ["foo"],
    Symbol("foo"),
  ];
  for (const value of values) {
    assertEquals(await validate(value, isDefined()), []);
  }
});

Deno.test("isDefined (no match)", async () => {
  const values = [
    undefined,
  ];
  for (const value of values) {
    assertNotEquals(await validate(value, isDefined()), []);
  }
});

Deno.test("isNotEmpty (match)", async () => {
  const values = [
    "foo",
    0,
    1,
    true,
    false,
    NaN,
    { foo: "bar" },
    ["foo"],
    Symbol("foo"),
  ];
  for (const value of values) {
    assertEquals(await validate(value, isNotEmpty()), []);
  }
});

Deno.test("isNotEmpty (no match)", async () => {
  const values = [
    undefined,
    null,
    "",
    "  ",
    {},
    [],
  ];
  for (const value of values) {
    assertNotEquals(await validate(value, isNotEmpty()), []);
  }
});
