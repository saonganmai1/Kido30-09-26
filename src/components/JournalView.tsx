import React, { useState, useEffect } from 'react';
import { Pencil, Image, Video, Save, Calendar, Trash2 } from 'lucide-react';
import { audioService } from '../utils/audio';
import { UserProfile } from '../types';
import { 
  JournalEntry, 
  subscribeJournalEntries, 
  saveJournalEntryToFirebase, 
  deleteJournalEntryFromFirebase 
} from '../lib/firebaseSync';

interface JournalViewProps {
  user?: UserProfile;
  onTriggerNotification?: (title: string, msg: string) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ user, onTriggerNotification }) => {
  const userId = user?.username || user?.name || 'acc-kid';
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  useEffect(() => {
    const unsub = subscribeJournalEntries(userId, (updatedEntries) => {
      setEntries(updatedEntries);
    });
    return () => unsub();
  }, [userId]);

  const colorOptions = [
    { name: 'White', hex: '#ffffff', border: 'border-slate-200' },
    { name: 'Orange', hex: '#ffedd5', border: 'border-orange-200' },
    { name: 'Yellow', hex: '#fef9c3', border: 'border-yellow-200' },
    { name: 'Green', hex: '#dcfce7', border: 'border-emerald-200' },
    { name: 'Purple', hex: '#f3e8ff', border: 'border-purple-200' },
  ];

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    audioService.playSuccessSound();

    const newEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      userId: userId,
      title: title.trim() || 'Nhật ký học tập',
      content: content.trim(),
      color: selectedColor,
      mediaUrl: mediaUrl.trim() || undefined,
      mediaType: mediaUrl.trim() ? mediaType : undefined,
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };

    saveJournalEntryToFirebase(newEntry);
    setTitle('');
    setContent('');
    setMediaUrl('');

    if (onTriggerNotification) {
      onTriggerNotification('📝 Đã lưu nhật ký', 'Nhật ký mới của bé đã được lưu thành công vào cơ sở dữ liệu!');
    }
  };

  const handleDeleteEntry = (id: string) => {
    audioService.playClickSound();
    deleteJournalEntryFromFirebase(id, userId);
  };

  return (
    <div className="space-y-5 select-none font-sans text-slate-800">
      {/* View Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          Nhật ký & Ghi chú của Bé <span className="text-amber-500">📝</span>
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
          Bé hoặc bố mẹ có thể viết nhật ký học tập, ghi chú từ vựng, lưu giữ hình ảnh và video đáng yêu tại đây nha!
        </p>
      </div>

      {/* 1. Viết nhật ký mới */}
      <div className="bg-sky-50/40 rounded-3xl p-5 border border-sky-200/80 shadow-xs space-y-4">
        <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
          <span>✍️</span> Viết nhật ký mới
        </h3>

        <form onSubmit={handleSaveEntry} className="space-y-3">
          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề nhật ký của bé..."
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-400"
          />

          {/* Content area */}
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Hôm nay bé học được từ gì vui? Viết cảm nghĩ vào đây nhé... (ví dụ: #tuvung #dongvat)"
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-400 resize-none"
          />

          {/* Color picker */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">Chọn màu nền note:</span>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setSelectedColor(c.hex)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-6 h-6 rounded-full border ${c.border} cursor-pointer transition transform hover:scale-110 ${
                    selectedColor === c.hex ? 'ring-2 ring-sky-400 scale-110' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Media attachment box */}
          <div className="p-4 rounded-2xl border border-dashed border-sky-300 bg-sky-100/30 space-y-2.5">
            <span className="text-xs font-extrabold text-slate-700 block">
              🖼️ Đính kèm hình ảnh hoặc video bài học:
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setMediaType('image')}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 cursor-pointer ${
                  mediaType === 'image' ? 'bg-blue-500 text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <Image size={14} />
                <span>Tải Ảnh Lên</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 cursor-pointer ${
                  mediaType === 'video' ? 'bg-blue-500 text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <Video size={14} />
                <span>Tải Video Lên</span>
              </button>

              <span className="text-xs font-semibold text-slate-400">Hoặc dán URL media ở dưới:</span>
            </div>

            <input
              type="text"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Dán link ảnh hoặc video (Youtube/MP4) trực tiếp..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={16} />
              <span>Lưu nhật ký</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Nhật ký học tập của bé */}
      <div className="space-y-3">
        <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
          <span>📒</span> Nhật ký học tập của bé
        </h3>

        {entries.length === 0 ? (
          <div className="bg-white/60 rounded-3xl p-10 text-center border border-slate-200/60 shadow-2xs space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-3xl">
              🦕
            </div>
            <h4 className="text-sm font-extrabold text-slate-700">Chưa có trang nhật ký nào!</h4>
            <p className="text-xs font-medium text-slate-400 max-w-sm mx-auto">
              Bé hãy điền thông tin vào bảng viết phía trên để lưu giữ kỷ niệm học tiếng Anh nha.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                style={{ backgroundColor: entry.color }}
                className="p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 relative group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800">{entry.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400">{entry.createdAt}</span>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-medium text-slate-700 whitespace-pre-wrap">{entry.content}</p>

                {entry.mediaUrl && (
                  <div className="mt-2 rounded-xl overflow-hidden max-h-40 border border-slate-200">
                    {entry.mediaType === 'video' ? (
                      <div className="p-2 bg-slate-900 text-white text-xs font-mono truncate">
                        🎬 {entry.mediaUrl}
                      </div>
                    ) : (
                      <img
                        src={entry.mediaUrl}
                        alt="Media attachment"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
