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
  // We intentionally use a plain <img> for product images (external/unknown
  // origins with an onError fallback) because next/image triggers a Turbopack
  // production client-manifest bug in this Next version.
  {
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
