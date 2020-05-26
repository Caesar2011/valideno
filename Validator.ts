export type Args = { [_: string]: any };

export interface Validator {
  type: string;
  check: (value: any) => Promise<Args | undefined> | Args | undefined;
  message: (
    value: any,
    args?: Args,
  ) => Promise<string | undefined> | string | undefined;
}

export interface ValidationError {
  type: string;
  param?: string[];
  message?: string | null;
  args?: Args;
}

export type Validatable = Schema | Validator | Validator[];

export const ArraySymbol: unique symbol = Symbol("ArraySymbol");
export type Schema = { [key: string]: Validatable } | {
  [ArraySymbol]: Validatable;
};

export async function validate(
  value: any,
  validators: Validatable,
): Promise<ValidationError[]> {
  if (instanceofValidatorArray(validators) || instanceofValidator(validators)) {
    return validateValue(value, validators);
  } else {
    return validateSchema(value, validators);
  }
}

function instanceofValidator(value: any): value is Validator {
  return value &&
    value.hasOwnProperty("type") && typeof value.type === "string" &&
    value.hasOwnProperty("check") && typeof value.check === "function" &&
    value.hasOwnProperty("message") && typeof value.message === "function";
}

function instanceofValidatorArray(value: any): value is Validator[] {
  return Array.isArray(value) && value.every((x) => instanceofValidator(x));
}

async function validateValue(
  value: any,
  validators: Validator | Validator[],
): Promise<ValidationError[]> {
  if (!Array.isArray(validators)) {
    validators = [validators];
  }
  const result: ValidationError[] = [];
  for (const validator of validators) {
    const args = await validator.check(value);
    if (args !== undefined) {
      const message = await validator.message(value, args);
      result.push({
        type: validator.type,
        args,
        message,
      });
    }
  }
  return result;
}

async function validateSchema(
  value: any,
  validators: Schema,
): Promise<ValidationError[]> {
  if (validators.hasOwnProperty(ArraySymbol)) {
    const v = validators as { [ArraySymbol]: Validatable };
    if (Array.isArray(value)) {
      const arr = await Promise.all(
        value.map((val) => validate(val, v[ArraySymbol])),
      );
      const errors = arr.flatMap((val, idx) =>
        (val ?? []).map((error) => ({
          ...error,
          param: [`[${idx}]`, ...(error.param || [])],
        }))
      );
      return errors;
    } else {
      return [{
        type: "array",
        param: ["[]"],
        message: "Array expected!",
        args: {},
      }];
    }
  }
  const v = validators as { [key: string]: Validatable };
  const valErrors: ValidationError[] = [];
  for (const prop in validators) {
    if (!validators.hasOwnProperty(prop)) {
      continue;
    }
    if (value.hasOwnProperty(prop)) {
      const errors = await validate(value[prop], v[prop]);
      valErrors.push(...(errors ?? []));
    } else {
      valErrors.push({
        type: "property",
        param: [prop],
        message: `Property '${prop}' expected but not found!`,
        args: { property: prop },
      });
    }
  }
  return valErrors;
}
