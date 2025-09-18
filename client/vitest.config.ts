import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}", "src/**/__tests__/**/*.{ts,tsx}"],
    setupFiles: ["./src/setupTests.ts"],
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
