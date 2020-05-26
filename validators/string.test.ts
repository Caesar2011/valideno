import { isString, isURL } from "./string.ts";
import { validate } from "../mod.ts";
import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.53.0/testing/asserts.ts";

Deno.test("isString (match)", async () => {
  const values = [
    undefined,
    null,
    "",
    "foo",
    new String(),
    new String("bar"),
  ];
  for (const value of values) {
    assertEquals(await validate(value, isString()), []);
  }
});

Deno.test("isString (no match)", async () => {
  const values = [
    0,
    1,
    true,
    false,
    () => {},
    function named() {},
    new Object(),
    Symbol(),
  ];
  for (const value of values) {
    assertNotEquals(await validate(value, isString()), []);
  }
});

Deno.test("isURL (match)", async () => {
  const values = [
    "http://google.com",
    "http://10.1.1.1",
    "http://10.1.1.254",
    "http://223.255.255.254",
    " data:,Hello World!"
  ];
  for (const value of values) {
    assertEquals(await validate(value, isURL({allowLocal: true, allowDataUrl: true})), [], value);
  }
});

Deno.test("isURL (no match)", async () => {
  const values = [
    "invalid",
    "http://0.0.0.0",
    "http://10.1.1.0",
    "http://10.1.1.255",
    "http://224.1.1.1",
    "http://1.1.1.1.1",
    " data:,Hello World!"
  ];
  for (const value of values) {
    assertNotEquals(await validate(value, isURL({allowLocal: true})), [], value);
  }
});
