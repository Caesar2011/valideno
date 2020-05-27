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

export function isInRange(
  {
    allowNaN = false,
    greaterThan = undefined,
    greaterThanOrEqualTo = undefined,
    equalTo = undefined,
    lessThan = undefined,
    lessThanOrEqualTo = undefined,
  }: {
    allowNaN?: boolean;
    greaterThan?: number;
    greaterThanOrEqualTo?: number;
    equalTo?: number;
    lessThan?: number;
    lessThanOrEqualTo?: number;
  } = {},
): Validator {
  return {
    type: "isInRange",
    extends: [isNumber({ allowNaN })],
    check: (value: any) => {
      if (value === null || value === undefined) return;
      if (allowNaN && Number.isNaN(value)) return;
      if (greaterThan !== undefined && value <= greaterThan) {
        return { range: "greaterThan" };
      }
      if (greaterThanOrEqualTo !== undefined && value < greaterThanOrEqualTo) {
        return { range: "greaterThanOrEqualTo" };
      }
      if (equalTo !== undefined && value !== equalTo) {
        return { range: "equalTo" };
      }
      if (lessThan !== undefined && value >= lessThan) {
        return { range: "lessThan" };
      }
      if (lessThanOrEqualTo !== undefined && value > lessThanOrEqualTo) {
        return { range: "lessThanOrEqualTo" };
      }
    },
    message: (value: any, args?: Args) => {
      return `This value is not in the given range.`;
    },
  };
}

export function hasParity(
  {
    allowNaN = false,
    odd = true,
    even = true,
    divisibleBy = undefined,
  }: {
    allowNaN?: boolean;
    odd?: boolean;
    even?: boolean;
    divisibleBy?: number;
  } = {},
): Validator {
  return {
    type: "hasParity",
    extends: [isInteger({ allowNaN })],
    check: (value: any) => {
      if (value === null || value === undefined) return;
      if (allowNaN && Number.isNaN(value)) return;
      if (!odd && Math.abs(value % 2) == 1) {
        return { partity: "odd" };
      }
      if (!even && value % 2 == 0) {
        return { partity: "even" };
      }
      if (divisibleBy !== undefined && (value % divisibleBy !== 0)) {
        return { divisibleBy: "divisibleBy" };
      }
    },
    message: (value: any, args?: Args) => {
      return `This value is not in the given range.`;
    },
  };
}
