import React, { useState, useEffect, useMemo } from 'react';
import { Brain, Video, Headphones, Target, Play, CheckCircle2, Volume2, Sparkles, Send, Award, Zap, Flame, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../utils/audio';
import { DictationPracticeView } from './DictationPracticeView';
import { StoryReadingView } from './StoryReadingView';
import { VideoShadowingLibraryView } from './VideoShadowingLibraryView';
import { LinearThinkingPracticeView } from './LinearThinkingPracticeView';
import { VideoLectureView } from './VideoLectureView';

import { UserAccount, UserProfile } from '../types';

interface LinearMindmapViewProps {
  initialTab?: string;
  onAddStars: (amount: number) => void;
  user?: UserAccount | UserProfile;
  onLogout?: () => void;
  onBack?: () => void;
}

export const LinearMindmapView: React.FC<LinearMindmapViewProps> = ({
  initialTab = 'mind-thinking',
  onAddStars,
  user,
  onLogout,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Task Station State
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    'task-1': false,
    'task-2': false,
    'task-3': false,
    'task-4': false,
  });

  const dailyTasks = [
    {
      id: 'task-1',
      title: 'Hoàn thành 1 bài Luyện Nghe (Nhớ - Viết Lại)',
      desc: 'Nghe đoạn âm thanh mẫu và gõ đúng câu tiếng Anh.',
      reward: 10,
      icon: Headphones,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700',
    },
    {
      id: 'task-2',
      title: 'Thực hành sơ đồ Tư Duy Linear',
      desc: 'Đọc và nghe phát âm 3 nhánh tư duy trong chủ đề All About Me.',
      reward: 15,
      icon: Brain,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      btnColor: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      id: 'task-3',
      title: 'Luyện tập Shadowing 1 câu tiếng Anh',
      desc: 'Nhại lại giọng nói người bản xứ để luyện ngữ điệu mượt mà.',
      reward: 10,
      icon: Video,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
      btnColor: 'bg-sky-600 hover:bg-sky-700',
    },
    {
      id: 'task-4',
      title: 'Duy trì chuỗi học tập 3 ngày liên tiếp',
      desc: 'Tích cực đăng nhập và học tập hàng ngày cùng Kido.',
      reward: 20,
      icon: Flame,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      btnColor: 'bg-amber-500 hover:bg-amber-600',
    },
  ];

  const sampleMindmapNodes = [
    { label: 'All About Me', color: 'bg-[#1d50b4]', text: 'Chủ đề bản thân' },
    { label: 'Name & Age', color: 'bg-emerald-500', text: 'Tên và tuổi (e.g. I am 7 years old)' },
    { label: 'Hobbies', color: 'bg-amber-500', text: 'Sở thích (e.g. I like reading & swimming)' },
    { label: 'Family Members', color: 'bg-purple-500', text: 'Gia đình (e.g. Father, Mother, Sister)' },
  ];

  const handleClaimTaskReward = (taskId: string, rewardAmount: number) => {
    if (completedTasks[taskId]) return;
    audioService.playSuccessSound();
    setCompletedTasks(prev => ({ ...prev, [taskId]: true }));
    onAddStars(rewardAmount);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-5 select-none font-sans relative">
      {/* Top Tab Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-3xl border border-sky-100 shadow-xs text-xs font-black">
        <button
          onClick={() => setActiveTab('mind-thinking')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl transition cursor-pointer ${
            activeTab === 'mind-thinking' ? 'bg-[#1d50b4] text-white shadow-xs' : 'text-slate-600 hover:bg-sky-50'
          }`}
        >
          <Brain size={16} />
          <span>Tư Duy Thinking</span>
        </button>

        <button
          onClick={() => setActiveTab('shadowing')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl transition cursor-pointer ${
            activeTab === 'shadowing' ? 'bg-[#1d50b4] text-white shadow-xs' : 'text-slate-600 hover:bg-sky-50'
          }`}
        >
          <Video size={16} />
          <span>Luyện Shadowing</span>
        </button>

        <button
          onClick={() => setActiveTab('dictation')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl transition cursor-pointer ${
            activeTab === 'dictation' ? 'bg-[#1d50b4] text-white shadow-xs' : 'text-slate-600 hover:bg-sky-50'
          }`}
        >
          <Headphones size={16} />
          <span>Luyện Nghe (Nhớ - Viết Lại)</span>
        </button>

        <button
          onClick={() => setActiveTab('storyboard-shadowing')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl transition cursor-pointer ${
            activeTab === 'storyboard-shadowing' ? 'bg-[#1d50b4] text-white shadow-xs' : 'text-slate-600 hover:bg-sky-50'
          }`}
        >
          <BookOpen size={16} className="text-cyan-300" />
          <span>Truyện StoryBoard - Shadowing</span>
        </button>

        <button
          onClick={() => setActiveTab('task-station')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl transition cursor-pointer ${
            activeTab === 'task-station' ? 'bg-[#1d50b4] text-white shadow-xs' : 'text-slate-600 hover:bg-sky-50'
          }`}
        >
          <Target size={16} className="text-amber-300" />
          <span>Trạm Nhiệm Vụ</span>
        </button>

        <button
          onClick={() => setActiveTab('video-lectures')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl transition cursor-pointer ${
            activeTab === 'video-lectures' ? 'bg-[#1d50b4] text-white shadow-xs' : 'text-slate-600 hover:bg-sky-50'
          }`}
        >
          <Video size={16} className="text-orange-300" />
          <span>Video Bài Giảng</span>
        </button>
      </div>

      {/* 1. MINDMAP THINKING VIEW */}
      {activeTab === 'mind-thinking' && (
        <LinearThinkingPracticeView
          user={user}
          onAddStars={onAddStars}
          onLogout={onLogout}
          onBack={onBack}
        />
      )}

      {/* 2. SHADOWING VIEW */}
      {activeTab === 'shadowing' && (
        <VideoShadowingLibraryView key="linear-video-shadowing-library" onAddStars={onAddStars} />
      )}

      {/* 3. DICTATION VIEW */}
      {activeTab === 'dictation' && (
        <DictationPracticeView
          key="linear-dictation-practice-view"
          onAddStars={onAddStars}
          user={user}
          onLogout={onLogout}
          onBack={onBack}
        />
      )}

      {/* 3.5. STORYBOARD - SHADOWING VIEW */}
      {activeTab === 'storyboard-shadowing' && (
        <StoryReadingView key="linear-storyboard-shadowing-view" onAddStars={onAddStars} />
      )}

      {/* 4. TASK STATION VIEW (Trạm Nhiệm Vụ) */}
      {activeTab === 'task-station' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Target className="text-amber-500" size={24} />
                <span>Trạm Nhiệm Vụ Tư Duy Linear</span>
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Hoàn thành nhiệm vụ mỗi ngày để tích lũy Sao Vàng & mở khóa danh hiệu Kido Master!
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-black text-xs">
              <Zap size={16} className="text-amber-500 fill-amber-500" />
              <span>Nhiệm vụ làm mới sau 24h</span>
            </div>
          </div>

          {/* Task List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyTasks.map((t) => {
              const TaskIcon = t.icon;
              const isClaimed = completedTasks[t.id];
              return (
                <div
                  key={t.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition ${t.color}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white shadow-2xs border border-slate-200/60 shrink-0">
                      <TaskIcon size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{t.title}</h4>
                      <p className="text-[11px] font-medium text-slate-600 mt-0.5">{t.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                    <span className="text-xs font-black text-amber-700 flex items-center gap-1">
                      <Award size={14} className="fill-amber-400 text-amber-500" />
                      <span>+{t.reward} Sao</span>
                    </span>

                    <button
                      onClick={() => handleClaimTaskReward(t.id, t.reward)}
                      disabled={isClaimed}
                      className={`px-4 py-1.5 rounded-xl text-xs font-black text-white transition flex items-center gap-1.5 cursor-pointer ${
                        isClaimed ? 'bg-slate-300 text-slate-600 cursor-not-allowed' : t.btnColor
                      }`}
                    >
                      {isClaimed ? (
                        <>
                          <CheckCircle2 size={14} />
                          <span>Đã nhận</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          <span>Nhận thưởng</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. VIDEO LECTURES VIEW (Video Bài Giảng) */}
      {activeTab === 'video-lectures' && (
        <VideoLectureView
          user={user}
          onLogout={onLogout}
          onBack={onBack}
        />
      )}
    </div>
  );
};
