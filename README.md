# Tamagochi Cam 🎥

친구와 웹캠을 공유할 수 있는 실시간 스트리밍 애플리케이션

## 기능

- 🔒 비밀번호 보호
- 📹 실시간 웹캠 공유
- ⚡ WebRTC P2P 연결

## 로컬 실행

```bash
# Dependencies 설치
npm install

# 환경 변수 설정 (.env.local 파일 생성)
echo "PASSWORD={비밀번호}" > .env.local

# 개발 서버 실행
npm run dev
```

## 배포 (Railway)

1. Railway 계정 생성: https://railway.app
2. GitHub 레포지토리 연결
3. 환경 변수 설정:
   - `PASSWORD={비밀번호}`
4. 자동 배포 완료!

## 기술 스택

- Next.js 14
- Socket.io (실시간 통신)
- WebRTC (P2P 비디오)
- Tailwind CSS
- Framer Motion

## 라이센스

MIT
