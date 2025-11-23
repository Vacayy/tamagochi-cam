'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/tamagochi');
      } else {
        setError(data.message || '비밀번호를 확인해주세요');
      }
    } catch (err) {
      setError('에러가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(220,20%,12%)] to-[hsl(280,100%,10%)] relative overflow-hidden">
      {/* 배경 애니메이션 효과 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[hsl(var(--primary))] to-transparent opacity-10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-[hsl(var(--secondary))] to-transparent opacity-10 blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* 메인 카드 */}
        <div className="glass-effect rounded-3xl p-8 shadow-2xl border border-white/10">
          {/* 제목 */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                type: 'spring',
                stiffness: 200,
              }}
              className="text-5xl font-bold gradient-text mb-3"
            >
              Tamagochi Cam
            </motion.h1>
            <p className="text-muted-foreground text-sm">
              친구와 번갈아가며 Cam을 공유해보세요
            </p>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground/80 mb-2"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 text-destructive text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-[hsl(var(--primary))]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isLoading ? '확인 중...' : '입장하기'}
            </button>
          </form>
        </div>

        {/* 장식 요소 */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-20 right-10 w-32 h-32 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] rounded-full blur-3xl opacity-20"
        />
      </motion.div>
    </div>
  );
}
