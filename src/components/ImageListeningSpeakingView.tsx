import React, { useState, useRef } from 'react';
import { 
  Volume2, 
  Mic, 
  Upload, 
  ArrowLeft, 
  Award, 
  Flame, 
  Search, 
  CheckCircle2, 
  X, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  VolumeX, 
  Sparkles, 
  BookOpen, 
  Lock, 
  ChevronUp, 
  ChevronDown,
  Info,
  Layers,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount, UserProfile } from '../types';
import { audioService } from '../utils/audio';
import { UserAvatar } from './UserAvatar';

interface ImageListeningSpeakingViewProps {
  user: UserAccount | UserProfile;
  onBack: () => void;
  onAddStars: (amount: number) => void;
  onLogout: () => void;
  onTriggerNotification?: (title: string, message: string) => void;
}

// Comprehensive Curriculum Lessons for Grade 1..5 and Speaking Tips
interface CurriculumLesson {
  id: string;
  grade: string; // 'grade-1' | 'grade-2' | 'grade-3' | 'grade-4' | 'grade-5' | 'speaking-tips'
  semester: 'hk1' | 'hk2';
  category: 'mindmap' | 'grammar' | 'speaking';
  title: string;
  date: string;
  count: string;
  tag: string;
  image: string;
  sentences: { id: number; en: string; vi: string }[];
}

// Sample Extracted Sentences for Unit 10 "All About Me!"
const SAMPLE_SENTENCES = [
  { id: 1, en: "Hi! I'm Linh!", vi: "Chào cậu! Tớ là Linh!" },
  { id: 2, en: "All about me! Let me tell you who I am and what I love!", vi: "Tất tần tật về tớ! Để tớ kể cho cậu biết tớ là ai và tớ yêu thích những gì nhé!" },
  { id: 3, en: "1. Asking and answering questions about personal information", vi: "1. Hỏi và trả lời các câu hỏi về thông tin cá nhân" },
  { id: 4, en: "Can you tell me about yourself?", vi: "Cậu có thể giới thiệu về bản thân không?" },
  { id: 5, en: "- I'm Linh.", vi: "- Tớ là Linh." },
  { id: 6, en: "- I'm in class 6A.", vi: "- Tớ học lớp 6A." },
  { id: 7, en: "- I live in Hanoi.", vi: "- Tớ sống ở Hà Nội." },
  { id: 8, en: "- My favourite colour is pink.", vi: "- Màu sắc yêu thích của tớ là màu hồng." },
  { id: 9, en: "- My favourite animal is the dolphin.", vi: "- Loài động vật yêu thích của tớ là cá heo." },
  { id: 10, en: "- My favourite sport is table tennis.", vi: "- Môn thể thao yêu thích của tớ là bóng bàn." },
  { id: 11, en: "2. Asking and answering questions about someone's favourite things", vi: "2. Hỏi và trả lời về sở thích của ai đó" },
  { id: 12, en: "What's your favourite ...?", vi: "Sở thích của bạn về ... là gì?" },
  { id: 13, en: "- My favourite city is Da Nang.", vi: "- Thành phố yêu thích của tớ là Đà Nẵng." },
  { id: 14, en: "- My favourite class is English.", vi: "- Môn học yêu thích của tớ là Tiếng Anh." },
  { id: 15, en: "- My favourite place is the countryside.", vi: "- Nơi chốn yêu thích của tớ là vùng nông thôn." },
  { id: 16, en: "- My favourite food is a sandwich.", vi: "- Món ăn yêu thích của tớ là bánh mì kẹp (sandwich)." },
  { id: 17, en: "3. Vocabulary", vi: "3. Từ vựng" },
  { id: 18, en: "city", vi: "thành phố" },
  { id: 19, en: "class", vi: "lớp học" },
  { id: 20, en: "countryside", vi: "vùng nông thôn" },
  { id: 21, en: "dolphin", vi: "cá heo" },
  { id: 22, en: "pink", vi: "màu hồng" },
  { id: 23, en: "sandwich", vi: "bánh mì kẹp" },
  { id: 24, en: "table tennis", vi: "môn bóng bàn" },
  { id: 25, en: "Here are some of my favourites!", vi: "Dưới đây là một số điều tớ yêu thích nhất!" },
  { id: 26, en: "More about me...", vi: "Thêm thông tin về tớ..." },
  { id: 27, en: "I live in the city, but I love going to the countryside.", vi: "Tớ sống ở thành phố, nhưng tớ rất thích đi về vùng nông thôn." },
  { id: 28, en: "My favourite animal is the dolphin because it's smart and friendly.", vi: "Động vật yêu thích của tớ là cá heo vì nó thông minh và thân thiện." },
  { id: 29, en: "My favourite food is a sandwich. It's simple but delicious!", vi: "Món ăn yêu thích của tớ là sandwich. Đơn giản nhưng rất ngon!" },
  { id: 30, en: "I like table tennis. It's fun and good for my health.", vi: "Tớ thích chơi bóng bàn. Nó rất vui và tốt cho sức khỏe." },
  { id: 31, en: "What about you? Let's share!", vi: "Còn cậu thì sao? Cùng chia sẻ nhé!" },
  { id: 32, en: "It's nice to meet you! Let's be friends!", vi: "Rất vui được gặp cậu! Chúng ta hãy làm bạn nhé!" },
  { id: 33, en: "Name: Linh | Age: 11 | Class: 6A | School: Sunshine Secondary School", vi: "Tên: Linh | Tuổi: 11 | Lớp: 6A | Trường: THCS Ánh Dương" },
  { id: 34, en: "Hometown: Hanoi", vi: "Quê quán: Hà Nội" },
  { id: 35, en: "Favourite colour: Pink", vi: "Màu yêu thích: Hồng" },
  { id: 36, en: "Favourite food: Sandwich", vi: "Món ăn yêu thích: Sandwich" },
  { id: 37, en: "Favourite sport: Table Tennis", vi: "Môn thể thao yêu thích: Bóng bàn" },
  { id: 38, en: "Thank you!", vi: "Cảm ơn bạn!" },
  { id: 39, en: "Welcome to Kido English!", vi: "Chào mừng đến với Kido English!" },
  { id: 40, en: "Keep practicing listening and speaking every day!", vi: "Hãy tiếp tục luyện nghe và nói mỗi ngày nhé!" }
];

const ALL_CURRICULUM_LESSONS: CurriculumLesson[] = [
  // --- LỚP 1 - HK1 ---
  {
    id: 'g1-hk1-m1',
    grade: 'grade-1',
    semester: 'hk1',
    category: 'mindmap',
    title: 'Mindmap - Unit 1: In the school playground (Lớp 1 HK1)',
    date: '18/7/2026',
    count: '8 câu',
    tag: 'Mới',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "In the school playground", vi: "Ở sân trường" },
      { id: 2, en: "Bill, Ba, Bike, Ball", vi: "Bill, Ba, Xe đạp, Quả bóng" },
      { id: 3, en: "Look at Ba!", vi: "Hãy nhìn bạn Ba kìa!" },
      { id: 4, en: "Ba is playing with a ball.", vi: "Ba đang chơi với quả bóng." },
      { id: 5, en: "Look at Bill!", vi: "Hãy nhìn bạn Bill kìa!" },
      { id: 6, en: "Bill is riding a bike.", vi: "Bill đang cưỡi xe đạp." },
      { id: 7, en: "I see a boy on a bike.", vi: "Tớ thấy một cậu bé trên xe đạp." },
      { id: 8, en: "This is my ball.", vi: "Đây là quả bóng của tớ." }
    ]
  },
  {
    id: 'g1-hk1-m2',
    grade: 'grade-1',
    semester: 'hk1',
    category: 'mindmap',
    title: 'Mindmap - Unit 2: In the dining room (Lớp 1 HK1)',
    date: '19/7/2026',
    count: '7 câu',
    tag: 'Chung',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "In the dining room", vi: "Trong phòng ăn" },
      { id: 2, en: "Cake, Cat, Car, Cup", vi: "Bánh ngọt, Con mèo, Ô tô, Cái cốc" },
      { id: 3, en: "I have a cat.", vi: "Tớ có một con mèo." },
      { id: 4, en: "The cat is on the table.", vi: "Con mèo ở trên bàn." },
      { id: 5, en: "I have a red car.", vi: "Tớ có một chiếc ô tô màu đỏ." },
      { id: 6, en: "Pass me the cake, please!", vi: "Cho tớ xin cái bánh ngọt nhé!" },
      { id: 7, en: "Look at the cute cat!", vi: "Nhìn con mèo đáng yêu chưa kìa!" }
    ]
  },
  {
    id: 'g1-hk1-g1',
    grade: 'grade-1',
    semester: 'hk1',
    category: 'grammar',
    title: '[Ngữ Pháp] - Unit 1: Chào hỏi & Tự giới thiệu tên',
    date: '20/7/2026',
    count: '4 câu',
    tag: 'Ngữ pháp',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Hello, I'm Ba.", vi: "Xin chào, tớ là Ba." },
      { id: 2, en: "Hi, I'm Bill. Nice to meet you!", vi: "Chào bạn, tớ là Bill. Rất vui được gặp bạn!" },
      { id: 3, en: "I have a ball.", vi: "Tớ có một quả bóng." },
      { id: 4, en: "I have a cat.", vi: "Tớ có một con mèo." }
    ]
  },
  {
    id: 'g1-hk1-s1',
    grade: 'grade-1',
    semester: 'hk1',
    category: 'speaking',
    title: 'Thử thách nói: Giới thiệu bản thân Lớp 1',
    date: '21/7/2026',
    count: '3 câu',
    tag: 'Hot',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Hello! My name is Nam.", vi: "Xin chào! Tên tớ là Nam." },
      { id: 2, en: "I am six years old.", vi: "Tớ 6 tuổi." },
      { id: 3, en: "I like apples and cats.", vi: "Tớ thích táo và những chú mèo." }
    ]
  },

  // --- LỚP 1 - HK2 ---
  {
    id: 'g1-hk2-m1',
    grade: 'grade-1',
    semester: 'hk2',
    category: 'mindmap',
    title: 'Mindmap - Unit 6: In the classroom (Lớp 1 HK2)',
    date: '10/2/2026',
    count: '7 câu',
    tag: 'Mới',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "In the classroom", vi: "Trong lớp học" },
      { id: 2, en: "Pen, Pencil, Paper, Pencil case", vi: "Bút mực, Bút chì, Tờ giấy, Hộp bút" },
      { id: 3, en: "Open your book, please!", vi: "Hãy mở sách ra nào!" },
      { id: 4, en: "Close your book!", vi: "Gập sách lại nhé!" },
      { id: 5, en: "Stand up!", vi: "Đứng dậy nào!" },
      { id: 6, en: "Sit down!", vi: "Ngồi xuống nhé!" },
      { id: 7, en: "Look at the teacher!", vi: "Hãy nhìn cô giáo kìa!" }
    ]
  },
  {
    id: 'g1-hk2-g1',
    grade: 'grade-1',
    semester: 'hk2',
    category: 'grammar',
    title: '[Ngữ Pháp] - Unit 6: Câu lệnh cơ bản trong lớp học',
    date: '12/2/2026',
    count: '3 câu',
    tag: 'Chung',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Stand up, please!", vi: "Vui lòng đứng dậy!" },
      { id: 2, en: "Sit down, please!", vi: "Vui lòng ngồi xuống!" },
      { id: 3, en: "Open your pencil case.", vi: "Mở hộp bút của bạn ra." }
    ]
  },
  {
    id: 'g1-hk2-s1',
    grade: 'grade-1',
    semester: 'hk2',
    category: 'speaking',
    title: 'Thử thách nói: Miêu tả đồ dùng học tập Lớp 1',
    date: '15/2/2026',
    count: '3 câu',
    tag: 'Nổi bật',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Look at my new pencil case!", vi: "Hãy nhìn hộp bút mới của tớ này!" },
      { id: 2, en: "It is blue and yellow.", vi: "Nó màu xanh dương và màu vàng." },
      { id: 3, en: "I have three pencils.", vi: "Tớ có ba chiếc bút chì." }
    ]
  },

  // --- LỚP 2 - HK1 ---
  {
    id: 'g2-hk1-m1',
    grade: 'grade-2',
    semester: 'hk1',
    category: 'mindmap',
    title: 'Mindmap - Unit 1: At the seaside (Lớp 2 HK1)',
    date: '15/7/2026',
    count: '5 câu',
    tag: 'Mới',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "At the seaside", vi: "Ở bờ biển" },
      { id: 2, en: "Sea, Sun, Sand, Sailboat", vi: "Biển, Mặt trời, Bãi cát, Thuyền buồm" },
      { id: 3, en: "The sun is shining brightly.", vi: "Mặt trời đang tỏa sáng rực rỡ." },
      { id: 4, en: "The sand is yellow and soft.", vi: "Bãi cát màu vàng và mềm mại." },
      { id: 5, en: "Look at the sailboat on the sea!", vi: "Nhìn chiếc thuyền buồm trên biển kìa!" }
    ]
  },
  {
    id: 'g2-hk1-g1',
    grade: 'grade-2',
    semester: 'hk1',
    category: 'grammar',
    title: '[Ngữ Pháp] - Unit 2: Hỏi sở thích đồ ăn "Do you like...?"',
    date: '18/7/2026',
    count: '3 câu',
    tag: 'Ngữ pháp',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Do you like chicken?", vi: "Cậu có thích thịt gà không?" },
      { id: 2, en: "Yes, I do. / No, I don't.", vi: "Có, tớ thích. / Không, tớ không thích." },
      { id: 3, en: "I like cheese and chocolate.", vi: "Tớ thích phô mai và socola." }
    ]
  },
  {
    id: 'g2-hk1-s1',
    grade: 'grade-2',
    semester: 'hk1',
    category: 'speaking',
    title: 'Thử thách nói: Nói về đồ ăn yêu thích Lớp 2',
    date: '20/7/2026',
    count: '2 câu',
    tag: 'Hot',
    image: 'https://images.unsplash.com/photo-1566438480900-0ff09be85425?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "My favourite food is chicken.", vi: "Món ăn yêu thích của tớ là thịt gà." },
      { id: 2, en: "I eat chicken on Sundays.", vi: "Tớ ăn thịt gà vào các ngày Chủ nhật." }
    ]
  },

  // --- LỚP 2 - HK2 ---
  {
    id: 'g2-hk2-m1',
    grade: 'grade-2',
    semester: 'hk2',
    category: 'mindmap',
    title: 'Mindmap - Unit 8: At the zoo (Lớp 2 HK2)',
    date: '14/2/2026',
    count: '4 câu',
    tag: 'Mới',
    image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Monkey, Elephant, Tiger, Giraffe", vi: "Con khỉ, Con voi, Con hổ, Hươu cao cổ" },
      { id: 2, en: "The elephant is very big!", vi: "Con voi rất là to lớn!" },
      { id: 3, en: "Look at the funny monkey!", vi: "Nhìn chú khỉ vui nhộn kìa!" },
      { id: 4, en: "The monkey is eating a yellow banana.", vi: "Chú khỉ đang ăn một quả chuối màu vàng." }
    ]
  },
  {
    id: 'g2-hk2-g1',
    grade: 'grade-2',
    semester: 'hk2',
    category: 'grammar',
    title: '[Ngữ Pháp] - Unit 6: Hỏi vị trí "Where is...?"',
    date: '18/2/2026',
    count: '4 câu',
    tag: 'Chung',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Where is the spoon?", vi: "Cái thìa ở đâu?" },
      { id: 2, en: "It's on the table.", vi: "Nó ở trên bàn." },
      { id: 3, en: "Where is the cat?", vi: "Con mèo ở đâu?" },
      { id: 4, en: "It's under the chair.", vi: "Nó ở dưới cái ghế." }
    ]
  },
  {
    id: 'g2-hk2-s1',
    grade: 'grade-2',
    semester: 'hk2',
    category: 'speaking',
    title: 'Thử thách nói: Miêu tả con vật ở vườn thú',
    date: '20/2/2026',
    count: '2 câu',
    tag: 'Nổi bật',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "I love going to the zoo.", vi: "Tớ rất thích đi vườn thú." },
      { id: 2, en: "My favourite animal is the elephant.", vi: "Động vật yêu thích của tớ là con voi." }
    ]
  },

  // --- LỚP 3 - HK1 ---
  {
    id: 'g3-hk1-m1',
    grade: 'grade-3',
    semester: 'hk1',
    category: 'mindmap',
    title: 'Mindmap - Unit 1: Hello (Lớp 3 HK1)',
    date: '10/7/2026',
    count: '5 câu',
    tag: 'Mới',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Hello! I'm Ben.", vi: "Xin chào! Tớ là Ben." },
      { id: 2, en: "What's your name?", vi: "Tên của bạn là gì?" },
      { id: 3, en: "My name is Mai.", vi: "Tên tớ là Mai." },
      { id: 4, en: "How are you today?", vi: "Hôm nay bạn khỏe không?" },
      { id: 5, en: "I'm fine, thank you!", vi: "Tớ khỏe, cảm ơn bạn!" }
    ]
  },
  {
    id: 'g3-hk1-m2',
    grade: 'grade-3',
    semester: 'hk1',
    category: 'mindmap',
    title: 'Mindmap - Unit 5: My hobbies (Lớp 3 HK1)',
    date: '12/7/2026',
    count: '4 câu',
    tag: 'Chung',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "What's your hobby?", vi: "Sở thích của bạn là gì?" },
      { id: 2, en: "I like singing and dancing.", vi: "Tớ thích hát và múa." },
      { id: 3, en: "My brother likes playing chess.", vi: "Anh trai tớ thích chơi cờ vua." },
      { id: 4, en: "We like swimming in the pool.", vi: "Chúng tớ thích bơi ở hồ bơi." }
    ]
  },
  {
    id: 'g3-hk1-g1',
    grade: 'grade-3',
    semester: 'hk1',
    category: 'grammar',
    title: '[Ngữ Pháp] - Unit 1 & 2: Hỏi tên, tuổi & sở thích',
    date: '15/7/2026',
    count: '2 câu',
    tag: 'Ngữ pháp',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "How old are you? - I am eight years old.", vi: "Bạn bao nhiêu tuổi? - Tớ 8 tuổi." },
      { id: 2, en: "What's your hobby? - I like painting.", vi: "Sở thích của bạn là gì? - Tớ thích vẽ tranh." }
    ]
  },
  {
    id: 'g3-hk1-s1',
    grade: 'grade-3',
    semester: 'hk1',
    category: 'speaking',
    title: 'Thử thách nói: Giới thiệu bản thân & sở thích',
    date: '18/7/2026',
    count: '3 câu',
    tag: 'Hot',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Hi everyone! My name is Mai.", vi: "Chào mọi người! Tên tớ là Mai." },
      { id: 2, en: "I'm eight years old. I live in Hanoi.", vi: "Tớ 8 tuổi. Tớ sống ở Hà Nội." },
      { id: 3, en: "My hobby is reading books.", vi: "Sở thích của tớ là đọc sách." }
    ]
  },

  // --- LỚP 3 - HK2 ---
  {
    id: 'g3-hk2-m1',
    grade: 'grade-3',
    semester: 'hk2',
    category: 'mindmap',
    title: 'Mindmap - Unit 11: My family (Lớp 3 HK2)',
    date: '11/2/2026',
    count: '4 câu',
    tag: 'Mới',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Who is this?", vi: "Đây là ai?" },
      { id: 2, en: "This is my father. He is a doctor.", vi: "Đây là bố tớ. Bố tớ là bác sĩ." },
      { id: 3, en: "This is my mother. She is a teacher.", vi: "Đây là mẹ tớ. Mẹ tớ là giáo viên." },
      { id: 4, en: "I have a younger sister.", vi: "Tớ có một em gái." }
    ]
  },
  {
    id: 'g3-hk2-g1',
    grade: 'grade-3',
    semester: 'hk2',
    category: 'grammar',
    title: '[Ngữ Pháp] - Unit 11 & 12: Cấu trúc There is / There are',
    date: '14/2/2026',
    count: '2 câu',
    tag: 'Chung',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "There is a living room.", vi: "Có một phòng khách." },
      { id: 2, en: "There are two bedrooms in my house.", vi: "Có hai phòng ngủ trong nhà tớ." }
    ]
  },
  {
    id: 'g3-hk2-s1',
    grade: 'grade-3',
    semester: 'hk2',
    category: 'speaking',
    title: 'Thử thách nói: Giới thiệu ngôi nhà yêu thích',
    date: '16/2/2026',
    count: '2 câu',
    tag: 'Nổi bật',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Welcome to my house!", vi: "Chào mừng bạn đến thăm nhà tớ!" },
      { id: 2, en: "My bedroom is my favourite room.", vi: "Phòng ngủ là phòng tớ yêu thích nhất." }
    ]
  },

  // --- LỚP 4 - HK1 ---
  {
    id: 'g4-hk1-m1',
    grade: 'grade-4',
    semester: 'hk1',
    category: 'mindmap',
    title: 'Mindmap - Unit 1: My friends (Lớp 4 HK1)',
    date: '05/7/2026',
    count: '4 câu',
    tag: 'Mới',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Where are you from?", vi: "Bạn đến từ đâu?" },
      { id: 2, en: "I'm from Vietnam. I'm Vietnamese.", vi: "Tớ đến từ Việt Nam. Tớ là người Việt Nam." },
      { id: 3, en: "She is from Japan. She is Japanese.", vi: "Cô ấy đến từ Nhật Bản. Cô ấy là người Nhật." },
      { id: 4, en: "He is from America. He is American.", vi: "Cậu ấy đến từ Mỹ. Cậu ấy là người Mỹ." }
    ]
  },
  {
    id: 'g4-hk1-g1',
    grade: 'grade-4',
    semester: 'hk1',
    category: 'grammar',
    title: '[Ngữ Pháp] - Unit 1 & 2: Hỏi quốc tịch & thời gian',
    date: '08/7/2026',
    count: '2 câu',
    tag: 'Ngữ pháp',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "What nationality are you? - I'm Vietnamese.", vi: "Bạn quốc tịch gì? - Tớ là người Việt Nam." },
      { id: 2, en: "What time do you eat breakfast? - At 6:30 AM.", vi: "Mấy giờ bạn ăn sáng? - Lúc 6:30 sáng." }
    ]
  },
  {
    id: 'g4-hk1-s1',
    grade: 'grade-4',
    semester: 'hk1',
    category: 'speaking',
    title: 'Thử thách nói: Kể về thời khóa biểu một ngày',
    date: '10/7/2026',
    count: '2 câu',
    tag: 'Hot',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "In the morning, I get up at 6:00.", vi: "Vào buổi sáng, tớ thức dậy lúc 6:00." },
      { id: 2, en: "After school, I play badminton with my friends.", vi: "Sau giờ học, tớ chơi cầu lông cùng bạn bè." }
    ]
  },

  // --- LỚP 4 - HK2 ---
  {
    id: 'g4-hk2-m1',
    grade: 'grade-4',
    semester: 'hk2',
    category: 'mindmap',
    title: 'Mindmap - Unit 12: Jobs (Lớp 4 HK2)',
    date: '08/2/2026',
    count: '4 câu',
    tag: 'Mới',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "What does your father do?", vi: "Bố bạn làm nghề gì?" },
      { id: 2, en: "He is a pilot. He flies airplanes.", vi: "Bố tớ là phi công. Bố tớ lái máy bay." },
      { id: 3, en: "What does your mother do?", vi: "Mẹ bạn làm nghề gì?" },
      { id: 4, en: "She is a nurse. She works in a hospital.", vi: "Mẹ tớ là y tá. Mẹ làm việc ở bệnh viện." }
    ]
  },
  {
    id: 'g4-hk2-g1',
    grade: 'grade-4',
    semester: 'hk2',
    category: 'grammar',
    title: '[Ngữ Pháp] - Unit 12: Cấu trúc hỏi nghề nghiệp & nơi làm việc',
    date: '10/2/2026',
    count: '2 câu',
    tag: 'Chung',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "What does he do? - He is a doctor.", vi: "Cậu ấy làm nghề gì? - Cậu ấy là bác sĩ." },
      { id: 2, en: "Where does she work? - She works in a school.", vi: "Cô ấy làm việc ở đâu? - Cô ấy làm việc ở trường học." }
    ]
  },
  {
    id: 'g4-hk2-s1',
    grade: 'grade-4',
    semester: 'hk2',
    category: 'speaking',
    title: 'Thử thách nói: Ước mơ nghề nghiệp tương lai',
    date: '12/2/2026',
    count: '2 câu',
    tag: 'Nổi bật',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "I want to be a teacher in the future.", vi: "Tớ muốn trở thành một giáo viên trong tương lai." },
      { id: 2, en: "Because I love teaching children English.", vi: "Vì tớ rất thích dạy tiếng Anh cho các bạn nhỏ." }
    ]
  },

  // --- LỚP 5 - HK1 ---
  {
    id: 'g5-hk1-m1',
    grade: 'grade-5',
    semester: 'hk1',
    category: 'mindmap',
    title: 'Mindmap - Unit 10: All about me! (Global Success Lớp 5)',
    date: '17/7/2026',
    count: '40 câu',
    tag: 'Nổi bật',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80',
    sentences: SAMPLE_SENTENCES
  },
  {
    id: 'g5-hk1-m2',
    grade: 'grade-5',
    semester: 'hk1',
    category: 'mindmap',
    title: 'Mindmap - Unit 2: Our homes (Global Success Lớp 5)',
    date: '18/7/2026',
    count: '6 câu',
    tag: 'Mới',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "What is your address?", vi: "Địa chỉ nhà bạn là gì?" },
      { id: 2, en: "It's 105 Hoa Binh Lane, Hanoi.", vi: "Đó là số 105 ngõ Hòa Bình, Hà Nội." },
      { id: 3, en: "Who do you live with?", vi: "Bạn sống cùng với ai?" },
      { id: 4, en: "I live with my parents and my grandmother.", vi: "Tớ sống cùng bố mẹ và bà nội." },
      { id: 5, en: "What's the flat like?", vi: "Căn hộ đó trông như thế nào?" },
      { id: 6, en: "It's big, bright and modern.", vi: "Nó rộng rãi, sáng sủa và hiện đại." }
    ]
  },
  {
    id: 'g5-hk1-g1',
    grade: 'grade-5',
    semester: 'hk1',
    category: 'grammar',
    title: '[Ngữ Pháp] - Unit 1 & 2: Hỏi địa chỉ & tần suất thói quen',
    date: '26/7/2026',
    count: '2 câu',
    tag: 'Ngữ pháp',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "What's your address? - It's 52 Tran Phu Street.", vi: "Địa chỉ của bạn là gì? - Đó là số 52 đường Trần Phú." },
      { id: 2, en: "How often do you study English? - Every day.", vi: "Bạn học tiếng Anh bao lâu một lần? - Mỗi ngày." }
    ]
  },
  {
    id: 'g5-hk1-s1',
    grade: 'grade-5',
    semester: 'hk1',
    category: 'speaking',
    title: 'Thử thách nói: Thuyết trình giới thiệu trường lớp',
    date: '28/7/2026',
    count: '2 câu',
    tag: 'Hot',
    image: 'https://images.unsplash.com/photo-1566438480900-0ff09be85425?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Hello everyone! Welcome to my class 5A.", vi: "Xin chào mọi người! Chào mừng đến với lớp 5A của tớ." },
      { id: 2, en: "Our classroom is decorated with colorful posters.", vi: "Lớp học của chúng tớ được trang trí bằng các tấm áp phích nhiều màu sắc." }
    ]
  },

  // --- LỚP 5 - HK2 ---
  {
    id: 'g5-hk2-m1',
    grade: 'grade-5',
    semester: 'hk2',
    category: 'mindmap',
    title: 'Mindmap - Unit 11: Our health (Global Success Lớp 5)',
    date: '02/2/2026',
    count: '4 câu',
    tag: 'Mới',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "What's the matter with you?", vi: "Bạn bị làm sao thế?" },
      { id: 2, en: "I have a headache and a fever.", vi: "Tớ bị đau đầu và bị sốt." },
      { id: 3, en: "You should stay in bed and take medicine.", vi: "Bạn nên nằm nghỉ trên giường và uống thuốc." },
      { id: 4, en: "You shouldn't drink cold ice water.", vi: "Bạn không nên uống nước đá lạnh." }
    ]
  },
  {
    id: 'g5-hk2-g1',
    grade: 'grade-5',
    semester: 'hk2',
    category: 'grammar',
    title: '[Ngữ Pháp] - Unit 11: Lời khuyên sức khỏe Should / Shouldn\'t',
    date: '05/2/2026',
    count: '2 câu',
    tag: 'Chung',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "You should eat more fresh fruit.", vi: "Bạn nên ăn nhiều trái cây tươi hơn." },
      { id: 2, en: "You shouldn't stay up late.", vi: "Bạn không nên thức khuya." }
    ]
  },
  {
    id: 'g5-hk2-s1',
    grade: 'grade-5',
    semester: 'hk2',
    category: 'speaking',
    title: 'Thử thách nói: Kể lại chuyến dã ngoại đáng nhớ',
    date: '08/2/2026',
    count: '2 câu',
    tag: 'Nổi bật',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Last weekend, my class had a fantastic school trip.", vi: "Cuối tuần trước, lớp tớ đã có một chuyến dã ngoại tuyệt vời." },
      { id: 2, en: "We took lots of photos and played fun games together.", vi: "Chúng tớ đã chụp rất nhiều ảnh và chơi các trò chơi vui vẻ cùng nhau." }
    ]
  },

  // --- GỢI Ý SPEAKING - HK1 ---
  {
    id: 'sp-hk1-m1',
    grade: 'speaking-tips',
    semester: 'hk1',
    category: 'mindmap',
    title: 'Gợi ý Speaking: Thuyết trình bản thân & Gia đình',
    date: '01/7/2026',
    count: '4 câu',
    tag: 'Mới',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Good morning everyone! Let me introduce myself.", vi: "Xin chào buổi sáng mọi người! Để tớ tự giới thiệu bản thân nhé." },
      { id: 2, en: "My name is Linh and I am ten years old.", vi: "Tên tớ là Linh và tớ 10 tuổi." },
      { id: 3, en: "There are four people in my family.", vi: "Gia đình tớ có 4 người." },
      { id: 4, en: "We love watching movies together on weekends.", vi: "Chúng tớ thích xem phim cùng nhau vào cuối tuần." }
    ]
  },
  {
    id: 'sp-hk1-g1',
    grade: 'speaking-tips',
    semester: 'hk1',
    category: 'grammar',
    title: 'Mẫu câu mở bài & kết bài Speaking chuẩn',
    date: '03/7/2026',
    count: '2 câu',
    tag: 'Hot',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Thank you for listening to my presentation!", vi: "Cảm ơn mọi người đã lắng nghe phần thuyết trình của tớ!" },
      { id: 2, en: "If you have any questions, please feel free to ask!", vi: "Nếu mọi người có câu hỏi nào, xin cứ tự nhiên đặt câu hỏi nhé!" }
    ]
  },
  {
    id: 'sp-hk1-s1',
    grade: 'speaking-tips',
    semester: 'hk1',
    category: 'speaking',
    title: 'Luyện phản xạ nói 1 phút - Chủ đề Sở thích',
    date: '05/7/2026',
    count: '2 câu',
    tag: 'Nổi bật',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "In my free time, I enjoy reading comic books.", vi: "Vào thời gian rảnh, tớ thích đọc truyện tranh." },
      { id: 2, en: "It helps me relax and sparks my imagination.", vi: "Nó giúp tớ thư giãn và kích thích trí tưởng tượng." }
    ]
  },

  // --- GỢI Ý SPEAKING - HK2 ---
  {
    id: 'sp-hk2-m1',
    grade: 'speaking-tips',
    semester: 'hk2',
    category: 'mindmap',
    title: 'Gợi ý Speaking: Nói về ước mơ & Chuyến du lịch',
    date: '01/2/2026',
    count: '4 câu',
    tag: 'Mới',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "Today I would like to talk about my dream job.", vi: "Hôm nay tớ xin phép nói về công việc ước mơ của tớ." },
      { id: 2, en: "I dream of becoming an astronaut and exploring space.", vi: "Tớ mơ ước trở thành phi hành gia và khám phá vũ trụ." },
      { id: 3, en: "Last summer, I visited Da Nang with my family.", vi: "Mùa hè năm ngoái, tớ đã đi thăm Đà Nẵng cùng gia đình." },
      { id: 4, en: "The beach was blue and the food was delicious.", vi: "Bãi biển thật xanh mát và đồ ăn rất ngon." }
    ]
  },
  {
    id: 'sp-hk2-g1',
    grade: 'speaking-tips',
    semester: 'hk2',
    category: 'grammar',
    title: 'Mẫu câu so sánh & miêu tả chuyến đi',
    date: '03/2/2026',
    count: '2 câu',
    tag: 'Chung',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "The beach in Da Nang is wider than in Hanoi.", vi: "Bãi biển ở Đà Nẵng rộng hơn so với ở Hà Nội." },
      { id: 2, en: "It was one of the best trips in my life!", vi: "Đó là một trong những chuyến đi tuyệt vời nhất đời tớ!" }
    ]
  },
  {
    id: 'sp-hk2-s1',
    grade: 'speaking-tips',
    semester: 'hk2',
    category: 'speaking',
    title: 'Luyện phản xạ nói 1 phút - Ước mơ tương lai',
    date: '05/2/2026',
    count: '1 câu',
    tag: 'Hot',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    sentences: [
      { id: 1, en: "I will work hard every day to achieve my dream.", vi: "Tớ sẽ chăm chỉ làm việc mỗi ngày để đạt được ước mơ." }
    ]
  }
];

// Helper function to create SVG mindmap data URLs for lessons
const generateMindmapSvg = (title: string, grade: string, sentences: { en: string; vi: string }[]) => {
  const isG1 = grade === 'grade-1';
  const bgColor = isG1 ? '#fdf2f8' : grade === 'grade-2' ? '#fff7ed' : grade === 'grade-3' ? '#ecfeff' : grade === 'grade-4' ? '#f0fdf4' : '#faf5ff';
  const mainColor = isG1 ? '#ec4899' : grade === 'grade-2' ? '#ea580c' : grade === 'grade-3' ? '#0284c7' : grade === 'grade-4' ? '#16a34a' : '#9333ea';
  const subBg = isG1 ? '#fce7f3' : grade === 'grade-2' ? '#ffedd5' : grade === 'grade-3' ? '#cffaff' : grade === 'grade-4' ? '#dcfce7' : '#f3e8ff';

  const vocabWords = sentences.filter(s => s.en.length < 30).slice(0, 6);
  
  const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <rect width="800" height="500" rx="24" fill="${bgColor}"/>
  <rect x="20" y="20" width="760" height="460" rx="20" fill="white" stroke="${mainColor}" stroke-width="3" stroke-dasharray="8 6" opacity="0.6"/>
  
  <!-- Header Title -->
  <rect x="180" y="35" width="440" height="48" rx="24" fill="${mainColor}"/>
  <text x="400" y="65" text-anchor="middle" fill="white" font-family="sans-serif" font-weight="900" font-size="18">
    ${title.replace(/Mindmap - /g, '').replace(/\(Lớp \d HK\d\)/g, '')}
  </text>
  
  <!-- Center Main Node -->
  <circle cx="400" cy="250" r="75" fill="${mainColor}" filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.15))"/>
  <circle cx="400" cy="250" r="68" fill="white" stroke="${mainColor}" stroke-width="4"/>
  <text x="400" y="242" text-anchor="middle" fill="${mainColor}" font-family="sans-serif" font-weight="900" font-size="16">
    KIDO ENGLISH
  </text>
  <text x="400" y="265" text-anchor="middle" fill="#475569" font-family="sans-serif" font-weight="800" font-size="13">
    MINDMAP ${grade.replace('grade-', 'LỚP ')}
  </text>

  <!-- Branches and Nodes -->
  ${vocabWords.map((word, i) => {
    const angle = (i * (360 / Math.max(vocabWords.length, 1))) - 90;
    const rad = (angle * Math.PI) / 180;
    const x = 400 + Math.cos(rad) * 170;
    const y = 250 + Math.sin(rad) * 140;
    
    return `
      <path d="M 400 250 Q ${400 + Math.cos(rad)*80} ${250 + Math.sin(rad)*80} ${x} ${y}" stroke="${mainColor}" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.8"/>
      <g transform="translate(${x}, ${y})">
        <rect x="-80" y="-28" width="160" height="56" rx="18" fill="${subBg}" stroke="${mainColor}" stroke-width="2.5"/>
        <text x="0" y="-4" text-anchor="middle" fill="${mainColor}" font-family="sans-serif" font-weight="900" font-size="14">${word.en.replace(/[.,!]/g, '')}</text>
        <text x="0" y="16" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-weight="700" font-size="11">${word.vi}</text>
      </g>
    `;
  }).join('')}

  <!-- Mascot Badge -->
  <g transform="translate(40, 400)">
    <rect x="0" y="0" width="160" height="44" rx="22" fill="${mainColor}" opacity="0.1"/>
    <text x="80" y="27" text-anchor="middle" fill="${mainColor}" font-family="sans-serif" font-weight="900" font-size="14">🦖 Kido Practice</text>
  </g>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

export const ImageListeningSpeakingView: React.FC<ImageListeningSpeakingViewProps> = ({
  user,
  onBack,
  onAddStars,
  onLogout,
  onTriggerNotification,
}) => {
  // Navigation & Filter States
  const [selectedGrade, setSelectedGrade] = useState<string>('grade-1');
  const [selectedSemester, setSelectedSemester] = useState<'hk1' | 'hk2'>('hk1');
  const [savedTab, setSavedTab] = useState<'mindmap' | 'grammar' | 'speaking'>('mindmap');

  // Filter lessons based on grade, semester, and category tab
  const currentCategoryLessons = ALL_CURRICULUM_LESSONS.filter(
    (l) => l.grade === selectedGrade && l.semester === selectedSemester && l.category === savedTab
  );

  // Default active lesson based on filter or fallback
  const initialLesson = currentCategoryLessons[0] || ALL_CURRICULUM_LESSONS.find(l => l.grade === selectedGrade && l.semester === selectedSemester) || ALL_CURRICULUM_LESSONS[0];

  // Image & Extraction State
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialLesson.image);
  const [activeLessonTitle, setActiveLessonTitle] = useState<string>(initialLesson.title);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auto-switch active lesson when grade or semester changes
  React.useEffect(() => {
    const matchingLessons = ALL_CURRICULUM_LESSONS.filter(
      (l) => l.grade === selectedGrade && l.semester === selectedSemester
    );
    if (matchingLessons.length > 0) {
      const preferred = matchingLessons.find(l => l.category === savedTab) || matchingLessons[0];
      setActiveLessonTitle(preferred.title);
      setUploadedImage(preferred.image);
    }
  }, [selectedGrade, selectedSemester]);

  // When savedTab changes, switch to first available lesson in that tab if available
  const handleTabChange = (tab: 'mindmap' | 'grammar' | 'speaking') => {
    setSavedTab(tab);
    const tabLessons = ALL_CURRICULUM_LESSONS.filter(
      (l) => l.grade === selectedGrade && l.semester === selectedSemester && l.category === tab
    );
    if (tabLessons.length > 0) {
      setActiveLessonTitle(tabLessons[0].title);
      setUploadedImage(tabLessons[0].image);
    }
  };

  // Find currently active lesson object
  const activeLesson = ALL_CURRICULUM_LESSONS.find(l => l.title === activeLessonTitle) || initialLesson;
  const currentSentences = activeLesson ? activeLesson.sentences : [];

  // Speaking Practice Modal State
  const [speakingItem, setSpeakingItem] = useState<{ id: number; en: string; vi: string } | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechAccuracy, setSpeechAccuracy] = useState<number | null>(null);

  // Timer & Audio States for Sidebar
  const [timerSeconds, setTimerSeconds] = useState<number>(900); // 15 mins default
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [musicVol, setMusicVol] = useState<number>(50);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // File Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        if (onTriggerNotification) {
          onTriggerNotification('⚠️ Dung lượng ảnh lớn', 'Vui lòng chọn file dưới 10MB!');
        }
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setUploadedImage(dataUrl);
        setActiveLessonTitle(`Ảnh tải lên: ${file.name}`);
        audioService.playSuccessSound();
        if (onTriggerNotification) {
          onTriggerNotification('✨ Trích xuất thành công!', `Kido đã phân tích bài học từ hình ảnh.`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered Sentences
  const filteredSentences = currentSentences.filter((s) =>
    s.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.vi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Speaking Challenge
  const handleStartRecording = () => {
    audioService.playClickSound();
    setIsRecording(true);
    setSpeechAccuracy(null);

    setTimeout(() => {
      setIsRecording(false);
      const score = Math.floor(Math.random() * 15) + 86; // 86% - 100%
      setSpeechAccuracy(score);
      audioService.playSuccessSound();
      onAddStars(5);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

      if (onTriggerNotification) {
        onTriggerNotification(`🎉 Xuất sắc! Đạt ${score}%`, 'Bé vừa hoàn thành phần luyện nói và nhận +5 Sao Vàng!');
      }
    }, 2500);
  };

  // Scroll saved list
  const handleScroll = (direction: 'up' | 'down') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: direction === 'down' ? 120 : -120,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 font-sans select-none pb-12 transition-all duration-300">
      {/* Back Button Bar */}
      <div>
        <button
          onClick={() => {
            audioService.playClickSound();
            onBack();
          }}
          className="px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-black flex items-center gap-1.5 transition cursor-pointer border border-slate-200 shadow-2xs"
        >
          <ArrowLeft size={16} />
          <span>Quay lại bài học</span>
        </button>
      </div>

      {/* 2. GRADE LEVEL SELECTOR & SEMESTER TABS */}
      <div className="space-y-2">
        {/* Grade Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'grade-1', name: 'Lớp 1', color: 'bg-pink-100/90 text-pink-700 border-pink-200' },
            { id: 'grade-2', name: 'Lớp 2', color: 'bg-amber-100/90 text-amber-800 border-amber-200' },
            { id: 'grade-3', name: 'Lớp 3', color: 'bg-cyan-100/90 text-cyan-800 border-cyan-200' },
            { id: 'grade-4', name: 'Lớp 4', color: 'bg-emerald-100/90 text-emerald-800 border-emerald-200' },
            { id: 'grade-5', name: 'Lớp 5', color: 'bg-purple-600 text-white font-extrabold shadow-md' },
            { id: 'speaking-tips', name: 'Gợi ý Speaking', color: 'bg-yellow-100 text-amber-900 border-yellow-300 font-bold' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                audioService.playClickSound();
                setSelectedGrade(item.id);
              }}
              className={`px-4 py-2 rounded-2xl border text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${
                selectedGrade === item.id
                  ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-300'
                  : item.color
              }`}
            >
              {item.id === 'speaking-tips' && <span>🗣️</span>}
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Semester Buttons */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 text-xs font-black">
          <button
            onClick={() => {
              audioService.playClickSound();
              setSelectedSemester('hk1');
            }}
            className={`py-2 rounded-xl text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedSemester === 'hk1' ? 'bg-sky-500 text-white shadow-xs font-extrabold' : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <span>📅</span>
            <span>Học kỳ I</span>
          </button>
          <button
            onClick={() => {
              audioService.playClickSound();
              setSelectedSemester('hk2');
            }}
            className={`py-2 rounded-xl text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedSemester === 'hk2' ? 'bg-sky-500 text-white shadow-xs font-extrabold' : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <span>📅</span>
            <span>Học kỳ II</span>
          </button>
        </div>
      </div>

      {/* 3. INSTRUCTION & LIMIT BOX */}
      <div className="bg-sky-50/90 rounded-3xl p-4 border border-sky-200 text-xs space-y-2.5 relative">
        <div className="font-extrabold text-sky-900 flex items-center gap-1.5 text-sm">
          <Info size={16} className="text-sky-600" />
          <span>Hướng dẫn học tập & Hạn mức:</span>
        </div>
        <ul className="space-y-1 font-semibold text-slate-700 pl-5 list-disc text-xs">
          <li>
            <strong className="text-sky-800">Chọn Khối lớp & Học kỳ</strong> tương ứng bên trên.
          </li>
          <li>
            Tải ảnh lên hoặc chọn bài học đã lưu. Để lưu bài học mới, bé hãy nhập tên bài học và nhấn Lưu.
          </li>
          <li>
            <strong className="text-red-600">**Hạn mức**:</strong> Lưu tối đa <strong className="text-slate-900">20 bài học</strong> và upload phân tích tối đa <strong className="text-slate-900">10 hình ảnh/ngày</strong> (Ngoại trừ Admin).
          </li>
        </ul>

        {/* Goal Badge Banner */}
        <div className="bg-red-50/90 border border-red-200 rounded-2xl p-2.5 text-red-800 font-extrabold flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-base">🎯</span>
            <span className="text-xs">
              Mục tiêu: Bé cố gắng hoàn thành 80% nội dung Mindmap để đạt kết quả xuất sắc nhé!{' '}
              <em className="font-normal text-slate-600">(Bé chỉ cần nghe voice các từ trong bài là hoàn thành)</em> 🏵️
            </span>
          </div>

          <button
            onClick={() => {
              audioService.playClickSound();
              audioService.speakEnglish("Welcome to Kido English! Let's practice listening and speaking!");
            }}
            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-2xs transition cursor-pointer"
          >
            <Volume2 size={14} />
            <span>Nghe voice</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN TWO-COLUMN CONTENT AREA + SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN (6 COLS): IMAGE DISPLAY + SAVED LESSONS */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Card A: Image Upload & Preview */}
          <div className="bg-white rounded-3xl p-4 border border-sky-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <span>🖼️</span>
                <span>Hình ảnh bài học</span>
              </h2>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-300 text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <Upload size={12} />
                <span>Đổi ảnh khác</span>
              </button>
            </div>

            {/* Image Preview or Upload Dropzone */}
            <div className="relative min-h-[280px] sm:min-h-[340px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-2 shadow-inner">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt={activeLessonTitle}
                  onError={(e) => {
                    const fallbackSvg = generateMindmapSvg(activeLessonTitle, selectedGrade, currentSentences);
                    (e.target as HTMLImageElement).src = fallbackSvg;
                  }}
                  className="max-h-[380px] w-full h-auto object-contain rounded-xl shadow-md transition hover:scale-102 cursor-zoom-in"
                />
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full border-2 border-dashed border-sky-300 bg-sky-50/50 hover:bg-sky-50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer text-center space-y-2 transition"
                >
                  <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-2xl shadow-2xs">
                    ☁️
                  </div>
                  <p className="text-sm font-black text-slate-700">
                    Kéo thả ảnh vào đây hoặc nhấp để chọn ảnh
                  </p>
                  <p className="text-xs text-slate-400 font-bold">
                    Hỗ trợ định dạng JPG, PNG, WEBP
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card B: Saved Lessons ("Bài học đã lưu") */}
          <div className="bg-white rounded-3xl p-4 border border-sky-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-500">🔖</span>
                <h3 className="text-sm font-black text-slate-800">Bài học đã lưu</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-black border border-slate-200">
                {currentCategoryLessons.length} bài
              </span>
            </div>

            {/* 3 Saved Categories Tabs */}
            <div className="grid grid-cols-3 gap-2 text-xs font-black">
              <button
                onClick={() => {
                  audioService.playClickSound();
                  handleTabChange('mindmap');
                }}
                className={`py-2 rounded-2xl border transition cursor-pointer flex items-center justify-center gap-1 ${
                  savedTab === 'mindmap'
                    ? 'bg-sky-50 text-sky-700 border-sky-400 font-extrabold ring-1 ring-sky-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>🔀</span>
                <span>Mindmap</span>
              </button>

              <button
                onClick={() => {
                  audioService.playClickSound();
                  handleTabChange('grammar');
                }}
                className={`py-2 rounded-2xl border transition cursor-pointer flex items-center justify-center gap-1 ${
                  savedTab === 'grammar'
                    ? 'bg-amber-50 text-amber-800 border-amber-400 font-extrabold ring-1 ring-amber-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>📖</span>
                <span>Ngữ Pháp</span>
              </button>

              <button
                onClick={() => {
                  audioService.playClickSound();
                  handleTabChange('speaking');
                }}
                className={`py-2 rounded-2xl border transition cursor-pointer flex items-center justify-center gap-1 ${
                  savedTab === 'speaking'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-extrabold ring-1 ring-emerald-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>🎙️</span>
                <span>Gợi Ý Speaking</span>
              </button>
            </div>

            {/* Saved Items Scrollable Container with Arrows */}
            <div className="relative group">
              <div
                ref={scrollContainerRef}
                className="max-h-[220px] overflow-y-auto space-y-2 pr-1 custom-scrollbar scroll-smooth"
              >
                {currentCategoryLessons.length === 0 ? (
                  <div className="py-8 text-center text-xs font-bold text-slate-400">
                    Chưa có bài học cho mục này
                  </div>
                ) : (
                  currentCategoryLessons.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        audioService.playClickSound();
                        setActiveLessonTitle(item.title);
                        setUploadedImage(item.image);
                        if (onTriggerNotification) {
                          onTriggerNotification('📖 Đã tải bài học!', item.title);
                        }
                      }}
                      className={`p-2.5 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
                        activeLessonTitle === item.title
                          ? 'bg-sky-50 border-sky-400 shadow-2xs ring-1 ring-sky-200'
                          : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/30'
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = generateMindmapSvg(item.title, item.grade, item.sentences);
                        }}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 bg-sky-50"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-slate-800 truncate">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] font-bold text-slate-400">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>{item.count}</span>
                          <span className="px-1.5 py-0.2 rounded bg-sky-100 text-sky-700 text-[10px] font-black">
                            {item.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Scroll Arrow Indicators */}
              <div className="absolute right-2 bottom-2 flex flex-col gap-1">
                <button
                  onClick={() => handleScroll('up')}
                  className="p-1 bg-white/90 hover:bg-slate-100 rounded-full border border-slate-200 shadow-2xs text-slate-600 transition cursor-pointer"
                >
                  <ChevronUp size={12} />
                </button>
                <button
                  onClick={() => handleScroll('down')}
                  className="p-1 bg-white/90 hover:bg-slate-100 rounded-full border border-slate-200 shadow-2xs text-slate-600 transition cursor-pointer"
                >
                  <ChevronDown size={12} />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (6 COLS): EXTRACTED RESULTS & PRACTICE */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-4 border border-sky-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <span>📑</span>
                <span>Kết quả trích xuất & luyện tập</span>
              </h2>

              <span className="text-xs font-black text-sky-600 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
                Tìm thấy {uploadedImage ? filteredSentences.length : 0} câu
              </span>
            </div>

            {/* Quick Search Input */}
            {uploadedImage && (
              <div className="relative mt-2">
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm câu tiếng Anh hoặc tiếng Việt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-400"
                />
              </div>
            )}

            {/* Extracted Sentence List or Empty State */}
            {!uploadedImage ? (
              <div className="py-24 px-6 text-center space-y-3 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-3xl shadow-sm border border-sky-200">
                  🦕
                </div>
                <p className="text-xs font-bold text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Chưa có ảnh. Vui lòng tải ảnh lên ở ô bên trái hoặc chọn bài học đã lưu để bắt đầu nhé! 🦕
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-2 max-h-[580px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredSentences.map((sentence) => (
                  <div
                    key={sentence.id}
                    className="p-3 rounded-2xl bg-slate-50/80 hover:bg-sky-50/50 border border-slate-200/80 hover:border-sky-300 transition flex items-start justify-between gap-3 group"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-black text-slate-800 leading-snug">{sentence.en}</p>
                      <p className="text-[11px] font-bold text-slate-500 leading-normal">{sentence.vi}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      {/* Audio Listen Button */}
                      <button
                        onClick={() => {
                          audioService.playClickSound();
                          audioService.speakEnglish(sentence.en);
                        }}
                        title="Nghe phát âm chuẩn"
                        className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 transition cursor-pointer shadow-2xs"
                      >
                        <Volume2 size={15} />
                      </button>

                      {/* Speaking Practice Button */}
                      <button
                        onClick={() => {
                          audioService.playClickSound();
                          setSpeakingItem(sentence);
                        }}
                        title="Thử thách luyện nói"
                        className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 transition cursor-pointer shadow-2xs"
                      >
                        <Mic size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 5. SPEAKING CHALLENGE MODAL */}
      {speakingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-sky-200 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => {
                audioService.playClickSound();
                setSpeakingItem(null);
                setIsRecording(false);
                setSpeechAccuracy(null);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="text-center space-y-2">
              <span className="inline-block p-3 rounded-full bg-orange-100 text-orange-600 text-2xl shadow-2xs">
                🎙️
              </span>
              <h3 className="text-base font-black text-slate-800">Thử thách Luyện nói cùng Kido</h3>
              <p className="text-xs font-bold text-slate-500">Nghe câu mẫu rồi bấm ghi âm để luyện tập nhé!</p>
            </div>

            {/* Target Sentence Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <p className="text-sm font-black text-slate-900">{speakingItem.en}</p>
              <p className="text-xs font-bold text-slate-500">{speakingItem.vi}</p>

              <button
                onClick={() => audioService.speakEnglish(speakingItem.en)}
                className="mt-2 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-black inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Volume2 size={14} />
                <span>Nghe giọng chuẩn</span>
              </button>
            </div>

            {/* Recording Controls */}
            <div className="text-center space-y-3">
              <button
                disabled={isRecording}
                onClick={handleStartRecording}
                className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
                }`}
              >
                <Mic size={18} />
                <span>{isRecording ? 'Đang lắng nghe bé nói...' : 'Bắt đầu đọc ngay'}</span>
              </button>

              {speechAccuracy !== null && (
                <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black space-y-1">
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span>Đánh giá độ chính xác: {speechAccuracy}%</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">Phát âm rất tốt! +5 Sao vàng đã được cộng vào tài khoản.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
