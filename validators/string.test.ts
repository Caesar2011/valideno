import { isString, isUrl, isEmail, fulfillsRegex } from "./string.ts";
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
    assertEquals(await validate(value, isString()), [], String(value));
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
    assertNotEquals(await validate(value, isString()), [], String(value));
  }
});

Deno.test("isUrl (match)", async () => {
  const values = [
    undefined,
    null,
    "http://google.com",
    "http://10.1.1.1",
    "http://10.1.1.254",
    "http://223.255.255.254",
    " data:,Hello World!",
  ];
  for (const value of values) {
    assertEquals(
      await validate(value, isUrl({ allowLocal: true, allowDataUrl: true })),
      [],
      String(value),
    );
  }
});

Deno.test("isUrl (no match)", async () => {
  const values = [
    "invalid",
    "http://0.0.0.0",
    "http://10.1.1.0",
    "http://10.1.1.255",
    "http://224.1.1.1",
    "http://1.1.1.1.1",
    " data:,Hello World!",
  ];
  for (const value of values) {
    assertNotEquals(
      await validate(value, isUrl({ allowLocal: true })),
      [],
      String(value),
    );
  }
});

Deno.test("isEmail (match)", async () => {
  const values = [
    undefined,
    null,
    "email@example.com",
    "firstname.lastname@example.com",
    "email@subdomain.example.com",
    "firstname+lastname@example.com",
    "email@123.123.123.123",
    "email@[123.123.123.123]",
    "1234567890@example.com",
    "234567890@example.com",
    "email@example-one.com",
    "_______@example.com",
    "email@example.name",
    "email@example.museum",
    "email@example.co.jp",
    "firstname-lastname@example.com",
  ];
  for (const value of values) {
    assertEquals(await validate(value, isEmail()), [], String(value));
  }
});

Deno.test("isEmail (no match)", async () => {
  const values = [
    "",
    1,
    "foo§@bar.baz",
    "#@%^%#$@#$@#.com",
    "@example.com",
    "Joe Smith <email@example.com>",
    "email.example.com",
    "email@example@example.com",
    ".email@example.com",
    "email.@example.com",
    "email..email@example.com",
    "あいうえお@example.com",
    "email@example.com (Joe Smith)",
    "email@example",
    "email@-example.com",
    "email@example..com",
    "Abc..123@example.com",
  ];
  for (const value of values) {
    assertNotEquals(await validate(value, isEmail()), [], String(value));
  }
});

Deno.test("fulfillsRegex (match)", async () => {
  const values: [any, RegExp][] = [
    ["abc", /[a-z]+/],
    [null, /[a-z]+/],
    [undefined, /[a-z]+/],
    ["123abc", /[a-z]+/],
    ["abc", /^[a-z]+$/],
    ["^ab$", /^\^(ab)|(cd)\$$/]
  ];
  for (const [value, regex] of values) {
    assertEquals(await validate(value, fulfillsRegex({ regex })), [], `${String(value)} - ${regex}`);
  }
});

Deno.test("fulfillsRegex (no match)", async () => {
  const values: [any, RegExp][] = [
    [Symbol(), /[a-z]+/],
    ["", /[a-z]+/],
    ["abc123", /^[a-z]+$/],
    ["^abcd$", /^\^(ab|cd)\$$/]
  ];
  for (const [value, regex] of values) {
    assertNotEquals(await validate(value, fulfillsRegex({ regex })), [], `${String(value)} - ${regex}`);
  }
});
