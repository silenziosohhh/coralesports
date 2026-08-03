import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  {
    extends: [...nextCoreWebVitals],
    ignores: ["node_modules/**", ".next/**", ".next-build/**", "next-env.d.ts"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);
