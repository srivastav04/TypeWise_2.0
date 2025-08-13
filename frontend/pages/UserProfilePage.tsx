"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store";
import Profile from "@/pageComponents/Profile";
import LoadingPage from "@/pageComponents/Loading";

export default function UserProfilePage() {
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (typeof useStore.persist?.hasHydrated === "function") {
      const unsub = useStore.persist.onFinishHydration(() => {
        setHasHydrated(true);
      });
      if (useStore.persist.hasHydrated()) {
        setHasHydrated(true);
      }
      return unsub;
    } else {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, hasHydrated, router]);

  if (!hasHydrated) {
    return <LoadingPage />;
  }

  return <Profile />;
}
