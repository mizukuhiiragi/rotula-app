import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/**/*.{test,spec}.{ts,tsx}", "src/__tests__/**"],
    rules: {
      "no-console": [
        "error",
        {
          // Legitimate diagnostic output (warnings & errors) has an explicit exemption;
          // arbitrary console.log / debug in application code fails the lint run.
          allow: ["warn", "error"],
        },
      ],
    },
  },
]);

export default eslintConfig;
