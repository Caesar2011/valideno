import { isSymbol } from "./symbol.ts";
import { validate } from "../mod.ts";
import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.53.0/testing/asserts.ts";

Deno.test("isSymbol (match)", async () => {
  const values = [
    undefined,
    null,
    Symbol(),
  ];
  for (const value of values) {
    assertEquals(await validate(value, isSymbol()), [], String(value));
  }
});

Deno.test("isSymbol (no match)", async () => {
  const values = [
    0,
    1,
    true,
    false,
    "",
    "foo",
    new String(),
    new String("bar"),
    () => {},
    function named() {},
    new Object(),
  ];
  for (const value of values) {
    assertNotEquals(await validate(value, isSymbol()), [], String(value));
  }
});
