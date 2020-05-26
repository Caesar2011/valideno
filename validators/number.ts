import { Validator, Args } from "../mod.ts";

export const isNumber: Validator = {
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

export const isInteger: Validator = {
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
