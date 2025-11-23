'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface VideoDisplayProps {
    stream: MediaStream | null;
    isLocal?: boolean;
}

export default function VideoDisplay({ stream, isLocal = false }: VideoDisplayProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const toggleMute = () => {
        if (stream && isLocal) {
            const audioTracks = stream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    if (!stream) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[hsl(220,20%,12%)] to-[hsl(220,20%,8%)] rounded-2xl"
            >
                <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto rounded-full bg-white/5 flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-lg font-medium text-foreground/80">
                            스트림이 없습니다
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {isLocal
                                ? '아래 버튼을 눌러 Cam을 공유하세요'
                                : '공유되는 Cam을 기다리는 중...'}
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[hsl(220,20%,12%)] to-[hsl(220,20%,8%)]"
        >
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocal}
                className="w-full h-full object-contain"
                style={{ transform: 'scaleX(-1)' }}
            />

            {/* 라이브 인디케이터 */}
            {stream && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-6 left-6 flex items-center gap-2 glass-effect px-4 py-2 rounded-full"
                >
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-medium text-white">LIVE</span>
                </motion.div>
            )}

            {/* 음소거 버튼 (로컬 스트림만) */}
            {isLocal && stream && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={toggleMute}
                    className="absolute bottom-6 right-6 glass-effect p-3 rounded-full hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {isMuted ? (
                        <svg
                            className="w-6 h-6 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                            />
                        </svg>
                    )}
                </motion.button>
            )}
        </motion.div>
    );
}
