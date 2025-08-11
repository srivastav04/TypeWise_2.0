"use client";

import { searchUsers } from "@/apiFunctions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import NavBar from "./NavBar";

export const SearchIcon = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function SearchBar() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastLoggedLength = useRef(0);

  const { data, refetch } = useQuery({
    queryKey: ["searchUsers", value],
    queryFn: ({ queryKey }) => searchUsers(queryKey[1]),
    enabled: false,
  });

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const length = value.length;
      if (
        length >= 2 &&
        length % 2 === 0 &&
        length !== lastLoggedLength.current
      ) {
        lastLoggedLength.current = length;
        setIsLoading(true);
        refetch().finally(() => setIsLoading(false));
      }
    }, 0); // better debounce

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, refetch]);

  const handleManualSearch = () => {
    setIsLoading(true);
    refetch().finally(() => setIsLoading(false));
  };

  return (
    <>
      <NavBar />
      <div className="w-auto  bg-black min-h-screen p-4">
        {/* Search Bar */}
        <div className="w-full h-14 flex items-center gap-3 bg-zinc-800 rounded-lg p-2">
          <Input
            placeholder="Search User"
            type="text"
            className="flex-1 h-10 rounded-md bg-white text-gray-800 placeholder-gray-500 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-shadow"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <Button
            size="sm"
            aria-label="Search"
            onClick={handleManualSearch}
            className="h-10 w-12 flex items-center justify-center rounded-md bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition-all"
          >
            <SearchIcon className="h-5 w-5" />
          </Button>
        </div>
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="mt-6 space-y-3 w-full">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="max-w-[300px] w-full flex items-center gap-3 p-2"
              >
                <Skeleton className="flex rounded-full w-12 h-12" />
                <div className="w-full flex flex-col gap-2">
                  <Skeleton className="h-3 w-4/5 rounded-lg" />
                  <Skeleton className="h-3 w-3/5 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search Results */}
        {data && data.users.length > 0 && !isLoading && (
          <div className="mt-4 space-y-3  rounded-xl">
            {data.users.map((user: any) => (
              <Link
                href={`/profile/${user.userId}`}
                key={user.userId}
                className="flex items-center gap-4 rounded-lg mt-4 bg-white p-4"
                aria-label={`Open profile for ${user.username}`}
              >
                {/* avatar — fixed size, won't stretch */}
                <div className="w-12 h-12 flex-shrink-0">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={user.avatar || "https://github.com/shadcn.png"}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <AvatarFallback className="w-12 h-12 flex items-center justify-center text-black rounded-full">
                      {user.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* text block */}
                <div className="min-w-0">
                  <p className="font-medium text-lg text-black truncate">
                    {user.username}
                  </p>
                  {/* optional subtitle — remove if you don't want it */}
                  <p className="text-sm text-gray-400 truncate leading-tight">
                    @{user.userId}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {/* No Results */}
        {data && data.users.length === 0 && !isLoading && (
          <div className="mt-14 text-center text-white font-bold text-3xl">
            No users found.
          </div>
        )}
      </div>
    </>
  );
}
