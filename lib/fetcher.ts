import { BASE_URL } from "@/config/global";
import { deleteCookie, getCookie } from "cookies-next";
import { ErrorResponse } from "@/types/global";
import NetworkError from "@/utils/network-error";
import { notFound, redirect } from "next/navigation";
import { userActionOutsideOfComponent } from "@/global-store/user";

interface CustomRequestInit extends RequestInit {
  redirectOnError?: boolean;
}

const fetcher = async <T>(input: string | string[], init?: CustomRequestInit): Promise<T> => {
  const url = `${BASE_URL}${Array.isArray(input) ? input[0] : input}`;
  
  // Debug logging
  if (!BASE_URL) {
    console.error('❌ BASE_URL is undefined!', {
      BASE_URL,
      input,
      constructedUrl: url,
      env: process.env.NEXT_PUBLIC_BASE_URL
    });
  }

  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        Authorization: getCookie("token") as string,
        ...init?.headers,
      },
    });

    if (!res.ok) {
      const errorResponse = (await res.json()) as ErrorResponse;
      // eslint-disable-next-line
      let errorMessage = errorResponse.message;
      if (errorResponse?.params) {
        // eslint-disable-next-line prefer-destructuring
        errorMessage = Object.values(errorResponse.params)?.[0]?.[0];
      }
      if (res.status === 401) {
        userActionOutsideOfComponent({ user: null });
        deleteCookie("token");
        return redirect("/");
      }
      if (init?.redirectOnError && res.status === 404) {
        return notFound();
      }
      throw new NetworkError(errorMessage, res.status, errorResponse?.params);
    }
    return res.json();
  } catch (error) {
    // Handle network errors more gracefully
    if (error instanceof NetworkError) {
      throw error;
    }

    // For fetch failures (network issues, server down, etc.)
    console.error("Fetch failed:", error);
    throw new NetworkError(
      "Network error: Unable to connect to server. Please check your internet connection and try again.",
      0,
      {}
    );
  }
};

export default fetcher;

interface MutationRequestInit extends Omit<RequestInit, "body" | "method"> {
  body: unknown;
}

fetcher.post = async <T>(input: string, init?: MutationRequestInit): Promise<T> =>
  fetcher(input, {
    ...init,
    method: "POST",
    body: JSON.stringify(init?.body),
    headers: { "Content-Type": "application/json" },
  });

fetcher.put = async <T>(input: string, init?: MutationRequestInit): Promise<T> =>
  fetcher(input, {
    ...init,
    method: "PUT",
    body: JSON.stringify(init?.body),
    headers: { "Content-Type": "application/json" },
  });

fetcher.delete = async <T>(input: string, init?: MutationRequestInit): Promise<T> =>
  fetcher(input, {
    ...init,
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(init?.body),
  });

// Request function for services
interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any>;
  body?: unknown;
}

export const request = async <T>(options: RequestOptions): Promise<T> => {
  const { url, method = 'GET', params, body } = options;
  
  // Build URL with query parameters
  let fullUrl = url;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  if (method === 'GET') {
    return fetcher<T>(fullUrl);
  } else if (method === 'POST') {
    return fetcher.post<T>(fullUrl, { body });
  } else if (method === 'PUT') {
    return fetcher.put<T>(fullUrl, { body });
  } else if (method === 'DELETE') {
    return fetcher.delete<T>(fullUrl, { body });
  }
  
  throw new Error(`Unsupported method: ${method}`);
};
