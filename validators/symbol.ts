import { Validator, Args } from "../mod.ts";

export function isSymbol(): Validator {
  return {
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
}
