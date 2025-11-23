'use client';

import { useWebRTC } from '@/hooks/useWebRTC';
import VideoDisplay from '@/components/VideoDisplay';
import StreamControls from '@/components/StreamControls';
import { motion } from 'framer-motion';

export default function TamagochiPage() {
    const {
        localStream,
        remoteStream,
        isStreaming,
        currentStreamer,
        startStreaming,
        stopStreaming,
        error,
    } = useWebRTC();

    // 표시할 스트림 결정: 내가 스트리밍 중이면 내 스트림, 아니면 원격 스트림
    const displayStream = isStreaming ? localStream : remoteStream;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(220,20%,12%)] to-[hsl(280,100%,10%)] relative overflow-hidden">
            {/* 배경 효과 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[hsl(var(--primary))] to-transparent opacity-5 blur-3xl" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-[hsl(var(--secondary))] to-transparent opacity-5 blur-3xl" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col p-6 gap-6">
                {/* 헤더 */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <h1 className="text-3xl font-bold gradient-text">Tamagochi Cam</h1>
                    <div className="glass-effect px-4 py-2 rounded-full text-sm">
                        {currentStreamer ? (
                            <span className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-foreground/80">스트리밍 중</span>
                            </span>
                        ) : (
                            <span className="text-muted-foreground">대기 중</span>
                        )}
                    </div>
                </motion.div>

                {/* 메인 비디오 영역 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex-1 flex items-center justify-center min-h-0"
                >
                    <div className="w-full max-w-5xl max-h-[70vh] aspect-video">
                        <VideoDisplay stream={displayStream} isLocal={isStreaming} />
                    </div>
                </motion.div>

                {/* 에러 메시지 */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-effect bg-destructive/20 border border-destructive/30 rounded-2xl px-6 py-4 text-destructive text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* 컨트롤 버튼 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <StreamControls
                        isStreaming={isStreaming}
                        onStartStreaming={startStreaming}
                        onStopStreaming={stopStreaming}
                    />
                </motion.div>
            </div>
        </div>
    );
}
