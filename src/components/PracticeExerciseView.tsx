import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  RotateCcw, 
  Trophy, 
  Award, 
  Flame, 
  LogOut,
  Pencil,
  Grid,
  Link,
  Layers,
  HelpCircle,
  Activity,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { audioService } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

interface PracticeExerciseViewProps {
  user: UserProfile;
  onBack: () => void;
  onAddStars: (amount: number) => void;
  onLogout?: () => void;
  onTriggerNotification?: (title: string, message: string) => void;
}

export interface PracticeUnit {
  id: string;
  grade: number; // 1, 2, 3, 4, 5
  unitNum: string; // e.g. "Unit 1", "Starter"
  title: string; // e.g. "In the school playground"
  subtitle: string; // e.g. "Trong sân trường"
  icon: string;
  color: string; // bg-color for icon
  vocab: { en: string; vi: string }[];
}

export const PRACTICE_UNITS: PracticeUnit[] = [
  // ================= LỚP 1 =================
  {
    id: 'g1-u1', grade: 1, unitNum: 'Unit 1', title: 'In the school playground', subtitle: 'Trong sân trường', icon: '🎒', color: 'bg-pink-100 text-pink-600',
    vocab: [
      { en: 'ball', vi: 'quả bóng' },
      { en: 'bike', vi: 'xe đạp' },
      { en: 'book', vi: 'quyển sách' },
      { en: 'boy', vi: 'cậu bé' }
    ]
  },
  {
    id: 'g1-u2', grade: 1, unitNum: 'Unit 2', title: 'In the dining room', subtitle: 'Trong phòng ăn', icon: '🍞', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'cake', vi: 'bánh ngọt' },
      { en: 'cat', vi: 'con mèo' },
      { en: 'car', vi: 'xe ô tô' },
      { en: 'cup', vi: 'cái cốc' }
    ]
  },
  {
    id: 'g1-u3', grade: 1, unitNum: 'Unit 3', title: 'At the street market', subtitle: 'Tại chợ đường phố', icon: '🏪', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'apple', vi: 'quả táo' },
      { en: 'banana', vi: 'quả chuối' },
      { en: 'cat', vi: 'con mèo' },
      { en: 'dog', vi: 'con chó' }
    ]
  },
  {
    id: 'g1-u4', grade: 1, unitNum: 'Unit 4', title: 'In the bedroom', subtitle: 'Trong phòng ngủ', icon: '🛏️', color: 'bg-sky-100 text-sky-600',
    vocab: [
      { en: 'door', vi: 'cửa ra vào' },
      { en: 'desk', vi: 'bàn học' },
      { en: 'duck', vi: 'con vịt' },
      { en: 'dog', vi: 'con chó' }
    ]
  },
  {
    id: 'g1-u5', grade: 1, unitNum: 'Unit 5', title: 'At the fish and chip shop', subtitle: 'Cửa hàng ăn nhanh', icon: '🐟', color: 'bg-purple-100 text-purple-600',
    vocab: [
      { en: 'fish', vi: 'con cá' },
      { en: 'frog', vi: 'con ếch' },
      { en: 'fox', vi: 'con cáo' },
      { en: 'foot', vi: 'bàn chân' }
    ]
  },
  {
    id: 'g1-u6', grade: 1, unitNum: 'Unit 6', title: 'In the classroom', subtitle: 'Trong lớp học', icon: '🏫', color: 'bg-cyan-100 text-cyan-600',
    vocab: [
      { en: 'pen', vi: 'bút mực' },
      { en: 'pencil', vi: 'bút chì' },
      { en: 'ruler', vi: 'thước kẻ' },
      { en: 'eraser', vi: 'cục tẩy' }
    ]
  },
  {
    id: 'g1-u7', grade: 1, unitNum: 'Unit 7', title: 'In the garden', subtitle: 'Trong khu vườn', icon: '🌻', color: 'bg-rose-100 text-rose-600',
    vocab: [
      { en: 'girl', vi: 'cô bé' },
      { en: 'garden', vi: 'khu vườn' },
      { en: 'goat', vi: 'con dê' },
      { en: 'gate', vi: 'cổng làng' }
    ]
  },
  {
    id: 'g1-u8', grade: 1, unitNum: 'Unit 8', title: 'In the park', subtitle: 'Trong công viên', icon: '🌳', color: 'bg-yellow-100 text-yellow-600',
    vocab: [
      { en: 'hand', vi: 'bàn tay' },
      { en: 'hat', vi: 'cái mũ' },
      { en: 'hair', vi: 'mái tóc' },
      { en: 'horse', vi: 'con ngựa' }
    ]
  },
  {
    id: 'g1-u9', grade: 1, unitNum: 'Unit 9', title: 'In the shop', subtitle: 'Trong cửa hàng', icon: '🛍️', color: 'bg-teal-100 text-teal-600',
    vocab: [
      { en: 'ink', vi: 'mực viết' },
      { en: 'insect', vi: 'côn trùng' },
      { en: 'iguana', vi: 'kỳ nhông' },
      { en: 'milk', vi: 'sữa tươi' }
    ]
  },
  {
    id: 'g1-u10', grade: 1, unitNum: 'Unit 10', title: 'At the zoo', subtitle: 'Tại sở thú', icon: '🦁', color: 'bg-blue-100 text-blue-600',
    vocab: [
      { en: 'juice', vi: 'nước trái cây' },
      { en: 'jam', vi: 'mứt hoa quả' },
      { en: 'jelly', vi: 'thạch rau câu' },
      { en: 'jacket', vi: 'áo khoác' }
    ]
  },
  {
    id: 'g1-u11', grade: 1, unitNum: 'Unit 11', title: 'At the bus stop', subtitle: 'Tại điểm dừng xe buýt', icon: '🚌', color: 'bg-indigo-100 text-indigo-600',
    vocab: [
      { en: 'bus', vi: 'xe buýt' },
      { en: 'bag', vi: 'cặp sách' },
      { en: 'bell', vi: 'cái chuông' },
      { en: 'box', vi: 'cái hộp' }
    ]
  },
  {
    id: 'g1-u12', grade: 1, unitNum: 'Unit 12', title: 'At the lake', subtitle: 'Ở hồ nước', icon: '🏞️', color: 'bg-sky-100 text-sky-600',
    vocab: [
      { en: 'lake', vi: 'hồ nước' },
      { en: 'leaf', vi: 'chiếc lá' },
      { en: 'lemon', vi: 'quả chanh' },
      { en: 'lion', vi: 'sư tử' }
    ]
  },
  {
    id: 'g1-u13', grade: 1, unitNum: 'Unit 13', title: 'In the school canteen', subtitle: 'Trong căn tin trường', icon: '🍔', color: 'bg-fuchsia-100 text-fuchsia-600',
    vocab: [
      { en: 'milk', vi: 'sữa tươi' },
      { en: 'mango', vi: 'quả xoài' },
      { en: 'meat', vi: 'thịt tươi' },
      { en: 'monkey', vi: 'con khỉ' }
    ]
  },
  {
    id: 'g1-u14', grade: 1, unitNum: 'Unit 14', title: 'In the toy shop', subtitle: 'Trong cửa hàng đồ chơi', icon: '🧸', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'nut', vi: 'hạt dẻ' },
      { en: 'nest', vi: 'tổ chim' },
      { en: 'net', vi: 'cái lưới' },
      { en: 'number', vi: 'con số' }
    ]
  },
  {
    id: 'g1-u15', grade: 1, unitNum: 'Unit 15', title: 'At the football match', subtitle: 'Trận thi đấu bóng đá', icon: '⚽', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'football', vi: 'bóng đá' },
      { en: 'foot', vi: 'bàn chân' },
      { en: 'field', vi: 'sân cỏ' },
      { en: 'fun', vi: 'vui vẻ' }
    ]
  },
  {
    id: 'g1-u16', grade: 1, unitNum: 'Unit 16', title: 'At home', subtitle: 'Ở nhà', icon: '🏠', color: 'bg-blue-100 text-blue-600',
    vocab: [
      { en: 'home', vi: 'ngôi nhà' },
      { en: 'family', vi: 'gia đình' },
      { en: 'mom', vi: 'mẹ' },
      { en: 'dad', vi: 'bố' }
    ]
  },

  // ================= LỚP 2 =================
  {
    id: 'g2-u1', grade: 2, unitNum: 'Unit 1', title: 'At my birthday party', subtitle: 'Tại bữa tiệc sinh nhật', icon: '🎂', color: 'bg-pink-100 text-pink-600',
    vocab: [
      { en: 'cake', vi: 'bánh sinh nhật' },
      { en: 'candle', vi: 'nến sinh nhật' },
      { en: 'card', vi: 'thiệp chúc mừng' },
      { en: 'gift', vi: 'món quà' }
    ]
  },
  {
    id: 'g2-u2', grade: 2, unitNum: 'Unit 2', title: 'In the backyard', subtitle: 'Trong sân sau', icon: '🏡', color: 'bg-orange-100 text-orange-600',
    vocab: [
      { en: 'tree', vi: 'cây xanh' },
      { en: 'flower', vi: 'bông hoa' },
      { en: 'grass', vi: 'thảm cỏ' },
      { en: 'bird', vi: 'chú chim' }
    ]
  },
  {
    id: 'g2-u3', grade: 2, unitNum: 'Unit 3', title: 'At the seaside', subtitle: 'Ở bãi biển', icon: '🏖️', color: 'bg-cyan-100 text-cyan-600',
    vocab: [
      { en: 'sea', vi: 'biển cả' },
      { en: 'sun', vi: 'mặt trời' },
      { en: 'sand', vi: 'bãi cát' },
      { en: 'shell', vi: 'vỏ ốc' }
    ]
  },
  {
    id: 'g2-u4', grade: 2, unitNum: 'Unit 4', title: 'In the countryside', subtitle: 'Ở nông thôn', icon: '🌾', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'river', vi: 'dòng sông' },
      { en: 'field', vi: 'cánh đồng' },
      { en: 'cow', vi: 'con bò' },
      { en: 'duck', vi: 'con vịt' }
    ]
  },
  {
    id: 'g2-u5', grade: 2, unitNum: 'Unit 5', title: 'In the classroom', subtitle: 'Trong lớp học', icon: '🏫', color: 'bg-purple-100 text-purple-600',
    vocab: [
      { en: 'board', vi: 'bảng đen' },
      { en: 'chair', vi: 'cái ghế' },
      { en: 'desk', vi: 'bàn học' },
      { en: 'book', vi: 'sách giáo khoa' }
    ]
  },
  {
    id: 'g2-u6', grade: 2, unitNum: 'Unit 6', title: 'On the farm', subtitle: 'Trên trang trại', icon: '🚜', color: 'bg-teal-100 text-teal-600',
    vocab: [
      { en: 'farm', vi: 'trang trại' },
      { en: 'horse', vi: 'con ngựa' },
      { en: 'pig', vi: 'con heo' },
      { en: 'sheep', vi: 'con cừu' }
    ]
  },
  {
    id: 'g2-u7', grade: 2, unitNum: 'Unit 7', title: 'In the kitchen', subtitle: 'Trong nhà bếp', icon: '🍳', color: 'bg-rose-100 text-rose-600',
    vocab: [
      { en: 'pot', vi: 'cái nồi' },
      { en: 'pan', vi: 'cái chảo' },
      { en: 'spoon', vi: 'cái thìa' },
      { en: 'fork', vi: 'cái nĩa' }
    ]
  },
  {
    id: 'g2-u8', grade: 2, unitNum: 'Unit 8', title: 'In the village', subtitle: 'Trong làng', icon: '🏞️', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'village', vi: 'ngôi làng' },
      { en: 'road', vi: 'con đường' },
      { en: 'house', vi: 'ngôi nhà' },
      { en: 'tree', vi: 'cây xanh' }
    ]
  },
  {
    id: 'g2-u9', grade: 2, unitNum: 'Unit 9', title: 'In the grocery store', subtitle: 'Trong cửa hàng tạp hóa', icon: '🛒', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'milk', vi: 'sữa tươi' },
      { en: 'bread', vi: 'bánh mì' },
      { en: 'rice', vi: 'gạo' },
      { en: 'egg', vi: 'quả trứng' }
    ]
  },
  {
    id: 'g2-u10', grade: 2, unitNum: 'Unit 10', title: 'At the zoo', subtitle: 'Tại sở thú', icon: '🦁', color: 'bg-blue-100 text-blue-600',
    vocab: [
      { en: 'tiger', vi: 'con hổ' },
      { en: 'monkey', vi: 'con khỉ' },
      { en: 'elephant', vi: 'con voi' },
      { en: 'bear', vi: 'con gấu' }
    ]
  },
  {
    id: 'g2-u11', grade: 2, unitNum: 'Unit 11', title: 'In the playground', subtitle: 'Trên sân chơi', icon: '🛝', color: 'bg-purple-100 text-purple-600',
    vocab: [
      { en: 'slide', vi: 'cầu trượt' },
      { en: 'swing', vi: 'xích đu' },
      { en: 'ball', vi: 'quả bóng' },
      { en: 'run', vi: 'chạy' }
    ]
  },
  {
    id: 'g2-u12', grade: 2, unitNum: 'Unit 12', title: 'At the café', subtitle: 'Tại quán cà phê', icon: '☕', color: 'bg-sky-100 text-sky-600',
    vocab: [
      { en: 'tea', vi: 'trà nóng' },
      { en: 'water', vi: 'nước lọc' },
      { en: 'juice', vi: 'nước ép' },
      { en: 'cake', vi: 'bánh ngọt' }
    ]
  },
  {
    id: 'g2-u13', grade: 2, unitNum: 'Unit 13', title: 'In the maths class', subtitle: 'Giờ học Toán', icon: '📐', color: 'bg-pink-100 text-pink-600',
    vocab: [
      { en: 'one', vi: 'số 1' },
      { en: 'two', vi: 'số 2' },
      { en: 'three', vi: 'số 3' },
      { en: 'plus', vi: 'dấu cộng' }
    ]
  },
  {
    id: 'g2-u14', grade: 2, unitNum: 'Unit 14', title: 'At home', subtitle: 'Ở nhà', icon: '🏠', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'room', vi: 'căn phòng' },
      { en: 'window', vi: 'cửa sổ' },
      { en: 'table', vi: 'cái bàn' },
      { en: 'chair', vi: 'cái ghế' }
    ]
  },
  {
    id: 'g2-u15', grade: 2, unitNum: 'Unit 15', title: 'In the clothes shop', subtitle: 'Trong cửa hàng quần áo', icon: '👕', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'shirt', vi: 'áo sơ mi' },
      { en: 'skirt', vi: 'chân váy' },
      { en: 'hat', vi: 'cái mũ' },
      { en: 'shoes', vi: 'đôi giày' }
    ]
  },
  {
    id: 'g2-u16', grade: 2, unitNum: 'Unit 16', title: 'At the campsite', subtitle: 'Tại khu cắm trại', icon: '🏕️', color: 'bg-blue-100 text-blue-600',
    vocab: [
      { en: 'tent', vi: 'lều cắm trại' },
      { en: 'fire', vi: 'ngọn lửa' },
      { en: 'star', vi: 'ngôi sao' },
      { en: 'moon', vi: 'mặt trăng' }
    ]
  },

  // ================= LỚP 3 =================
  {
    id: 'g3-u1', grade: 3, unitNum: 'Unit 1', title: 'Hello', subtitle: 'Chào hỏi và tự giới thiệu', icon: '👋', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'hello', vi: 'xin chào' },
      { en: 'name', vi: 'tên gọi' },
      { en: 'fine', vi: 'khỏe mạnh' },
      { en: 'thanks', vi: 'cảm ơn' }
    ]
  },
  {
    id: 'g3-u2', grade: 3, unitNum: 'Unit 2', title: 'Our names', subtitle: 'Hỏi và trả lời về tên và tuổi', icon: '📛', color: 'bg-purple-100 text-purple-600',
    vocab: [
      { en: 'eight', vi: 'tám tuổi' },
      { en: 'nine', vi: 'chín tuổi' },
      { en: 'years', vi: 'số tuổi' },
      { en: 'old', vi: 'tuổi tác' }
    ]
  },
  {
    id: 'g3-u3', grade: 3, unitNum: 'Unit 3', title: 'Our friends', subtitle: 'Giới thiệu người khác', icon: '🧑‍🤝‍🧑', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'friend', vi: 'người bạn' },
      { en: 'teacher', vi: 'thầy cô giáo' },
      { en: 'classmate', vi: 'bạn cùng lớp' },
      { en: 'nice', vi: 'tốt bụng' }
    ]
  },
  {
    id: 'g3-u4', grade: 3, unitNum: 'Unit 4', title: 'Our bodies', subtitle: 'Bộ phận cơ thể và chỉ dẫn', icon: '👁️', color: 'bg-sky-100 text-sky-600',
    vocab: [
      { en: 'eye', vi: 'mắt' },
      { en: 'ear', vi: 'tai' },
      { en: 'nose', vi: 'mũi' },
      { en: 'mouth', vi: 'miệng' }
    ]
  },
  {
    id: 'g3-u5', grade: 3, unitNum: 'Unit 5', title: 'My hobbies', subtitle: 'Sở thích', icon: '🎨', color: 'bg-pink-100 text-pink-600',
    vocab: [
      { en: 'singing', vi: 'ca hát' },
      { en: 'dancing', vi: 'múa hát' },
      { en: 'drawing', vi: 'vẽ tranh' },
      { en: 'reading', vi: 'đọc sách' }
    ]
  },
  {
    id: 'g3-u6', grade: 3, unitNum: 'Unit 6', title: 'Our school', subtitle: 'Trường học và các phòng chức năng', icon: '🏫', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'school', vi: 'trường học' },
      { en: 'library', vi: 'thư viện' },
      { en: 'gym', vi: 'phòng thể chất' },
      { en: 'playground', vi: 'sân chơi' }
    ]
  },
  {
    id: 'g3-u7', grade: 3, unitNum: 'Unit 7', title: 'Classroom instructions', subtitle: 'Mệnh lệnh và xin phép trong lớp', icon: '📣', color: 'bg-blue-100 text-blue-600',
    vocab: [
      { en: 'stand', vi: 'đứng dậy' },
      { en: 'sit', vi: 'ngồi xuống' },
      { en: 'open', vi: 'mở ra' },
      { en: 'close', vi: 'gập lại' }
    ]
  },
  {
    id: 'g3-u8', grade: 3, unitNum: 'Unit 8', title: 'My school things', subtitle: 'Đồ dùng học tập', icon: '🎒', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'pencil', vi: 'bút chì' },
      { en: 'ruler', vi: 'thước kẻ' },
      { en: 'rubber', vi: 'cục tẩy' },
      { en: 'pen', vi: 'bút mực' }
    ]
  },
  {
    id: 'g3-u9', grade: 3, unitNum: 'Unit 9', title: 'Colours', subtitle: 'Màu sắc', icon: '🎨', color: 'bg-purple-100 text-purple-600',
    vocab: [
      { en: 'red', vi: 'màu đỏ' },
      { en: 'blue', vi: 'màu xanh dương' },
      { en: 'yellow', vi: 'màu vàng' },
      { en: 'green', vi: 'màu xanh lá' }
    ]
  },
  {
    id: 'g3-u10', grade: 3, unitNum: 'Unit 10', title: 'Break time activities', subtitle: 'Các hoạt động giờ ra chơi', icon: '⚽', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'chess', vi: 'cờ vua' },
      { en: 'football', vi: 'bóng đá' },
      { en: 'badminton', vi: 'cầu lông' },
      { en: 'basketball', vi: 'bóng rổ' }
    ]
  },
  {
    id: 'g3-u11', grade: 3, unitNum: 'Unit 11', title: 'My family', subtitle: 'Gia đình', icon: '👨‍👩‍👧', color: 'bg-sky-100 text-sky-600',
    vocab: [
      { en: 'father', vi: 'bố' },
      { en: 'mother', vi: 'mẹ' },
      { en: 'brother', vi: 'anh/em trai' },
      { en: 'sister', vi: 'chị/em gái' }
    ]
  },
  {
    id: 'g3-u12', grade: 3, unitNum: 'Unit 12', title: 'Jobs', subtitle: 'Nghề nghiệp', icon: '👨‍⚕️', color: 'bg-rose-100 text-rose-600',
    vocab: [
      { en: 'doctor', vi: 'bác sĩ' },
      { en: 'nurse', vi: 'y tá' },
      { en: 'driver', vi: 'tài xế' },
      { en: 'cook', vi: 'đầu bếp' }
    ]
  },
  {
    id: 'g3-u13', grade: 3, unitNum: 'Unit 13', title: 'My house', subtitle: 'Ngôi nhà và vị trí đồ vật', icon: '🏠', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'kitchen', vi: 'phòng bếp' },
      { en: 'bedroom', vi: 'phòng ngủ' },
      { en: 'garden', vi: 'khu vườn' },
      { en: 'living', vi: 'phòng khách' }
    ]
  },
  {
    id: 'g3-u14', grade: 3, unitNum: 'Unit 14', title: 'My bedroom', subtitle: 'Phòng ngủ và số lượng vật dụng', icon: '🛏️', color: 'bg-blue-100 text-blue-600',
    vocab: [
      { en: 'bed', vi: 'chiếc giường' },
      { en: 'desk', vi: 'bàn học' },
      { en: 'chair', vi: 'cái ghế' },
      { en: 'lamp', vi: 'đèn học' }
    ]
  },
  {
    id: 'g3-u15', grade: 3, unitNum: 'Unit 15', title: 'At the dining table', subtitle: 'Đồ ăn và thức uống', icon: '🍽️', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'bread', vi: 'bánh mì' },
      { en: 'rice', vi: 'cơm trắng' },
      { en: 'water', vi: 'nước lọc' },
      { en: 'milk', vi: 'sữa tươi' }
    ]
  },
  {
    id: 'g3-u16', grade: 3, unitNum: 'Unit 16', title: 'My pets', subtitle: 'Thú cưng', icon: '🐶', color: 'bg-purple-100 text-purple-600',
    vocab: [
      { en: 'dog', vi: 'chú chó' },
      { en: 'cat', vi: 'con mèo' },
      { en: 'parrot', vi: 'con vẹt' },
      { en: 'rabbit', vi: 'con thỏ' }
    ]
  },
  {
    id: 'g3-u17', grade: 3, unitNum: 'Unit 17', title: 'Our toys', subtitle: 'Đồ chơi', icon: '🧸', color: 'bg-orange-100 text-orange-600',
    vocab: [
      { en: 'doll', vi: 'búp bê' },
      { en: 'car', vi: 'ô tô đồ chơi' },
      { en: 'robot', vi: 'người máy' },
      { en: 'plane', vi: 'máy bay' }
    ]
  },
  {
    id: 'g3-u18', grade: 3, unitNum: 'Unit 18', title: 'Playing and doing', subtitle: 'Hoạt động đang diễn ra', icon: '🏃', color: 'bg-cyan-100 text-cyan-600',
    vocab: [
      { en: 'playing', vi: 'đang chơi' },
      { en: 'cooking', vi: 'đang nấu ăn' },
      { en: 'reading', vi: 'đang đọc' },
      { en: 'drawing', vi: 'đang vẽ' }
    ]
  },
  {
    id: 'g3-u19', grade: 3, unitNum: 'Unit 19', title: 'Outdoor activities', subtitle: 'Hoạt động ngoài trời', icon: '🚴', color: 'bg-pink-100 text-pink-600',
    vocab: [
      { en: 'cycling', vi: 'đi xe đạp' },
      { en: 'running', vi: 'chạy bộ' },
      { en: 'walking', vi: 'đi bộ' },
      { en: 'skating', vi: 'trượt pa-tanh' }
    ]
  },
  {
    id: 'g3-u20', grade: 3, unitNum: 'Unit 20', title: 'At the zoo', subtitle: 'Tại vườn thú', icon: '🐘', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'elephant', vi: 'con voi' },
      { en: 'monkey', vi: 'con khỉ' },
      { en: 'tiger', vi: 'con hổ' },
      { en: 'bear', vi: 'con gấu' }
    ]
  },

  // ================= LỚP 4 =================
  {
    id: 'g4-starter', grade: 4, unitNum: 'Starter', title: 'My Classroom & Activities', subtitle: 'Chào hỏi và ôn tập hoạt động', icon: '🎒', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'hello', vi: 'xin chào' },
      { en: 'welcome', vi: 'chào mừng' },
      { en: 'ready', vi: 'sẵn sàng' },
      { en: 'learn', vi: 'học tập' }
    ]
  },
  {
    id: 'g4-u1', grade: 4, unitNum: 'Unit 1', title: 'My Friends', subtitle: 'Những người bạn của tớ (Các quốc gia)', icon: '🌏', color: 'bg-blue-100 text-blue-600',
    vocab: [
      { en: 'Vietnam', vi: 'Việt Nam' },
      { en: 'Japan', vi: 'Nhật Bản' },
      { en: 'America', vi: 'Nước Mỹ' },
      { en: 'England', vi: 'Nước Anh' }
    ]
  },
  {
    id: 'g4-u2', grade: 4, unitNum: 'Unit 2', title: 'Time and Daily Routines', subtitle: 'Thời gian & Thói quen hàng ngày', icon: '⏰', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'clock', vi: 'đồng hồ' },
      { en: 'morning', vi: 'buổi sáng' },
      { en: 'afternoon', vi: 'buổi chiều' },
      { en: 'evening', vi: 'buổi tối' }
    ]
  },
  {
    id: 'g4-u3', grade: 4, unitNum: 'Unit 3', title: 'My Week', subtitle: 'Tuần lễ của tớ (Các thứ & Hoạt động)', icon: '📅', color: 'bg-purple-100 text-purple-600',
    vocab: [
      { en: 'Monday', vi: 'Thứ Hai' },
      { en: 'Friday', vi: 'Thứ Sáu' },
      { en: 'Sunday', vi: 'Chủ Nhật' },
      { en: 'weekend', vi: 'cuối tuần' }
    ]
  },
  {
    id: 'g4-u4', grade: 4, unitNum: 'Unit 4', title: 'My Birthday Party', subtitle: 'Bữa tiệc sinh nhật (Tháng & Đồ ăn)', icon: '🎂', color: 'bg-rose-100 text-rose-600',
    vocab: [
      { en: 'January', vi: 'Tháng Một' },
      { en: 'May', vi: 'Tháng Năm' },
      { en: 'party', vi: 'bữa tiệc' },
      { en: 'pizza', vi: 'bánh pizza' }
    ]
  },
  {
    id: 'g4-u5', grade: 4, unitNum: 'Unit 5', title: 'Things We Can Do', subtitle: 'Những khả năng của chúng ta (Động từ)', icon: '🚴', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'swim', vi: 'bơi lội' },
      { en: 'sing', vi: 'ca hát' },
      { en: 'cook', vi: 'nấu ăn' },
      { en: 'skate', vi: 'trượt băng' }
    ]
  },
  {
    id: 'g4-u6', grade: 4, unitNum: 'Unit 6', title: 'Our School Facilities', subtitle: 'Cơ sở vật chất trường học (Địa điểm)', icon: '🏫', color: 'bg-teal-100 text-teal-600',
    vocab: [
      { en: 'canteen', vi: 'nhà ăn' },
      { en: 'computer', vi: 'máy tính' },
      { en: 'garden', vi: 'sân vườn' },
      { en: 'office', vi: 'văn phòng' }
    ]
  },
  {
    id: 'g4-u7', grade: 4, unitNum: 'Unit 7', title: 'Our Timetables', subtitle: 'Thời khóa biểu của chúng ta (Môn học)', icon: '📚', color: 'bg-pink-100 text-pink-600',
    vocab: [
      { en: 'English', vi: 'Tiếng Anh' },
      { en: 'Maths', vi: 'Môn Toán' },
      { en: 'Music', vi: 'Âm nhạc' },
      { en: 'Art', vi: 'Mỹ thuật' }
    ]
  },
  {
    id: 'g4-u8', grade: 4, unitNum: 'Unit 8', title: 'My Favourite Subjects', subtitle: 'Môn học yêu thích của tớ', icon: '🔬', color: 'bg-purple-100 text-purple-600',
    vocab: [
      { en: 'Science', vi: 'Khoa học' },
      { en: 'History', vi: 'Lịch sử' },
      { en: 'PE', vi: 'Thể dục' },
      { en: 'IT', vi: 'Tin học' }
    ]
  },
  {
    id: 'g4-u9', grade: 4, unitNum: 'Unit 9', title: 'Our Sports Day', subtitle: 'Ngày hội thể thao (Tháng & Sự kiện)', icon: '🏅', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'sports', vi: 'thể thao' },
      { en: 'run', vi: 'chạy bộ' },
      { en: 'jump', vi: 'nhảy cao' },
      { en: 'winner', vi: 'người chiến thắng' }
    ]
  },
  {
    id: 'g4-u10', grade: 4, unitNum: 'Unit 10', title: 'Our Summer Holidays', subtitle: 'Kỳ nghỉ hè của chúng ta (Thì quá khứ)', icon: '🏖️', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'summer', vi: 'mùa hè' },
      { en: 'beach', vi: 'bãi biển' },
      { en: 'island', vi: 'hòn đảo' },
      { en: 'visited', vi: 'đã ghé thăm' }
    ]
  },
  {
    id: 'g4-u11', grade: 4, unitNum: 'Unit 11', title: 'My Home', subtitle: 'Nhà của tớ (Đặc điểm & Nơi ở)', icon: '🏠', color: 'bg-sky-100 text-sky-600',
    vocab: [
      { en: 'house', vi: 'ngôi nhà' },
      { en: 'flat', vi: 'căn hộ' },
      { en: 'street', vi: 'con đường' },
      { en: 'quiet', vi: 'yên tĩnh' }
    ]
  },
  {
    id: 'g4-u12', grade: 4, unitNum: 'Unit 12', title: 'Jobs', subtitle: 'Nghề nghiệp & Nơi làm việc', icon: '👩‍🏫', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'pilot', vi: 'phi công' },
      { en: 'nurse', vi: 'y tá' },
      { en: 'farmer', vi: 'nông dân' },
      { en: 'hospital', vi: 'bệnh viện' }
    ]
  },
  {
    id: 'g4-u13', grade: 4, unitNum: 'Unit 13', title: 'Appearance', subtitle: 'Ngoại hình (Miêu tả hình dáng)', icon: '👤', color: 'bg-rose-100 text-rose-600',
    vocab: [
      { en: 'tall', vi: 'cao ráo' },
      { en: 'short', vi: 'thấp bé' },
      { en: 'slim', vi: 'mảnh khảnh' },
      { en: 'strong', vi: 'khỏe mạnh' }
    ]
  },
  {
    id: 'g4-u14', grade: 4, unitNum: 'Unit 14', title: 'Daily Activities', subtitle: 'Hoạt động hàng ngày (Các buổi)', icon: '🌅', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'breakfast', vi: 'bữa sáng' },
      { en: 'lunch', vi: 'bữa trưa' },
      { en: 'dinner', vi: 'bữa tối' },
      { en: 'shower', vi: 'tắm rửa' }
    ]
  },
  {
    id: 'g4-u15', grade: 4, unitNum: 'Unit 15', title: 'My Family\'s Weekends', subtitle: 'Cuối tuần của gia đình tớ', icon: '👨‍👩‍👧‍👦', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'cinema', vi: 'rạp chiếu phim' },
      { en: 'park', vi: 'công viên' },
      { en: 'picnic', vi: 'dã ngoại' },
      { en: 'together', vi: 'cùng nhau' }
    ]
  },
  {
    id: 'g4-u16', grade: 4, unitNum: 'Unit 16', title: 'Weather', subtitle: 'Thời tiết (Tính từ thời tiết & Nơi đi)', icon: '🌤️', color: 'bg-teal-100 text-teal-600',
    vocab: [
      { en: 'sunny', vi: 'nắng đẹp' },
      { en: 'rainy', vi: 'mưa rào' },
      { en: 'windy', vi: 'nhiều gió' },
      { en: 'snowy', vi: 'có tuyết' }
    ]
  },
  {
    id: 'g4-u17', grade: 4, unitNum: 'Unit 17', title: 'In the City', subtitle: 'Trong thành phố (Hỏi đường & Biển báo)', icon: '🏙️', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'street', vi: 'tuyến đường' },
      { en: 'turn', vi: 'rẽ hướng' },
      { en: 'left', vi: 'bên trái' },
      { en: 'right', vi: 'bên phải' }
    ]
  },
  {
    id: 'g4-u18', grade: 4, unitNum: 'Unit 18', title: 'At the Shopping Centre', subtitle: 'Tại trung tâm mua sắm (Giá cả)', icon: '🛍️', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'shop', vi: 'cửa hàng' },
      { en: 'buy', vi: 'mua sắm' },
      { en: 'price', vi: 'giá cả' },
      { en: 'money', vi: 'tiền tệ' }
    ]
  },
  {
    id: 'g4-u19', grade: 4, unitNum: 'Unit 19', title: 'The Animal World', subtitle: 'Thế giới động vật (Hành động)', icon: '🐅', color: 'bg-purple-100 text-purple-600',
    vocab: [
      { en: 'lion', vi: 'sư tử' },
      { en: 'zebra', vi: 'ngựa vằn' },
      { en: 'climb', vi: 'leo trèo' },
      { en: 'roar', vi: 'gầm thấu' }
    ]
  },
  {
    id: 'g4-u20', grade: 4, unitNum: 'Unit 20', title: 'At Summer Camp', subtitle: 'Tại trại hè (Hoạt động cắm trại)', icon: '🏕️', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'camp', vi: 'trại hè' },
      { en: 'tent', vi: 'cái lều' },
      { en: 'dance', vi: 'nhảy múa' },
      { en: 'sing', vi: 'ca hát' }
    ]
  },

  // ================= LỚP 5 =================
  {
    id: 'g5-u1', grade: 5, unitNum: 'Unit 1', title: 'All about me!', subtitle: 'Thông tin cá nhân và sở thích', icon: '👤', color: 'bg-blue-100 text-blue-600',
    vocab: [
      { en: 'city', vi: 'thành phố' },
      { en: 'dolphin', vi: 'cá heo' },
      { en: 'sandwich', vi: 'bánh mì kẹp' },
      { en: 'countryside', vi: 'vùng nông thôn' }
    ]
  },
  {
    id: 'g5-u2', grade: 5, unitNum: 'Unit 2', title: 'Our homes:', subtitle: 'Nơi ở và địa chỉ', icon: '🏠', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'address', vi: 'địa chỉ nhà' },
      { en: 'street', vi: 'tuyến đường' },
      { en: 'lane', vi: 'ngõ ngách' },
      { en: 'tower', vi: 'tòa tháp' }
    ]
  },
  {
    id: 'g5-u3', grade: 5, unitNum: 'Unit 3', title: 'My foreign friends:', subtitle: 'Quốc tịch và tính cách', icon: '🌍', color: 'bg-purple-100 text-purple-600',
    vocab: [
      { en: 'English', vi: 'người Anh' },
      { en: 'friendly', vi: 'thân thiện' },
      { en: 'clever', vi: 'thông minh' },
      { en: 'kind', vi: 'tốt bụng' }
    ]
  },
  {
    id: 'g5-u4', grade: 5, unitNum: 'Unit 4', title: 'Our free-time activities:', subtitle: 'Hoạt động trong thời gian rảnh', icon: '🎨', color: 'bg-rose-100 text-rose-600',
    vocab: [
      { en: 'reading', vi: 'đọc sách' },
      { en: 'gaming', vi: 'chơi game' },
      { en: 'drawing', vi: 'vẽ tranh' },
      { en: 'gardening', vi: 'làm vườn' }
    ]
  },
  {
    id: 'g5-u5', grade: 5, unitNum: 'Unit 5', title: 'My future job:', subtitle: 'Nghề nghiệp tương lai', icon: '🚀', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'astronaut', vi: 'phi hành gia' },
      { en: 'architect', vi: 'kiến trúc sư' },
      { en: 'writer', vi: 'nhà văn' },
      { en: 'reporter', vi: 'phóng viên' }
    ]
  },
  {
    id: 'g5-u6', grade: 5, unitNum: 'Unit 6', title: 'Our school rooms:', subtitle: 'Các phòng học và vị trí', icon: '🏫', color: 'bg-cyan-100 text-cyan-600',
    vocab: [
      { en: 'science', vi: 'phòng khoa học' },
      { en: 'art', vi: 'phòng mỹ thuật' },
      { en: 'music', vi: 'phòng âm nhạc' },
      { en: 'hall', vi: 'hội trường' }
    ]
  },
  {
    id: 'g5-u7', grade: 5, unitNum: 'Unit 7', title: 'Our favourite school activities:', subtitle: 'Hoạt động yêu thích tại trường', icon: '⚽', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'match', vi: 'trận đấu' },
      { en: 'singing', vi: 'cuộc thi hát' },
      { en: 'sports', vi: 'thể thao' },
      { en: 'science', vi: 'triển lãm' }
    ]
  },
  {
    id: 'g5-u8', grade: 5, unitNum: 'Unit 8', title: 'In our classroom:', subtitle: 'Đồ vật trong lớp học', icon: '🎒', color: 'bg-teal-100 text-teal-600',
    vocab: [
      { en: 'poster', vi: 'tấm áp phích' },
      { en: 'globe', vi: 'quả địa cầu' },
      { en: 'board', vi: 'bảng tương tác' },
      { en: 'projector', vi: 'máy chiếu' }
    ]
  },
  {
    id: 'g5-u9', grade: 5, unitNum: 'Unit 9', title: 'Our outdoor activities:', subtitle: 'Hoạt động ngoài trời trong quá quá', icon: '🏃', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'camped', vi: 'đã cắm trại' },
      { en: 'walked', vi: 'đã đi bộ' },
      { en: 'swam', vi: 'đã bơi' },
      { en: 'played', vi: 'đã chơi' }
    ]
  },
  {
    id: 'g5-u10', grade: 5, unitNum: 'Unit 10', title: 'Our school trip:', subtitle: 'Chuyến tham quan của trường', icon: '🚌', color: 'bg-blue-100 text-blue-600',
    vocab: [
      { en: 'museum', vi: 'bảo tàng' },
      { en: 'park', vi: 'công viên' },
      { en: 'zoo', vi: 'vườn thú' },
      { en: 'trip', vi: 'chuyến đi' }
    ]
  },
  {
    id: 'g5-u11', grade: 5, unitNum: 'Unit 11', title: 'Family time:', subtitle: 'Hoạt động gia đình trong quá quá', icon: '👨‍👩‍👧', color: 'bg-blue-100 text-blue-600',
    vocab: [
      { en: 'visited', vi: 'đã thăm' },
      { en: 'cooked', vi: 'đã nấu ăn' },
      { en: 'watched', vi: 'đã xem phim' },
      { en: 'cleaned', vi: 'đã dọn dẹp' }
    ]
  },
  {
    id: 'g5-u12', grade: 5, unitNum: 'Unit 12', title: 'Our Tet holiday:', subtitle: 'Kế hoạch cho ngày Tết', icon: '🧧', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'blossom', vi: 'hoa đào/mai' },
      { en: 'cake', vi: 'bánh chưng' },
      { en: 'lucky', vi: 'tiền lì xì' },
      { en: 'family', vi: 'sum họp' }
    ]
  },
  {
    id: 'g5-u13', grade: 5, unitNum: 'Unit 13', title: 'Our special days:', subtitle: 'Các ngày lễ đặc biệt và ăn uống', icon: '🎆', color: 'bg-purple-100 text-purple-600',
    vocab: [
      { en: 'festival', vi: 'ngày lễ hội' },
      { en: 'mooncake', vi: 'bánh trung thu' },
      { en: 'lantern', vi: 'đèn ông sao' },
      { en: 'party', vi: 'bữa tiệc' }
    ]
  },
  {
    id: 'g5-u14', grade: 5, unitNum: 'Unit 14', title: 'Staying healthy:', subtitle: 'Lối sống lành mạnh và tần suất', icon: '🍎', color: 'bg-rose-100 text-rose-600',
    vocab: [
      { en: 'fruit', vi: 'trái cây' },
      { en: 'water', vi: 'nước lọc' },
      { en: 'sleep', vi: 'giấc ngủ' },
      { en: 'exercise', vi: 'tập thể dục' }
    ]
  },
  {
    id: 'g5-u15', grade: 5, unitNum: 'Unit 15', title: 'Our health:', subtitle: 'Các vấn đề sức khỏe và lời khuyên', icon: '🏥', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'headache', vi: 'đau đầu' },
      { en: 'fever', vi: 'cơn sốt' },
      { en: 'rest', vi: 'nghỉ ngơi' },
      { en: 'doctor', vi: 'bác sĩ' }
    ]
  },
  {
    id: 'g5-u16', grade: 5, unitNum: 'Unit 16', title: 'Seasons and the weather:', subtitle: 'Thời tiết và trang phục theo mùa', icon: '🌤️', color: 'bg-cyan-100 text-cyan-600',
    vocab: [
      { en: 'spring', vi: 'mùa xuân' },
      { en: 'summer', vi: 'mùa hè' },
      { en: 'autumn', vi: 'mùa thu' },
      { en: 'winter', vi: 'mùa đông' }
    ]
  },
  {
    id: 'g5-u17', grade: 5, unitNum: 'Unit 17', title: 'Stories for children:', subtitle: 'Nhân vật và đặc điểm trong truyện', icon: '📚', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'fox', vi: 'con cáo' },
      { en: 'crow', vi: 'con quạ' },
      { en: 'smart', vi: 'mưu trí' },
      { en: 'story', vi: 'câu chuyện' }
    ]
  },
  {
    id: 'g5-u18', grade: 5, unitNum: 'Unit 18', title: 'Means of transport:', subtitle: 'Địa điểm du lịch và phương tiện', icon: '🚆', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'plane', vi: 'máy bay' },
      { en: 'train', vi: 'tàu hỏa' },
      { en: 'coach', vi: 'xe khách' },
      { en: 'motorbike', vi: 'xe máy' }
    ]
  },
  {
    id: 'g5-u19', grade: 5, unitNum: 'Unit 19', title: 'Places of interest:', subtitle: 'Ý kiến về địa danh và khoảng cách', icon: '🗺️', color: 'bg-amber-100 text-amber-600',
    vocab: [
      { en: 'bridge', vi: 'cây cầu' },
      { en: 'pagoda', vi: 'ngôi chùa' },
      { en: 'island', vi: 'hòn đảo' },
      { en: 'lake', vi: 'hồ nước' }
    ]
  },
  {
    id: 'g5-u20', grade: 5, unitNum: 'Unit 20', title: 'Our summer holidays:', subtitle: 'Dự định cho kỳ nghỉ hè', icon: '🏖️', color: 'bg-emerald-100 text-emerald-600',
    vocab: [
      { en: 'resort', vi: 'khu nghỉ dưỡng' },
      { en: 'seafood', vi: 'hải sản' },
      { en: 'explore', vi: 'khám phá' },
      { en: 'relax', vi: 'thư giãn' }
    ]
  }
];

export const PracticeExerciseView: React.FC<PracticeExerciseViewProps> = ({
  user,
  onBack,
  onAddStars,
  onLogout,
  onTriggerNotification,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<PracticeUnit | null>(null);
  const [activeGameType, setActiveGameType] = useState<number | null>(null); // 1..6

  // Game 1: Word Search State
  const [wordSearchSelectedLetters, setWordSearchSelectedLetters] = useState<number[]>([]);
  const [wordSearchFoundWords, setWordSearchFoundWords] = useState<string[]>([]);

  // Game 2: Unscramble State
  const [unscrambleIdx, setUnscrambleIdx] = useState(0);
  const [unscrambleUserLetters, setUnscrambleUserLetters] = useState<string[]>([]);

  // Game 3: Matching State
  const [selectedEnWord, setSelectedEnWord] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Game 4: Memory Cards State
  const [memoryFlippedCards, setMemoryFlippedCards] = useState<number[]>([]);
  const [memoryMatchedCards, setMemoryMatchedCards] = useState<number[]>([]);

  // Game 5: Fill in Blank State
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizInput, setQuizInput] = useState('');
  const [quizFeedback, setQuizFeedback] = useState<boolean | null>(null);

  // Filter Units for Selected Grade
  const currentUnits = PRACTICE_UNITS.filter((u) => u.grade === selectedGrade);

  // Sound & Speech Helpers
  const playSound = (type: 'click' | 'success' | 'speak', text?: string) => {
    if (type === 'click') audioService.playClickSound();
    if (type === 'success') audioService.playSuccessSound();
    if (type === 'speak' && text) audioService.speakEnglish(text);
  };

  const handleGradeChange = (grade: number) => {
    playSound('click');
    setSelectedGrade(grade);
    setSelectedUnit(null);
    setActiveGameType(null);
  };

  const handleSelectUnit = (unit: PracticeUnit) => {
    playSound('click');
    setSelectedUnit(unit);
    setActiveGameType(null);
  };

  const handleLaunchGame = (gameType: number) => {
    playSound('click');
    setActiveGameType(gameType);

    // Reset game states
    setWordSearchSelectedLetters([]);
    setWordSearchFoundWords([]);
    setUnscrambleIdx(0);
    setUnscrambleUserLetters([]);
    setSelectedEnWord(null);
    setMatchedPairs([]);
    setMemoryFlippedCards([]);
    setMemoryMatchedCards([]);
    setQuizIdx(0);
    setQuizInput('');
    setQuizFeedback(null);
  };

  // Grade Tab Themes matching Images 1-5 exactly
  const getGradeTabStyle = (grade: number) => {
    if (grade === selectedGrade) {
      switch (grade) {
        case 1: return 'bg-[#ec4899] text-white shadow-md font-black';
        case 2: return 'bg-[#ff7a29] text-white shadow-md font-black';
        case 3: return 'bg-[#00b4d8] text-white shadow-md font-black';
        case 4: return 'bg-[#2ec4b6] text-white shadow-md font-black';
        case 5: return 'bg-[#8b5cf6] text-white shadow-md font-black';
        default: return 'bg-[#8b5cf6] text-white shadow-md font-black';
      }
    } else {
      switch (grade) {
        case 1: return 'bg-[#fde8ef] text-[#ec4899] hover:bg-pink-100 font-bold';
        case 2: return 'bg-[#fff0e6] text-[#ff7a29] hover:bg-orange-100 font-bold';
        case 3: return 'bg-[#e0f7fa] text-[#00b4d8] hover:bg-cyan-100 font-bold';
        case 4: return 'bg-[#e6f4ea] text-[#2ec4b6] hover:bg-emerald-100 font-bold';
        case 5: return 'bg-[#f3e8ff] text-[#8b5cf6] hover:bg-purple-100 font-bold';
        default: return 'bg-slate-100 text-slate-700 font-bold';
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Quay lại button */}
      <div>
        <button
          onClick={() => {
            playSound('click');
            if (activeGameType) {
              setActiveGameType(null);
            } else if (selectedUnit) {
              setSelectedUnit(null);
            } else {
              onBack();
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-xs font-black rounded-2xl transition cursor-pointer shadow-2xs"
        >
          <ArrowLeft size={16} />
          <span>Quay lại</span>
        </button>
      </div>

      {/* ================= VIEW 1: UNIT SELECTION GRID (Images 1-5) ================= */}
      {!selectedUnit && (
        <div className="space-y-6">
          {/* Grade Selector Tabs (5 Tabs matching Images 1-5) */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((g) => (
              <button
                key={g}
                onClick={() => handleGradeChange(g)}
                className={`py-3 px-2 sm:px-4 rounded-2xl text-xs sm:text-sm text-center transition cursor-pointer border border-transparent transform active:scale-98 ${getGradeTabStyle(g)}`}
              >
                Lớp {g}
              </button>
            ))}
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800">
              Chọn chủ đề ôn tập (Lớp {selectedGrade}):
            </h2>
          </div>

          {/* Units Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
            {currentUnits.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-3xl p-3.5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-sky-300 transition flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-lg shrink-0 ${unit.color}`}>
                      {unit.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs font-black text-slate-800 leading-snug truncate group-hover:text-[#1d50b4]">
                        {unit.unitNum}: {unit.title}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 truncate mt-0.5">
                        {unit.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Làm bài tập ôn Button */}
                <button
                  onClick={() => handleSelectUnit(unit)}
                  className="w-full py-2 bg-[#10b981] hover:bg-emerald-600 active:scale-98 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
                >
                  <span>Làm bài tập ôn</span>
                  <span className="text-xs">📝</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= VIEW 2: EXERCISE TYPES SELECTOR (Image 6) ================= */}
      {selectedUnit && !activeGameType && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Bài tập ôn tập từ vựng:
            </span>
          </div>

          {/* Horizontal Grid of 6 Exercise Type Cards (Image 6) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* Card 1: Tìm từ ẩn giấu */}
            <div
              onClick={() => handleLaunchGame(1)}
              className="bg-[#fce7f3] border border-[#fbcfe8] hover:border-pink-400 rounded-3xl p-4 cursor-pointer transition shadow-2xs hover:shadow-md flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-pink-500 text-white flex items-center justify-center text-lg shadow-2xs group-hover:scale-110 transition">
                  🔎
                </div>
                <div>
                  <h3 className="text-xs font-black text-pink-950">1. Tìm từ ẩn giấu 🔎</h3>
                  <p className="text-[11px] font-semibold text-pink-800/80 leading-snug mt-1">
                    Tìm các từ tiếng Anh nằm trong lưới chữ cái.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Sắp xếp chữ cái */}
            <div
              onClick={() => handleLaunchGame(2)}
              className="bg-[#ffedd5] border border-[#fed7aa] hover:border-orange-400 rounded-3xl p-4 cursor-pointer transition shadow-2xs hover:shadow-md flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-lg shadow-2xs group-hover:scale-110 transition">
                  🎈
                </div>
                <div>
                  <h3 className="text-xs font-black text-orange-950">2. Sắp xếp chữ cái 🎈</h3>
                  <p className="text-[11px] font-semibold text-orange-800/80 leading-snug mt-1">
                    Ghép bong bóng chữ thành từ vựng hoàn chỉnh.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Nối từ thông thái */}
            <div
              onClick={() => handleLaunchGame(3)}
              className="bg-[#e0f2fe] border border-[#bae6fd] hover:border-sky-400 rounded-3xl p-4 cursor-pointer transition shadow-2xs hover:shadow-md flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-lg shadow-2xs group-hover:scale-110 transition">
                  🔗
                </div>
                <div>
                  <h3 className="text-xs font-black text-sky-950">3. Nối từ thông thái 🔗</h3>
                  <p className="text-[11px] font-semibold text-sky-800/80 leading-snug mt-1">
                    Nối tiếng Anh với nghĩa tiếng Việt / Hình ảnh tương ứng.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Lật thẻ ghi nhớ */}
            <div
              onClick={() => handleLaunchGame(4)}
              className="bg-[#f3e8ff] border border-[#e9d5ff] hover:border-purple-400 rounded-3xl p-4 cursor-pointer transition shadow-2xs hover:shadow-md flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-lg shadow-2xs group-hover:scale-110 transition">
                  🎴
                </div>
                <div>
                  <h3 className="text-xs font-black text-purple-950">4. Lật thẻ ghi nhớ 🎴</h3>
                  <p className="text-[11px] font-semibold text-purple-800/80 leading-snug mt-1">
                    Lật thẻ và tìm cặp từ khớp nhau để kiểm tra trí nhớ.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 5: Đố vui điền từ */}
            <div
              onClick={() => handleLaunchGame(5)}
              className="bg-[#dcfce7] border border-[#bbf7d0] hover:border-emerald-400 rounded-3xl p-4 cursor-pointer transition shadow-2xs hover:shadow-md flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-lg shadow-2xs group-hover:scale-110 transition">
                  📝
                </div>
                <div>
                  <h3 className="text-xs font-black text-emerald-950">5. Đố vui điền từ 📝</h3>
                  <p className="text-[11px] font-semibold text-emerald-800/80 leading-snug mt-1">
                    Lắng nghe âm thanh và viết từ vựng thật chính xác.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 6: Vận động & Sáng tạo (Dashed Border) */}
            <div
              onClick={() => handleLaunchGame(6)}
              className="bg-[#fef3c7] border-2 border-dashed border-amber-300 hover:border-amber-400 rounded-3xl p-4 cursor-pointer transition shadow-2xs hover:shadow-md flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-2xs group-hover:scale-110 transition">
                  🎨
                </div>
                <div>
                  <h3 className="text-xs font-black text-amber-950">6. Vận động & Sáng tạo 🎨🏃</h3>
                  <p className="text-[11px] font-semibold text-amber-800/80 leading-snug mt-1">
                    Gợi ý các trò chơi thực tế lý thú cùng ba mẹ hoặc thầy cô!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 3: INTERACTIVE GAMEPLAY MODAL ================= */}
      {selectedUnit && activeGameType && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-6 max-w-3xl mx-auto">
          {/* Game Title Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              {activeGameType === 1 && <span>🔎 1. Tìm từ ẩn giấu</span>}
              {activeGameType === 2 && <span>🎈 2. Sắp xếp chữ cái</span>}
              {activeGameType === 3 && <span>🔗 3. Nối từ thông thái</span>}
              {activeGameType === 4 && <span>🎴 4. Lật thẻ ghi nhớ</span>}
              {activeGameType === 5 && <span>📝 5. Đố vui điền từ</span>}
              {activeGameType === 6 && <span>🎨 6. Vận động & Sáng tạo</span>}
            </h3>
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-extrabold">
              {selectedUnit.unitNum} - {selectedUnit.title}
            </span>
          </div>

          {/* GAME 1: WORD SEARCH */}
          {activeGameType === 1 && (
            <div className="space-y-5 text-center">
              <p className="text-xs font-semibold text-slate-500">
                Tìm danh sách các từ từ vựng trong bảng chữ cái dưới đây:
              </p>

              {/* Vocab Target Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {selectedUnit.vocab.map((v) => {
                  const isFound = wordSearchFoundWords.includes(v.en);
                  return (
                    <button
                      key={v.en}
                      onClick={() => playSound('speak', v.en)}
                      className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                        isFound
                          ? 'bg-emerald-500 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span>{v.en}</span>
                      <span className="text-[10px] text-slate-400">({v.vi})</span>
                      <Volume2 size={12} />
                    </button>
                  );
                })}
              </div>

              {/* Simplified Grid Interactive Puzzle */}
              <div className="bg-sky-50 border border-sky-200 rounded-3xl p-6 space-y-4">
                <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
                  {selectedUnit.vocab.map((v, idx) => {
                    const isFound = wordSearchFoundWords.includes(v.en);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!isFound) {
                            playSound('success');
                            playSound('speak', v.en);
                            setWordSearchFoundWords((prev) => [...prev, v.en]);
                            onAddStars(5);
                            confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                          }
                        }}
                        className={`h-16 rounded-2xl font-black text-sm transition transform cursor-pointer flex flex-col items-center justify-center p-2 border-2 ${
                          isFound
                            ? 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-md'
                            : 'bg-white border-sky-300 text-sky-900 hover:border-sky-500 hover:bg-sky-100'
                        }`}
                      >
                        <span className="uppercase">{v.en}</span>
                        <span className="text-[10px] font-bold opacity-80">{v.vi}</span>
                      </button>
                    );
                  })}
                </div>

                {wordSearchFoundWords.length === selectedUnit.vocab.length && (
                  <div className="bg-emerald-100 text-emerald-900 rounded-2xl p-3 font-extrabold text-xs animate-bounce">
                    🎉 Xuất sắc! Bé đã tìm đủ tất cả các từ trong bài! +20 Sao!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* GAME 2: WORD UNSCRAMBLE */}
          {activeGameType === 2 && (
            <div className="space-y-5 text-center">
              <p className="text-xs font-semibold text-slate-500">
                Hãy ghép các chữ cái đang bị xáo trộn để tạo thành từ đúng:
              </p>

              {unscrambleIdx < selectedUnit.vocab.length ? (() => {
                const target = selectedUnit.vocab[unscrambleIdx];
                const targetLetters = target.en.split('');
                const isComplete = unscrambleUserLetters.join('') === target.en;

                return (
                  <div className="space-y-6 bg-orange-50/50 border border-orange-200 rounded-3xl p-6">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Gợi ý tiếng Việt</span>
                      <h4 className="text-xl font-black text-orange-950">"{target.vi}"</h4>
                    </div>

                    {/* Target Slots */}
                    <div className="flex items-center justify-center gap-2">
                      {targetLetters.map((l, i) => (
                        <div
                          key={i}
                          className={`w-11 h-12 rounded-2xl border-2 flex items-center justify-center text-lg font-black uppercase ${
                            unscrambleUserLetters[i]
                              ? 'bg-orange-500 text-white border-orange-600 shadow-md'
                              : 'bg-white border-orange-300 text-slate-300'
                          }`}
                        >
                          {unscrambleUserLetters[i] || '_'}
                        </div>
                      ))}
                    </div>

                    {/* Letter Options */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      {targetLetters.map((letter, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            playSound('click');
                            if (unscrambleUserLetters.length < targetLetters.length) {
                              setUnscrambleUserLetters((prev) => [...prev, letter]);
                            }
                          }}
                          className="w-11 h-11 rounded-2xl bg-white border-2 border-orange-300 text-orange-900 font-black text-base shadow-2xs hover:bg-orange-100 transition cursor-pointer uppercase active:scale-95"
                        >
                          {letter}
                        </button>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setUnscrambleUserLetters([])}
                        className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer hover:bg-slate-300"
                      >
                        Xóa tất cả
                      </button>

                      <button
                        disabled={!isComplete}
                        onClick={() => {
                          playSound('success');
                          playSound('speak', target.en);
                          onAddStars(5);
                          confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                          setUnscrambleIdx((prev) => prev + 1);
                          setUnscrambleUserLetters([]);
                        }}
                        className={`px-5 py-2 rounded-xl text-xs font-black text-white shadow-md transition cursor-pointer ${
                          isComplete ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-300 cursor-not-allowed'
                        }`}
                      >
                        Tiếp theo ➔
                      </button>
                    </div>
                  </div>
                );
              })() : (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl space-y-3">
                  <h4 className="text-lg font-black text-emerald-800">🎉 Bé đã hoàn thành xuất sắc trò chơi Sắp xếp chữ cái!</h4>
                  <p className="text-xs font-semibold text-emerald-700">Đã nhận thêm +20 Sao thưởng!</p>
                </div>
              )}
            </div>
          )}

          {/* GAME 3: WORD MATCHING */}
          {activeGameType === 3 && (
            <div className="space-y-5 text-center">
              <p className="text-xs font-semibold text-slate-500">
                Nhấp chọn từ tiếng Anh, sau đó chọn nghĩa tiếng Việt tương ứng:
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {/* Left: EN */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-sky-800 uppercase tracking-wider mb-2">Tiếng Anh</h4>
                  {selectedUnit.vocab.map((v) => {
                    const isMatched = matchedPairs.includes(v.en);
                    const isSelected = selectedEnWord === v.en;
                    return (
                      <button
                        key={v.en}
                        disabled={isMatched}
                        onClick={() => {
                          playSound('click');
                          playSound('speak', v.en);
                          setSelectedEnWord(v.en);
                        }}
                        className={`w-full py-3 px-3 rounded-2xl font-black text-xs transition border-2 cursor-pointer ${
                          isMatched
                            ? 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                            : isSelected
                            ? 'bg-sky-500 text-white border-sky-600 shadow-md'
                            : 'bg-white border-sky-200 text-sky-900 hover:border-sky-400'
                        }`}
                      >
                        {v.en}
                      </button>
                    );
                  })}
                </div>

                {/* Right: VI */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-2">Tiếng Việt</h4>
                  {selectedUnit.vocab.map((v) => {
                    const isMatched = matchedPairs.includes(v.en);
                    return (
                      <button
                        key={v.vi}
                        disabled={isMatched}
                        onClick={() => {
                          if (selectedEnWord === v.en) {
                            playSound('success');
                            setMatchedPairs((prev) => [...prev, v.en]);
                            setSelectedEnWord(null);
                            onAddStars(5);
                            confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
                          } else {
                            playSound('click');
                          }
                        }}
                        className={`w-full py-3 px-3 rounded-2xl font-black text-xs transition border-2 cursor-pointer ${
                          isMatched
                            ? 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                            : 'bg-white border-emerald-200 text-emerald-900 hover:border-emerald-400'
                        }`}
                      >
                        {v.vi}
                      </button>
                    );
                  })}
                </div>
              </div>

              {matchedPairs.length === selectedUnit.vocab.length && (
                <div className="p-4 bg-emerald-100 text-emerald-900 rounded-2xl font-extrabold text-xs">
                  🎉 Bé đã nối đúng tất cả các cặp từ!
                </div>
              )}
            </div>
          )}

          {/* GAME 4: MEMORY CARDS */}
          {activeGameType === 4 && (
            <div className="space-y-5 text-center">
              <p className="text-xs font-semibold text-slate-500">
                Lật các thẻ bài để tìm cặp từ tiếng Anh và nghĩa tiếng Việt tương ứng:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                {selectedUnit.vocab.flatMap((v, idx) => [
                  { id: idx * 2, word: v.en, type: 'en', key: v.en },
                  { id: idx * 2 + 1, word: v.vi, type: 'vi', key: v.en }
                ]).map((card) => {
                  const isFlipped = memoryFlippedCards.includes(card.id) || memoryMatchedCards.includes(card.id);
                  return (
                    <button
                      key={card.id}
                      onClick={() => {
                        if (memoryFlippedCards.length < 2 && !memoryFlippedCards.includes(card.id)) {
                          playSound('click');
                          if (card.type === 'en') playSound('speak', card.word);
                          const newFlipped = [...memoryFlippedCards, card.id];
                          setMemoryFlippedCards(newFlipped);

                          if (newFlipped.length === 2) {
                            // Check match logic
                            setTimeout(() => {
                              setMemoryFlippedCards([]);
                              setMemoryMatchedCards((prev) => [...prev, newFlipped[0], newFlipped[1]]);
                              playSound('success');
                              onAddStars(5);
                            }, 800);
                          }
                        }
                      }}
                      className={`h-24 rounded-2xl font-black text-xs transition border-2 cursor-pointer flex items-center justify-center p-2 shadow-2xs transform active:scale-95 ${
                        isFlipped
                          ? 'bg-purple-600 text-white border-purple-700 shadow-md'
                          : 'bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200'
                      }`}
                    >
                      {isFlipped ? card.word : '❓'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* GAME 5: FILL IN THE BLANK QUIZ */}
          {activeGameType === 5 && (
            <div className="space-y-5 text-center">
              <p className="text-xs font-semibold text-slate-500">
                Nghe âm thanh và chọn/nhập từ tiếng Anh đúng:
              </p>

              {quizIdx < selectedUnit.vocab.length ? (() => {
                const target = selectedUnit.vocab[quizIdx];
                return (
                  <div className="space-y-5 max-w-md mx-auto bg-emerald-50 border border-emerald-200 rounded-3xl p-6">
                    <button
                      onClick={() => playSound('speak', target.en)}
                      className="px-5 py-3 bg-[#1d50b4] hover:bg-blue-700 text-white rounded-2xl font-black text-xs shadow-md inline-flex items-center gap-2 transition cursor-pointer"
                    >
                      <Volume2 size={18} />
                      <span>Phát âm thanh từ 🔊</span>
                    </button>

                    <div className="text-xs font-bold text-slate-600">
                      Nghĩa tiếng Việt: <span className="font-extrabold text-emerald-800">"{target.vi}"</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {selectedUnit.vocab.map((v) => (
                        <button
                          key={v.en}
                          onClick={() => {
                            if (v.en === target.en) {
                              playSound('success');
                              playSound('speak', v.en);
                              onAddStars(5);
                              triggerConfetti('default');
                              setQuizIdx((prev) => prev + 1);
                            } else {
                              playSound('click');
                            }
                          }}
                          className="py-3 px-3 bg-white hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 rounded-2xl font-black text-xs shadow-2xs transition cursor-pointer"
                        >
                          {v.en}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })() : (
                <div className="p-6 bg-emerald-100 text-emerald-900 rounded-3xl font-black text-sm">
                  🎉 Bé đã trả lời đúng tất cả các câu đố! +20 Sao!
                </div>
              )}
            </div>
          )}

          {/* GAME 6: CREATIVE & PHYSICAL ACTIVITY GUIDE */}
          {activeGameType === 6 && (
            <div className="space-y-5 text-center">
              <div className="p-6 bg-amber-50 border-2 border-dashed border-amber-300 rounded-3xl space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center text-3xl shadow-2xs">
                  🎨
                </div>
                <h4 className="text-base font-black text-amber-950">
                  Gợi ý trò chơi tương tác thực tế cùng Ba Mẹ & Thầy Cô!
                </h4>
                <div className="text-xs font-semibold text-amber-900/90 leading-relaxed max-w-lg mx-auto space-y-2 text-left bg-white/80 p-4 rounded-2xl border border-amber-200">
                  <p>🔹 <strong>Trò chơi 1 (Simon Says):</strong> Ba mẹ hô tên các đồ vật từ vựng tiếng Anh (VD: <em>{selectedUnit.vocab[0]?.en}</em>, <em>{selectedUnit.vocab[1]?.en}</em>), bé sẽ chạy tới chỉ vào đồ vật đó trong nhà!</p>
                  <p>🔹 <strong>Trò chơi 2 (Vẽ hình đoán chữ):</strong> Một người vẽ hình lên giấy, người kia đoán từ tiếng Anh tương ứng thật nhanh!</p>
                  <p>🔹 <strong>Trò chơi 3 (Hát và nhún nhảy):</strong> Cùng lắng nghe câu hát mẫu và phát âm to rõ từng từ vựng nhé!</p>
                </div>

                <button
                  onClick={() => {
                    playSound('success');
                    onAddStars(10);
                    triggerConfetti('lessonComplete');
                  }}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-2xl shadow-md transition cursor-pointer"
                >
                  Bé đã tham gia trò chơi cùng Ba Mẹ (+10 Sao ⭐)
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
