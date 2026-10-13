import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth, ANIME_AVATARS } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, loginAsGuest } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(ANIME_AVATARS[0].url);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          throw new Error("Elektron pochta va parolni kiriting.");
        }
        await loginWithEmail(email.trim(), password);
      } else {
        if (!displayName.trim()) {
          throw new Error("Iltimos, ismingiz yoki taxallusingizni kiriting.");
        }
        if (password.length < 6) {
          throw new Error("Parol kamida 6 ta belgidan iborat bo'lishi kerak.");
        }
        await registerWithEmail(email.trim(), password, displayName.trim(), selectedAvatarUrl);
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setErrorMsg("Elektron pochta yoki parol noto'g'ri kiritildi.");
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg("Bu elektron pochta allaqachon ro'yxatdan o'tgan. Kirish bo'limidan foydalaning.");
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg("Elektron pochta manzili formati noto'g'ri.");
      } else {
        setErrorMsg(err.message || "Xatolik yuz berdi. Qayta urinib ko'ring.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await loginWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Google orqali kirishda xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest("Mehmon Muxlis");
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#141519] border border-[#232732] rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Yopish"
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white hover:bg-[#1E232F] rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#F47521] mx-auto flex items-center justify-center font-black text-black shadow-lg shadow-[#F47521]/20">
            <span className="text-2xl leading-none">⚡</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Ani<span className="text-[#F47521]">Roll</span> Hisobi
          </h2>
          <p className="text-xs text-neutral-400">
            {mode === 'login'
              ? "Sevimli animelaringiz va tomosha ro'yxatingizga kirish"
              : "Yangi akkaunt yarating va cheksiz anime olamiga qo'shiling"}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-[#0B0C0E] p-1 rounded-xl border border-[#232732] text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
              mode === 'login'
                ? 'bg-[#F47521] text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Kirish (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
              mode === 'register'
                ? 'bg-[#F47521] text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Register-only Display Name & Avatar selector */}
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Ismingiz yoki Taxallusingiz (Nickname)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Masalan: ShadowHunter_Uz"
                    className="w-full bg-[#191B22] border border-[#232732] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#F47521]"
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  Anime Qahramon Avatari Tanlang:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ANIME_AVATARS.map((av) => {
                    const isSelected = selectedAvatarUrl === av.url;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatarUrl(av.url)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer p-0.5 ${
                          isSelected
                            ? 'border-[#F47521] scale-105 shadow-md shadow-[#F47521]/30'
                            : 'border-[#232732] opacity-70 hover:opacity-100 hover:border-neutral-500'
                        }`}
                      >
                        <img
                          src={av.url}
                          alt={av.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#F47521] flex items-center justify-center text-black">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Email input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Elektron pochta manzili
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="misol@gmail.com"
                className="w-full bg-[#191B22] border border-[#232732] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#F47521]"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                Parol
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setErrorMsg("Parolni tiklash havolasi elektron pochtangizga yuborildi.")}
                  className="text-[11px] text-neutral-400 hover:text-[#F47521] cursor-pointer"
                >
                  Parolni unutdingizmi?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kamida 6 ta belgi"
                className="w-full bg-[#191B22] border border-[#232732] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-[#F47521]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#F47521] hover:bg-[#FF8533] disabled:opacity-50 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-[#F47521]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span>Yuklanmoqda...</span>
            ) : mode === 'login' ? (
              <>
                <span>Tizimga kirish</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Ro'yxatdan o'tish</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#232732] w-full" />
          <span className="bg-[#141519] px-3 text-[11px] text-neutral-500 uppercase tracking-wider absolute">
            yoki
          </span>
        </div>

        {/* Social / Alternative logins */}
        <div className="space-y-2">
          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-2.5 bg-[#191B22] hover:bg-[#1E232F] border border-[#232732] text-xs font-semibold text-white rounded-xl flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google orqali kirish</span>
          </button>

          {/* Guest 1-Click Access */}
          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full py-2 bg-transparent hover:bg-[#191B22] text-[11px] text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer text-center"
          >
            Mehmon sifatida tezkor sinab ko'rish (Guest Pass)
          </button>
        </div>

      </div>
    </div>
  );
};
