// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "react-router-dom": "react-router-dom",
//     },
//   },
//   server: {
//     proxy: {
//       "/api": {
//         target: "https://api.football-data.org",
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ""),
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // You can add aliases here if needed
      // For example, aliasing some paths
      // '@components': '/src/components',
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://api.football-data.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
