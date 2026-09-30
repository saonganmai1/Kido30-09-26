import React, { useState } from 'react';
import { User, Key, Shield, MessageCircle, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { audioService } from '../utils/audio';
import { UserAccount, UserRole } from '../types';
import { UserAvatar } from './UserAvatar';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { recordUserLogin } from '../lib/firebaseSync';

interface LoginViewProps {
  accounts: UserAccount[];
  onLoginSuccess: (account: UserAccount) => void;
  onContactClick: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ accounts, onLoginSuccess, onContactClick }) => {
  const [loginTab, setLoginTab] = useState<'kid' | 'parent'>('kid');
  const [username, setUsername] = useState('Cao Quốc Minh');
  const [password, setPassword] = useState('123456');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // States for Image 3 & Image 4
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successAccount, setSuccessAccount] = useState<UserAccount | null>(null);
  const [showNotActivatedModal, setShowNotActivatedModal] = useState(false);

  const activeAccounts = accounts.filter((a) => !a.isDeleted);

  // Finder logic - STRICT matching only
  const findAccount = (inputUsername: string) => {
    const cleanInput = inputUsername.trim().toLowerCase();
    if (!cleanInput) return null;

    return activeAccounts.find(
      (a) =>
        a.username.toLowerCase() === cleanInput ||
        a.name.toLowerCase() === cleanInput ||
        (a.email && a.email.toLowerCase() === cleanInput)
    ) || null;
  };

  const triggerSuccessFlow = (account: UserAccount) => {
    setSuccessAccount(account);
    setShowSuccessModal(true);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimUser = username.trim();
    const trimPass = password.trim();

    if (!trimUser) {
      setErrorMsg('Vui lòng nhập tên đăng nhập!');
      audioService.playClickSound();
      return;
    }

    if (!trimPass) {
      setErrorMsg('Vui lòng nhập mật khẩu!');
      audioService.playClickSound();
      return;
    }

    const matched = findAccount(trimUser);

    if (!matched) {
      setErrorMsg('Tài khoản chưa được Admin tạo trong hệ thống! Vui lòng liên hệ Admin hoặc Phụ huynh.');
      audioService.playClickSound();
      return;
    }

    // Check if the tab role matches or check strictly
    const expectedPass = matched.passwordHash || '123456';
    if (trimPass !== expectedPass) {
      setErrorMsg('Mật khẩu không đúng! Vui lòng kiểm tra lại mật khẩu.');
      audioService.playClickSound();
      return;
    }

    audioService.playSuccessSound();
    triggerSuccessFlow(matched);
  };

  const handleQuickAccountSelect = (acc: UserAccount) => {
    setErrorMsg(null);
    audioService.playSuccessSound();
    triggerSuccessFlow(acc);
  };

  const handleGoogleLogin = async () => {
    try {
      setErrorMsg(null);
      setIsConnectingGoogle(true); // Triggers Image 3 "Đang kết nối Google..."
      audioService.playClickSound();

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userEmail = user.email ? user.email.toLowerCase().trim() : '';

      // Check if this Google email is activated in admin accounts list
      const matchedAccount = activeAccounts.find(
        (a) =>
          (a.email && a.email.toLowerCase().trim() === userEmail) ||
          (a.username && a.username.toLowerCase().trim() === userEmail)
      );

      setIsConnectingGoogle(false);

      if (!matchedAccount) {
        // Gmail not activated by admin -> sign out and display image 1 modal
        try {
          await signOut(auth);
        } catch (e) {
          console.warn('SignOut error:', e);
        }
        setShowNotActivatedModal(true);
        audioService.playClickSound();
        return;
      }

      audioService.playSuccessSound();
      triggerSuccessFlow(matchedAccount);
    } catch (err: any) {
      setIsConnectingGoogle(false);
      if (err?.code === 'auth/popup-closed-by-user' || err?.message?.includes('popup-closed-by-user')) {
        // User voluntarily closed the Google login popup, silently cancel
        return;
      }
      console.error('Google Sign-In Error:', err);
      setErrorMsg('Đăng nhập Google thất bại: ' + (err?.message || 'Lỗi không xác định'));
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#e8f3ff] flex items-center justify-center p-4 py-8 relative font-sans select-none overflow-y-auto">
      {/* Background Subtle Doodle Elements */}
      <div className="absolute top-10 left-10 text-pink-200/80 text-3xl pointer-events-none">✏️</div>
      <div className="absolute top-16 right-12 text-emerald-200/80 text-3xl pointer-events-none">📖</div>
      <div className="absolute bottom-20 left-12 text-pink-200/80 text-3xl pointer-events-none">🎵</div>
      <div className="absolute bottom-16 right-16 text-[#cbd5e1] text-3xl pointer-events-none">🎓</div>
      <div className="absolute top-1/2 left-6 text-amber-200/80 text-3xl pointer-events-none">🎨</div>
      <div className="absolute top-1/2 right-6 text-sky-200/80 text-3xl pointer-events-none">🌐</div>

      {/* Main Login Card */}
      <div className="w-full max-w-[420px] bg-white rounded-[36px] p-6 sm:p-7 border-2 border-[#50b2ff] shadow-xl relative z-10 flex flex-col items-center space-y-4 animate-fadeIn my-auto">
        
        {/* Top 3D Kido Mascot Avatar (Image 1 & 2) */}
        <div className="w-22 h-22 rounded-full bg-gradient-to-b from-[#70c3ff] to-[#a8dcff] p-1 shadow-sm flex items-center justify-center relative overflow-hidden shrink-0 border-2 border-white">
          <div className="text-4xl transform hover:scale-110 transition duration-300">🦖</div>
          <div className="absolute top-1.5 left-2 text-xs">⭐</div>
          <div className="absolute top-2 right-2 text-xs">🌟</div>
          <div className="absolute bottom-1.5 left-2 text-xs">🧸</div>
          <div className="absolute bottom-1.5 right-2 text-xs">⚽</div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center space-y-0.5">
          <h1 className="text-2xl sm:text-3xl font-black text-[#1a3d8f] tracking-tight">
            KIDOEnglish
          </h1>
          <p className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1">
            <span>Học Tiếng Anh Thật Vui</span>
            <span className="text-amber-400 text-sm">⭐</span>
          </p>
        </div>

        {/* Quick Account Selector Banner */}
        <div className="w-full bg-amber-50/90 rounded-2xl p-2 border border-amber-200 space-y-1 text-center">
          <p className="text-[10px] font-black text-amber-900 flex items-center justify-center gap-1">
            <Sparkles size={12} className="text-amber-600 fill-amber-400" />
            <span>Tài khoản thử nghiệm sẵn có:</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-black">
            {activeAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleQuickAccountSelect(acc)}
                className={`py-1.5 px-1 rounded-xl border transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  acc.role === 'admin'
                    ? 'bg-blue-100 border-blue-300 text-[#1a3d8f]'
                    : acc.role === 'parent'
                    ? 'bg-purple-100 border-purple-300 text-purple-900'
                    : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                }`}
              >
                <UserAvatar avatar={acc.avatar} name={acc.name} className="w-4 h-4 rounded-full" />
                <span className="truncate w-full font-black text-[9px] text-center">
                  {acc.name || (acc.role === 'admin' ? 'Admin' : acc.role === 'parent' ? 'Phụ Huynh' : 'Học Sinh')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Segmented Control Switcher (Cho Bé Học vs Phụ Huynh / Admin) */}
        <div className="w-full bg-[#f0f6ff] p-1.5 rounded-2xl border border-[#d2e5ff] flex items-center text-xs font-black">
          <button
            type="button"
            onClick={() => {
              audioService.playClickSound();
              setErrorMsg(null);
              setLoginTab('kid');
              setUsername('Cao Quốc Minh');
              setPassword('123456');
            }}
            className={`flex-1 py-2.5 px-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              loginTab === 'kid'
                ? 'bg-white text-[#1a3d8f] shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 font-bold'
            }`}
          >
            <User size={15} className="text-[#1a3d8f]" />
            <span>Cho Bé Học</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioService.playClickSound();
              setErrorMsg(null);
              setLoginTab('parent');
              setUsername('phuhuynh');
              setPassword('123456');
            }}
            className={`flex-1 py-2.5 px-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              loginTab === 'parent'
                ? 'bg-white text-[#1a3d8f] shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 font-bold'
            }`}
          >
            <Shield size={15} className="text-[#1a3d8f]" />
            <span>Phụ Huynh / Admin</span>
          </button>
        </div>

        {/* Error Message Notification */}
        {errorMsg && (
          <div className="w-full p-2.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: CHO BÉ HỌC (Image 1) */}
        {loginTab === 'kid' && (
          <form onSubmit={handleFormLogin} className="w-full space-y-3 text-xs font-bold">
            {/* Username Field */}
            <div className="space-y-1">
              <label className="text-[#1a3d8f] block text-xs font-black">
                Tên đăng nhập của bé:
              </label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setErrorMsg(null);
                    setUsername(e.target.value);
                  }}
                  placeholder="Nhập tên đăng nhập..."
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl border border-slate-200 focus:border-[#50b2ff] focus:outline-none text-slate-800 text-xs font-bold bg-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[#1a3d8f] block text-xs font-black">
                Mật khẩu:
              </label>
              <div className="relative flex items-center">
                <Key size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setErrorMsg(null);
                    setPassword(e.target.value);
                  }}
                  placeholder="Nhập mật khẩu..."
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl border border-slate-200 focus:border-[#50b2ff] focus:outline-none text-slate-800 text-xs font-bold bg-white"
                />
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="submit"
                className="py-3 px-2 rounded-2xl bg-[#f0e2d3] hover:bg-[#e8d2bd] text-[#5c3e1e] font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 border-2 border-dashed border-[#c29869] active:scale-95 shadow-xs"
              >
                <BookOpen size={15} />
                <span>Vào Học Ngay Thôi</span>
              </button>

              <button
                type="button"
                onClick={onContactClick}
                className="py-3 px-2 rounded-2xl bg-[#e6f3ff] hover:bg-[#d4e9ff] text-[#1d50b4] font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 border-2 border-dashed border-[#50b2ff] active:scale-95 shadow-xs"
              >
                <MessageCircle size={15} />
                <span>Liên Hệ Tôi</span>
              </button>
            </div>

            {/* Footer Notice */}
            <p className="text-[10px] text-slate-400 font-bold text-center leading-relaxed pt-1">
              Ba mẹ vui lòng sử dụng tài khoản được cấp để đăng nhập cho bé nhé (Dự án không thương mại) <span className="text-red-500 inline-block">❤️</span>
            </p>
          </form>
        )}

        {/* TAB 2: PHỤ HUYNH / ADMIN (Image 2 & 3) */}
        {loginTab === 'parent' && (
          <div className="w-full space-y-4 py-2 text-center">
            <p className="text-xs font-extrabold text-slate-600 leading-relaxed px-2">
              Phụ huynh đăng nhập bằng Google Gmail để quản lý bé, nạp bài học hoặc gia hạn VIP.
            </p>

            {/* Google Sign In Button (Normal - Image 2 vs Connecting - Image 3) */}
            {!isConnectingGoogle ? (
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#fbbb05] via-[#ff9800] to-[#f4511e] hover:brightness-105 text-white font-black text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2.5 border border-amber-300 active:scale-95"
              >
                <svg className="w-5 h-5 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Đăng nhập với Google Gmail</span>
              </button>
            ) : (
              /* Image 3 Connecting State */
              <button
                type="button"
                disabled
                className="w-full py-3.5 px-4 rounded-2xl bg-white border border-slate-300 text-[#1a3d8f] font-black text-sm shadow-xs flex items-center justify-center gap-2 cursor-wait animate-pulse"
              >
                <span className="text-base">⏳</span>
                <span>Đang kết nối Google...</span>
              </button>
            )}

            <p className="text-[10px] text-slate-400 font-bold text-center leading-relaxed px-2 pt-2">
              Chỉ các tài khoản Gmail phụ huynh được cấp phép hoặc Admin tổng mới được truy cập.
            </p>
          </div>
        )}
      </div>

      {/* IMAGE 1: UNACTIVATED GMAIL MODAL ("Kido nhắn bé") */}
      {showNotActivatedModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] border-2 border-dashed border-[#3b82f6] p-6 sm:p-7 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            
            {/* Top Mascot with Mint Dotted Circle (Matching Image 1) */}
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-300 bg-emerald-50/80 flex items-center justify-center mx-auto text-4xl shadow-inner relative">
              <div className="transform hover:scale-110 transition duration-300">🦖</div>
              <div className="absolute top-1 left-1.5 text-[10px]">🧸</div>
              <div className="absolute top-1 right-1.5 text-[10px]">🔤</div>
              <div className="absolute bottom-1 left-1.5 text-[10px]">🎨</div>
              <div className="absolute bottom-1 right-1.5 text-[10px]">🎈</div>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#1e293b]">Kido nhắn bé</h3>
              <p className="text-xs font-bold text-slate-500 mt-2 leading-relaxed px-1">
                Email của ba mẹ chưa được kích hoạt dùng thử. Vui lòng liên hệ Admin <span className="text-slate-700 font-extrabold">hmcuongth06@gmail.com</span> để kích hoạt nhé <span className="text-red-500">❤️</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                audioService.playClickSound();
                setShowNotActivatedModal(false);
              }}
              className="w-full py-3 rounded-2xl bg-[#2563eb] hover:bg-blue-700 active:scale-95 text-white font-black text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Đồng ý</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      )}

      {/* IMAGE 4: SUCCESS LOGIN MODAL ("Tuyệt vời ông mặt trời 🌟") */}
      {showSuccessModal && successAccount && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[28px] border-2 border-dashed border-[#3b82f6] p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-300 bg-emerald-50 flex items-center justify-center mx-auto text-3xl shadow-inner text-emerald-600">
              🏆
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">Tuyệt vời ông mặt trời 🌟</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1.5 leading-relaxed">
                Đăng nhập thành công! Chào mừng {successAccount.role === 'parent' ? 'ba mẹ của ' : ''}{successAccount.name} 🎉
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                recordUserLogin(successAccount);
                onLoginSuccess(successAccount);
              }}
              className="w-full py-3 rounded-2xl bg-[#2563eb] hover:bg-blue-700 text-white font-black text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Đồng ý</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
