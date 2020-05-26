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
export function isURL(
  {
    protocols = ["http", "https"],
    allowDataUrl = false,
    allowUrl = true,
    allowLocal = false,
    allowIp = true,
    allowDomain = true,
    allowBasicAuth = false,
    allowPort = true,
    allowRecourcePath = true
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
    type: "isURL",
    extends: [isString()],
    check: (value: any) => {
      if (value === null || value === undefined) return;
      if (allowUrl) {

        let regex = "^";
        // protocol identifier (optional)
        // short syntax // still required
        if (protocols) {
          regex += `(?:(?:(?:${protocols.join("|")}):)?\\/\\/)`
        } else {
          regex += `(?:(?:(?:[a-z]+):)?\/\/)`
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
          regex += 
            "(?:" +
              "(?:" +
                "[a-z0-9\\u00a1-\\uffff]" +
                "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
              ")?" +
              "[a-z0-9\\u00a1-\\uffff]\\." +
            ")+" +
            // TLD identifier name, may end with dot
            "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)"
        }
        regex += ")"; // [hostname] end
        if (allowPort) {
          // port number (optional)
          regex += "(?::\\d{2,5})?"
        }
        if (allowRecourcePath) {
          // resource path (optional)
          regex += "(?:[/?#]\\S*)?"
        }
        regex += "$";
        if (value.match(new RegExp(regex, "i"))) {
          return;
        }
      }
      if (allowDataUrl) {
        const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
        if (value.match(regex)) {
          return;
        }
      }
      return { };
    },
    message: (value: any, args?: Args) => {
      return `This value is not a valid URL.`;
    },
  };
}
