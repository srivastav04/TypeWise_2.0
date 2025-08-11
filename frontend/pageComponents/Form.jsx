"use client";

import LoginForm from "@/pageComponents/LoginForm";
import SignUpForm from "@/pageComponents/SignUpForm";
import { useState } from "react";

export default function Form() {
    const [method, setMethod] = useState(true);

    return (
        <div className="relative z-10 w-full max-w-sm p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg shadow-cyan-500/30 overflow-hidden">

            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-purple-400 to-pink-500 text-center mb-6">
                {method ? "Login to Your Account" : "Create an Account"}
            </h1>

            {method ? <LoginForm /> : <SignUpForm />}

            <div className="text-center pt-4">
                {method ? (
                    <p className="text-sm text-gray-400 mb-2">
                        Don't have an account?
                        <span
                            className="ml-1 text-sm text-blue-500"
                            onClick={() => setMethod((prev) => !prev)}
                        >
                            Sign Up
                        </span>
                    </p>
                ) : (
                    <p className="text-sm text-gray-400 mb-2">
                        Already have an account?
                        <span
                            className="ml-1 text-sm text-blue-500"
                            onClick={() => setMethod((prev) => !prev)}
                        >
                            Login
                        </span>
                    </p>
                )}
            </div>
        </div>

    );
}