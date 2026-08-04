import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import eslint from "@nabla/vite-plugin-eslint";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@use "src/_variables.scss" as *;` },
    },
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      src: path.resolve(import.meta.dirname, "./src"),
    },
  },

  plugins: [
    react(),
    svgrPlugin(),
    eslint(),
    visualizer({ filename: "dist/stats.html", template: "treemap" }),
  ],

  envDir: "../",
});
