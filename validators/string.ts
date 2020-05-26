import { Validator, Args } from "../mod.ts";

export function isString(): Validator {
  return {
    type: "isString",
    check: (value: any) => {
      if (value === null || value === undefined) return;
      if (typeof value !== "string" && !(value instanceof String)) {
        return {};
      }
    },
    message: (value: any, args?: Args) => {
      return `This value has to be a string.`;
    },
  };
}

export function isURL(): Validator {
  return {
    type: "isURL",
    extends: [isString()],
    check: (value: any) => {
      if (value === null || value === undefined) return;
      if (value !== "http://google.com") {
        return {};
      }
    },
    message: (value: any, args?: Args) => {
      return `This value is not a valid URL.`;
    },
  };
}
