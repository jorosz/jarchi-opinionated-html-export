var globals = require("globals");

module.exports = [
  {
    ignores: ["**/nashorn-polyfills.js"]
  },
  {
    files: ["**/*.js", "**/*.ajs"],
    languageOptions: {
      ecmaVersion: 2015,
      sourceType: "script",
      globals: Object.assign(
        {},
        globals.browser,
        globals.node,
        {
          // Jarchi/Archi globals
          _: "readonly",
          $: "readonly",
          marked: "readonly",
          mdOptions: "readonly",
          selection: "readonly",
          model: "readonly",
          console: "readonly",
          shell: "readonly",
          window: "readonly",
          // Nashorn globals
          Java: "readonly",
          JavaImporter: "readonly",
          Packages: "readonly",
          java: "readonly",
          javax: "readonly",
          com: "readonly",
          org: "readonly",
          print: "readonly",
          load: "readonly",
          exit: "readonly",
          quit: "readonly",
          __DIR__: "readonly",
          // Your custom functions
          readFully: "readonly",
        }
      )
    },
    rules: {
      // ES5 compatibility
      "no-var": "off",
      "prefer-const": "off",
      "no-with": "off", // Allow 'with' for JavaImporter
      // Correctness checks
      "eqeqeq": ["error", "always"],
      "curly": "error",
      "no-undef": "error",
      "no-unused-vars": ["warn", { args: "none" }],
      "no-implied-eval": "error",
      "radix": ["error", "always"],
    }
  }
];