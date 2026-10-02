import { getAccessToken } from "./auth";

export const authFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const auth = await getAccessToken();

  if (!auth.success || !auth.accessToken) {
    return {
      success: false,
      message: auth.message || "Unauthorized",
      data: null,
    };
  }

  const headers = new Headers(options.headers);

  headers.set(
    "Cookie",
    `accessToken=${auth.accessToken}`
  );

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(
    `${process.env.BACKEND_API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  return response.json();
};