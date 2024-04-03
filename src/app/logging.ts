import { headers } from "next/headers";

export function logRequestHeaders() {
  const requestHeaders = headers();

  // Log all headers
  console.log("Request Headers:", Object.fromEntries(requestHeaders));

  // If you want to log a specific header
  console.log("User-Agent:", requestHeaders.get("user-agent"));
}
