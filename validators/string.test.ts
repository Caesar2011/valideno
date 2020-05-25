import { isString } from "./string.ts";
import { validate } from "../mod.ts";
import { assertEquals, assertNotEquals } from "https://deno.land/std@0.53.0/testing/asserts.ts";

Deno.test("isString (match)", async () => {
  const values = [
    "",
    "foo",
    new String(),
    new String("bar")
  ];
  for (const value of values) {
    assertEquals([], await validate(value, isString));
  }
});

Deno.test("isString (no match)", async () => {
  const values = [
    undefined,
    null,
    0,
    1,
    true,
    false,
    () => {},
    function named() {},
    new Object(),
    Symbol()
  ];
  for (const value of values) {
    assertNotEquals([], await validate(value, isString));
  }
});