import { defineConfig, loadEnv } from "vite";
import legacy from "@vitejs/plugin-legacy";

export default ({ mode }) => {
  const outDir = "build";
  const publicDir = "public";
  const [buildMode, platform] = mode.split("-");
  console.log(
    "🚀 Building the app in mode: ",
    buildMode,
    " for platform: ",
    platform
  );

  const plugins = [
    legacy({
      renderModernChunks: false,
      targets: ["Chrome >= 53", "not dead"],
    }),
  ];

  return defineConfig({
    base: "",
    publicDir,
    plugins,
    server: {
      host: true,
      port: 3001,
      strictPort: true,
    },
    build: {
      outDir,
      target: "es2015",
      emptyOutDir: true,
      minify: false,
      sourcemap: platform !== "web",
    },
    esbuild: {
      drop: platform === "web" ? ["console"] : [],
    },
  });
};
