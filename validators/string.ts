import { Validator, Args } from "../mod.ts";

export function isString(): Validator {
  return {
    type: "isString",
    check: (value: any) => {
      if (value === null || value === undefined) return;
      if (typeof value !== "string" && !(value instanceof String)) {
        return {};
      }
    },
    message: (value: any, args?: Args) => {
      return `This value has to be a string.`;
    },
  };
}

/**
 * Thanks to https://gist.github.com/dperini/729294
 * Data URL https://gist.github.com/bgrins/6194623
 * 
 * @param param Options
 */
export function isUrl(
  {
    protocols = ["http", "https"],
    allowDataUrl = false,
    allowUrl = true,
    allowLocal = false,
    allowIp = true,
    allowDomain = true,
    allowBasicAuth = false,
    allowPort = true,
    allowRecourcePath = true,
  }: {
    protocols?: string[] | null;
    allowDataUrl?: boolean;
    allowUrl?: boolean;
    allowLocal?: boolean;
    allowIp?: boolean;
    allowDomain?: boolean;
    allowBasicAuth?: boolean;
    allowPort?: boolean;
    allowRecourcePath?: boolean;
  } = {},
): Validator {
  return {
    type: "isUrl",
    extends: [isString()],
    check: (value: any) => {
      if (value === null || value === undefined) return;
      if (allowUrl) {
        let regex = "^";
        // protocol identifier (optional)
        // short syntax // still required
        if (protocols) {
          regex += `(?:(?:(?:${protocols.join("|")}):)?\\/\\/)`;
        } else {
          regex += `(?:(?:(?:[a-z]+):)?\/\/)`;
        }
        // user:pass BasicAuth (optional)
        if (allowBasicAuth) {
          regex += "(?:\\S+(?::\\S*)?@)?";
        }
        regex += "(?:"; // [hostname] start
        if (allowIp && !allowLocal) {
          regex += "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
            "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
            "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})";
        }
        if (allowIp) {
          regex += "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
            "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
            "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))";
        }
        if (allowIp || allowDomain) {
          regex += "|"; // [hostname] ip end / domain start
        }
        if (allowDomain) {
          // host & domain names, may end with dot
          // can be replaced by a shortest alternative
          // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
          regex += "(?:" +
            "(?:" +
            "[a-z0-9\\u00a1-\\uffff]" +
            "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
            ")?" +
            "[a-z0-9\\u00a1-\\uffff]\\." +
            ")+" +
            // TLD identifier name, may end with dot
            "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)";
        }
        regex += ")"; // [hostname] end
        if (allowPort) {
          // port number (optional)
          regex += "(?::\\d{2,5})?";
        }
        if (allowRecourcePath) {
          // resource path (optional)
          regex += "(?:[/?#]\\S*)?";
        }
        regex += "$";
        if (value.match(new RegExp(regex, "i"))) {
          return;
        }
      }
      if (allowDataUrl) {
        const regex =
          /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
        if (value.match(regex)) {
          return;
        }
      }
      return {};
    },
    message: (value: any, args?: Args) => {
      return `This value is not a valid URL.`;
    },
  };
}

/**
 * https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression
 */
export function isEmail(): Validator {
  return {
    type: "isEmail",
    extends: [isString()],
    check: (value: any) => {
      if (value === null || value === undefined) return;
      const regex =
        /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
      if (value.match(regex)) {
        return;
      }
      return {};
    },
    message: (value: any, args?: Args) => {
      return `This value has to be an email address.`;
    },
  };
}

export function fulfillsRegex({regex}: {regex: RegExp}): Validator {
  return {
    type: "fulfillsRegex",
    extends: [isString()],
    check: (value: any) => {
      if (value === null || value === undefined) return;
      if (!value.match(regex)) {
        return {};
      }
    },
    message: (value: any, args?: Args) => {
      return `This value has to fulfill the regex ${regex}.`;
    },
  };
}
