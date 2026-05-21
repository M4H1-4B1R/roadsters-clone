"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/lib/auth/admin-session";

export default async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
