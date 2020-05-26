import { Validator, Args } from "../mod.ts";

export function isNumber(
  { allowNaN = false }: { allowNaN?: boolean } = {},
): Validator {
  return {
    type: "isNumber",
    check: (value: any) => {
      if (value === null || value === undefined) return;
      if (allowNaN && Number.isNaN(value)) return;
      if (!Number.isFinite(value)) {
        return {};
      }
    },
    message: (value: any, args?: Args) => {
      return `This value has to be a number.`;
    },
  };
}

export function isInteger(
  { allowNaN = false }: { allowNaN?: boolean } = {},
): Validator {
  return {
    type: "isInteger",
    check: (value: any) => {
      if (value === null || value === undefined) return;
      if (allowNaN && Number.isNaN(value)) return;
      if (!Number.isInteger(value)) {
        return {};
      }
    },
    message: (value: any, args?: Args) => {
      return `This value has to be an integer.`;
    },
  };
}
