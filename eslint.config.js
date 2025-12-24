import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
    },

    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.eslint.json",
        },
      },
    },

    rules: {
      // TypeScript recommended
      ...tsPlugin.configs.recommended.rules,

      // React recommended
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // jsx-a11y recommended
      ...jsxA11yPlugin.configs.recommended.rules,

      // React
      "react/react-in-jsx-scope": "off",
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "function-declaration",
          unnamedComponents: "arrow-function",
        },
      ],
      "react/require-default-props": "off",
      "react/jsx-props-no-spreading": "off",

      // TS
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-throw-literal": "off",
      "@typescript-eslint/lines-between-class-members": "off",

      // import
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never",
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Node.js 내장 모듈 (fs, path 등)
            "external", // node_modules
            "internal", // 프로젝트 내부 절대 경로 (@/* 등)
            ["parent", "sibling"], // 상위/형제 디렉토리
            "index", // 현재 디렉토리 index
            "object",
            "type", // TypeScript type import
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "never",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/no-cycle": "off",
      "import/no-extraneous-dependencies": "off",
      "import/prefer-default-export": "off",

      // a11y
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/anchor-has-content": "off",

      "arrow-body-style": "off",
    },
  },
  eslintConfigPrettier,
  {
    ignores: ["dist/**", "node_modules/**", "scripts/**", "**/*.cjs"],
  },
];
