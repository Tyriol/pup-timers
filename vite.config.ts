import { defineConfig } from "vite";
import { coverageConfigDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 5173,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["src/main.tsx", ...coverageConfigDefaults.exclude],
    },
  },
});
