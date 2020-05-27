import {
  ValidationError, validate,
  isBoolean
} from "./mod.ts";

const converted: any = {};
const errors: ValidationError[] = await validate("foobar", isBoolean(), { doConversion: true, converted });
console.log(errors);
// [ { type: "isBoolean", args: {}, message: "This value has to be a boolean." } ]
console.log(converted);
// { output: "foobar" }