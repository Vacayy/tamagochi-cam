const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(httpServer, {
        cors: {
            origin: '*',
        },
    });

    // Socket.io 이벤트 처리
    io.on('connection', (socket) => {
        console.log('새 클라이언트 연결:', socket.id);

        // 방 참가
        socket.on('join-room', () => {
            socket.join('tamagochi-room');
            console.log(`${socket.id}가 tamagochi-room에 참가했습니다`);

            // 현재 방에 있는 다른 사용자들에게 새 사용자 알림
            socket.to('tamagochi-room').emit('user-joined', socket.id);
        });

        // 웹캠 스트리밍 시작
        socket.on('start-streaming', () => {
            console.log(`${socket.id}가 스트리밍을 시작했습니다`);
            io.to('tamagochi-room').emit('streamer-started', socket.id);
        });

        // 웹캠 스트리밍 중지
        socket.on('stop-streaming', () => {
            console.log(`${socket.id}가 스트리밍을 중지했습니다`);
            io.to('tamagochi-room').emit('streamer-stopped', socket.id);
        });

        // WebRTC 시그널링: offer
        socket.on('offer', ({ to, offer }) => {
            console.log(`Offer를 ${to}에게 전달합니다`);
            io.to(to).emit('offer', { from: socket.id, offer });
        });

        // WebRTC 시그널링: answer
        socket.on('answer', ({ to, answer }) => {
            console.log(`Answer를 ${to}에게 전달합니다`);
            io.to(to).emit('answer', { from: socket.id, answer });
        });

        // WebRTC 시그널링: ice-candidate
        socket.on('ice-candidate', ({ to, candidate }) => {
            io.to(to).emit('ice-candidate', { from: socket.id, candidate });
        });

        // 연결 해제
        socket.on('disconnect', () => {
            console.log('클라이언트 연결 해제:', socket.id);
            io.to('tamagochi-room').emit('user-left', socket.id);
        });
    });

    httpServer
        .once('error', (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
