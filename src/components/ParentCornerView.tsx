import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Search, 
  Plus, 
  Edit, 
  Gift, 
  Star, 
  Trash2, 
  Camera, 
  LogOut, 
  X, 
  Sparkles,
  FolderOpen,
  Link2,
  Unlink,
  Send,
  UserCheck,
  Clock
} from 'lucide-react';
import { UserAccount, UserProfile, ToastType } from '../types';
import { audioService } from '../utils/audio';
import { UserAvatar, isImageUrl } from './UserAvatar';
import { saveAccountToFirebase } from '../lib/firebaseSync';

interface GiftItem {
  id: string;
  title: string;
  subtitle: string;
  starsRequired: number;
  emoji: string;
  colorTheme: string; // 'green' | 'blue' | 'pink' | 'purple' | 'orange' | 'yellow'
}

interface ParentCornerViewProps {
  user?: UserAccount | UserProfile;
  accounts?: UserAccount[];
  onUpdateAccounts?: (accounts: UserAccount[]) => void;
  onTriggerNotification?: (title: string, msg: string, type?: ToastType) => void;
  onLogout?: () => void;
}

export const ParentCornerView: React.FC<ParentCornerViewProps> = ({
  user,
  accounts = [],
  onUpdateAccounts,
  onTriggerNotification,
  onLogout,
}) => {
  // Linking state
  const [targetStudentSearch, setTargetStudentSearch] = useState('');
  const loggedParent =
    user && user.role === 'parent'
      ? accounts.find(
          (a) =>
            (user.id && a.id === user.id) ||
            (user.username && a.username && a.username.toLowerCase() === user.username.toLowerCase()) ||
            a.name === user.name
        ) || user
      : null;

  const currentParent: UserAccount =
    (loggedParent as UserAccount) ||
    accounts.find((a) => a.role === 'parent') || ({
      id: user?.id || 'parent-default',
      name: user?.name || 'Phụ Huynh Kido',
      username: user?.username || 'parent-default',
      passwordHash: '123456',
      email: (user && 'email' in user && user.email) ? user.email : 'caoquocbaozx4@gmail.com',
      role: 'parent' as const,
      avatar: user?.avatar || '👨‍👩‍👧',
      vipExpiryDate: '2027-12-31',
      isVip: true,
      createdAt: '2026-01-01',
      linkedKidIds: [],
    } as UserAccount);

  // Student selection / editing state
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // Filter ONLY student accounts that are explicitly linked to this parent account
  const linkedKids = accounts.filter(
    (a) =>
      a.role === 'kid' &&
      ((currentParent.linkedKidIds || []).includes(a.id) ||
        (a.linkedParentIds || []).includes(currentParent.id))
  );

  const filteredAndSortedKids = linkedKids
    .filter((st) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        st.name.toLowerCase().includes(q) ||
        (st.username && st.username.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'oldest') {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

  // Form states for Student Creation / Edit
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [stars, setStars] = useState(243);
  const [petCompanion, setPetCompanion] = useState<'kido' | 'panda'>('kido');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [studentAvatar, setStudentAvatar] = useState<string>('🎒');
  const studentFileInputRef = React.useRef<HTMLInputElement>(null);

  // Modal for Gifts
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [activeGiftStudent, setActiveGiftStudent] = useState<string>('Cao Quốc Minh');
  const [profileModalStudent, setProfileModalStudent] = useState<UserAccount | null>(null);
  
  // Gift management states inside modal
  const [giftsList, setGiftsList] = useState<GiftItem[]>([
    {
      id: 'g-1',
      title: 'Super Kido 🦖',
      subtitle: 'Chú Khủng Long Siêu Phẩm | ⭐ 80 Sao',
      starsRequired: 80,
      emoji: '🦖',
      colorTheme: 'green',
    },
    {
      id: 'g-2',
      title: 'Space Explorer 🚀',
      subtitle: 'Phi Hành Gia Vũ Trụ | ⭐ 150 Sao',
      starsRequired: 150,
      emoji: '🚀',
      colorTheme: 'pink',
    },
    {
      id: 'g-3',
      title: 'Smart Kitty 🐱',
      subtitle: 'Mèo Mimi Thông Thái | ⭐ 50 Sao',
      starsRequired: 50,
      emoji: '🐱',
      colorTheme: 'purple',
    },
    {
      id: 'g-4',
      title: 'Mighty Robot 🤖',
      subtitle: 'Rô-bốt Trí Tuệ Nhân Tạo | ⭐ 100 Sao',
      starsRequired: 100,
      emoji: '🤖',
      colorTheme: 'blue',
    },
    {
      id: 'g-5',
      title: 'Magical Kite 🪁',
      subtitle: 'Cánh Diều Mơ Ước | ⭐ 40 Sao',
      starsRequired: 40,
      emoji: '🪁',
      colorTheme: 'green',
    },
  ]);

  // Form state inside Gift Modal
  const [editingGiftId, setEditingGiftId] = useState<string | null>(null);
  const [giftTitle, setGiftTitle] = useState('');
  const [giftDesc, setGiftDesc] = useState('');
  const [giftStars, setGiftStars] = useState(80);
  const [giftEmoji, setGiftEmoji] = useState('🪁');
  const [giftColor, setGiftColor] = useState('green');



  // Handle Edit student button
  const handleStartEditStudent = (st: any) => {
    audioService.playClickSound();
    setEditingStudentId(st.id);
    setFullName(st.name);
    setUsername(st.username);
    setPassword('dangduylop3');
    setStars(st.stars !== undefined ? st.stars : 0);
    setStudentAvatar(st.avatar || '🎒');
  };

  const handleCancelEdit = () => {
    audioService.playClickSound();
    setEditingStudentId(null);
    setFullName('');
    setUsername('');
    setPassword('');
    setStudentAvatar('🎒');
  };

  // Handle Student Photo File Upload
  const handleStudentPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setStudentAvatar(dataUrl);
        audioService.playSuccessSound();
        if (onTriggerNotification) {
          onTriggerNotification('📸 Đã chọn ảnh bé!', 'Ảnh đại diện mới đã sẵn sàng để lưu.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendLinkRequest = async (kidAcc: UserAccount) => {
    audioService.playClickSound();
    const existingRequests = kidAcc.pendingParentRequests || [];
    const isAlreadyRequested = existingRequests.some((r) => r.parentId === currentParent.id);
    if (isAlreadyRequested) {
      if (onTriggerNotification) {
        onTriggerNotification('ℹ️ Thông báo', 'Bạn đã gửi yêu cầu cho học sinh này rồi. Đang chờ học sinh xác nhận!');
      }
      return;
    }

    const newRequest = {
      parentId: currentParent.id,
      parentName: currentParent.name,
      parentEmail: currentParent.email || 'caoquocbaozx4@gmail.com',
      requestedAt: new Date().toLocaleDateString('vi-VN'),
    };

    const updatedKid = {
      ...kidAcc,
      pendingParentRequests: [...existingRequests, newRequest],
    };

    saveAccountToFirebase(updatedKid);

    if (onUpdateAccounts) {
      onUpdateAccounts(accounts.map((a) => (a.id === kidAcc.id ? updatedKid : a)));
    }

    audioService.playSuccessSound();
    if (onTriggerNotification) {
      onTriggerNotification('📩 Đã gửi yêu cầu liên kết', `Đã gửi yêu cầu liên kết tới học sinh ${kidAcc.name}. Khi bé đăng nhập bấm Xác nhận, hai tài khoản sẽ liên kết!`);
    }
  };

  const handleUnlinkKid = async (kidAcc: UserAccount) => {
    audioService.playClickSound();
    const updatedParent = {
      ...currentParent,
      linkedKidIds: (currentParent.linkedKidIds || []).filter((id) => id !== kidAcc.id),
    };
    const updatedKid = {
      ...kidAcc,
      linkedParentIds: (kidAcc.linkedParentIds || []).filter((id) => id !== currentParent.id),
    };

    saveAccountToFirebase(updatedParent);
    saveAccountToFirebase(updatedKid);

    if (onUpdateAccounts) {
      onUpdateAccounts(accounts.map((a) => {
        if (a.id === currentParent.id) return updatedParent;
        if (a.id === kidAcc.id) return updatedKid;
        return a;
      }));
    }

    if (onTriggerNotification) {
      onTriggerNotification('🔓 Đã hủy liên kết', `Đã hủy liên kết với học sinh ${kidAcc.name} thành công!`);
    }
  };

  // Handle Create / Update Student
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const targetUsername = (username || fullName).trim().toLowerCase().replace(/\s+/g, '');
    const isDuplicateUsername = accounts.some(
      (a) => a.id !== editingStudentId && a.username && a.username.trim().toLowerCase() === targetUsername
    );

    if (isDuplicateUsername) {
      audioService.playErrorSound();
      if (onTriggerNotification) {
        onTriggerNotification(
          '⚠️ Trùng lặp tên đăng nhập',
          `Tên đăng nhập "@${targetUsername}" đã tồn tại trong hệ thống. Vui lòng chọn tên khác cho bé!`,
          'urgent'
        );
      }
      return;
    }

    audioService.playSuccessSound();

    if (editingStudentId && onUpdateAccounts) {
      const targetKid = accounts.find((a) => a.id === editingStudentId);
      const updatedKid = targetKid
        ? { ...targetKid, name: fullName, username, stars, avatar: studentAvatar || targetKid.avatar || '🎒' }
        : null;
      if (updatedKid) {
        saveAccountToFirebase(updatedKid);
      }

      const updated = accounts.map((a) =>
        a.id === editingStudentId && updatedKid ? updatedKid : a
      );
      onUpdateAccounts(updated);
      if (onTriggerNotification) {
        onTriggerNotification('✅ Cập nhật học sinh', `Đã cập nhật thông tin tài khoản cho bé ${fullName}!`);
      }
    } else {
      const newKidId = `acc-${Date.now()}`;
      const newAcc: UserAccount = {
        id: newKidId,
        name: fullName,
        username: username || fullName.toLowerCase().replace(/\s+/g, ''),
        passwordHash: password || '123456',
        role: 'kid',
        avatar: studentAvatar || '🎒',
        stars: stars || 100,
        vipExpiryDate: currentParent.vipExpiryDate || '2027-12-31',
        isVip: currentParent.isVip ?? true,
        allowedGrades: currentParent.allowedGrades || ['all'],
        linkedParentIds: [currentParent.id],
        createdAt: new Date().toISOString(),
      };

      const updatedParent = {
        ...currentParent,
        linkedKidIds: Array.from(new Set([...(currentParent.linkedKidIds || []), newKidId])),
      };

      saveAccountToFirebase(newAcc);
      saveAccountToFirebase(updatedParent);

      if (onUpdateAccounts) {
        onUpdateAccounts(
          accounts.map((a) => (a.id === currentParent.id ? updatedParent : a)).concat(newAcc)
        );
      }
      if (onTriggerNotification) {
        onTriggerNotification('🎉 Tạo tài khoản bé mới', `Đã tạo tài khoản cho bé ${fullName} và liên kết tự động với Phụ huynh!`);
      }
    }

    setEditingStudentId(null);
    setFullName('');
    setUsername('');
    setPassword('');
    setStudentAvatar('🎒');
  };

  // Gift modal actions
  const handleOpenGiftsModal = (studentName: string) => {
    audioService.playClickSound();
    setActiveGiftStudent(studentName);
    setShowGiftModal(true);
  };

  const handleSaveGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftTitle.trim()) return;

    audioService.playSuccessSound();

    if (editingGiftId) {
      setGiftsList(
        giftsList.map((g) =>
          g.id === editingGiftId
            ? {
                ...g,
                title: giftTitle,
                subtitle: `${giftDesc || 'Phần thưởng'} | ⭐ ${giftStars} Sao`,
                starsRequired: giftStars,
                emoji: giftEmoji,
                colorTheme: giftColor,
              }
            : g
        )
      );
      setEditingGiftId(null);
    } else {
      const newG: GiftItem = {
        id: `g-${Date.now()}`,
        title: `${giftTitle} ${giftEmoji}`,
        subtitle: `${giftDesc || 'Phần thưởng mới'} | ⭐ ${giftStars} Sao`,
        starsRequired: giftStars,
        emoji: giftEmoji,
        colorTheme: giftColor,
      };
      setGiftsList([...giftsList, newG]);
    }

    setGiftTitle('');
    setGiftDesc('');
    setGiftStars(80);
  };

  const handleStartEditGift = (g: GiftItem) => {
    audioService.playClickSound();
    setEditingGiftId(g.id);
    setGiftTitle(g.title.replace(g.emoji, '').trim());
    setGiftStars(g.starsRequired);
    setGiftEmoji(g.emoji);
    setGiftColor(g.colorTheme);
  };

  const handleDeleteGift = (id: string) => {
    audioService.playClickSound();
    setGiftsList(giftsList.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-5 select-none font-sans text-slate-800">
      {/* Title Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          Góc Quản Trị Phụ Huynh
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
          Quản lý cơ sở dữ liệu và tải bài học thông minh cùng Gemini AI
        </p>
      </div>

      {/* Top Box: Góc Phụ Huynh (Parent Portal) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-[#1d50b4] flex items-center justify-center font-extrabold text-xl">
            👤
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800">Góc Phụ Huynh (Parent Portal)</h3>
            <p className="text-xs font-semibold text-slate-500">
              Tài khoản phụ huynh: <span className="text-slate-800 font-bold">caoquocbaozx4@gmail.com</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            audioService.playClickSound();
            if (onLogout) onLogout();
          }}
          className="px-4 py-1.5 rounded-xl border border-pink-300 text-pink-600 hover:bg-pink-50 font-black text-xs transition cursor-pointer"
        >
          Đăng xuất
        </button>
      </div>

      {/* Main Section: Quản lý học sinh (Student Management) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
          <span>👥</span> Quản lý học sinh (Student Management)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Hồ sơ tài khoản bé (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-700">Hồ sơ tài khoản bé</h4>

            {/* Search and Filter row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none"
                />
              </div>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </div>

            {/* Student List Cards */}
            <div className="space-y-2.5">
              {linkedKids.length === 0 ? (
                <div className="p-4 rounded-2xl border border-dashed border-sky-300 bg-sky-50/50 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-sky-100 text-[#1d50b4] mx-auto flex items-center justify-center font-bold text-lg">
                    👥
                  </div>
                  <p className="text-xs font-black text-slate-800">Chưa có tài khoản bé nào được liên kết</p>
                  <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                    Chỉ tài khoản bé đã liên kết mới hiển thị tại đây. Phụ huynh hãy gửi yêu cầu liên kết ở phần <span className="font-extrabold text-[#1d50b4]">"Liên Kết & Quản Lý Tài Khoản Con"</span> bên dưới, hoặc dùng form bên phải để tạo tài khoản bé mới!
                  </p>
                </div>
              ) : filteredAndSortedKids.length === 0 ? (
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-center text-xs font-bold text-slate-500">
                  Không tìm thấy tài khoản bé nào khớp với từ khóa "{searchQuery}"
                </div>
              ) : (
                filteredAndSortedKids.map((st) => (
                  <div
                    key={st.id}
                    className="p-3 rounded-2xl border border-sky-300 bg-sky-50/40 flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => {
                          audioService.playClickSound();
                          setProfileModalStudent(st as UserAccount);
                        }}
                        title="Nhấn để xem thông tin cá nhân của bé"
                        className="w-10 h-10 rounded-full border-2 border-sky-400 hover:border-amber-400 overflow-hidden shrink-0 shadow-2xs cursor-pointer transition transform hover:scale-105 active:scale-95 flex items-center justify-center bg-sky-100"
                      >
                        <UserAvatar
                          avatar={st.avatar}
                          name={st.name}
                          className="w-full h-full rounded-full"
                        />
                      </button>
                      <div className="min-w-0">
                        <h5 className="text-xs font-black text-slate-800 truncate">{st.name}</h5>
                        <p className="text-[10px] font-semibold text-slate-500 truncate">
                          Tên đăng nhập: <span className="text-sky-600 font-bold">{st.username}</span> | Mật khẩu:{' '}
                          <span className="text-slate-400">***</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEditStudent(st)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-sky-600 border border-sky-300 rounded-lg text-[11px] font-extrabold flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>✏️</span> Sửa
                      </button>

                      <button
                        onClick={() => handleOpenGiftsModal(st.name)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-purple-600 border border-purple-300 rounded-lg text-[11px] font-extrabold flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>🎁</span> Quà
                      </button>

                      <span className="px-2.5 py-1 bg-white border border-amber-300 text-amber-700 rounded-lg text-[11px] font-extrabold flex items-center gap-0.5">
                        ⭐ {st.stars !== undefined ? st.stars : 0}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Form (7 cols) */}
          <div className="lg:col-span-7 p-4 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/30 space-y-3">
            <h4 className="text-xs font-black text-[#1d50b4] flex items-center gap-1.5">
              <span>{editingStudentId ? '✏️' : '➕'}</span>
              <span>{editingStudentId ? 'Chỉnh sửa thông tin bé' : 'Tạo tài khoản bé mới'}</span>
            </h4>

            <form onSubmit={handleSaveStudent} className="space-y-3 text-xs font-semibold">
              {/* Full Name */}
              <div>
                <label className="block text-slate-700 mb-1 font-extrabold">Họ và tên của bé</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ví dụ: Hàn Đăng Duy"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-slate-700 mb-1 font-extrabold">Tên đăng nhập (username)</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ví dụ: dangduy"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-700 mb-1 font-extrabold">Mật khẩu</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ví dụ: dangduylop3"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Stars field if editing */}
              {editingStudentId && (
                <div>
                  <label className="block text-slate-700 mb-1 font-extrabold">Số sao của bé</label>
                  <input
                    type="number"
                    value={stars}
                    onChange={(e) => setStars(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none"
                  />
                </div>
              )}

              {/* Companion Pet */}
              <div>
                <label className="block text-slate-700 mb-1 font-extrabold">Chọn bạn đồng hành (Pet)</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPetCompanion('kido' as any)}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition ${
                      (petCompanion as string) === 'kido' || (petCompanion as string) === 'dino' ? 'border-2 border-sky-400 bg-white font-extrabold shadow-2xs' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <span>🦖</span> Khủng Long Kido
                  </button>

                  <button
                    type="button"
                    onClick={() => setPetCompanion('panda')}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition ${
                      petCompanion === 'panda' ? 'border-2 border-sky-400 bg-white font-extrabold shadow-2xs' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <span>🐼</span> Gấu Trúc Panda
                  </button>
                </div>
              </div>

              {/* Avatar options */}
              <div>
                <label className="block text-slate-700 mb-1 font-extrabold text-xs">Chọn biểu tượng hoặc Tải ảnh đại diện</label>
                
                <input
                  type="file"
                  ref={studentFileInputRef}
                  onChange={handleStudentPhotoUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-1.5">
                  {['🦖', '🐱', '🐶', '🦁', '🤖', '👾', '🎒'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setStudentAvatar(emoji)}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg cursor-pointer transition ${
                        studentAvatar === emoji ? 'border-2 border-amber-400 bg-amber-50 ring-2 ring-amber-200' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span>{emoji}</span>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => studentFileInputRef.current?.click()}
                    className="px-3 py-2 rounded-xl border border-sky-300 bg-sky-50 text-sky-700 text-xs font-extrabold flex items-center gap-1 cursor-pointer hover:bg-sky-100 transition shadow-2xs"
                  >
                    <Camera size={14} />
                    <span>Tải ảnh</span>
                  </button>
                </div>

                {/* Show avatar preview if it's a uploaded photo dataUrl or image */}
                {studentAvatar && isImageUrl(studentAvatar) && (
                  <div className="mt-2 flex items-center gap-2 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    <UserAvatar avatar={studentAvatar} name="Ảnh đã tải" className="w-8 h-8 rounded-full border border-emerald-400" />
                    <span className="text-[11px] font-bold text-emerald-800">Ảnh thực tế đã được tải lên!</span>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>{editingStudentId ? 'Cập nhật tài khoản bé ⚡' : 'Tạo tài khoản bé ⚡'}</span>
                </button>

                {editingStudentId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs rounded-xl transition cursor-pointer"
                  >
                    Hủy bỏ ⊗
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Manual Account Linking Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
            <Link2 className="text-[#1d50b4]" size={18} />
            <span>Liên Kết & Quản Lý Tài Khoản Con (Parent-Student Linking)</span>
          </h3>
          <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Đã liên kết: {(currentParent.linkedKidIds || []).length} tài khoản
          </span>
        </div>

        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Gửi yêu cầu liên kết tới tài khoản của học sinh. Học sinh sẽ nhận được thông báo yêu cầu xác nhận khi đăng nhập.
          <span className="block mt-1 font-extrabold text-[#1d50b4] bg-sky-50 p-2 rounded-xl border border-sky-200">
            ✨ Synchronized Privileges: Khi 2 tài khoản được liên kết, nếu 1 trong 2 tài khoản được cấp bất kỳ quyền nào (từ VIP, ngày gia hạn, đến phân quyền khối lớp & các chức năng), tài khoản còn lại sẽ tự động đồng bộ đầy đủ!
          </span>
        </p>

        {/* Search Student to Link */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={targetStudentSearch}
              onChange={(e) => setTargetStudentSearch(e.target.value)}
              placeholder="Nhập tên đăng nhập hoặc họ tên học sinh cần liên kết..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-[#1d50b4]"
            />
          </div>
        </div>

        {/* Student Linking Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {accounts
            .filter((a) => a.role === 'kid')
            .filter((a) => {
              if (!targetStudentSearch.trim()) return true;
              const q = targetStudentSearch.toLowerCase();
              return a.name.toLowerCase().includes(q) || a.username.toLowerCase().includes(q);
            })
            .map((kid) => {
              const isLinked = (currentParent.linkedKidIds || []).includes(kid.id) || (kid.linkedParentIds || []).includes(currentParent.id);
              const isPending = (kid.pendingParentRequests || []).some((r) => r.parentId === currentParent.id);

              return (
                <div
                  key={kid.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 transition ${
                    isLinked
                      ? 'border-emerald-300 bg-emerald-50/40'
                      : isPending
                      ? 'border-amber-300 bg-amber-50/40'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar avatar={kid.avatar} name={kid.name} className="w-10 h-10 rounded-full border border-slate-300 shrink-0" />
                    <div className="min-w-0">
                      <h5 className="text-xs font-black text-slate-800 truncate">{kid.name}</h5>
                      <p className="text-[10px] font-bold text-slate-500 truncate">
                        Username: <span className="text-sky-600 font-extrabold">{kid.username}</span>
                      </p>
                      {isLinked && (
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700">
                            <UserCheck size={12} /> Đã liên kết
                          </span>
                          <span className="inline-flex items-center gap-1 text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100">
                            🔄 Tự động đồng bộ VIP & Quyền môn học
                          </span>
                        </div>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-700 mt-0.5">
                          <Clock size={12} /> Đang chờ học sinh xác nhận...
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isLinked ? (
                      <button
                        onClick={() => handleUnlinkKid(kid)}
                        className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-300 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition"
                      >
                        <Unlink size={13} />
                        <span>Hủy liên kết</span>
                      </button>
                    ) : isPending ? (
                      <button
                        disabled
                        className="px-3 py-1.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-not-allowed opacity-80"
                      >
                        <Clock size={13} />
                        <span>Chờ xác nhận</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendLinkRequest(kid)}
                        className="px-3 py-1.5 bg-[#1d50b4] hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-xs transition"
                      >
                        <Send size={13} />
                        <span>Gửi yêu cầu</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Bottom Box: Quản lý Bài giảng thông minh (AI Units) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
          <span>📁</span> Quản lý Bài giảng thông minh (AI Units)
        </h3>
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
          <p className="text-xs font-bold text-slate-400">Chưa có bài học tự động nạp vào trong hệ thống.</p>
        </div>
      </div>

      {/* MODAL: GIFT MANAGEMENT (Image 5) */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-200 shadow-2xl space-y-5 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <span>🎁</span> Quản lý phần thưởng của bé: <span className="text-[#1d50b4]">{activeGiftStudent}</span>
              </h3>
              <button
                onClick={() => setShowGiftModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Left Column: List of current gifts (6 cols) */}
              <div className="md:col-span-6 space-y-3">
                <h4 className="text-xs font-black text-slate-800">Danh sách quà hiện tại</h4>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {giftsList.map((g) => (
                    <div
                      key={g.id}
                      className="p-3 rounded-2xl border border-emerald-300 bg-emerald-50/30 flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                          {g.emoji}
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-black text-slate-800 truncate">{g.title}</h5>
                          <p className="text-[10px] font-semibold text-slate-500 truncate">{g.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEditGift(g)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-50 text-sky-600 border border-sky-300 rounded-lg text-[10px] font-extrabold cursor-pointer"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteGift(g.id)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-50 text-red-600 border border-red-300 rounded-lg text-[10px] font-extrabold cursor-pointer"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Form to Add/Edit Gift (6 cols) */}
              <div className="md:col-span-6 p-4 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/20 space-y-3">
                <h4 className="text-xs font-black text-[#1d50b4] flex items-center gap-1">
                  <span>➕</span> {editingGiftId ? 'Chỉnh sửa phần thưởng' : 'Thêm phần thưởng mới'}
                </h4>

                <form onSubmit={handleSaveGift} className="space-y-3 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-700 mb-1 font-extrabold">Tên phần thưởng</label>
                    <input
                      type="text"
                      required
                      value={giftTitle}
                      onChange={(e) => setGiftTitle(e.target.value)}
                      placeholder="Ví dụ: Cốc nước khủng long"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-extrabold">Mô tả</label>
                    <input
                      type="text"
                      value={giftDesc}
                      onChange={(e) => setGiftDesc(e.target.value)}
                      placeholder="Ví dụ: Đổi cốc uống nước siêu xinh"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-extrabold">Số sao yêu cầu để đổi</label>
                    <input
                      type="number"
                      required
                      value={giftStars}
                      onChange={(e) => setGiftStars(parseInt(e.target.value, 10) || 0)}
                      placeholder="Ví dụ: 80"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none"
                    />
                  </div>

                  {/* Emoji selector */}
                  <div>
                    <label className="block text-slate-700 mb-1 font-extrabold">
                      Chọn biểu tượng (Emoji) HOẶC tải ảnh riêng
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      {['🎁', '🍦', '🍰', '🎨', '🚀', '🚜', '🎒'].map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setGiftEmoji(em)}
                          className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center cursor-pointer border ${
                            giftEmoji === em ? 'bg-amber-100 border-amber-400' : 'bg-white border-slate-200'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={giftEmoji}
                        onChange={(e) => setGiftEmoji(e.target.value)}
                        placeholder="Emoji (ví dụ: 🪁)"
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs"
                      />
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-white border border-sky-300 text-sky-700 text-xs font-extrabold rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Camera size={13} />
                        <span>Tải ảnh</span>
                      </button>
                    </div>
                  </div>

                  {/* Pastel color picker */}
                  <div>
                    <label className="block text-slate-700 mb-1 font-extrabold">Chọn gam màu chủ đạo (Pastel)</label>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setGiftColor('green')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer border ${
                          giftColor === 'green' ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-white border-slate-200'
                        }`}
                      >
                        Xanh Lá
                      </button>
                      <button
                        type="button"
                        onClick={() => setGiftColor('blue')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer border ${
                          giftColor === 'blue' ? 'bg-sky-100 text-sky-800 border-sky-400' : 'bg-white border-slate-200'
                        }`}
                      >
                        Xanh Lam
                      </button>
                      <button
                        type="button"
                        onClick={() => setGiftColor('pink')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer border ${
                          giftColor === 'pink' ? 'bg-pink-100 text-pink-800 border-pink-400' : 'bg-white border-slate-200'
                        }`}
                      >
                        Hồng
                      </button>
                      <button
                        type="button"
                        onClick={() => setGiftColor('purple')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer border ${
                          giftColor === 'purple' ? 'bg-purple-100 text-purple-800 border-purple-400' : 'bg-white border-slate-200'
                        }`}
                      >
                        Tím
                      </button>
                      <button
                        type="button"
                        onClick={() => setGiftColor('orange')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer border ${
                          giftColor === 'orange' ? 'bg-amber-100 text-amber-800 border-amber-400' : 'bg-white border-slate-200'
                        }`}
                      >
                        Cam
                      </button>
                      <button
                        type="button"
                        onClick={() => setGiftColor('yellow')}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer border ${
                          giftColor === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-400' : 'bg-white border-slate-200'
                        }`}
                      >
                        Vàng
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1 mt-2"
                  >
                    <span>💾 Lưu phần thưởng</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Kido nhắn bé Profile Card */}
      {profileModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] border-2 border-dashed border-blue-400 p-6 sm:p-7 max-w-xs sm:max-w-sm w-full text-center shadow-2xl relative animate-scaleUp">
            {/* Top avatar inside green dotted border ring */}
            <div className="relative mx-auto w-20 h-20 mb-3">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-400 p-1 flex items-center justify-center bg-emerald-50/50 shadow-xs">
                <UserAvatar
                  avatar={profileModalStudent.avatar}
                  name={profileModalStudent.name}
                  className="w-full h-full rounded-full"
                />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight mb-2">
              Kido nhắn bé
            </h3>

            {/* Info list */}
            <div className="text-xs sm:text-sm font-semibold text-slate-600 space-y-1.5 my-4 inline-block text-left">
              <p className="text-slate-500 font-bold mb-1 text-center">Thông tin cá nhân của Bé:</p>
              <p className="flex items-center gap-1.5"><span className="text-slate-400">-</span> <span>Họ Tên: <strong className="text-slate-800">{profileModalStudent.name}</strong></span></p>
              <p className="flex items-center gap-1.5"><span className="text-slate-400">-</span> <span>Tài khoản: <strong className="text-slate-800">{profileModalStudent.username || 'quocminh'}</strong></span></p>
              <p className="flex items-center gap-1.5"><span className="text-slate-400">-</span> <span>Số sao tích lũy: <strong className="text-slate-800">{profileModalStudent.stars !== undefined ? profileModalStudent.stars : 0}</strong> 🌟</span></p>
              <p className="flex items-center gap-1.5"><span className="text-slate-400">-</span> <span>Cấp độ hiện tại: <strong className="text-slate-800">Cấp độ 5</strong></span></p>
            </div>

            {/* Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  audioService.playClickSound();
                  setProfileModalStudent(null);
                }}
                className="w-full sm:w-auto px-8 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-md transition transform hover:scale-105 flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <span>Đồng ý</span>
                <span className="text-base font-black">➔</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
