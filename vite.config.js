import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/chai-code-assignment1/",
    define: {
      "import.meta.env": JSON.stringify(env),
    },
  };
});
