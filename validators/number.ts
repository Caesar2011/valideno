import { Validator, Args } from "../mod.ts";

export function isNumber(): Validator {
  return {
    type: "isNumber",
    check: (value: any) => {
      if (value === null || value === undefined) return;
      if (!Number.isFinite(value)) {
        return {};
      }
    },
    message: (value: any, args?: Args) => {
      return `This value has to be a number.`;
    },
  };
}

export function isInteger(): Validator {
  return {
    type: "isInteger",
    check: (value: any) => {
      if (value === null || value === undefined) return;
      if (!Number.isInteger(value)) {
        return {};
      }
    },
    message: (value: any, args?: Args) => {
      return `This value has to be an integer.`;
    },
  };
}
