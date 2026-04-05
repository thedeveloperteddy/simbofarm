import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
    onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 300); // Shorter delay
                    return 100;
                }
                return prev + 3; // Faster progress
            });
        }, 30);

        return () => {
            clearInterval(interval);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center"
            >
                {/* Main Content */}
                <div className="flex flex-col items-center space-y-6">
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-gray-100"
                    >
                        <img
                            src="https://storage.googleapis.com/dala-prod-public-storage/attachments/d4100ad4-9ffe-48fa-a13d-5492823abfd0/1771921446551_1765997464780_1.jpg"
                            alt="Simbo Farm Logo"
                            className="w-14 h-14 object-contain rounded-xl"
                        />
                    </motion.div>

                    {/* Simple Loader */}
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 200 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden"
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                            className="h-full bg-orange-500 rounded-full"
                        />
                    </motion.div>

                    {/* Attribution Text */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                        className="text-xs text-gray-500 font-medium tracking-wide"
                    >
                        built by ETLINE subsystems
                    </motion.p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}