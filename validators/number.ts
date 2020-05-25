import { Validator, Args } from "../mod.ts";

export const isNumber: Validator = {
  type: "isNumber",
  check: (value: any) => {
    if (!Number.isFinite(value)) {
      return {};
    }
  },
  message: (value: any, args?: Args) => {
    return `The value '${value && value.toString()}' has to be a number.`;
  },
};

export const isInteger: Validator = {
  type: "isInteger",
  check: (value: any) => {
    if (!Number.isInteger(value)) {
      return {};
    }
  },
  message: (value: any, args?: Args) => {
    return `The value '${value && value.toString()}' has to be an integer.`;
  },
};
