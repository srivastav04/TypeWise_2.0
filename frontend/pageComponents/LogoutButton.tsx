"use client";
import React from "react";
import { handleLogout } from "@/apiFunctions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

export const LogoutButton = () => {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: handleLogout,
    onSuccess() {
      router.replace("/login");
    },
  });

  return (
    <>
      {isPending ? (
        <Button disabled>
          <Loader2Icon className="animate-spin h-5 w-5" />
          Logging out
        </Button>
      ) : (
        <Button
          onClick={() => mutate()}
          className="p-0 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-purple-400 to-pink-500 hover:from-cyan-900 hover:via-fuchsia-900 hover:to-rose-900 transition duration-300"
        >
          Logout
        </Button>
      )}
    </>
  );
};
