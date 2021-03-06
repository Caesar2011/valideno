import {
  Validator,
  Args,
  isString,
  isArray,
  isNumber,
  isSymbol,
  isBoolean,
} from "../mod.ts";

export function isRequired(): Validator {
  return {
    type: "isRequired",
    check: (value: any) => {
      if (value === null || value === undefined) {
        return {};
      }
    },
    message: (value: any, args?: Args) => {
      return `This value is required.`;
    },
  };
}

export function isDefined(): Validator {
  return {
    type: "isDefined",
    check: (value: any) => {
      if (value === undefined) {
        return {};
      }
    },
    message: (value: any, args?: Args) => {
      return `This value has to be defined.`;
    },
  };
}

export function isNotEmpty(): Validator {
  return {
    type: "isNotEmpty",
    check: async (value: any) => {
      if (value === null || value === undefined) {
        return {};
      }
      if ((await isString().check(value)) === undefined) {
        if (/^\s*$/.test(value)) {
          return {};
        }
        return;
      }
      if (
        (await isNumber().check(value)) === undefined || Number.isNaN(value)
      ) {
        return;
      }
      if (await isSymbol().check(value) === undefined) {
        return;
      }
      if (await isBoolean().check(value) === undefined) {
        return;
      }
      if ((await isArray().check(value)) === undefined) {
        if (value.length > 0) {
          return;
        }
        return {};
      }
      // noinspection LoopStatementThatDoesntLoopJS
      for (const key in value) {
        return;
      }
      return {};
    },
    message: (value: any, args?: Args) => {
      return `This value has to be non-empty.`;
    },
  };
}
