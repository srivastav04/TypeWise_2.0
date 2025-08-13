"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store";
import ProfilePage from "@/pageComponents/ProfilePage";
import LoadingPage from "@/pageComponents/Loading";

export default function OtherProfilePage() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const hasHydrated =
    typeof useStore.persist?.hasHydrated === "function"
      ? useStore.persist.hasHydrated()
      : false;
  useEffect(() => {
    if (hasHydrated && !isLoggedIn) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, router]);

  if (loading || !hasHydrated) {
    return <LoadingPage />;
  }

  return <ProfilePage />;
}
