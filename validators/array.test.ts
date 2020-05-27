import { isArray } from "./array.ts";
import { validate } from "../mod.ts";
import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.53.0/testing/asserts.ts";

Deno.test("isArray (match)", async () => {
  const values = [
    undefined,
    null,
    [],
    ["foo"],
  ];
  for (const value of values) {
    assertEquals(await validate(value, isArray()), [], String(value));
  }
});

Deno.test("isArray (no match)", async () => {
  const values = [
    0,
    1,
    false,
    true,
    "",
    "foo",
    new String(),
    new String("bar"),
    () => {},
    function named() {},
    new Object(),
    Symbol(),
  ];
  for (const value of values) {
    assertNotEquals(await validate(value, isArray()), [], String(value));
  }
});
