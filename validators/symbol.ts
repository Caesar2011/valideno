import { Validator, Args } from "../mod.ts";

export const isSymbol: Validator = {
  type: "isSymbol",
  check: (value: any) => {
    if (value === null || value === undefined) return;
    if (typeof value !== "symbol") {
      return {};
    }
  },
  message: (value: any, args?: Args) => {
    return `This value has to be a symbol.`;
  },
};
