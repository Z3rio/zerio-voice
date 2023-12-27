import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "",
  optimizeDeps: {
    include: ["shared"]
  },
  build: {
    outDir: "../../dist/html",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        }
      }
    },
    commonjsOptions: {
      include: [/utils/, /node_modules/]
    }
  }
});
