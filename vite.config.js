import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/destination-discovery-guide/",
    build: { sourcemap: false },
    plugins: [react()],
});
