import { defineConfig } from "orval";

export default defineConfig({
  spotvisit: {
    output: {
      mode: "tags-split",
      target: "src/generated/backend.ts",
      schemas: "src/generated/model",
      client: "react-query",
      override: {
        mutator: {
          path: "src/libs/backend/customInstance.ts",
          name: "backendCustomInstance",
        },
      },
    },
    input: {
      target: "./openapi.yaml",
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});
