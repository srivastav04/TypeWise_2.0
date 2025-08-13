"use client";

import { Loader2Icon } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { handleLogin } from "@/apiFunctions";
import { useRouter } from "next/navigation";
import useStore from "@/store";
export type FormValues = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
  const setId = useStore((state) => state.setId);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const { mutateAsync } = useMutation({
    mutationFn: handleLogin,
    onSuccess(data) {
      const { status, id } = data;
      if (status) {
        setIsLoggedIn(true);
        setId(id);
        router.replace("/home");
      }
    },
    onError(error: any) {
      if (!error) return;

      Object.entries(error.error).forEach(([key, message]) => {
        if (key === "username" || key === "password" || key === "root") {
          setError(key as "username" | "password" | "root", {
            type: "manual",
            message: message as string,
          });
        } else {
          setError("root", {
            type: "manual",
            message: "Something went wrong",
          });
        }
      });
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { username, password } = data;
    if (username.length < 5) {
      setError("username", { message: "Must be at least 5 characters." });
      return;
    }
    if (password.length < 5) {
      setError("password", { message: "Must be at least 5 characters." });
      return;
    }
    await mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Username
        </label>
        <Input
          {...register("username", {
            required: true,
          })}
          disabled={isSubmitting}
          type="text"
          name="username"
          className="w-full px-4 py-3.5 rounded-lg bg-[#2a2a40] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <Input
          {...register("password", {
            required: true,
          })}
          disabled={isSubmitting}
          type="password"
          name="password"
          className="w-full px-4 py-3.5 rounded-lg bg-[#2a2a40] text-white placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {errors.root && (
        <p className="text-red-500 text-sm mt-2">{errors.root.message}</p>
      )}

      {isSubmitting ? (
        <Button
          disabled
          className="w-full py-3.5 mt-6 rounded-lg bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 text-white font-medium text-lg shadow-md shadow-purple-500/40 hover:shadow-pink-500/50 transition-transform duration-200 hover:scale-[1.02]"
        >
          <Loader2Icon className="animate-spin h-5 w-5" />
          Please wait...
        </Button>
      ) : (
        <Button className="w-full py-3.5 mt-6 rounded-lg bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 text-white font-medium text-lg shadow-md shadow-purple-500/40 hover:shadow-pink-500/50 transition-transform duration-200 hover:scale-[1.02]">
          Submit
        </Button>
      )}
    </form>
  );
}
