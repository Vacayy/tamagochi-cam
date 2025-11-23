'use client';

import { useWebRTC } from '@/hooks/useWebRTC';
import VideoDisplay from '@/components/VideoDisplay';
import StreamControls from '@/components/StreamControls';
import { motion } from 'framer-motion';

export default function TamagochiPage() {
    const {
        localStream,
        remoteStreams,
        isStreaming,
        streamers,
        startStreaming,
        stopStreaming,
        error,
    } = useWebRTC();

    // 전체 스트림 모음 (내 스트림 + 원격 스트림들)
    const allStreams: Array<{ id: string; stream: MediaStream; isLocal: boolean }> = [];

    if (isStreaming && localStream) {
        allStreams.push({ id: 'local', stream: localStream, isLocal: true });
    }

    remoteStreams.forEach((stream, userId) => {
        allStreams.push({ id: userId, stream, isLocal: false });
    });

    const hasStreams = allStreams.length > 0;
    const isSplitScreen = allStreams.length === 2;

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
                        {streamers.length > 0 ? (
                            <span className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-foreground/80">{streamers.length}명 스트리밍 중</span>
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
                    <div className="w-full h-full max-w-6xl max-h-[calc(100vh-280px)] flex items-center justify-center">
                        {!hasStreams ? (
                            <VideoDisplay stream={null} isLocal={false} />
                        ) : isSplitScreen ? (
                            // 2명일 때: 화면 분할
                            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                {allStreams.map(({ id, stream, isLocal }) => (
                                    <div key={id} className="w-full h-full">
                                        <VideoDisplay stream={stream} isLocal={isLocal} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // 1명일 때: 전체 화면
                            <div className="w-full h-full">
                                <VideoDisplay
                                    stream={allStreams[0].stream}
                                    isLocal={allStreams[0].isLocal}
                                />
                            </div>
                        )}
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
                        disabled={streamers.length >= 2 && !isStreaming}
                    />
                </motion.div>
            </div>
        </div>
    );
}
