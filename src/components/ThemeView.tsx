import React, { useState } from 'react';
import { Palette, Check, RotateCcw, ExternalLink, Box, Layout } from 'lucide-react';
import { audioService } from '../utils/audio';

interface ThemeViewProps {
  onGoHome?: () => void;
  onTriggerNotification?: (title: string, msg: string) => void;
}

export const ThemeView: React.FC<ThemeViewProps> = ({
  onGoHome,
  onTriggerNotification,
}) => {
  const [uiStyle, setUiStyle] = useState<'standard' | 'claymorphism'>('standard');
  const [selectedTheme, setSelectedTheme] = useState<string>('Blue');
  const [activeButtonColor, setActiveButtonColor] = useState<string>('#1d50b4');
  const [buttonSize, setButtonSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [borderRadius, setBorderRadius] = useState<'round' | 'square'>('round');

  const presets = [
    { id: 'Green', name: 'Green', icon: '🌿', bg: 'bg-emerald-50 border-emerald-200' },
    { id: 'Pink', name: 'Pink', icon: '💗', bg: 'bg-pink-50 border-pink-200' },
    { id: 'Blue', name: 'Blue', icon: '💧', bg: 'bg-sky-50 border-sky-300' },
    { id: 'Purple', name: 'Purple', icon: '⭐', bg: 'bg-purple-50 border-purple-200' },
    { id: 'Peach', name: 'Peach', icon: '🍊', bg: 'bg-amber-50 border-amber-200' },
    { id: 'Mint', name: 'Mint', icon: '☕', bg: 'bg-teal-50 border-teal-200' },
    { id: 'Lemon', name: 'Lemon', icon: '🍋', bg: 'bg-yellow-50 border-yellow-200' },
    { id: 'Lavender', name: 'Lavender', icon: '🌙', bg: 'bg-indigo-50 border-indigo-200' },
    { id: 'Coral', name: 'Coral', icon: '🔥', bg: 'bg-rose-50 border-rose-200' },
    { id: 'Sky', name: 'Sky', icon: '☁️', bg: 'bg-cyan-50 border-cyan-200' },
  ];

  const colorSwatches = [
    '#10b981', // Green
    '#1d50b4', // Blue
    '#4338ca', // Indigo
    '#8b5cf6', // Purple
    '#f97316', // Orange
    '#059669', // Dark Green
    '#ef4444', // Red
    '#06b6d4', // Cyan
  ];

  const handleResetDefault = () => {
    audioService.playClickSound();
    setUiStyle('standard');
    setSelectedTheme('Blue');
    setActiveButtonColor('#1d50b4');
    setButtonSize('medium');
    setBorderRadius('round');
    if (onTriggerNotification) {
      onTriggerNotification('↺ Khôi phục chủ đề', 'Đã đặt lại chủ đề mặc định!');
    }
  };

  return (
    <div className="space-y-5 select-none font-sans text-slate-800">
      {/* Title Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          Chủ đề hiển thị <span className="text-pink-500">🎨</span>
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
          Chọn một trong mười preset nền; tên hiển thị ngắn, chữ đầu viết hoa (Green, Pink, Blue, ...). Lưu trên thiết bị này.
        </p>
      </div>

      {/* 1. Phong cách Giao diện (UI Style) */}
      <div className="bg-purple-50/40 rounded-3xl p-5 border border-purple-200/80 shadow-xs space-y-3">
        <div>
          <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
            <span>⚛️</span> Phong cách Giao diện (UI Style)
          </h3>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Chọn phong cách hiển thị dành cho bé. Bạn có thể bật thử nghiệm hoặc quay về mặc định bất cứ lúc nào!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Standard */}
          <button
            onClick={() => {
              audioService.playClickSound();
              setUiStyle('standard');
            }}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3.5 ${
              uiStyle === 'standard'
                ? 'border-2 border-blue-500 bg-white shadow-sm ring-2 ring-blue-100'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
              <Layout size={20} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-800">Tiêu Chuẩn (Standard)</h4>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                Giao diện phẳng bo tròn nhẹ nhàng ban đầu
              </p>
            </div>
          </button>

          {/* Card 2: Claymorphism 3D */}
          <button
            onClick={() => {
              audioService.playClickSound();
              setUiStyle('claymorphism');
            }}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3.5 ${
              uiStyle === 'claymorphism'
                ? 'border-2 border-blue-500 bg-white shadow-sm ring-2 ring-blue-100'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200">
              <Box size={20} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-800">Claymorphism 3D (Đất nặn)</h4>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                Hiệu ứng nổi khối đất nặn pastel 3D cho bé
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Màu nền trang (Presets Grid) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
          <span>🌈</span> Màu nền trang
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {presets.map((p) => {
            const isSelected = selectedTheme === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  audioService.playClickSound();
                  setSelectedTheme(p.id);
                }}
                className={`relative flex flex-col items-center justify-center py-5 px-3 rounded-2xl border transition cursor-pointer ${p.bg} ${
                  isSelected
                    ? 'border-2 border-blue-500 shadow-md scale-[1.02] ring-2 ring-blue-200'
                    : 'hover:shadow-2xs opacity-90 hover:opacity-100'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xs">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
                <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-xl shadow-2xs mb-2">
                  {p.icon}
                </div>
                <span className="text-xs font-black text-slate-800">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Nút hành động */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-5">
        <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
          <span>⚙️</span> Nút hành động
        </h3>

        <div className="space-y-4 text-xs font-extrabold">
          {/* Swatches */}
          <div>
            <p className="text-slate-500 mb-2 font-bold">Màu nút chính</p>
            <div className="flex flex-wrap items-center gap-3">
              {colorSwatches.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    audioService.playClickSound();
                    setActiveButtonColor(color);
                  }}
                  style={{ backgroundColor: color }}
                  className={`w-7 h-7 rounded-full transition cursor-pointer transform hover:scale-110 flex items-center justify-center ${
                    activeButtonColor === color ? 'ring-3 ring-blue-300 scale-110 shadow-sm' : ''
                  }`}
                >
                  {activeButtonColor === color && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
            {/* Button size */}
            <div>
              <p className="text-slate-500 mb-2 font-bold">Cỡ chữ / nút</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setButtonSize('small')}
                  className={`px-4 py-1.5 rounded-xl font-black text-xs cursor-pointer border ${
                    buttonSize === 'small' ? 'bg-blue-500 text-white border-blue-500' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  Nhỏ
                </button>
                <button
                  onClick={() => setButtonSize('medium')}
                  className={`px-4 py-1.5 rounded-xl font-black text-xs cursor-pointer border ${
                    buttonSize === 'medium' ? 'bg-blue-500 text-white border-blue-500' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  Vừa
                </button>
                <button
                  onClick={() => setButtonSize('large')}
                  className={`px-4 py-1.5 rounded-xl font-black text-xs cursor-pointer border ${
                    buttonSize === 'large' ? 'bg-blue-500 text-white border-blue-500' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  Lớn
                </button>
              </div>
            </div>

            {/* Border radius */}
            <div>
              <p className="text-slate-500 mb-2 font-bold">Bo góc</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBorderRadius('round')}
                  className={`px-4 py-1.5 rounded-xl font-black text-xs cursor-pointer border ${
                    borderRadius === 'round' ? 'bg-blue-500 text-white border-blue-500' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  Tròn
                </button>
                <button
                  onClick={() => setBorderRadius('square')}
                  className={`px-4 py-1.5 rounded-xl font-black text-xs cursor-pointer border ${
                    borderRadius === 'square' ? 'bg-blue-500 text-white border-blue-500' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  Vuông
                </button>
              </div>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleResetDefault}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Khôi phục nền mặc định</span>
            </button>

            {onGoHome && (
              <button
                onClick={() => {
                  audioService.playClickSound();
                  onGoHome();
                }}
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Xem trên trang chủ</span>
                <ExternalLink size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
