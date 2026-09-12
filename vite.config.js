import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    process.env.ANALYZE &&
      visualizer({ open: true, filename: "stats.html", gzipSize: true }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("/node_modules/motion")) return "motion";
          if (id.includes("/node_modules/react-dom")) return "react-vendor";
          if (id.includes("@tiptap") || id.includes("prosemirror"))
            return "editor";
          if (id.includes("/node_modules/ogl")) return "gl";
        },
      },
    },
  },
});
