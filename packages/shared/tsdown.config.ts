import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    utils: "src/utils/index.ts",
    constants: "src/constants/index.ts",
  },
  outDir: "dist",
  format: ["esm"],
  target: "es2024",
  sourcemap: true,
  clean: true,
  dts: true,
  minify: false,
});
