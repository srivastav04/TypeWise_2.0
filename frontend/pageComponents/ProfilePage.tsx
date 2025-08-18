"use client";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "@/apiFunctions";
import { useParams } from "next/navigation";
import { Component } from "./Chart";
import LoadingPage from "./Loading";

export default function ProfilePage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id;

  if (!userId) {
    return <LoadingPage />;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getUserData(userId),
    enabled: !!userId,
  });

  if (isLoading || !data) return <LoadingPage />;
  if (error) return <div>Something went wrong.</div>;

  const MAX = 20;

  const scores = data?.scores ?? [];
  const accuracyArr = data?.accuracy ?? [];

  const extracted = scores.slice(-MAX).map((wpm: any, idx: number) => {
    const originalIndex = scores.length - Math.min(MAX, scores.length) + idx;
    return {
      month: originalIndex + 1,
      WPM: wpm,
      accuracy: accuracyArr[originalIndex] ?? null,
    };
  });

  const highestWPM = data?.scores?.length ? Math.max(...data?.scores) : 0;
  const highestAccuracy = data?.accuracy?.length
    ? Math.max(...data?.accuracy)
    : 0;

  return (
    <>
      {data && (
        <div className="min-h-screen bg-black text-white">
          <div className="px-6 py-12 max-w-6xl mx-auto">
            <header className="mb-12">
              <div className="flex items-center gap-6 p-4 bg-white/5 rounded-xl backdrop-blur-lg">
                <img
                  src={data?.avatar}
                  alt="avatar"
                  className="w-32 h-32 rounded-full border-4 border-teal-400"
                />
                <div>
                  <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-purple-400 to-pink-500">
                    {data?.username}
                  </h1>
                  <p className="mt-2 text-gray-400">
                    Joined: {data?.createdAt?.slice(0, 10)}
                  </p>
                  <p className="text-gray-400">
                    Tests Taken: {data?.totalTests}
                  </p>
                </div>
              </div>
            </header>

            {/* Stats Section */}
            <section className="mb-16 grid grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 rounded-lg text-center">
                <h2 className="text-xl font-bold text-teal-300">Highest WPM</h2>
                <p className="text-3xl font-bold">{highestWPM.toFixed(1)}</p>
              </div>
              <div className="bg-white/5 p-6 rounded-lg text-center">
                <h2 className="text-xl font-bold text-purple-300">
                  Highest Accuracy
                </h2>
                <p className="text-3xl font-bold">
                  {highestAccuracy.toFixed(1)}%
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-lg text-center">
                <h2 className="text-xl font-bold text-pink-300">Average WPM</h2>
                <p className="text-3xl font-bold">
                  {data?.averageScore?.toFixed(1)}
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-lg text-center">
                <h2 className="text-xl font-bold text-yellow-300">
                  Average Accuracy
                </h2>
                <p className="text-3xl font-bold">
                  {data?.averageAccuracy.toFixed(1)}%
                </p>
              </div>
            </section>

            <section className="mb-16">
              {data.scores.length > 0 ? (
                <>
                  <h1 className="text-3xl font-bold mb-4">Recent Tests</h1>
                  <Component data={extracted} />
                </>
              ) : (
                <>
                  <div className="mt-14 text-center text-white font-bold text-3xl">
                    No Tests Given.
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
