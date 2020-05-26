import { Validator, Args, Validatable, validate } from "../mod.ts";

export function or(...funcs: Validatable[]): Validator {
  return {
    type: "or",
    check: async (value: any) => {
      const errors = await Promise.all(funcs.map((x) => validate(value, x)));
      if (errors.every((x) => x.length > 0)) {
        return {
          errors,
        };
      }
    },
    message: (value: any, args?: Args) => {
      return "At least one of the rules has to be successful.";
    },
  };
}
