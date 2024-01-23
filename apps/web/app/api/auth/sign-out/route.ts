import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export function POST() {
  cookies().delete("user");
  cookies().delete("access_token");
  cookies().delete("refresh_token");

  redirect("/auth/login");
}
