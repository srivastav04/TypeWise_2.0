"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/pageComponents/NavBar";
import TypingTest from "@/pageComponents/TypingTest";
import LoadingPage from "@/pageComponents/Loading";
import useStore from "@/store";

export default function HomePage() {
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  // ✅ Wait for Zustand to hydrate before running any logic
  useEffect(() => {
    if (typeof useStore.persist?.hasHydrated === "function") {
      const unsub = useStore.persist.onFinishHydration(() => {
        setHasHydrated(true);
      });
      // If already hydrated
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

  return (
    <>
      <NavBar />
      <TypingTest />
    </>
  );
}
