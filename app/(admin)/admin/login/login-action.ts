"use server";

import { createSession } from "@/lib/auth/admin-session";
import { timingSafeEqual } from "crypto";

export default async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;
  if (!password) return { error: "Password is required" };

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return { error: "Server configuration error" };

  const buf1 = Buffer.from(password);
  const buf2 = Buffer.from(adminPassword);

  if (buf1.length !== buf2.length || !timingSafeEqual(buf1, buf2)) {
    return { error: "Invalid password" };
  }

  await createSession();
  return { ok: true };
}
