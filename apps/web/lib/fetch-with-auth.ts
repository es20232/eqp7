"use server";

import { AccessToken} from "@/app/types/tokens";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { cookies } from "next/headers";
import { API_URL } from "./env";

export async function fetchWithAuth(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const accessTokenCookie = cookies().get("access_token")?.value;
  const accessToken: AccessToken =
    accessTokenCookie && JSON.parse(accessTokenCookie);
  
  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken.value}` }),
    },
  });
}