import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/_variables.scss" as *;`,
      },
    },
  },
  plugins: [react(), viteTsconfigPaths(), svgrPlugin(), eslint()],
  envDir: "../",
});
