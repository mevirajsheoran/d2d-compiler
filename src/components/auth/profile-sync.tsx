// src/components/auth/profile-sync.tsx
"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setProfile } from "@/redux/slice/profile";
import { normalizeProfile, ConvexUserRaw } from "@/types/user";

/**
 * Syncs the authenticated user's profile to Redux.
 * This is a safety net — profile should already be preloaded in layout.tsx,
 * but if the preload fails, this will catch it client-side.
 */
export function ProfileSync() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.profile.user);
  const convexUser = useQuery(api.user.getCurrentUser);

  useEffect(() => {
    // If we already have a user in Redux, skip
    if (currentUser) return;

    // If Convex returned a user, sync to Redux
    if (convexUser) {
      const profile = normalizeProfile(convexUser as unknown as ConvexUserRaw);
      if (profile) {
        dispatch(setProfile(profile));
      }
    }
  }, [convexUser, currentUser, dispatch]);

  return null; // This component renders nothing
}