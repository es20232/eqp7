"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
  cookies().delete("user");
  cookies().delete("access_token");
  cookies().delete("refresh_token");

  redirect("/auth/login");
}
