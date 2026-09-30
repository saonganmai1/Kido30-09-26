import React, { useState, useEffect } from 'react';
import { Settings, Volume2, Mic, User, Check, Sparkles, GraduationCap, Globe, Bell, Gift, BookOpen, Flame, Radio, ShieldCheck } from 'lucide-react';
import { audioService } from '../utils/audio';
import { UserAvatar } from './UserAvatar';
import { useLanguage } from '../context/LanguageContext';

interface SettingsViewProps {
  userAvatar?: string;
  setUserAvatar?: (avatar: string) => void;
  onTriggerNotification?: (title: string, msg: string) => void;
}

interface NotificationConfig {
  pushEnabled: boolean;
  rewardClaim: boolean;
  newLesson: boolean;
  streakReminder: boolean;
  systemBroadcast: boolean;
}

const NOTIFICATION_STORAGE_KEY = 'KIDO_USER_NOTIFICATION_SETTINGS';

const NotificationSettingsCard: React.FC<{
  onTriggerNotification?: (title: string, msg: string) => void;
}> = ({ onTriggerNotification }) => {
  const { t } = useLanguage();

  const [notifConfig, setNotifConfig] = useState<NotificationConfig>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      pushEnabled: true,
      rewardClaim: true,
      newLesson: true,
      streakReminder: true,
      systemBroadcast: true,
    };
  });

  const saveConfig = (next: NotificationConfig, eventName?: string) => {
    setNotifConfig(next);
    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {}
    audioService.playSuccessSound();
    if (onTriggerNotification && eventName) {
      onTriggerNotification(
        '🔔 ' + t('Đã cập nhật thông báo', 'Notification Settings Updated'),
        `${eventName}: ${next.pushEnabled ? 'Đã bật' : 'Đã tắt'}`
      );
    }
  };

  const toggleMasterPush = () => {
    const nextVal = !notifConfig.pushEnabled;
    const updated: NotificationConfig = {
      pushEnabled: nextVal,
      rewardClaim: nextVal,
      newLesson: nextVal,
      streakReminder: nextVal,
      systemBroadcast: nextVal,
    };
    saveConfig(updated, t('Tất cả thông báo đẩy', 'Master Push Notifications'));
  };

  const toggleEvent = (key: keyof Omit<NotificationConfig, 'pushEnabled'>, label: string) => {
    const nextVal = !notifConfig[key];
    const updated = {
      ...notifConfig,
      [key]: nextVal,
    };
    // If at least one event is enabled, keep pushEnabled true
    updated.pushEnabled = Object.keys(updated)
      .filter((k) => k !== 'pushEnabled')
      .some((k) => updated[k as keyof typeof updated]);

    saveConfig(updated, label);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-indigo-200/80 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
        <div>
          <h3 className="text-sm sm:text-base font-black text-indigo-600 flex items-center gap-2">
            <Bell size={18} className="text-indigo-600 shrink-0" />
            <span>{t("Cài đặt nhận thông báo đẩy", "Push Notification Settings")}</span>
          </h3>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            {t("Bật/Tắt thông báo đẩy cho các sự kiện cụ thể như nhận thưởng, bài học mới và nhắc nhở.", "Enable/disable push notifications for specific events such as claiming rewards, new lessons, and reminders.")}
          </p>
        </div>

        {/* Master Switch */}
        <button
          onClick={toggleMasterPush}
          className={`px-4 py-1.5 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-2 border shadow-2xs ${
            notifConfig.pushEnabled
              ? 'bg-emerald-500 text-white border-emerald-600'
              : 'bg-slate-100 text-slate-600 border-slate-300'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${notifConfig.pushEnabled ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
          <span>{notifConfig.pushEnabled ? t('BẬT TẤT CẢ', 'ALL ON') : t('TẮT TẤT CẢ', 'ALL OFF')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Item 1: Reward Claim */}
        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black shrink-0">
              <Gift size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800">{t("🎁 Nhận Thưởng & Đổi Quà", "Reward Claim & Gifts")}</h4>
              <p className="text-[11px] font-medium text-slate-500">{t("Nhận sao, quà tặng và thăng cấp", "Claim stars, rewards & level ups")}</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={notifConfig.rewardClaim}
            onChange={() => toggleEvent('rewardClaim', t("🎁 Nhận Thưởng", "Reward Claim"))}
            className="w-5 h-5 accent-indigo-600 rounded-md cursor-pointer shrink-0"
          />
        </div>

        {/* Item 2: New Lesson */}
        <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black shrink-0">
              <BookOpen size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800">{t("📚 Bài Học Mới & Lịch Học", "New Lessons & Schedule")}</h4>
              <p className="text-[11px] font-medium text-slate-500">{t("Khi có bài học mới hoặc nhắc học hàng ngày", "New lesson releases & daily reminders")}</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={notifConfig.newLesson}
            onChange={() => toggleEvent('newLesson', t("📚 Bài Học Mới", "New Lessons"))}
            className="w-5 h-5 accent-indigo-600 rounded-md cursor-pointer shrink-0"
          />
        </div>

        {/* Item 3: Streak & Achievement */}
        <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black shrink-0">
              <Flame size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800">{t("🔥 Chuỗi Ngày Học (Streak)", "Learning Streak & Badges")}</h4>
              <p className="text-[11px] font-medium text-slate-500">{t("Cảnh báo nguy cơ đứt chuỗi & danh hiệu", "Streak risk alerts & title unlock")}</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={notifConfig.streakReminder}
            onChange={() => toggleEvent('streakReminder', t("🔥 Chuỗi Ngày Học", "Streak Alert"))}
            className="w-5 h-5 accent-indigo-600 rounded-md cursor-pointer shrink-0"
          />
        </div>

        {/* Item 4: System Broadcast */}
        <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black shrink-0">
              <Radio size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800">{t("📢 Thông Báo Từ Giáo Viên / Admin", "Teacher & Admin Broadcasts")}</h4>
              <p className="text-[11px] font-medium text-slate-500">{t("Tin nhắn phát sóng, thông báo sự kiện", "Live broadcast messages & announcements")}</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={notifConfig.systemBroadcast}
            onChange={() => toggleEvent('systemBroadcast', t("📢 Thông Báo Admin", "Admin Broadcasts"))}
            className="w-5 h-5 accent-indigo-600 rounded-md cursor-pointer shrink-0"
          />
        </div>
      </div>
    </div>
  );
};

export const SettingsView: React.FC<SettingsViewProps> = ({
  userAvatar,
  setUserAvatar,
  onTriggerNotification,
}) => {
  const { lang, toggleLang, t } = useLanguage();
  const [selectedAvatar, setSelectedAvatar] = useState<string>('child_photo');
  const [readingSpeed, setReadingSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [bilingualMode, setBilingualMode] = useState<boolean>(true);
  const [enVoiceGender, setEnVoiceGender] = useState<'female' | 'male'>('female');
  const [viVoiceGender, setViVoiceGender] = useState<'female' | 'male'>('male');
  const [pronunciationMethod, setPronunciationMethod] = useState<'online' | 'offline'>('online');
  const [voiceModel, setVoiceModel] = useState<string>('default_plus');
  
  const [popSoundEffect, setPopSoundEffect] = useState<boolean>(true);
  const [bgMusic, setBgMusic] = useState<boolean>(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const avatarsList = [
    { id: 'kido', name: 'Kido', emoji: '🦖', color: 'bg-emerald-100 text-emerald-600 border-emerald-300', url: '🦖' },
    { id: 'mimi', name: 'Mimi', emoji: '🐱', color: 'bg-pink-100 text-pink-600 border-pink-300', url: '🐱' },
    { id: 'kiki', name: 'Kiki', emoji: '🐶', color: 'bg-amber-100 text-amber-600 border-amber-300', url: '🐶' },
    { id: 'leo', name: 'Leo', emoji: '🦁', color: 'bg-orange-100 text-orange-600 border-orange-300', url: '🦁' },
    { id: 'robo', name: 'Robo', emoji: '🤖', color: 'bg-purple-100 text-purple-600 border-purple-300', url: '🤖' },
    { id: 'neil', name: 'Neil', emoji: '👾', color: 'bg-cyan-100 text-cyan-600 border-cyan-300', url: '👾' },
    { id: 'child_photo', name: 'Ảnh của bé', isPhoto: true, url: userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        if (onTriggerNotification) {
          onTriggerNotification('⚠️ Dung lượng ảnh lớn', 'Vui lòng chọn ảnh nhỏ hơn 5MB!');
        }
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        if (setUserAvatar) {
          setUserAvatar(dataUrl);
        }
        setSelectedAvatar('child_photo');
        audioService.playSuccessSound();
        if (onTriggerNotification) {
          onTriggerNotification('📸 Đã cập nhật ảnh bé!', 'Ảnh đại diện mới đã được lưu thành công.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveVoiceModel = () => {
    audioService.playSuccessSound();
    if (onTriggerNotification) {
      onTriggerNotification('💬 Cài đặt thành công', 'Đã lưu cấu hình giọng đọc của Kido!');
    }
  };

  return (
    <div className="space-y-5 select-none font-sans text-slate-800">
      {/* View Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          Góc Cài Đặt Của Bé <span className="text-sky-500">⚙️</span>
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
          Thay đổi hình đại diện, nhạc nền và tốc độ đọc của Kido nhé!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Card 0: Ngôn Ngữ Giao Diện (Ảnh Mẫu 1) */}
          <div className="bg-white rounded-3xl p-5 border border-sky-200/80 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-sky-600 flex items-center gap-2">
                  <span>🌐</span> {t("Ngôn ngữ giao diện", "Display Language")}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  {t("Chuyển đổi hiển thị Tiếng Việt và Tiếng Anh trên ứng dụng", "Switch between Vietnamese and English display across the app")}
                </p>
              </div>

              {/* Light blue dashed oval button matching image 1 */}
              <button
                onClick={() => {
                  audioService.playClickSound();
                  toggleLang();
                }}
                title={t("Nhấn để chuyển đổi ngôn ngữ", "Click to switch language")}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 border-2 border-dashed border-sky-300 text-sm font-black transition cursor-pointer shadow-2xs active:scale-95 shrink-0"
              >
                <Globe size={18} className="text-sky-600 shrink-0" />
                <span className="tracking-wide uppercase">{lang === 'vi' ? 'VN VI' : 'EN'}</span>
              </button>
            </div>
          </div>

          {/* Card 0.5: Cài Đặt Thông Báo Cho Người Dùng (Notification Settings) */}
          <NotificationSettingsCard onTriggerNotification={onTriggerNotification} />

          {/* Card 1: Chọn hình đại diện (Avatar) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm sm:text-base font-black text-amber-500 flex items-center gap-2">
                <span>⭐</span> Chọn hình đại diện (Avatar)
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Hình đại diện bé chọn sẽ xuất hiện trên thanh trạng thái góc phải phía trên!
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2.5">
              {avatarsList.map((item) => {
                const isSelected = selectedAvatar === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      audioService.playClickSound();
                      setSelectedAvatar(item.id);
                      if (item.isPhoto) {
                        fileInputRef.current?.click();
                      } else if (setUserAvatar && item.url) {
                        setUserAvatar(item.url);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-2 border-sky-400 bg-sky-50/60 shadow-xs ring-2 ring-sky-200'
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden mb-1 shadow-2xs">
                      {item.isPhoto ? (
                        <div className="w-full h-full bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                          <UserAvatar
                            avatar={userAvatar}
                            name="Avatar của bé"
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border ${item.color}`}>
                          {item.emoji}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-700">{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Hidden File Input for Custom Child Avatar */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Custom Photo Upload Button */}
            <div className="pt-1 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500">Hoặc chọn ảnh thực tế từ thiết bị của bé:</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-black rounded-xl shadow-2xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>📸</span>
                <span>Tải ảnh bé lên</span>
              </button>
            </div>
          </div>

          {/* Card 2: Tốc độ đọc tiếng Anh */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div>
              <h3 className="text-sm sm:text-base font-black text-sky-600 flex items-center gap-2">
                <span>🔊</span> Tốc độ đọc tiếng Anh
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Chọn tốc độ đọc phát âm phù hợp để nghe rõ các âm đuôi khó của từ:
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  audioService.playClickSound();
                  setReadingSpeed('slow');
                }}
                className={`py-2.5 px-3 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  readingSpeed === 'slow'
                    ? 'bg-gradient-to-r from-blue-500 to-sky-400 text-white border-blue-500 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🚶</span> Rất Chậm
              </button>

              <button
                onClick={() => {
                  audioService.playClickSound();
                  setReadingSpeed('normal');
                }}
                className={`py-2.5 px-3 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  readingSpeed === 'normal'
                    ? 'bg-gradient-to-r from-blue-500 to-sky-400 text-white border-blue-500 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🏃</span> Chậm Vừa (Chuẩn)
              </button>

              <button
                onClick={() => {
                  audioService.playClickSound();
                  setReadingSpeed('fast');
                }}
                className={`py-2.5 px-3 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  readingSpeed === 'fast'
                    ? 'bg-gradient-to-r from-blue-500 to-sky-400 text-white border-blue-500 shadow-md'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>⚡</span> Bình Thường
              </button>
            </div>
          </div>

          {/* Card 3: Cài đặt giọng nói Kido */}
          <div className="bg-amber-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
                <span>💬</span> Cài đặt giọng nói Kido
              </h3>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              {/* Option 1: Song ngữ */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/50">
                <div>
                  <h4 className="font-extrabold text-slate-800">Chế độ Song Ngữ Anh-Việt</h4>
                  <p className="text-[11px] text-slate-500">Đọc từ tiếng Anh xong sẽ dịch nghĩa tiếng Việt.</p>
                </div>
                <input
                  type="checkbox"
                  checked={bilingualMode}
                  onChange={(e) => {
                    audioService.playClickSound();
                    setBilingualMode(e.target.checked);
                  }}
                  className="w-5 h-5 accent-sky-500 rounded-md cursor-pointer"
                />
              </div>

              {/* Option 2: Giọng đọc tiếng Anh */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/50">
                <div>
                  <h4 className="font-extrabold text-slate-800">Giọng đọc tiếng Anh</h4>
                  <p className="text-[11px] text-slate-500">Giọng Nam / Nữ cho tiếng Anh.</p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setEnVoiceGender('female')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      enVoiceGender === 'female' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span>♀</span> Nữ
                  </button>
                  <button
                    onClick={() => setEnVoiceGender('male')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      enVoiceGender === 'male' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span>♂</span> Nam
                  </button>
                </div>
              </div>

              {/* Option 3: Giọng đọc dịch nghĩa tiếng Việt */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/50">
                <div>
                  <h4 className="font-extrabold text-slate-800">Giọng đọc dịch nghĩa tiếng Việt</h4>
                  <p className="text-[11px] text-slate-500">Giọng Nam / Nữ cho dịch nghĩa.</p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setViVoiceGender('female')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      viVoiceGender === 'female' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span>♀</span> Nữ
                  </button>
                  <button
                    onClick={() => setViVoiceGender('male')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      viVoiceGender === 'male' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span>♂</span> Nam
                  </button>
                </div>
              </div>

              {/* Option 4: Phương thức phát âm */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/50">
                <div>
                  <h4 className="font-extrabold text-slate-800">Phương thức phát âm</h4>
                  <p className="text-[11px] text-slate-500">
                    ⚡ Phát âm cao cấp bằng Audio Cache hoặc API Key (Online).
                  </p>
                </div>
                <button className="px-3 py-1.5 rounded-xl bg-sky-500 text-white font-extrabold text-xs shadow-2xs flex items-center gap-1">
                  ⚡ Online API
                </button>
              </div>

              {/* Option 5: Voice Model Hệ thống */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-800">Voice Model Hệ thống</h4>
                  <p className="text-[11px] text-slate-500">Chọn dòng giọng đọc chất lượng cao phù hợp.</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={voiceModel}
                    onChange={(e) => setVoiceModel(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="default_plus">Mặc định (Plus)</option>
                    <option value="studio_pro">Studio Pro</option>
                    <option value="ai_natural">AI Natural</option>
                  </select>
                  <button
                    onClick={handleSaveVoiceModel}
                    className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs shadow-2xs cursor-pointer transition"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card: Cài đặt âm lượng */}
          <div className="bg-emerald-50/40 rounded-3xl p-5 border border-emerald-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <span>🎵</span> Cài đặt âm lượng
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-800">Hiệu ứng âm thanh (Pop/Pop)</h4>
                  <p className="text-[11px] text-slate-500">Phát ra tiếng pop vui tai khi nhấn chuột.</p>
                </div>
                <input
                  type="checkbox"
                  checked={popSoundEffect}
                  onChange={(e) => {
                    audioService.playClickSound();
                    setPopSoundEffect(e.target.checked);
                  }}
                  className="w-5 h-5 accent-sky-500 rounded-md cursor-pointer shrink-0 mt-0.5"
                />
              </div>

              <div className="flex items-start justify-between border-t border-emerald-200/50 pt-3">
                <div>
                  <h4 className="font-extrabold text-slate-800">Nhạc nền học tập vui vẻ</h4>
                  <p className="text-[11px] text-slate-500">Nhạc không lời êm ái tăng độ tập trung.</p>
                </div>
                <input
                  type="checkbox"
                  checked={bgMusic}
                  onChange={(e) => {
                    audioService.playClickSound();
                    setBgMusic(e.target.checked);
                  }}
                  className="w-5 h-5 accent-sky-500 rounded-md cursor-pointer shrink-0 mt-0.5"
                />
              </div>
            </div>
          </div>

          {/* Info Card: KIDOEnglish Version */}
          <div className="border-2 border-dashed border-sky-300 rounded-3xl bg-sky-50/40 p-5 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-sky-100 text-[#1d50b4] flex items-center justify-center text-xl">
              🎓
            </div>
            <h4 className="text-sm font-black text-[#1d50b4]">KIDOEnglish v1.2.0</h4>
            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
              Hệ thống được phát triển dành riêng cho học sinh cấp 1 học tiếng Anh trực quan sinh động.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
