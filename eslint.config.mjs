import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "android/**",
      "ios/**",
      "server/**",
      "public/**",
      "next-env.d.ts",
      "node_modules/**",
      "src/**/*.js", // Ignore compiled JS files in src
    ],
  },
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/preserve-manual-memoization": "off", // Suppress React Compiler warnings if they persist
    },
  },
];

export default eslintConfig;
