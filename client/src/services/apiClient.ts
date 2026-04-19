const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";

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
    const errorMessage =
      isJson &&
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
