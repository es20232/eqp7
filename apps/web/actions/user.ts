"use server";

import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function editUser(params: FormData) {
  const response = await fetchWithAuth(
    "/user/update",
    {
      method: "PUT",
      body: params,
    },
    "form-data",
  );

  const data = await response.json();

  if (response.ok) {
    cookies().set("user", JSON.stringify(data.updatedUserResponse));
    redirect("/account");
  }

  return {
    error: data.message,
  };
}
