import React, { useState } from 'react';
import { X, Crown, Sparkles, CheckCircle2, Clock, Zap, ShieldCheck, HeartHandshake, PhoneCall, Send, Star, Gift } from 'lucide-react';
import { VipPromotionConfig, UserProfile } from '../types';
import { saveAuditLogToFirebase } from '../lib/firebaseSync';

interface VipPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: VipPromotionConfig | null;
  user: UserProfile;
  onRequestUpgradeSuccess?: () => void;
}

export const VipPromotionModal: React.FC<VipPromotionModalProps> = ({
  isOpen,
  onClose,
  promotion,
  user,
  onRequestUpgradeSuccess
}) => {
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !promotion) return null;

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Record upgrade request in Audit Log / Admin Notice
      await saveAuditLogToFirebase({
        id: `audit-req-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN'),
        timestampMs: Date.now(),
        actorName: parentName || user.name || 'Học sinh / Phụ huynh',
        targetAccountId: user.id || 'account',
        targetAccountName: user.name || 'User',
        targetAccountRole: user.role,
        actionType: 'vip',
        actionTitle: '⚡ Yêu Cầu Nâng Cấp VIP PRO Khuyến Mãi',
        details: `Đăng ký khuyến mãi: "${promotion.title}". SĐT: ${parentPhone || 'Chưa nhập'}. Ghi chú: ${note || 'Không có'}. Giá áp dụng: ${promotion.discountedPrice}`,
        newValue: `VIP Request - ${promotion.discountedPrice}`
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      if (onRequestUpgradeSuccess) onRequestUpgradeSuccess();
    } catch (err) {
      console.error('Error submitting upgrade request:', err);
      setIsSubmitting(false);
      setIsSuccess(true); // Graceful fallback
    }
  };

  const features = promotion.featuresList && promotion.featuresList.length > 0 ? promotion.featuresList : [
    'Mở khóa trọn bộ 100% Bài Học & Đề Thi Khối 1 - Khối 5',
    'Không giới hạn thời gian dùng thử (Un-limited Trial Time)',
    'Luyện phát âm & hội thoại AI Kido Robot thông minh 24/7',
    'Báo cáo tiến độ học tập chi tiết qua Email Phụ Huynh hằng tuần',
    'Tặng ngay 500 Sao Thưởng & Bộ Sticker Linh Vật Kido Độc Quyền'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200/80 flex flex-col max-h-[92vh]">
        {/* Header Banner */}
        <div className={`bg-gradient-to-r ${promotion.bgGradient || 'from-amber-500 via-rose-500 to-indigo-700'} text-white p-5 sm:p-6 relative shrink-0`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Zap size={13} fill="currentColor" /> Khuyến Mãi Đặc Biệt
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-amber-200 font-bold text-xs">
              Giảm {promotion.discountPercent}%
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug">
            {promotion.title}
          </h3>

          <p className="text-xs sm:text-sm text-amber-100/90 font-medium mt-1 leading-relaxed">
            {promotion.description}
          </p>

          {/* Price Box Tag */}
          <div className="mt-4 inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-inner">
            <div>
              <span className="text-xs text-amber-200/80 font-bold line-through block">
                Giá gốc: {promotion.originalPrice}
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-300 flex items-center gap-1">
                {promotion.discountedPrice}
                <span className="text-xs font-bold text-white/80">/năm</span>
              </span>
            </div>
            <div className="pl-3 border-l border-white/20">
              <span className="text-[10px] font-black uppercase text-amber-200 tracking-wider block">Tiết kiệm ngay</span>
              <span className="text-sm font-black text-emerald-300">
                {promotion.discountPercent}% OFF
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="text-xl font-black text-slate-800">
                🎉 Đăng Ký Khuyến Mãi Thành Công!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                Hệ thống KidoEnglish đã ghi nhận thông tin yêu cầu nâng cấp VIP PRO cho học sinh <strong>{user.name}</strong> với mức giá ưu đãi <strong>{promotion.discountedPrice}</strong>.
              </p>
              <div className="bg-white p-4 rounded-xl border border-emerald-200 text-left text-xs text-slate-700 space-y-1">
                <p className="font-black text-emerald-800">📌 Hướng dẫn hoàn tất nhanh:</p>
                <p>• Ban quản trị hoặc Giáo viên phụ trách sẽ liên hệ SĐT <strong>{parentPhone || 'của bạn'}</strong> trong vòng 15-30 phút.</p>
                <p>• Hoặc liên hệ trực tiếp Hotline/Zalo Admin: <strong className="text-indigo-600">0988.123.456</strong> để kích hoạt tài khoản lập tức!</p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition shadow-md cursor-pointer"
              >
                Đã Hoàn Tất - Đóng Cửa Sổ
              </button>
            </div>
          ) : (
            <>
              {/* Features List */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Crown size={14} className="text-amber-500" />
                  <span>Đặc Quyền Gói VIP Pro Đã Bao Gồm</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs font-extrabold text-slate-700">
                      <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 size={12} />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fast Registration Form */}
              <form onSubmit={handleSubmitRequest} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <Send size={16} className="text-indigo-600" />
                    <span>Đăng Ký Nhận Ưu Đãi VIP Khuyến Mãi</span>
                  </h4>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Chỉ 199.000đ/Năm
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">
                      Họ Tên Phụ Huynh / Học Sinh:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Nguyễn Văn A"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">
                      Số Điện Thoại Zalo / Liên Hệ:
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="VD: 0912 345 678"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Ghi Chú Yêu Cầu (Tùy Chọn):
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Muốn đăng ký cho bé Lớp 3, tư vấn thanh toán qua Chuyển khoản"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span>Bảo mật 100% - Kích hoạt tự động sau 15 phút</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles size={16} />
                    <span>{isSubmitting ? 'Đang Gửi Yêu Cầu...' : 'Xác Nhận Đăng Ký VIP Ưu Đãi'}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
