'use client';

import { motion } from 'framer-motion';

interface StreamControlsProps {
    isStreaming: boolean;
    onStartStreaming: () => void;
    onStopStreaming: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export default function StreamControls({
    isStreaming,
    onStartStreaming,
    onStopStreaming,
    isLoading = false,
    disabled = false,
}: StreamControlsProps) {
    return (
        <div className="flex items-center justify-center gap-4">
            {!isStreaming ? (
                <motion.button
                    whileHover={{ scale: disabled ? 1 : 1.05 }}
                    whileTap={{ scale: disabled ? 1 : 0.95 }}
                    onClick={onStartStreaming}
                    disabled={isLoading || disabled}
                    className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white font-semibold py-4 px-8 rounded-2xl hover:shadow-lg hover:shadow-[hsl(var(--primary))]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 0 00-2-2H5a2 0 00-2 2v8a2 0 002 2z"
                        />
                    </svg>
                    <span>{disabled ? '최대 2명까지 스트리밍 가능' : '내 Cam 공유하기'}</span>
                </motion.button>
            ) : (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStopStreaming}
                    className="bg-destructive/80 hover:bg-destructive text-white font-semibold py-4 px-8 rounded-2xl hover:shadow-lg hover:shadow-destructive/30 transition-all flex items-center gap-3"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        />
                    </svg>
                    <span>Cam 공유 끄기</span>
                </motion.button>
            )}
        </div>
    );
}
