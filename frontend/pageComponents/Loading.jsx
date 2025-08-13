import { motion } from 'framer-motion';

const LoadingPage = () => {
    return (
        <div className="w-screen h-screen bg-black flex flex-col items-center justify-center overflow-hidden space-y-8">

            {/* Holographic Text */}
            <motion.div
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                animate={{
                    textShadow: [
                        '0 0 8px rgba(34,211,238,0.3)',
                        '0 0 12px rgba(168,85,247,0.4)',
                        '0 0 8px rgba(236,72,153,0.3)'
                    ],
                    opacity: [0.8, 1, 0.8]
                }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
                Loading...
            </motion.div>
            {/* Pulsing Energy Beam */}
            <div className="relative w-64 h-4 rounded-full overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-500/50 to-pink-400/30"
                    animate={{
                        opacity: [0.4, 0.8, 0.4],
                        scaleX: [0.8, 1.2, 0.8],
                    }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 blur-sm"
                    animate={{
                        opacity: [0.2, 0.5, 0.2],
                        scaleX: [0.5, 1.5, 0.5],
                    }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                />
            </div>
        </div>
    );
};

export default LoadingPage;