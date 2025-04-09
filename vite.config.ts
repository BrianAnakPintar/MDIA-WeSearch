import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  assetsInclude: ["**/*.pdf"],
  server: {
    watch: {
      // Ignore backend folder (adjust the path if needed)
      ignored: ['**/backend/**'], // or "**/backend/**" depending on your folder structure
    },
  },
});
