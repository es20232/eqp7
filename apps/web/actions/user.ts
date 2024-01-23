"use server";

import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type EditUserParams = {
  name: string;
  username: string;
  bio: string;
  profilePicture: string;
};

export async function editUser(params: EditUserParams) {
  console.log(params);

  const response = await fetchWithAuth("/user/update", {
    method: "PUT",
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (response.ok) {
    cookies().set("user", JSON.stringify(data.updatedUserResponse));
    redirect("/account");
  }

  return {
    error: data.message,
  };
}
