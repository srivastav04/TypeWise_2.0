"use client"
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import Link from 'next/link';

const NeonRays = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const horizontalLines = [10, 25, 40, 55, 70, 85];
    const verticalLines = [15, 30, 45, 60, 75, 90];
    const diagonalLines = [
        { rotation: 45, offset: '30%' },
        { rotation: 135, offset: '60%' }
    ];

    // Generate random letters with positions and delays
    const fallingLetters = useMemo(() =>
        Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            char: characters[Math.floor(Math.random() * characters.length)],
            left: Math.random() * 95,
            delay: Math.random() * 5,
            duration: 8 + Math.random() * 4
        })), []
    );

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-black px-4 overflow-hidden">
            {/* Falling Letters */}
            <div className="absolute inset-0 z-0">
                {fallingLetters.map(({ id, char, left, delay, duration }) => (
                    <motion.span
                        key={id}
                        className="absolute font-mono text-xl bg-clip-text text-transparent bg-gradient-to-b from-cyan-300 via-purple-300/30 to-pink-400"
                        style={{
                            left: `${left}%`,
                            top: '-2em',
                        }}
                        animate={{
                            y: '110vh',
                            opacity: [0, 0.6, 0.3, 0],
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            delay: delay,
                            ease: 'linear'
                        }}
                    >
                        {char}
                    </motion.span>
                ))}
            </div>

            {/* Neon Grid */}
            {horizontalLines.map((percent, idx) => (
                <motion.div
                    key={`h-${idx}`}
                    className="absolute left-0 w-full h-px bg-gradient-to-r from-cyan-400 to-transparent opacity-60 z-10"
                    style={{ top: `calc(${percent}% - 1px)` }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 4 + idx * 1.5, ease: 'linear' }}
                />
            ))}

            {verticalLines.map((percent, idx) => (
                <motion.div
                    key={`v-${idx}`}
                    className="absolute top-0 h-full w-px bg-gradient-to-b from-purple-400 to-transparent opacity-60 z-10"
                    style={{ left: `calc(${percent}% - 1px)` }}
                    animate={{ y: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 5 + idx * 1.8, ease: 'linear' }}
                />
            ))}

            {diagonalLines.map((line, idx) => (
                <motion.div
                    key={`d-${idx}`}
                    className="absolute w-[200%] h-px bg-gradient-to-r from-pink-500 to-transparent opacity-50 z-10"
                    style={{
                        transform: `rotate(${line.rotation}deg)`,
                        ...(line.rotation === 45 ? { top: line.offset } : { bottom: line.offset }),
                    }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 6 + idx * 2, ease: 'linear' }}
                />
            ))}
            <div className="relative z-20 text-center space-y-4">
                {/* Main Heading (no background glow) */}
                <motion.h1
                    className="pb-4 text-7xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 "
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                >
                    TypeWise
                </motion.h1>

                {/* Subtitle (unchanged) */}
                <motion.p
                    className="text-lg md:text-xl max-w-2xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-300/90 to-purple-300/80 font-light tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    transition={{ delay: 0.4, duration: 1 }}
                >
                    You got one life type it away, each keystroke a chance to turn your story.
                </motion.p>


                <Link href={'/login'}>
                    <motion.div
                        className="mt-8"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <motion.button
                            className="
          px-8 py-3.5 rounded-lg font-semibold text-lg
          bg-gradient-to-r from-cyan-600 to-purple-600
          text-white
          transition-transform
        "
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Started
                        </motion.button>
                    </motion.div>
                </Link>
            </div>

        </div>

    );
};

export default NeonRays;