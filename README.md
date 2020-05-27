# valideno

Validate your values and schemas with **valideno**. Convert values to your desired type if needed. All you need is a single function.

`validate(data, validators, options = {})`;

## Examples

```ts
import {
  ValidationError, validate, ArraySymbol,
  isString, isEmail, fulfillsRegex,
  isNumber, isInRange,
} from "./mod.ts";

const errorsA: ValidationError[] = await validate(3.14, isNumber());
console.log(errorsA);
// []

const errorsB: ValidationError[] = await validate(3.14, isString());
console.log(errorsB);
// [ { type: "isString", args: {}, message: "This value has to be a string." } ]

const errorsC: ValidationError[] = await validate(
  "john.doe@example.com",
  [isString(), isEmail()],
);
console.log(errorsC);
// []

const entity = {
  name: "John Doe",
  age: 25,
  emails: [
    { type: "work", address: "john.doe@example.com" },
    { type: "home", address: "fancy_joe69@rainbow.com" },
  ],
};
const scheme = {
  name: isString(),
  age: isInRange({ greaterThanOrEqualTo: 18 }),
  emails: {
    [ArraySymbol]: {
      type: fulfillsRegex({ regex: /^[a-z]+$/ }),
      address: isEmail(),
    },
  },
};
const errorsD: ValidationError[] = await validate(entity, scheme);
console.log(errorsD);
// []
```

## Conversion

To allow automatic conversion to the desired data type add the `doConversion: true` option. To retreive the converted values, you need to pass a reference to an object to `converted`. If the conversion is not possible (e.g. when passing a `string` to `isBoolean()`) no conversion will take place and the value stays the same. In this case errors are thrown, because the non-converted `string` is not a Boolean.

The converted data is not in the reference passed to `converted` in the property `output`. This also works for schemes.

```ts
import {
  ValidationError, validate,
  isNumber
} from "./mod.ts";

const converted: any = {};
const errors: ValidationError[] = await validate("420", isNumber(), { doConversion: true, converted });
console.log(errors);
// []
console.log(converted);
// { output: 420 }
```

To disable validation and do "best effort" conversion only, disable validation with `doValidation: false`.

```ts
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
```