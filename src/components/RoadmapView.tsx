import React, { useState } from 'react';
import { 
  Trophy, 
  Star, 
  Flame, 
  LogOut, 
  ArrowLeft, 
  Lock, 
  Check, 
  Sparkles,
  MapPin,
  GraduationCap,
  X,
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, ActiveTab } from '../types';
import { audioService } from '../utils/audio';
import { hasGradeAccess } from '../utils/permissions';
import { UserAvatar } from './UserAvatar';

interface RoadmapViewProps {
  user?: UserProfile;
  setActiveTab: (tab: ActiveTab) => void;
  onAddStars?: (amount: number) => void;
  onBack?: () => void;
  onLogout?: () => void;
}

interface RoadmapUnit {
  id: number;
  unitNumber: number;
  title: string;
  subtitle: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  icon: string;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  user,
  setActiveTab,
  onAddStars,
  onBack,
  onLogout,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [activeUnitModal, setActiveUnitModal] = useState<RoadmapUnit | null>(null);
  const [hoveredUnitId, setHoveredUnitId] = useState<number | null>(null);

  // Define full unit datasets per grade matching GradeView 100%
  const getUnitsForGrade = (grade: number): RoadmapUnit[] => {
    if (grade === 1) {
      return [
        { id: 1, unitNumber: 1, title: 'Unit 1: In the school playground', subtitle: 'Trong sân trường', isUnlocked: true, isCompleted: false, icon: '🏫' },
        { id: 2, unitNumber: 2, title: 'Unit 2: In the dining room', subtitle: 'Trong phòng ăn', isUnlocked: false, isCompleted: false, icon: '🍽️' },
        { id: 3, unitNumber: 3, title: 'Unit 3: At the street market', subtitle: 'Tại chợ đường phố', isUnlocked: false, isCompleted: false, icon: '🏪' },
        { id: 4, unitNumber: 4, title: 'Unit 4: In the bedroom', subtitle: 'Trong phòng ngủ', isUnlocked: false, isCompleted: false, icon: '🛏️' },
        { id: 5, unitNumber: 5, title: 'Unit 5: At the fish and chip shop', subtitle: 'Cửa hàng ăn nhanh', isUnlocked: false, isCompleted: false, icon: '🍟' },
        { id: 6, unitNumber: 6, title: 'Unit 6: In the classroom', subtitle: 'Trong lớp học', isUnlocked: false, isCompleted: false, icon: '📚' },
        { id: 7, unitNumber: 7, title: 'Unit 7: In the garden', subtitle: 'Trong khu vườn', isUnlocked: false, isCompleted: false, icon: '🏡' },
        { id: 8, unitNumber: 8, title: 'Unit 8: In the park', subtitle: 'Trong công viên', isUnlocked: false, isCompleted: false, icon: '🌳' },
        { id: 9, unitNumber: 9, title: 'Unit 9: In the shop', subtitle: 'Trong cửa hàng', isUnlocked: false, isCompleted: false, icon: '🛍️' },
        { id: 10, unitNumber: 10, title: 'Unit 10: At the zoo', subtitle: 'Tại sở thú', isUnlocked: false, isCompleted: false, icon: '🦁' },
        { id: 11, unitNumber: 11, title: 'Unit 11: At the bus stop', subtitle: 'Tại điểm dừng xe buýt', isUnlocked: false, isCompleted: false, icon: '🚏' },
        { id: 12, unitNumber: 12, title: 'Unit 12: At the lake', subtitle: 'Ở hồ nước', isUnlocked: false, isCompleted: false, icon: '🏞️' },
        { id: 13, unitNumber: 13, title: 'Unit 13: In the school canteen', subtitle: 'Trong căn tin trường', isUnlocked: false, isCompleted: false, icon: '🥪' },
        { id: 14, unitNumber: 14, title: 'Unit 14: In the toy shop', subtitle: 'Trong cửa hàng đồ chơi', isUnlocked: false, isCompleted: false, icon: '🧸' },
        { id: 15, unitNumber: 15, title: 'Unit 15: At the football match', subtitle: 'Trận thi đấu bóng đá', isUnlocked: false, isCompleted: false, icon: '⚽' },
        { id: 16, unitNumber: 16, title: 'Unit 16: At home', subtitle: 'Ở nhà', isUnlocked: false, isCompleted: false, icon: '🏠' },
      ];
    }
    if (grade === 2) {
      return [
        { id: 1, unitNumber: 1, title: 'Unit 1: At my birthday party', subtitle: 'Tại bữa tiệc sinh nhật', isUnlocked: true, isCompleted: false, icon: '🎂' },
        { id: 2, unitNumber: 2, title: 'Unit 2: In the backyard', subtitle: 'Trong sân sau', isUnlocked: false, isCompleted: false, icon: '🏡' },
        { id: 3, unitNumber: 3, title: 'Unit 3: At the seaside', subtitle: 'Ở bãi biển', isUnlocked: false, isCompleted: false, icon: '🏖️' },
        { id: 4, unitNumber: 4, title: 'Unit 4: In the countryside', subtitle: 'Ở nông thôn', isUnlocked: false, isCompleted: false, icon: '🌾' },
        { id: 5, unitNumber: 5, title: 'Unit 5: In the classroom', subtitle: 'Trong lớp học', isUnlocked: false, isCompleted: false, icon: '🏫' },
        { id: 6, unitNumber: 6, title: 'Unit 6: On the farm', subtitle: 'Trên trang trại', isUnlocked: false, isCompleted: false, icon: '🚜' },
        { id: 7, unitNumber: 7, title: 'Unit 7: In the kitchen', subtitle: 'Trong nhà bếp', isUnlocked: false, isCompleted: false, icon: '🍳' },
        { id: 8, unitNumber: 8, title: 'Unit 8: In the village', subtitle: 'Trong làng', isUnlocked: false, isCompleted: false, icon: '🏘️' },
        { id: 9, unitNumber: 9, title: 'Unit 9: In the grocery store', subtitle: 'Trong cửa hàng tạp hóa', isUnlocked: false, isCompleted: false, icon: '🛒' },
        { id: 10, unitNumber: 10, title: 'Unit 10: At the zoo', subtitle: 'Tại sở thú', isUnlocked: false, isCompleted: false, icon: '🦁' },
        { id: 11, unitNumber: 11, title: 'Unit 11: In the playground', subtitle: 'Trên sân chơi', isUnlocked: false, isCompleted: false, icon: '🛝' },
        { id: 12, unitNumber: 12, title: 'Unit 12: At the café', subtitle: 'Tại quán cà phê', isUnlocked: false, isCompleted: false, icon: '☕' },
        { id: 13, unitNumber: 13, title: 'Unit 13: In the maths class', subtitle: 'Giờ học Toán', isUnlocked: false, isCompleted: false, icon: '📐' },
        { id: 14, unitNumber: 14, title: 'Unit 14: At home', subtitle: 'Ở nhà', isUnlocked: false, isCompleted: false, icon: '🏠' },
        { id: 15, unitNumber: 15, title: 'Unit 15: In the clothes shop', subtitle: 'Trong cửa hàng quần áo', isUnlocked: false, isCompleted: false, icon: '👕' },
        { id: 16, unitNumber: 16, title: 'Unit 16: At the campsite', subtitle: 'Tại khu cắm trại', isUnlocked: false, isCompleted: false, icon: '⛺' },
      ];
    }
    if (grade === 3) {
      return [
        { id: 1, unitNumber: 1, title: 'Unit 1: Hello', subtitle: 'Chào hỏi và tự giới thiệu', isUnlocked: true, isCompleted: false, icon: '👋' },
        { id: 2, unitNumber: 2, title: 'Unit 2: Our names', subtitle: 'Hỏi và trả lời về tên và tuổi', isUnlocked: false, isCompleted: false, icon: '📛' },
        { id: 3, unitNumber: 3, title: 'Unit 3: Our friends', subtitle: 'Giới thiệu người khác', isUnlocked: false, isCompleted: false, icon: '🤝' },
        { id: 4, unitNumber: 4, title: 'Unit 4: Our bodies', subtitle: 'Bộ phận cơ thể và chỉ dẫn', isUnlocked: false, isCompleted: false, icon: '👁️' },
        { id: 5, unitNumber: 5, title: 'Unit 5: My hobbies', subtitle: 'Sở thích', isUnlocked: false, isCompleted: false, icon: '🎨' },
        { id: 6, unitNumber: 6, title: 'Unit 6: Our school', subtitle: 'Trường học và các phòng chức năng', isUnlocked: false, isCompleted: false, icon: '🏫' },
        { id: 7, unitNumber: 7, title: 'Unit 7: Classroom instructions', subtitle: 'Mệnh lệnh và xin phép trong lớp', isUnlocked: false, isCompleted: false, icon: '📢' },
        { id: 8, unitNumber: 8, title: 'Unit 8: My school things', subtitle: 'Đồ dùng học tập', isUnlocked: false, isCompleted: false, icon: '✏️' },
        { id: 9, unitNumber: 9, title: 'Unit 9: Colours', subtitle: 'Màu sắc', isUnlocked: false, isCompleted: false, icon: '🌈' },
        { id: 10, unitNumber: 10, title: 'Unit 10: Break time activities', subtitle: 'Các hoạt động giờ ra chơi', isUnlocked: false, isCompleted: false, icon: '⚽' },
        { id: 11, unitNumber: 11, title: 'Unit 11: My family', subtitle: 'Gia đình', isUnlocked: false, isCompleted: false, icon: '👨‍👩‍👧' },
        { id: 12, unitNumber: 12, title: 'Unit 12: Jobs', subtitle: 'Nghề nghiệp', isUnlocked: false, isCompleted: false, icon: '👩‍⚕️' },
        { id: 13, unitNumber: 13, title: 'Unit 13: My house', subtitle: 'Ngôi nhà và vị trí đồ vật', isUnlocked: false, isCompleted: false, icon: '🏡' },
        { id: 14, unitNumber: 14, title: 'Unit 14: My bedroom', subtitle: 'Phòng ngủ và số lượng vật dụng', isUnlocked: false, isCompleted: false, icon: '🛏️' },
        { id: 15, unitNumber: 15, title: 'Unit 15: At the dining table', subtitle: 'Đồ ăn và thức uống', isUnlocked: false, isCompleted: false, icon: '🍲' },
        { id: 16, unitNumber: 16, title: 'Unit 16: My pets', subtitle: 'Thú cưng', isUnlocked: false, isCompleted: false, icon: '🐶' },
        { id: 17, unitNumber: 17, title: 'Unit 17: Our toys', subtitle: 'Đồ chơi', isUnlocked: false, isCompleted: false, icon: '🧸' },
        { id: 18, unitNumber: 18, title: 'Unit 18: Playing and doing', subtitle: 'Hoạt động đang diễn ra', isUnlocked: false, isCompleted: false, icon: '🏃' },
        { id: 19, unitNumber: 19, title: 'Unit 19: Outdoor activities', subtitle: 'Hoạt động ngoài trời', isUnlocked: false, isCompleted: false, icon: '🚴' },
        { id: 20, unitNumber: 20, title: 'Unit 20: At the zoo', subtitle: 'Tại vườn thú', isUnlocked: false, isCompleted: false, icon: '🦁' },
      ];
    }
    if (grade === 4) {
      return [
        { id: 1, unitNumber: 1, title: 'Starter: My Classroom & Activities', subtitle: 'Chào hỏi và ôn tập hoạt động', isUnlocked: true, isCompleted: false, icon: '🏫' },
        { id: 2, unitNumber: 2, title: 'Unit 1: My Friends', subtitle: 'Những người bạn của tớ (Các quốc gia)', isUnlocked: false, isCompleted: false, icon: '💙' },
        { id: 3, unitNumber: 3, title: 'Unit 2: Time and Daily Routines', subtitle: 'Thời gian & Thói quen hàng ngày', isUnlocked: false, isCompleted: false, icon: '⏰' },
        { id: 4, unitNumber: 4, title: 'Unit 3: My Week', subtitle: 'Tuần lễ của tớ (Các thứ & Hoạt động)', isUnlocked: false, isCompleted: false, icon: '📅' },
        { id: 5, unitNumber: 5, title: 'Unit 4: My Birthday Party', subtitle: 'Bữa tiệc sinh nhật (Tháng & Đồ ăn)', isUnlocked: false, isCompleted: false, icon: '🎂' },
        { id: 6, unitNumber: 6, title: 'Unit 5: Things We Can Do', subtitle: 'Những khả năng của chúng ta', isUnlocked: false, isCompleted: false, icon: '🎨' },
        { id: 7, unitNumber: 7, title: 'Unit 6: Our School Facilities', subtitle: 'Cơ sở vật chất trường học', isUnlocked: false, isCompleted: false, icon: '🏫' },
        { id: 8, unitNumber: 8, title: 'Unit 7: Our Timetables', subtitle: 'Thời khóa biểu của chúng ta', isUnlocked: false, isCompleted: false, icon: '📚' },
        { id: 9, unitNumber: 9, title: 'Unit 8: My Favourite Subjects', subtitle: 'Môn học yêu thích của tớ', isUnlocked: false, isCompleted: false, icon: '🎨' },
        { id: 10, unitNumber: 10, title: 'Unit 9: Our Sports Day', subtitle: 'Ngày hội thể thao (Tháng & Sự kiện)', isUnlocked: false, isCompleted: false, icon: '🏅' },
        { id: 11, unitNumber: 11, title: 'Unit 10: Our Summer Holidays', subtitle: 'Kỳ nghỉ hè của chúng ta', isUnlocked: false, isCompleted: false, icon: '🏖️' },
        { id: 12, unitNumber: 12, title: 'Unit 11: My Home', subtitle: 'Nhà của tớ (Đặc điểm & Nơi ở)', isUnlocked: false, isCompleted: false, icon: '🏠' },
        { id: 13, unitNumber: 13, title: 'Unit 12: Jobs', subtitle: 'Nghề nghiệp & Nơi làm việc', isUnlocked: false, isCompleted: false, icon: '👨‍⚕️' },
        { id: 14, unitNumber: 14, title: 'Unit 13: Appearance', subtitle: 'Ngoại hình (Miêu tả hình dáng)', isUnlocked: false, isCompleted: false, icon: '👤' },
        { id: 15, unitNumber: 15, title: 'Unit 14: Daily Activities', subtitle: 'Hoạt động hàng ngày', isUnlocked: false, isCompleted: false, icon: '☀️' },
        { id: 16, unitNumber: 16, title: 'Unit 15: My Family\'s Weekends', subtitle: 'Cuối tuần của gia đình tớ', isUnlocked: false, isCompleted: false, icon: '👨‍👩‍👧' },
        { id: 17, unitNumber: 17, title: 'Unit 16: Weather', subtitle: 'Thời tiết', isUnlocked: false, isCompleted: false, icon: '🌤️' },
        { id: 18, unitNumber: 18, title: 'Unit 17: In the City', subtitle: 'Trong thành phố', isUnlocked: false, isCompleted: false, icon: '🏙️' },
        { id: 19, unitNumber: 19, title: 'Unit 18: At the Shopping Centre', subtitle: 'Tại trung tâm mua sắm', isUnlocked: false, isCompleted: false, icon: '🛍️' },
        { id: 20, unitNumber: 20, title: 'Unit 19: The Animal World', subtitle: 'Thế giới động vật', isUnlocked: false, isCompleted: false, icon: '🦁' },
        { id: 21, unitNumber: 21, title: 'Unit 20: At Summer Camp', subtitle: 'Tại trại hè', isUnlocked: false, isCompleted: false, icon: '⛺' },
      ];
    }
    // Grade 5
    return [
      { id: 1, unitNumber: 1, title: 'Unit 1: All about me!', subtitle: 'Thông tin cá nhân và sở thích', isUnlocked: true, isCompleted: false, icon: '💙' },
      { id: 2, unitNumber: 2, title: 'Unit 2: Our homes', subtitle: 'Nơi ở và địa chỉ', isUnlocked: false, isCompleted: false, icon: '🏡' },
      { id: 3, unitNumber: 3, title: 'Unit 3: My foreign friends', subtitle: 'Quốc tịch và tính cách', isUnlocked: false, isCompleted: false, icon: '🌍' },
      { id: 4, unitNumber: 4, title: 'Unit 4: Our free-time activities', subtitle: 'Hoạt động trong thời gian rảnh', isUnlocked: false, isCompleted: false, icon: '🎮' },
      { id: 5, unitNumber: 5, title: 'Unit 5: My future job', subtitle: 'Nghề nghiệp tương lai', isUnlocked: false, isCompleted: false, icon: '🚀' },
      { id: 6, unitNumber: 6, title: 'Unit 6: Our school rooms', subtitle: 'Các phòng học và vị trí', isUnlocked: false, isCompleted: false, icon: '🏫' },
      { id: 7, unitNumber: 7, title: 'Unit 7: Our favourite school activities', subtitle: 'Hoạt động yêu thích tại trường', isUnlocked: false, isCompleted: false, icon: '🎨' },
      { id: 8, unitNumber: 8, title: 'Unit 8: In our classroom', subtitle: 'Đồ vật trong lớp học', isUnlocked: false, isCompleted: false, icon: '✏️' },
      { id: 9, unitNumber: 9, title: 'Unit 9: Our outdoor activities', subtitle: 'Hoạt động ngoài trời trong quá khứ', isUnlocked: false, isCompleted: false, icon: '🌳' },
      { id: 10, unitNumber: 10, title: 'Unit 10: Our school trip', subtitle: 'Chuyến tham quan của trường', isUnlocked: false, isCompleted: false, icon: '🚌' },
      { id: 11, unitNumber: 11, title: 'Unit 11: Family time', subtitle: 'Hoạt động gia đình trong quá khứ', isUnlocked: false, isCompleted: false, icon: '👨‍👩‍👧‍👦' },
      { id: 12, unitNumber: 12, title: 'Unit 12: Our Tet holiday', subtitle: 'Kế hoạch cho ngày Tết', isUnlocked: false, isCompleted: false, icon: '🏮' },
      { id: 13, unitNumber: 13, title: 'Unit 13: Our special days', subtitle: 'Các ngày lễ đặc biệt và ăn uống', isUnlocked: false, isCompleted: false, icon: '🎉' },
      { id: 14, unitNumber: 14, title: 'Unit 14: Staying healthy', subtitle: 'Lối sống lành mạnh và tần suất', isUnlocked: false, isCompleted: false, icon: '🍎' },
      { id: 15, unitNumber: 15, title: 'Unit 15: Our health', subtitle: 'Các vấn đề sức khỏe và lời khuyên', isUnlocked: false, isCompleted: false, icon: '🩺' },
      { id: 16, unitNumber: 16, title: 'Unit 16: Seasons and the weather', subtitle: 'Thời tiết và trang phục theo mùa', isUnlocked: false, isCompleted: false, icon: '🌤️' },
      { id: 17, unitNumber: 17, title: 'Unit 17: Stories for children', subtitle: 'Nhân vật và đặc điểm trong truyện', isUnlocked: false, isCompleted: false, icon: '📖' },
      { id: 18, unitNumber: 18, title: 'Unit 18: Means of transport', subtitle: 'Địa điểm du lịch và phương tiện giao thông', isUnlocked: false, isCompleted: false, icon: '🚀' },
      { id: 19, unitNumber: 19, title: 'Unit 19: Places of interest', subtitle: 'Ý kiến về địa danh và khoảng cách', isUnlocked: false, isCompleted: false, icon: '🏞️' },
      { id: 20, unitNumber: 20, title: 'Unit 20: Our summer holidays', subtitle: 'Dự định cho kỳ nghỉ hè', isUnlocked: false, isCompleted: false, icon: '🏖️' },
    ];
  };

  const units = getUnitsForGrade(selectedGrade);
  const studentName = user?.name || 'Bé Minh';
  const levelVal = user?.level !== undefined ? user.level : 1;
  const starsVal = user?.stars !== undefined ? user.stars : 0;
  const streakVal = user?.streakDays !== undefined ? user.streakDays : 0;
  const avatarToUse = user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

  const handleUnitClick = (unit: RoadmapUnit) => {
    audioService.playClickSound();
    setActiveUnitModal(unit);
  };

  const handleStartStudy = (unit: RoadmapUnit) => {
    audioService.playClickSound();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setActiveUnitModal(null);
    setActiveTab(`grade-${selectedGrade}` as ActiveTab);
  };

  // Node serpentine curve positioning calculations
  // Height per node step = 160px
  const nodeGap = 160;
  const startY = 85;
  const lastNodeY = startY + Math.max(0, units.length - 1) * nodeGap;
  const totalMapHeight = lastNodeY + 100;

  // Compute (x, y) coordinates for SVG serpentine path and node layout
  const points = units.map((_, idx) => {
    const y = startY + idx * nodeGap;
    // Alternate x using sine wave: 50% -> 72% -> 50% -> 28% -> 50%
    const xPercent = 50 + 22 * Math.sin((idx * Math.PI) / 2);
    return { xPercent, y };
  });

  // Construct SVG path "M x0 y0 C x0 y1 ..." or smooth cubic bezier curve
  let svgPathD = '';
  if (points.length > 0) {
    svgPathD = `M ${points[0].xPercent} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const midY = (p1.y + p2.y) / 2;
      svgPathD += ` C ${p1.xPercent} ${midY}, ${p2.xPercent} ${midY}, ${p2.xPercent} ${p2.y}`;
    }
  }

  return (
    <div className="space-y-5 animate-fadeIn pb-16">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <button
          onClick={() => {
            audioService.playClickSound();
            if (onBack) onBack();
            else setActiveTab(`grade-${selectedGrade}` as ActiveTab);
          }}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition transform active:scale-95 cursor-pointer shrink-0"
        >
          <ArrowLeft size={14} />
          <span>Quay lại bài học</span>
        </button>
      </div>

      {/* Grade Selector Tabs Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {[
          { grade: 1, label: 'Lớp 1', bgActive: 'bg-[#E91E63] text-white border-pink-600', bgInactive: 'bg-[#FFF0F5] hover:bg-pink-100 text-pink-800 border-pink-200' },
          { grade: 2, label: 'Lớp 2', bgActive: 'bg-[#FB8C00] text-white border-orange-600', bgInactive: 'bg-[#FFF3E0] hover:bg-amber-100 text-amber-800 border-amber-200' },
          { grade: 3, label: 'Lớp 3', bgActive: 'bg-[#0288D1] text-white border-sky-600', bgInactive: 'bg-[#E0F2FE] hover:bg-sky-100 text-sky-800 border-sky-200' },
          { grade: 4, label: 'Lớp 4', bgActive: 'bg-[#43A047] text-white border-green-600', bgInactive: 'bg-[#DCFCE7] hover:bg-emerald-100 text-emerald-800 border-emerald-200' },
          { grade: 5, label: 'Lớp 5', bgActive: 'bg-[#8E24AA] text-white border-purple-600', bgInactive: 'bg-[#F3E8FF] hover:bg-purple-100 text-purple-800 border-purple-200' },
        ].map((item) => {
          const isAllowed = hasGradeAccess(user?.allowedGrades, `grade-${item.grade}`, user?.role);
          const isActive = selectedGrade === item.grade;
          return (
            <button
              key={item.grade}
              onClick={() => {
                if (!isAllowed) {
                  audioService.playClickSound();
                  return;
                }
                audioService.playClickSound();
                setSelectedGrade(item.grade);
              }}
              className={`py-2.5 px-3 rounded-2xl font-black text-xs border transition transform shadow-2xs text-center flex items-center justify-center gap-1.5 ${
                isActive ? `${item.bgActive} shadow-md scale-[1.02]` : item.bgInactive
              } ${!isAllowed ? 'opacity-60 cursor-not-allowed' : 'active:scale-95 cursor-pointer'}`}
            >
              <span>{item.label}</span>
              {!isAllowed && <Lock size={12} className="text-amber-500 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Completion Progress Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs max-w-xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center text-sm">
            🗺️
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-xs">Tiến trình hoàn thành</h3>
            <p className="text-[10px] text-slate-500 font-semibold">Chinh phục 16 Unit cùng Kido</p>
          </div>
        </div>
        <div className="flex-1 max-w-[180px] h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full w-[6%] transition-all duration-300" />
        </div>
        <span className="font-black text-xs text-emerald-600 shrink-0 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">6%</span>
      </div>

      {/* Vertical Scrollable Winding Map Box (Thành trượt dọc) */}
      <div className="bg-[#FAF6EF] rounded-3xl border-2 border-[#EAE3D2] shadow-sm relative overflow-hidden">
        {/* Scroll Header Hint */}
        <div className="bg-[#FAF6EF]/90 backdrop-blur-xs sticky top-0 z-30 px-4 py-2.5 border-b border-[#EAE3D2] flex items-center justify-between text-xs font-black text-slate-700">
          <span className="flex items-center gap-1.5 text-amber-800">
            <span>✨</span>
            <span>Bản đồ bài học Lớp {selectedGrade}</span>
          </span>
          <span className="text-[10px] text-amber-900/60 font-bold bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200/60">
            Cuộn xuống để xem tiếp 👇
          </span>
        </div>

        {/* Scrollable Container with Custom Vertical Scrollbar */}
        <div className="max-h-[70vh] md:max-h-[75vh] overflow-y-auto custom-scrollbar px-4 py-4 sm:px-8 sm:py-6 relative">
          <div 
            className="relative w-full mx-auto max-w-2xl"
            style={{ minHeight: `${totalMapHeight}px` }}
          >
            {/* SVG Background Curve */}
            <svg
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
              viewBox={`0 0 100 ${totalMapHeight}`}
              preserveAspectRatio="none"
            >
              <path
                d={svgPathD}
                fill="none"
                stroke="#D2C7B3"
                strokeWidth="3"
                strokeDasharray="8 8"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Nodes rendering along winding path */}
            {units.map((unit, idx) => {
              const pt = points[idx];
              const isFirst = idx === 0;
              const isHovered = hoveredUnitId === unit.id;

              return (
                <div
                  key={unit.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                  style={{
                    left: `${pt.xPercent}%`,
                    top: `${pt.y}px`,
                  }}
                  onMouseEnter={() => setHoveredUnitId(unit.id)}
                  onMouseLeave={() => setHoveredUnitId(null)}
                >
                  {/* Image 1 Hover Tooltip Card */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-40 w-64 pointer-events-none animate-fadeIn">
                      <div className="bg-[#FFFDF9] rounded-2xl p-3 border-2 border-amber-400 shadow-xl relative text-left space-y-2">
                        {/* Top Unit Title Header Box */}
                        <div className="bg-amber-50/90 rounded-xl p-2 border border-amber-200">
                          <h4 className="text-xs font-black text-amber-950 truncate">
                            {unit.title}
                          </h4>
                          <p className="text-[11px] font-black text-sky-700 flex items-center gap-1 mt-0.5">
                            <span>🧩</span>
                            <span>Tiến độ: {unit.isCompleted ? '7/7' : unit.isUnlocked ? '1/7' : '0/7'} Bài học ({unit.isCompleted ? '100%' : unit.isUnlocked ? '14%' : '0%'})</span>
                          </p>
                        </div>

                        {/* Lesson Status List */}
                        <div className="space-y-1 text-[11px] font-bold text-slate-700 px-0.5">
                          <div className="flex items-center gap-1 text-red-500 font-extrabold text-[10px]">
                            <span>ⓘ</span>
                            <span>{unit.isCompleted ? 'Bài đã học:' : 'Bài chưa học:'}</span>
                          </div>
                          <ul className="space-y-1 pl-1 text-[10.5px] text-slate-700 font-bold leading-tight">
                            <li className="flex items-center gap-1.5"><span className="text-amber-500">•</span> Học từ vựng</li>
                            <li className="flex items-center gap-1.5"><span className="text-purple-500">•</span> Luyện thẻ ghi nhớ</li>
                            <li className="flex items-center gap-1.5"><span className="text-emerald-500">•</span> Luyện nghe tinh anh</li>
                            <li className="flex items-center gap-1.5"><span className="text-orange-500">•</span> Luyện nói tự tin</li>
                            <li className="flex items-center gap-1.5"><span className="text-yellow-600">•</span> Học Mindmap</li>
                            <li className="flex items-center gap-1.5"><span className="text-pink-500">•</span> Đọc truyện cùng Kido</li>
                          </ul>
                        </div>

                        {/* Downward triangle pointer arrow */}
                        <div className="absolute left-1/2 -bottom-2.5 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-10 border-t-amber-400" />
                        <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-7 border-x-transparent border-t-9 border-t-[#FFFDF9]" />
                      </div>
                    </div>
                  )}

                  {/* Start Badge on top of Node 1 */}
                  {isFirst && (
                    <div 
                      onClick={() => handleUnitClick(unit)}
                      className="bg-[#FF4D4D] text-white font-black text-[10px] px-3.5 py-0.5 rounded-full shadow-md uppercase tracking-wider mb-1.5 animate-bounce cursor-pointer hover:bg-red-600 transition ring-2 ring-white"
                    >
                      BẮT ĐẦU
                    </div>
                  )}

                  {/* Circular Node Button */}
                  <button
                    onClick={() => handleUnitClick(unit)}
                    className={`rounded-full transition transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center relative shadow-md ${
                      isFirst || unit.isUnlocked
                        ? 'w-16 h-16 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-4 border-amber-200 text-2xl text-amber-950 shadow-amber-200/60 ring-2 ring-amber-400/40'
                        : 'w-14 h-14 bg-gradient-to-b from-slate-100 to-slate-200 border-3 border-slate-300 text-slate-400 shadow-slate-200'
                    }`}
                  >
                    {isFirst || unit.isUnlocked ? (
                      <span>{unit.icon || '🏫'}</span>
                    ) : (
                      <Lock size={18} className="text-slate-400" />
                    )}
                  </button>

                  {/* Connected White Unit Card directly below Node */}
                  <div
                    onClick={() => handleUnitClick(unit)}
                    className={`mt-2 bg-white rounded-2xl px-4 py-2 border text-center transition hover:shadow-md cursor-pointer max-w-[210px] min-w-[180px] shadow-2xs ${
                      isFirst || unit.isUnlocked
                        ? 'border-2 border-amber-300 shadow-amber-100/60'
                        : 'border border-slate-200/90 opacity-90'
                    }`}
                  >
                    <h3 className="font-black text-xs text-slate-900 leading-tight">
                      {unit.title}
                    </h3>
                    <p className="font-semibold text-[11px] text-slate-500 mt-0.5">
                      {unit.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Image 2: Unit Detail 8-Activity Modal Dialog */}
      {activeUnitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl relative space-y-4 text-center animate-scaleUp">
            {/* Top Close Button */}
            <button
              onClick={() => {
                audioService.playClickSound();
                setActiveUnitModal(null);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-xs flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header Unit Info */}
            <div className="space-y-1 pt-1">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-2xs">
                {activeUnitModal.icon || '🤝'}
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 pt-1">
                {activeUnitModal.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                {activeUnitModal.subtitle}
              </p>
            </div>

            {/* 8 Grid Activities (2 columns x 4 rows) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left pt-2">
              {/* 1. Học từ vựng */}
              <button
                onClick={() => {
                  audioService.playClickSound();
                  confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                  setActiveUnitModal(null);
                  setActiveTab('vocab');
                }}
                className="bg-[#F0F7FF] hover:bg-sky-100/90 border border-sky-300 text-sky-950 font-extrabold text-xs p-3 rounded-2xl flex items-center gap-2.5 transition active:scale-95 cursor-pointer shadow-2xs"
              >
                <span className="w-7 h-7 rounded-full bg-sky-200/80 border border-sky-300 flex items-center justify-center text-sm shrink-0">
                  💬
                </span>
                <span>1. Học từ vựng</span>
              </button>

              {/* 2. Thẻ ghi nhớ */}
              <button
                onClick={() => {
                  audioService.playClickSound();
                  confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                  setActiveUnitModal(null);
                  setActiveTab('flashcards');
                }}
                className="bg-[#F8F5FF] hover:bg-purple-100/90 border border-purple-300 text-purple-950 font-extrabold text-xs p-3 rounded-2xl flex items-center gap-2.5 transition active:scale-95 cursor-pointer shadow-2xs"
              >
                <span className="w-7 h-7 rounded-full bg-purple-200/80 border border-purple-300 flex items-center justify-center text-sm shrink-0">
                  🎴
                </span>
                <span>2. Thẻ ghi nhớ</span>
              </button>

              {/* 3. Luyện nghe tinh anh */}
              <button
                onClick={() => {
                  audioService.playClickSound();
                  confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                  setActiveUnitModal(null);
                  setActiveTab('listening');
                }}
                className="bg-[#F0FDF4] hover:bg-emerald-100/90 border border-emerald-300 text-emerald-950 font-extrabold text-xs p-3 rounded-2xl flex items-center gap-2.5 transition active:scale-95 cursor-pointer shadow-2xs"
              >
                <span className="w-7 h-7 rounded-full bg-emerald-200/80 border border-emerald-300 flex items-center justify-center text-sm shrink-0">
                  🎧
                </span>
                <span>3. Luyện nghe tinh anh</span>
              </button>

              {/* 4. Luyện nói tự tin */}
              <button
                onClick={() => {
                  audioService.playClickSound();
                  confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                  setActiveUnitModal(null);
                  setActiveTab('speaking');
                }}
                className="bg-[#FFF7ED] hover:bg-amber-100/90 border border-amber-300 text-amber-950 font-extrabold text-xs p-3 rounded-2xl flex items-center gap-2.5 transition active:scale-95 cursor-pointer shadow-2xs"
              >
                <span className="w-7 h-7 rounded-full bg-amber-200/80 border border-amber-300 flex items-center justify-center text-sm shrink-0">
                  🎙️
                </span>
                <span>4. Luyện nói tự tin</span>
              </button>

              {/* 5. Sơ đồ tư duy Mindmap */}
              <button
                onClick={() => {
                  audioService.playClickSound();
                  confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                  setActiveUnitModal(null);
                  setActiveTab('mind-thinking');
                }}
                className="bg-[#FEFCE8] hover:bg-yellow-100/90 border border-yellow-400 text-yellow-950 font-extrabold text-xs p-3 rounded-2xl flex items-center gap-2.5 transition active:scale-95 cursor-pointer shadow-2xs"
              >
                <span className="w-7 h-7 rounded-full bg-yellow-200/80 border border-yellow-400 flex items-center justify-center text-sm shrink-0">
                  🔀
                </span>
                <span>5. Sơ đồ tư duy Mindmap</span>
              </button>

              {/* 6. Đọc truyện cùng Kido */}
              <button
                onClick={() => {
                  audioService.playClickSound();
                  confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                  setActiveUnitModal(null);
                  setActiveTab('listening-speaking-img');
                }}
                className="bg-[#FDF2F8] hover:bg-pink-100/90 border border-pink-300 text-pink-950 font-extrabold text-xs p-3 rounded-2xl flex items-center gap-2.5 transition active:scale-95 cursor-pointer shadow-2xs"
              >
                <span className="w-7 h-7 rounded-full bg-pink-200/80 border border-pink-300 flex items-center justify-center text-sm shrink-0">
                  📖
                </span>
                <span>6. Đọc truyện cùng Kido</span>
              </button>

              {/* 7. Đố vui bài học (Quiz) */}
              <button
                onClick={() => {
                  audioService.playClickSound();
                  confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                  setActiveUnitModal(null);
                  setActiveTab('quiz');
                }}
                className="bg-[#ECFDF5] hover:bg-emerald-100/90 border border-emerald-300 text-emerald-950 font-extrabold text-xs p-3 rounded-2xl flex items-center justify-between transition active:scale-95 cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-emerald-200/80 border border-emerald-300 flex items-center justify-center text-sm shrink-0">
                    ❓
                  </span>
                  <span>7. Đố vui bài học (Quiz)</span>
                </div>
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  ✓
                </span>
              </button>

              {/* 8. Trò chơi ôn tập (Review) */}
              <button
                onClick={() => {
                  audioService.playClickSound();
                  confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                  setActiveUnitModal(null);
                  setActiveTab('games');
                }}
                className="bg-[#FFF1F2] hover:bg-rose-100/90 border border-rose-300 text-rose-950 font-extrabold text-xs p-3 rounded-2xl flex items-center gap-2.5 transition active:scale-95 cursor-pointer shadow-2xs"
              >
                <span className="w-7 h-7 rounded-full bg-rose-200/80 border border-rose-300 flex items-center justify-center text-sm shrink-0">
                  🎮
                </span>
                <span>8. Trò chơi ôn tập (Review)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
