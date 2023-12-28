// vite.config.ts
import { defineConfig } from "file:///G:/Github%20Projects/zerio-voice/node_modules/.pnpm/vite@5.0.10_@types+node@20.10.5_sass@1.69.5/node_modules/vite/dist/node/index.js";
import vue from "file:///G:/Github%20Projects/zerio-voice/node_modules/.pnpm/@vitejs+plugin-vue@5.0.0_vite@5.0.10_vue@3.3.13/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var vite_config_default = defineConfig({
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
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      }
    },
    commonjsOptions: {
      include: [/utils/, /node_modules/]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJHOlxcXFxHaXRodWIgUHJvamVjdHNcXFxcemVyaW8tdm9pY2VcXFxcYXBwc1xcXFx1aVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRzpcXFxcR2l0aHViIFByb2plY3RzXFxcXHplcmlvLXZvaWNlXFxcXGFwcHNcXFxcdWlcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0c6L0dpdGh1YiUyMFByb2plY3RzL3plcmlvLXZvaWNlL2FwcHMvdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbdnVlKCldLFxuICBiYXNlOiBcIlwiLFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXCJzaGFyZWRcIl1cbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6IFwiLi4vLi4vZGlzdC9odG1sXCIsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlc1wiKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlkXG4gICAgICAgICAgICAgIC50b1N0cmluZygpXG4gICAgICAgICAgICAgIC5zcGxpdChcIm5vZGVfbW9kdWxlcy9cIilbMV1cbiAgICAgICAgICAgICAgLnNwbGl0KFwiL1wiKVswXVxuICAgICAgICAgICAgICAudG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGNvbW1vbmpzT3B0aW9uczoge1xuICAgICAgaW5jbHVkZTogWy91dGlscy8sIC9ub2RlX21vZHVsZXMvXVxuICAgIH1cbiAgfVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdULFNBQVMsb0JBQW9CO0FBQzdVLE9BQU8sU0FBUztBQUdoQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxDQUFDO0FBQUEsRUFDZixNQUFNO0FBQUEsRUFDTixjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsUUFBUTtBQUFBLEVBQ3BCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixhQUFhLElBQUk7QUFDZixjQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IsbUJBQU8sR0FDSixTQUFTLEVBQ1QsTUFBTSxlQUFlLEVBQUUsQ0FBQyxFQUN4QixNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQ1osU0FBUztBQUFBLFVBQ2Q7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGlCQUFpQjtBQUFBLE1BQ2YsU0FBUyxDQUFDLFNBQVMsY0FBYztBQUFBLElBQ25DO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
