import { Client, extractErrorMessage } from "../Client/Client";

export async function refreshToken(): Promise<string | null> {
  try {
    const res = await Client.post<{ token: string }>("/auth/refresh", {});
    const token = res.data?.token;
    if (token) {
      localStorage.setItem("auth_token", token);
      return token;
    }
    return null;
  } catch (e) {
    console.error(
      "Failed to refresh token:",
      extractErrorMessage(e, "Failed to refresh token")
    );
    return null;
  }
}
