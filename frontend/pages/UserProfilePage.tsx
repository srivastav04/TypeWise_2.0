"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store";
import Profile from "@/pageComponents/Profile";
import LoadingPage from "@/pageComponents/Loading";

export default function UserProfilePage() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const router = useRouter();
  const hasHydrated =
    typeof useStore.persist?.hasHydrated === "function"
      ? useStore.persist.hasHydrated()
      : false;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasHydrated && !isLoggedIn) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [hasHydrated, isLoggedIn, router]);

  if (loading || !hasHydrated) {
    return <LoadingPage />;
  }

  return <Profile />;
}
