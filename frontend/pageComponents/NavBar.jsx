"use client";

import Link from 'next/link';
import { LogoutButton } from './LogoutButton';
export default function NavBar() {

    const routes = [
        { name: 'Home', path: '/home' },
        {
            name: 'Profile',
            path: '/profile'
        },
        {
            name: 'Search',
            path: '/search'
        }
    ]
    return (
        <nav
            className="flex justify-between items-center px-6 py-4 bg-black border-b-1 border-gray-500"
        >
            <div className="flex flex-col">
                <h1 className="text-4xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-purple-400 to-pink-500">
                    TypeWise
                </h1>

            </div>

            <div className="flex space-x-6">
                {routes.map((text, idx) => (
                    <Link
                        key={idx}
                        href={text.path}
                        className="mt-1 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-purple-400 to-pink-500 hover:from-cyan-900 hover:via-fuchsia-900 hover:to-rose-900 transition duration-300"
                    >
                        {text.name}
                    </Link>
                ))}
                <LogoutButton />

            </div>
        </nav>


    )
}