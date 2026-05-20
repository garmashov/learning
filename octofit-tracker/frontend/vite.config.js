import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { transform } from "esbuild";

function jsxInJsPlugin() {
  return {
    name: "jsx-in-js-plugin",
    enforce: "pre",
    async transform(code, id) {
      if (!id.endsWith(".js")) return;
      if (id.includes("node_modules") || id.includes("@vite")) return;
      if (!/[<>]/.test(code)) return;
      try {
        const result = await transform(code, {
          loader: "jsx",
          sourcefile: id,
          sourcemap: true,
        });
        let transformedCode = result.code;
        const hasReactImport = /^\s*import\s+React\s+from\s+["']react["'];/m.test(code);
        if (!hasReactImport && /React\.createElement\(/.test(transformedCode)) {
          transformedCode = `import React from \"react\";\n${transformedCode}`;
        }
        return {
          code: transformedCode,
          map: result.map,
        };
      } catch {
        return null;
      }
    },
  };
}

export default defineConfig({
  plugins: [
    jsxInJsPlugin(),
    react({
      include: "**/*.{js,jsx,ts,tsx}",
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
