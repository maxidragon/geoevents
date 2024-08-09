import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import svgrPlugin from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    optimizeDeps: {
        include: [
            "@emotion/react",
            "@emotion/styled",
            "@mui/material/Tooltip",
            "@mui/material/styles",
        ],
    },
    plugins: [
        react({
            jsxImportSource: "@emotion/react",
            babel: {
                plugins: ["@emotion/babel-plugin"],
            },
        }),
        checker({
            overlay: { initialIsOpen: false },
            typescript: true,
            eslint: {
                lintCommand: "eslint --ext .js,.jsx,.ts,.tsx src",
            },
        }),
        viteTsconfigPaths(),
        svgrPlugin(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
