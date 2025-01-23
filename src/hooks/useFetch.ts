import { typedUseStoreState } from "../store";

export function useFetch() {
  const keycloak = typedUseStoreState((state) => state.auth.keycloak);

  async function httpRequest<T>(
    path: string,
    config: RequestInit = {},
    allowRetry = true,
    overwriteBaseUrl?: string
  ): Promise<{ error?: { message: string; fields?: string[] }; data?: T }> {
    if (keycloak.isTokenExpired()) {
      await keycloak.updateToken(10);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (!overwriteBaseUrl) path = import.meta.env.VITE_BACKEND_URL + path;
    if (overwriteBaseUrl) path = overwriteBaseUrl + path;

    config.headers = new Headers(config.headers);
    config.headers.set("Authorization", `Bearer ${keycloak.token}`);

    if (config.body) {
      config.headers.set("Content-Type", "application/json");
      // config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(path, config);
      const { success, data, error } = await response.json();
      if (!success) {
        // token expired?
        if (
          response.status === 401 &&
          error.message === "You are not authorized to access this resource." &&
          keycloak.isTokenExpired() &&
          allowRetry
        ) {
          await keycloak.updateToken(10);
          return await httpRequest(path, config, false);
        }
        return { error: error || { message: "Failed to perform request" } };
      }
      return { data: data || {} };
    } catch (err) {
      return { error: { message: "Failed to perform request" } };
    }
  }

  return httpRequest;
}
