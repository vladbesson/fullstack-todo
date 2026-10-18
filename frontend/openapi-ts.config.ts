import { resolve } from "node:path"
import { defineConfig } from "@hey-api/openapi-ts"
import { loadEnv } from "vite"

const env = loadEnv(
  process.env.NODE_ENV ?? "development",
  resolve(import.meta.dirname, ".."),
  "VITE_"
)

if (!env.VITE_API_URL) {
  throw new Error("Set VITE_API_URL in the root .env file.")
}

export default defineConfig({
  input: `${env.VITE_API_URL.replace(/\/+$/, "")}/openapi.json`,
  output: "src/api/generated",
  plugins: ["@hey-api/typescript"],
})
