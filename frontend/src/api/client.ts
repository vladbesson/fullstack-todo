import { client } from "./generated/client.gen"

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "")

if (!API_URL) {
  throw new Error("Set VITE_API_URL in the root .env file.")
}

client.setConfig({ baseUrl: API_URL })

export { client }
