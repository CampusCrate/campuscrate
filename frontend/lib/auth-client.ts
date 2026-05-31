"use client";
import { useAuth } from "./AuthProvider";

export const useSession = () => {
  const { user, isPending } = useAuth();
  return { data: { user }, isPending };
};

export const signOut = async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

