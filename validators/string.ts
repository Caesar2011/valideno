import { Validator, Args } from "../mod.ts";

export const isString: Validator = {
  type: "isString",
  check: (value: any) => {
    if (value === null || value === undefined) return;
    if (typeof value !== "string" && !(value instanceof String)) {
      return {};
    }
  },
  message: (value: any, args?: Args) => {
    return `The value '${value && value.toString()}' has to be a string.`;
  },
};
