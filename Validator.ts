export type Args = { [_: string]: any };

export interface Validator {
  type: string;
  extends?: Validator[];
  convert?: (value: any) => Promise<any> | any;
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
  { doConversion = false, converted = undefined, doValidation = true }: {
    doConversion?: boolean;
    converted?: any;
    doValidation?: boolean;
  } = {},
): Promise<ValidationError[]> {
  const options = { doConversion, converted, doValidation };
  if (Array.isArray(validators) || instanceofValidator(validators)) {
    return validateValue(value, validators, options);
  } else {
    return validateSchema(value, validators, options);
  }
}

export function instanceofValidator(value: any): value is Validator {
  return value &&
    value.hasOwnProperty("type") && typeof value.type === "string" &&
    value.hasOwnProperty("check") && typeof value.check === "function" &&
    value.hasOwnProperty("message") && typeof value.message === "function";
}

export async function validateValue(
  value: any,
  validators: Validator | Validator[],
  { doConversion = false, converted = undefined, doValidation = true }: {
    doConversion?: boolean;
    converted?: any;
    doValidation?: boolean;
  } = {},
): Promise<ValidationError[]> {
  const options = { doConversion, converted, doValidation };
  if (!Array.isArray(validators)) {
    validators = [validators];
  }
  const result: ValidationError[] = [];
  for (const validator of validators) {
    // 1. convert
    if (doConversion && validator.convert) {
      value = await validator.convert(value);
    }

    // 2. extends
    if (validator.extends) {
      const prerequisites = await validate(value, validator.extends, options);
      if (prerequisites.length > 0) {
        result.push(...prerequisites);
        continue;
      }
    }

    // 3. check
    const args = doValidation ? await validator.check(value) : undefined;

    // 4. message
    if (args !== undefined) {
      const message = await validator.message(value, args);
      result.push({
        type: validator.type,
        args,
        message,
      });
    }
  }
  if (converted) {
    converted.output = value;
  }
  return result;
}

export async function validateSchema(
  value: any,
  validators: Schema,
  { doConversion = false, converted = undefined, doValidation = true }: {
    doConversion?: boolean;
    converted?: any;
    doValidation?: boolean;
  } = {},
): Promise<ValidationError[]> {
  const conv: any = {};
  const options = { doConversion, converted: conv, doValidation };

  // Validate array
  if (validators.hasOwnProperty(ArraySymbol)) {
    const v = validators as { [ArraySymbol]: Validatable };
    if (Array.isArray(value)) {
      if (converted) {
        converted.output = [];
      }
      const arr: ValidationError[][] = [];
      for (const val of value) {
        const errors = await validate(val, v[ArraySymbol], options);
        arr.push(errors);
        if (converted) {
          converted.output.push(conv.output);
        }
      }
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

  // Validate object
  const v = validators as { [key: string]: Validatable };
  const valErrors: ValidationError[] = [];

  if (converted) {
    converted.output = {};
  }
  for (const prop in validators) {
    if (!validators.hasOwnProperty(prop)) {
      continue;
    }
    const errors = await validate(value && value[prop], v[prop], options);
    valErrors.push(...(errors ?? []));
    if (converted) {
      converted.output[prop] = conv.output;
    }
  }
  return valErrors;
}
