import prettier from "eslint-config-prettier";
import typescriptEslint from "typescript-eslint";

const prettierConfigs = Array.isArray(prettier) ? prettier : [prettier];

export default typescriptEslint.config(
  ...typescriptEslint.configs.recommended,
  ...prettierConfigs
);
