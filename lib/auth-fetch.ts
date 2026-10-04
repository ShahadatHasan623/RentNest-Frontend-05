import { getAccessToken } from "./auth";

export const authFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  try {
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

    const url = `${process.env.BACKEND_API_URL}${endpoint}`;


    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");


    if (!response.ok) {
      return {
        success: false,
        message: `API request failed with status ${response.status}`,
        data: null,
      };
    }

    if (!contentType?.includes("application/json")) {
      const text = await response.text();

      console.error("EXPECTED JSON BUT GOT:", text);

      return {
        success: false,
        message: "API returned a non-JSON response",
        data: null,
      };
    }

    return await response.json();
  } catch (error) {
    console.error("AUTH FETCH ERROR:", error);

    return {
      success: false,
      message: "Failed to fetch API",
      data: null,
    };
  }
};