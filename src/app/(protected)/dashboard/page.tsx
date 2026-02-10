// src/app/(protected)/dashboard/page.tsx
import { getProfileFromPreload } from "@/convex/query.config";
import { combinedSlug } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  let profileName: string | null = null;

  try {
    const profile = await getProfileFromPreload();
    profileName = profile?.name || null;
  } catch (error) {
    console.error("Failed to get profile:", error);
  }

  if (!profileName) {
    redirect("/auth/sign-in");
  }

  redirect(`/dashboard/${combinedSlug(profileName)}`);
}