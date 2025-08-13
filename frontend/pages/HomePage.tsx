// HomePage.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/pageComponents/NavBar";
import TypingTest from "@/pageComponents/TypingTest";
import LoadingPage from "@/pageComponents/Loading";
import useStore from "@/store";

export default function HomePage() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const router = useRouter();
  const hasHydrated = useStore.persist.hasHydrated();

  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <NavBar />
      <TypingTest />
    </>
  );
}
