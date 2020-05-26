import { Validator, Args } from "../mod.ts";

export function isBoolean(): Validator {
  return {
    type: "isBoolean",
    check: (value: any) => {
      if (value === null || value === undefined) return;
      if (value !== true && value !== false) {
        return {};
      }
    },
    message: (value: any, args?: Args) => {
      return `This value has to be a boolean.`;
    },
  };
}
