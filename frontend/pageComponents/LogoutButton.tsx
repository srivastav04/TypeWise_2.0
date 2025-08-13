"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useStore from "@/store";

export const LogoutButton = () => {
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
  const router = useRouter();

  const handleClick = () => {
    setIsLoggedIn(false);
    router.replace("/login");
  };

  return (
    <Button
      onClick={handleClick}
      className="p-0 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-purple-400 to-pink-500 hover:from-cyan-900 hover:via-fuchsia-900 hover:to-rose-900 transition duration-300"
    >
      Logout
    </Button>
  );
};
