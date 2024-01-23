import { User } from "lucide-react";
import { cookies } from "next/headers";

export type User = {
  name: string;
  username: string;
  email: string;
  profilePictureUrl: string;
  bio: string;
};

export function useUser(): User | undefined {
  const userCookie = cookies().get("user")?.value;

  if (!userCookie) return undefined;

  const user = JSON.parse(userCookie);

  return user;
}
