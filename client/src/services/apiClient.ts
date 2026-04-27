const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";
const API_BASE_URL =
  configuredBaseUrl || (import.meta.env.DEV ? "http://localhost:8080" : "");

type ApiClientOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export const apiClient = async <TResponse>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<TResponse> => {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  const hasBody = options.body !== undefined;
  const headers: HeadersInit = {
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
    ...(options.headers ?? {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    body: hasBody ? JSON.stringify(options.body) : undefined,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const choreoMessage =
      isJson &&
      payload !== null &&
      typeof payload === "object" &&
      "error_message" in payload &&
      typeof (payload as { error_message?: string }).error_message === "string"
        ? (payload as { error_message: string }).error_message
        : null;

    const choreoDescription =
      isJson &&
      payload !== null &&
      typeof payload === "object" &&
      "error_description" in payload &&
      typeof (payload as { error_description?: string }).error_description ===
        "string"
        ? (payload as { error_description: string }).error_description
        : null;

    const errorMessage =
      choreoMessage && choreoDescription
        ? `${choreoMessage}: ${choreoDescription}`
        : choreoMessage
          ? choreoMessage
          : isJson &&
              payload !== null &&
              typeof payload === "object" &&
              (("message" in payload && typeof payload.message === "string") ||
                ("error" in payload && typeof payload.error === "string"))
            ? "message" in payload && typeof payload.message === "string"
              ? payload.message
              : (payload as { error: string }).error
            : `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return payload as TResponse;
};
