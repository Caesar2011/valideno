import { isBoolean } from "./boolean.ts";
import { validate } from "../mod.ts";
import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.53.0/testing/asserts.ts";

Deno.test("isBoolean (match)", async () => {
  const values = [
    undefined,
    null,
    true,
    false,
  ];
  for (const value of values) {
    assertEquals(await validate(value, isBoolean()), [], String(value));
  }
});

Deno.test("isBoolean (no match)", async () => {
  const values = [
    0,
    1,
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
    assertNotEquals(await validate(value, isBoolean()), [], String(value));
  }
});
