export type {
  Args,
  Validatable,
  ValidationError,
  Validator,
} from './Validator.ts';

export {
  validate,
  ArraySymbol,
} from "./Validator.ts";
export {
  isString,
  isUrl,
  isEmail,
  fulfillsRegex,
} from "./validators/string.ts";
export {
  isNumber,
  isInteger,
  isInRange,
  hasParity,
} from "./validators/number.ts";
export { isArray } from "./validators/array.ts";
export { or } from "./validators/logic.ts";
export { isRequired, isDefined, isNotEmpty } from "./validators/empty.ts";
export { isSymbol } from "./validators/symbol.ts";
export { isBoolean } from "./validators/boolean.ts";
