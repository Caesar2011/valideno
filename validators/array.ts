import { Validator, Args } from "../mod.ts";

export const isArray: Validator = {
  type: "isArray",
  check: (value: any) => {
    if (value === null || value === undefined) return;
    if (!Array.isArray(value)) {
      return {};
    }
  },
  message: (value: any, args?: Args) => {
    return `This value has to be an array.`;
  },
};
