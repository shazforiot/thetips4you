import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";
export default defineConfig({
  base: "/thetips4you/",
  plugins: [react()],
  css: { postcss: { plugins: [tailwindcss()] } },
});
