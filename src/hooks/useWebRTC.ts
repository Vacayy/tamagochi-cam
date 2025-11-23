'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import SimplePeer from 'simple-peer';

interface UseWebRTCReturn {
    localStream: MediaStream | null;
    remoteStreams: Map<string, MediaStream>;
    isStreaming: boolean;
    streamers: string[];
    startStreaming: () => Promise<void>;
    stopStreaming: () => void;
    error: string | null;
}

export function useWebRTC(): UseWebRTCReturn {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamers, setStreamers] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const socketRef = useRef<Socket | null>(null);
    const peersRef = useRef<Map<string, SimplePeer.Instance>>(new Map());
    const localStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        // Socket.io 연결
        socketRef.current = io();

        socketRef.current.on('connect', () => {
            console.log('Socket 연결됨:', socketRef.current?.id);
            socketRef.current?.emit('join-room');
        });

        // 새 사용자가 참가했을 때
        socketRef.current.on('user-joined', (userId: string) => {
            console.log('새 사용자 참가:', userId);

            // 내가 스트리밍 중이라면 새 사용자에게 연결 (initiator=true로 offer 생성)
            if (localStreamRef.current) {
                console.log('새 사용자에게 스트림 제공:', userId);
                createPeer(userId, true);
            }
        });

        // 다른 사용자가 스트리밍을 시작했을 때
        socketRef.current.on('streamer-started', (streamerId: string) => {
            console.log('스트리머 시작:', streamerId);

            setStreamers(prev => {
                // 최대 2명까지만 허용
                if (prev.length >= 2) {
                    console.log('최대 2명까지만 스트리밍 가능합니다');
                    return prev;
                }
                if (!prev.includes(streamerId)) {
                    return [...prev, streamerId];
                }
                return prev;
            });

            // 내가 스트리머가 아니라면 스트리머에게 연결 요청
            if (streamerId !== socketRef.current?.id) {
                // 스트리머에게 연결 요청 (initiator=true로 offer 생성)
                console.log('스트리머에게 연결 시도:', streamerId);
                createPeer(streamerId, true);
            }
        });

        // 스트리밍이 중지되었을 때
        socketRef.current.on('streamer-stopped', (streamerId: string) => {
            console.log('스트리밍 중지됨:', streamerId);

            setStreamers(prev => prev.filter(id => id !== streamerId));
            setRemoteStreams(prev => {
                const newMap = new Map(prev);
                newMap.delete(streamerId);
                return newMap;
            });

            // 해당 peer 연결 정리
            const peer = peersRef.current.get(streamerId);
            if (peer) {
                peer.destroy();
                peersRef.current.delete(streamerId);
            }
        });

        // WebRTC Offer 수신
        socketRef.current.on('offer', ({ from, offer }: { from: string; offer: SimplePeer.SignalData }) => {
            console.log('Offer 수신:', from);
            createPeer(from, false, offer);
        });

        // WebRTC Answer 수신
        socketRef.current.on('answer', ({ from, answer }: { from: string; answer: SimplePeer.SignalData }) => {
            console.log('Answer 수신:', from);
            const peer = peersRef.current.get(from);
            if (peer) {
                peer.signal(answer);
            }
        });

        // ICE Candidate 수신
        socketRef.current.on('ice-candidate', ({ from, candidate }: { from: string; candidate: SimplePeer.SignalData }) => {
            const peer = peersRef.current.get(from);
            if (peer) {
                peer.signal(candidate);
            }
        });

        // 사용자가 나갔을 때
        socketRef.current.on('user-left', (userId: string) => {
            console.log('사용자 퇴장:', userId);
            const peer = peersRef.current.get(userId);
            if (peer) {
                peer.destroy();
                peersRef.current.delete(userId);
            }
        });

        return () => {
            // 정리
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => track.stop());
            }
            peersRef.current.forEach((peer) => peer.destroy());
            socketRef.current?.disconnect();
        };
    }, []);

    const createPeer = (userId: string, initiator: boolean, offer?: SimplePeer.SignalData) => {
        const peer = new SimplePeer({
            initiator,
            trickle: true,
            stream: localStreamRef.current || undefined,
        });

        peer.on('signal', (signal) => {
            if (signal.type === 'offer') {
                socketRef.current?.emit('offer', { to: userId, offer: signal });
            } else if (signal.type === 'answer') {
                socketRef.current?.emit('answer', { to: userId, answer: signal });
            } else {
                socketRef.current?.emit('ice-candidate', { to: userId, candidate: signal });
            }
        });

        peer.on('stream', (stream) => {
            console.log('원격 스트림 수신:', userId, stream);
            setRemoteStreams(prev => {
                const newMap = new Map(prev);
                newMap.set(userId, stream);
                return newMap;
            });
        });

        peer.on('error', (err) => {
            console.error('Peer 에러:', err);
            setError('연결 에러가 발생했습니다');
        });

        peersRef.current.set(userId, peer);

        if (offer) {
            peer.signal(offer);
        }
    };

    const startStreaming = async () => {
        try {
            setError(null);

            // 웹캠 스트림 가져오기
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: true,
            });

            setLocalStream(stream);
            localStreamRef.current = stream;
            setIsStreaming(true);

            // 서버에 스트리밍 시작 알림
            socketRef.current?.emit('start-streaming');
        } catch (err) {
            console.error('웹캠 접근 에러:', err);
            setError('웹캠에 접근할 수 없습니다. 권한을 확인해주세요.');
        }
    };

    const stopStreaming = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
        }

        setLocalStream(null);
        setIsStreaming(false);

        // 모든 peer 연결 종료
        peersRef.current.forEach((peer) => peer.destroy());
        peersRef.current.clear();

        // 서버에 스트리밍 중지 알림
        socketRef.current?.emit('stop-streaming');
    };

    return {
        localStream,
        remoteStreams,
        isStreaming,
        streamers,
        startStreaming,
        stopStreaming,
        error,
    };
}
