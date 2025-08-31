import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Core ESLint recommended rules
  {
    ...js.configs.recommended,
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  
  // React-specific rules
  pluginReact.configs.recommended,

  // Prettier integration (must be last)
  configPrettier,
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  // Global settings for the whole project
  {
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
]);