import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  Sparkles, 
  Award, 
  Send, 
  CheckCircle2, 
  RotateCcw, 
  Play, 
  Pause,
  ArrowLeft,
  ChevronDown,
  Search,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount, UserProfile } from '../types';
import { audioService } from '../utils/audio';

interface TopicSpeakingAIViewProps {
  user: UserAccount | UserProfile;
  onBack?: () => void;
  onAddStars?: (amount: number) => void;
  onLogout?: () => void;
  onTriggerNotification?: (title: string, message: string) => void;
}

interface TopicData {
  unitId: string;
  grade: number;
  unitName: string;
  topicTitle: string;
  vocab: {
    word: string;
    pos: string;
    phonetic: string;
    vi: string;
    example: string;
  }[];
  phrases: string[];
  outline: {
    step: string;
    title: string;
    en: string;
  }[];
  connectors: string[];
  readingParagraph: string;
  chatStarter: string;
}

// Curriculum Units Database for Grades 1 - 5
const CURRICULUM_DATA: Record<number, TopicData[]> = {
  1: [
    {
      unitId: 'g1-u1',
      grade: 1,
      unitName: 'Unit 1: In the school playground (Sân trường)',
      topicTitle: 'Fun in the School Playground',
      vocab: [
        { word: 'bike', pos: 'n', phonetic: '/baɪk/', vi: 'xe đạp', example: 'Bill rides a colorful bike.' },
        { word: 'book', pos: 'n', phonetic: '/bʊk/', vi: 'cuốn sách', example: 'He holds a new book.' },
        { word: 'ball', pos: 'n', phonetic: '/bɔːl/', vi: 'quả bóng', example: 'We play with a red ball.' },
        { word: 'grass', pos: 'n', phonetic: '/ɡrɑːs/', vi: 'thảm cỏ', example: 'The grass is green.' }
      ],
      phrases: [
        'I see a red ball in the playground.',
        'Bill rides a blue bike.',
        'We play games together on the grass.',
        'I love my fun school playground!'
      ],
      outline: [
        { step: '1', title: '1. Introduction (Mở đầu / Giới thiệu)', en: 'Hello everyone! Today I talk about my school playground.' },
        { step: '2', title: '2. Key Details (Nội dung chính)', en: 'In the playground, I see a bike, a book, and a red ball.' },
        { step: '3', title: '3. Feelings & Reasons (Cảm xúc & Lý do)', en: 'I feel happy because playing with friends is super fun.' },
        { step: '4', title: '4. Conclusion (Kết bài & Lời chào)', en: 'Thank you for listening! See you in the playground!' }
      ],
      connectors: ['and', 'because', 'in the playground', 'also', 'together'],
      readingParagraph: 'Welcome to our school playground! Bill rides a new bike. Linh holds an English book. The children play with a red ball happily on the green grass. We love playing together every day!',
      chatStarter: "Hello! Today let's talk about The School Playground. What is your favorite thing about it?"
    },
    {
      unitId: 'g1-u2',
      grade: 1,
      unitName: 'Unit 2: In the dining room (Phòng ăn)',
      topicTitle: 'Yummy Breakfast in the Dining Room',
      vocab: [
        { word: 'apple', pos: 'n', phonetic: '/ˈæp.əl/', vi: 'quả táo', example: 'I eat a sweet red apple.' },
        { word: 'milk', pos: 'n', phonetic: '/mɪlk/', vi: 'sữa tươi', example: 'My sister drinks fresh milk.' },
        { word: 'cake', pos: 'n', phonetic: '/keɪk/', vi: 'bánh ngọt', example: 'The cake is delicious.' },
        { word: 'table', pos: 'n', phonetic: '/ˈteɪ.bəl/', vi: 'bàn ăn', example: 'We sit around the table.' }
      ],
      phrases: [
        'We have breakfast in the dining room.',
        'My sister drinks fresh warm milk.',
        'I eat a sweet red apple every morning.',
        'Breakfast gives us lots of energy!'
      ],
      outline: [
        { step: '1', title: '1. Introduction (Mở đầu / Giới thiệu)', en: 'Hello everyone! Today I talk about my dining room.' },
        { step: '2', title: '2. Key Details (Nội dung chính)', en: 'In the dining room, my family eats apples, cake, and drinks milk.' },
        { step: '3', title: '3. Feelings & Reasons (Cảm xúc & Lý do)', en: 'I feel happy because eating together makes me warm.' },
        { step: '4', title: '4. Conclusion (Kết bài & Lời chào)', en: 'Thank you for listening! Enjoy your meals!' }
      ],
      connectors: ['and', 'because', 'in the dining room', 'every morning', 'together'],
      readingParagraph: 'Welcome to our dining room! Every morning, my family sits together. We have fresh milk, sweet red apples, and delicious cakes. Eating together makes me feel warm and happy!',
      chatStarter: "Hi! What do you like to eat for breakfast in the dining room?"
    }
  ],
  2: [
    {
      unitId: 'g2-u1',
      grade: 2,
      unitName: 'Unit 1: At my birthday party (Tiệc sinh nhật)',
      topicTitle: "Mai's Seventh Birthday Party",
      vocab: [
        { word: 'party', pos: 'n', phonetic: '/ˈpɑː.ti/', vi: 'bữa tiệc', example: 'Welcome to my birthday party!' },
        { word: 'cake', pos: 'n', phonetic: '/keɪk/', vi: 'bánh sinh nhật', example: 'A delicious strawberry cake.' },
        { word: 'candle', pos: 'n', phonetic: '/ˈkæn.dəl/', vi: 'cây nến', example: 'Blow out seven candles.' },
        { word: 'gift', pos: 'n', phonetic: '/ɡɪft/', vi: 'món quà', example: 'My friends bring lovely gifts.' }
      ],
      phrases: [
        'Happy birthday to Mai!',
        'I eat strawberry cake at the party.',
        'My friends sing a happy song.',
        'I love opening my birthday gifts!'
      ],
      outline: [
        { step: '1', title: '1. Introduction (Mở đầu / Giới thiệu)', en: 'Hello everyone! Today I talk about my seventh birthday party.' },
        { step: '2', title: '2. Key Details (Nội dung chính)', en: 'At my party, there is a big cake, seven candles, and lovely gifts.' },
        { step: '3', title: '3. Feelings & Reasons (Cảm xúc & Lý do)', en: 'I feel very happy because all my best friends come to play.' },
        { step: '4', title: '4. Conclusion (Kết bài & Lời chào)', en: 'Thank you for listening! Happy birthday to everyone!' }
      ],
      connectors: ['and', 'because', 'at my party', 'also', 'with friends'],
      readingParagraph: "Today is Mai's seventh birthday party! Her friends sing a sweet song around a big strawberry cake with seven bright candles. Mai blows out the candles and opens lovely gift boxes. Everyone laughs and plays fun party games!",
      chatStarter: "Hello Mai! What flavor is your favorite birthday cake?"
    }
  ],
  3: [
    {
      unitId: 'g3-u1',
      grade: 3,
      unitName: 'Unit 1: Hello & Greetings (Chào hỏi)',
      topicTitle: 'Meeting New Friends at School',
      vocab: [
        { word: 'hello', pos: 'v', phonetic: '/həˈləʊ/', vi: 'xin chào', example: 'Hello! My name is Dino.' },
        { word: 'name', pos: 'n', phonetic: '/neɪm/', vi: 'tên', example: 'What is your name?' },
        { word: 'friend', pos: 'n', phonetic: '/frend/', vi: 'bạn bè', example: 'She is my best friend.' },
        { word: 'nice', pos: 'adj', phonetic: '/naɪs/', vi: 'vui vẻ, tử tế', example: 'Nice to meet you!' }
      ],
      phrases: [
        'Hello! My name is Alex and I am eight years old.',
        'Nice to meet you! How are you today?',
        'I am fine, thank you. And you?',
        'Goodbye! See you again tomorrow.'
      ],
      outline: [
        { step: '1', title: '1. Introduction (Mở đầu / Giới thiệu)', en: 'Hello everyone! My name is Alex and today I want to talk about Greetings.' },
        { step: '2', title: '2. Key Details (Nội dung chính)', en: 'When I meet new friends at school, I say hello and ask their names politely.' },
        { step: '3', title: '3. Feelings & Reasons (Cảm xúc & Lý do)', en: 'I feel very happy because making new friends gives me joy and confidence.' },
        { step: '4', title: '4. Conclusion (Kết bài & Lời chào)', en: 'Thank you for listening to my presentation! Have a wonderful day!' }
      ],
      connectors: ['and', 'because', 'also', 'for example', 'nice to'],
      readingParagraph: 'Hello everyone! My name is Alex. Today is my first day at school. I see many new friends in the playground. I say hello to my teacher and smile. It is very nice to meet all my friends!',
      chatStarter: "Hello! Today let's talk about Greetings & Self Introduction. What is your favorite thing about it?"
    }
  ],
  4: [
    {
      unitId: 'g4-u1',
      grade: 4,
      unitName: 'Unit 1: My feelings & hometown (Cảm xúc & Quê hương)',
      topicTitle: 'Learning About My feelings & hometown',
      vocab: [
        { word: 'learn', pos: 'v', phonetic: '/lɜːn/', vi: 'học tập', example: 'We learn about my feelings & hometown.' },
        { word: 'happy', pos: 'adj', phonetic: '/ˈhæp.i/', vi: 'vui vẻ', example: 'I am happy to study my feelings & hometown.' },
        { word: 'favorite', pos: 'adj', phonetic: '/ˈfeɪ.vər.ɪt/', vi: 'yêu thích', example: 'This is my favorite topic.' },
        { word: 'together', pos: 'adv', phonetic: '/təˈɡeð.ər/', vi: 'cùng nhau', example: 'We study together every day.' }
      ],
      phrases: [
        'Today we learn about My feelings & hometown.',
        'I really like my feelings & hometown because it is fun.',
        'Can you tell me more about my feelings & hometown?',
        "Let's practice speaking English together!"
      ],
      outline: [
        { step: '1', title: '1. Introduction (Mở đầu / Giới thiệu)', en: 'Hello everyone! Today I want to present about My feelings & hometown.' },
        { step: '2', title: '2. Key Details (Nội dung chính)', en: 'When I study my feelings & hometown, I see many interesting things.' },
        { step: '3', title: '3. Feelings & Reasons (Cảm xúc & Lý do)', en: 'I feel happy because my feelings & hometown brings joy to my learning.' },
        { step: '4', title: '4. Conclusion (Kết bài & Lời chào)', en: 'Thank you for listening to my talk! I have a great day!' }
      ],
      connectors: ['because', 'and', 'also', 'for example', 'together'],
      readingParagraph: 'Today in class, we are learning about my feelings & hometown. All the students are excited to talk and share their thoughts. Practicing English every day makes us feel confident and smart!',
      chatStarter: "Hello! Today let's talk about My feelings & hometown. What is your favorite thing about it?"
    }
  ],
  5: [
    {
      unitId: 'g5-u1',
      grade: 5,
      unitName: 'Unit 1: All about me & friends (Bản thân & Bạn bè)',
      topicTitle: 'Learning About All about me & friends',
      vocab: [
        { word: 'learn', pos: 'v', phonetic: '/lɜːn/', vi: 'học tập', example: 'We learn about all about me & friends.' },
        { word: 'happy', pos: 'adj', phonetic: '/ˈhæp.i/', vi: 'vui vẻ', example: 'I am happy to study all about me & friends.' },
        { word: 'favorite', pos: 'adj', phonetic: '/ˈfeɪ.vər.ɪt/', vi: 'yêu thích', example: 'This is my favorite topic.' },
        { word: 'together', pos: 'adv', phonetic: '/təˈɡeð.ər/', vi: 'cùng nhau', example: 'We study together every day.' }
      ],
      phrases: [
        'Today we learn about All about me & friends.',
        'I really like all about me & friends because it is fun.',
        'Can you tell me more about all about me & friends?',
        "Let's practice speaking English together!"
      ],
      outline: [
        { step: '1', title: '1. Introduction (Mở đầu / Giới thiệu)', en: 'Hello everyone! Today I want to present about All about me & friends.' },
        { step: '2', title: '2. Key Details (Nội dung chính)', en: 'When I study all about me & friends, I see many interesting things.' },
        { step: '3', title: '3. Feelings & Reasons (Cảm xúc & Lý do)', en: 'I feel happy because all about me & friends brings joy to my learning.' },
        { step: '4', title: '4. Conclusion (Kết bài & Lời chào)', en: 'Thank you for listening to my talk! I have a great day!' }
      ],
      connectors: ['because', 'and', 'also', 'for example', 'together'],
      readingParagraph: 'Today in class, we are learning about all about me & friends. All the students are excited to talk and share their thoughts. Practicing English every day makes us feel confident and smart!',
      chatStarter: "Hello! Today let's talk about All about me & friends. What is your favorite thing about it?"
    }
  ]
};

// Generate SGK Units list dynamically for dropdown options
const ALL_UNITS_PER_GRADE: Record<number, { unitId: string; title: string }[]> = {
  1: [
    { unitId: 'g1-u1', title: 'Unit 1: In the school playground (Sân trường)' },
    { unitId: 'g1-u2', title: 'Unit 2: In the dining room (Phòng ăn)' },
    { unitId: 'g1-u3', title: 'Unit 3: At the street market (Chợ đường phố)' },
    { unitId: 'g1-u4', title: 'Unit 4: In the bedroom (Phòng ngủ)' },
    { unitId: 'g1-u5', title: 'Unit 5: At the fish and chip shop (Tiệm ăn nhanh)' },
    { unitId: 'g1-u6', title: 'Unit 6: In the classroom (Phòng học)' },
    { unitId: 'g1-u7', title: 'Unit 7: In the garden (Khu vườn)' },
    { unitId: 'g1-u8', title: 'Unit 8: In the park (Công viên)' },
    { unitId: 'g1-u9', title: 'Unit 9: In the shop (Cửa hàng)' },
    { unitId: 'g1-u10', title: 'Unit 10: At the zoo (Sở thú)' },
    { unitId: 'g1-u11', title: 'Unit 11: At the bus stop (Trạm xe buýt)' },
    { unitId: 'g1-u12', title: 'Unit 12: At the lake (Hồ nước)' },
    { unitId: 'g1-u13', title: 'Unit 13: In the school canteen (Cần tin)' },
    { unitId: 'g1-u14', title: 'Unit 14: In the toy shop (Cửa hàng đồ chơi)' },
    { unitId: 'g1-u15', title: 'Unit 15: At the football match (Trận bóng đá)' },
    { unitId: 'g1-u16', title: 'Unit 16: At home (Ở nhà)' }
  ],
  2: [
    { unitId: 'g2-u1', title: 'Unit 1: At my birthday party (Tiệc sinh nhật)' },
    { unitId: 'g2-u2', title: 'Unit 2: In the backyard (Sân sau)' },
    { unitId: 'g2-u3', title: 'Unit 3: At the seaside (Bãi biển)' },
    { unitId: 'g2-u4', title: 'Unit 4: In the countryside (Nông thôn)' },
    { unitId: 'g2-u5', title: 'Unit 5: In the classroom (Lớp học)' },
    { unitId: 'g2-u6', title: 'Unit 6: On the farm (Trang trại)' },
    { unitId: 'g2-u7', title: 'Unit 7: In the kitchen (Nhà bếp)' },
    { unitId: 'g2-u8', title: 'Unit 8: In the village (Ngôi làng)' },
    { unitId: 'g2-u9', title: 'Unit 9: In the grocery store (Cửa hàng tạp hóa)' },
    { unitId: 'g2-u10', title: 'Unit 10: At the zoo (Sở thú)' },
    { unitId: 'g2-u11', title: 'Unit 11: In the playground (Sân chơi)' },
    { unitId: 'g2-u12', title: 'Unit 12: At the café (Quán cà phê)' },
    { unitId: 'g2-u13', title: 'Unit 13: In the maths class (Giờ học Toán)' },
    { unitId: 'g2-u14', title: 'Unit 14: At home (Ở nhà)' },
    { unitId: 'g2-u15', title: 'Unit 15: In the clothes shop (Cửa hàng quần áo)' },
    { unitId: 'g2-u16', title: 'Unit 16: At the campsite (Khu cắm trại)' }
  ],
  3: [
    { unitId: 'g3-u1', title: 'Unit 1: Hello & Greetings (Chào hỏi)' },
    { unitId: 'g3-u2', title: 'Unit 2: Our names & age (Tên và tuổi)' },
    { unitId: 'g3-u3', title: 'Unit 3: Our friends (Bạn bè)' },
    { unitId: 'g3-u4', title: 'Unit 4: Our bodies (Cơ thể)' },
    { unitId: 'g3-u5', title: 'Unit 5: My hobbies (Sở thích)' },
    { unitId: 'g3-u6', title: 'Unit 6: Our school (Trường học)' },
    { unitId: 'g3-u7', title: 'Unit 7: Classroom instructions (Nội quy)' },
    { unitId: 'g3-u8', title: 'Unit 8: My school things (Đồ dùng học tập)' },
    { unitId: 'g3-u9', title: 'Unit 9: Colours (Màu sắc)' },
    { unitId: 'g3-u10', title: 'Unit 10: Break time activities (Giờ ra chơi)' },
    { unitId: 'g3-u11', title: 'Unit 11: My family (Gia đình)' },
    { unitId: 'g3-u12', title: 'Unit 12: Jobs (Nghề nghiệp)' },
    { unitId: 'g3-u13', title: 'Unit 13: My house (Ngôi nhà)' },
    { unitId: 'g3-u14', title: 'Unit 14: My bedroom (Phòng ngủ)' },
    { unitId: 'g3-u15', title: 'Unit 15: At the dining table (Bữa ăn)' },
    { unitId: 'g3-u16', title: 'Unit 16: Do you have any pets? (Thú cưng)' },
    { unitId: 'g3-u17', title: 'Unit 17: Our toys (Đồ chơi)' },
    { unitId: 'g3-u18', title: 'Unit 18: Playing in the park (Công viên)' },
    { unitId: 'g3-u19', title: 'Unit 19: Outdoor activities (Dã ngoại)' },
    { unitId: 'g3-u20', title: 'Unit 20: At the zoo (Sở thú)' }
  ],
  4: [
    { unitId: 'g4-u1', title: 'Unit 1: My feelings & hometown (Cảm xúc & Quê hương)' },
    { unitId: 'g4-u2', title: 'Unit 2: Time and daily routines (Thời gian & Thói quen)' },
    { unitId: 'g4-u3', title: 'Unit 3: My favourite subjects (Môn học yêu thích)' },
    { unitId: 'g4-u4', title: 'Unit 4: My birthday party (Tiệc sinh nhật)' },
    { unitId: 'g4-u5', title: 'Unit 5: Things we can do (Khả năng & Kỹ năng)' },
    { unitId: 'g4-u6', title: 'Unit 6: Our school facilities (Trường học & Phòng học)' },
    { unitId: 'g4-u7', title: 'Unit 7: Our shopping trip (Đi mua sắm)' },
    { unitId: 'g4-u8', title: 'Unit 8: My favourite food and drink (Đồ ăn thức uống)' },
    { unitId: 'g4-u9', title: 'Unit 9: Our teachers and friends (Thầy cô & Bạn bè)' },
    { unitId: 'g4-u10', title: 'Unit 10: Where were you yesterday? (Vị trí & Quá khứ)' },
    { unitId: 'g4-u11', title: 'Unit 11: My home town (Quê hương của tớ)' },
    { unitId: 'g4-u12', title: 'Unit 12: Jobs in the future (Nghề nghiệp tương lai)' },
    { unitId: 'g4-u13', title: 'Unit 13: Field trip at the farm (Chuyến thăm trang trại)' },
    { unitId: 'g4-u14', title: 'Unit 14: Daily activities (Hoạt động hàng ngày)' },
    { unitId: 'g4-u15', title: 'Unit 15: What\'s the matter with you? (Sức khỏe & Ốm đau)' },
    { unitId: 'g4-u16', title: 'Unit 16: Weather and seasons (Thời tiết & Mùa)' },
    { unitId: 'g4-u17', title: 'Unit 17: In the toy shop (Cửa hàng đồ chơi)' },
    { unitId: 'g4-u18', title: 'Unit 18: At the bakery (Tiệm bánh ngọt)' },
    { unitId: 'g4-u19', title: 'Unit 19: Animal world (Thế giới động vật)' },
    { unitId: 'g4-u20', title: 'Unit 20: Summer holidays (Kỳ nghỉ hè)' }
  ],
  5: [
    { unitId: 'g5-u1', title: 'Unit 1: All about me & friends (Bản thân & Bạn bè)' },
    { unitId: 'g5-u2', title: 'Unit 2: Our homes & addresses (Địa chỉ & Ngôi nhà)' },
    { unitId: 'g5-u3', title: 'Unit 3: My foreign friends (Bạn bè quốc tế & Quốc tịch)' },
    { unitId: 'g5-u4', title: 'Unit 4: Free time activities (Hoạt động thời gian rảnh)' },
    { unitId: 'g5-u5', title: 'Unit 5: Future jobs & dream careers (Ước mơ nghề nghiệp)' },
    { unitId: 'g5-u6', title: 'Unit 6: Our school places (Trường học & Quy tắc)' },
    { unitId: 'g5-u7', title: 'Unit 7: Favourite school subjects (Môn học yêu thích)' },
    { unitId: 'g5-u8', title: 'Unit 8: Classroom things & positions (Đồ dùng & Vị trí)' },
    { unitId: 'g5-u9', title: 'Unit 9: Our last weekend (Cuối tuần qua của em)' },
    { unitId: 'g5-u10', title: 'Unit 10: Where were you yesterday? (Nơi em đã đến)' },
    { unitId: 'g5-u11', title: 'Unit 11: Transport and travelling (Phương tiện & Đi lại)' },
    { unitId: 'g5-u12', title: 'Unit 12: Family & healthy habits (Gia đình & Sức khỏe)' },
    { unitId: 'g5-u13', title: 'Unit 13: Food and drinks we love (Món ăn & Đồ uống)' },
    { unitId: 'g5-u14', title: 'Unit 14: What would you like to be? (Nghề tương lai)' },
    { unitId: 'g5-u15', title: 'Unit 15: What\'s the matter with you? (Chăm sóc sức khỏe)' },
    { unitId: 'g5-u16', title: 'Unit 16: Seasons and weather (Thời tiết & Các mùa)' },
    { unitId: 'g5-u17', title: 'Unit 17: Stories and fairy tales (Truyện cổ tích)' },
    { unitId: 'g5-u18', title: 'Unit 18: Means of transport (Giao thông đô thị)' },
    { unitId: 'g5-u19', title: 'Unit 19: Which place would you like to visit? (Địa điểm du lịch)' },
    { unitId: 'g5-u20', title: 'Unit 20: Summer holidays & plans (Kế hoạch nghỉ hè)' }
  ]
};

export const TopicSpeakingAIView: React.FC<TopicSpeakingAIViewProps> = ({
  user,
  onBack,
  onAddStars,
  onLogout,
  onTriggerNotification
}) => {
  const userStars = (user as any)?.stars ?? 0;

  // Grade & Unit selection
  const [selectedGrade, setSelectedGrade] = useState<number>(3);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('g3-u1');
  const [customTopicInput, setCustomTopicInput] = useState<string>('');

  // Active Topic Data
  const [currentTopic, setCurrentTopic] = useState<TopicData>(CURRICULUM_DATA[3][0]);

  // Audio speech synthesis helper
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Recording State (Khung 5)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedText, setRecordedText] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // AI Evaluation State (Khung 6)
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    fluency: string;
    pronunciation: string;
    feedback: string;
  } | null>(null);

  // Chat Practice State (Khung 7)
  const [chatMessages, setChatMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatRecording, setIsChatRecording] = useState<boolean>(false);
  const chatRecognitionRef = useRef<any>(null);

  // Update current topic when Grade or Unit changes
  useEffect(() => {
    const listForGrade = CURRICULUM_DATA[selectedGrade] || [];
    const found = listForGrade.find((u) => u.unitId === selectedUnitId);

    if (found) {
      setCurrentTopic(found);
    } else {
      // Generate fallback topic data if unit not pre-cached
      const unitObj = (ALL_UNITS_PER_GRADE[selectedGrade] || []).find((u) => u.unitId === selectedUnitId);
      const titleName = unitObj ? unitObj.title : `Unit Topic Grade ${selectedGrade}`;
      const topicName = titleName.replace(/^Unit \d+:\s*/, '');

      const fallbackTopic: TopicData = {
        unitId: selectedUnitId,
        grade: selectedGrade,
        unitName: titleName,
        topicTitle: `Learning About ${topicName}`,
        vocab: [
          { word: 'learn', pos: 'v', phonetic: '/lɜːn/', vi: 'học tập', example: `We learn about ${topicName.toLowerCase()}.` },
          { word: 'happy', pos: 'adj', phonetic: '/ˈhæp.i/', vi: 'vui vẻ', example: `I am happy to study ${topicName.toLowerCase()}.` },
          { word: 'favorite', pos: 'adj', phonetic: '/ˈfeɪ.vər.ɪt/', vi: 'yêu thích', example: 'This is my favorite topic.' },
          { word: 'together', pos: 'adv', phonetic: '/təˈɡeð.ər/', vi: 'cùng nhau', example: 'We study together every day.' }
        ],
        phrases: [
          `Today we learn about ${topicName}.`,
          `I really like ${topicName} because it is fun.`,
          `Can you tell me more about ${topicName}?`,
          "Let's practice speaking English together!"
        ],
        outline: [
          { step: '1', title: '1. Introduction (Mở đầu / Giới thiệu)', en: `Hello everyone! Today I want to present about ${topicName}.` },
          { step: '2', title: '2. Key Details (Nội dung chính)', en: `When I study ${topicName}, I see many interesting things.` },
          { step: '3', title: '3. Feelings & Reasons (Cảm xúc & Lý do)', en: `I feel happy because ${topicName} brings joy to my learning.` },
          { step: '4', title: '4. Conclusion (Kết bài & Lời chào)', en: 'Thank you for listening to my talk! I have a great day!' }
        ],
        connectors: ['because', 'and', 'also', 'for example', 'together'],
        readingParagraph: `Today in class, we are learning about ${topicName}. All the students are excited to talk and share their thoughts. Practicing English every day makes us feel confident and smart!`,
        chatStarter: `Hello! Today let's talk about ${topicName}. What is your favorite thing about it?`
      };
      setCurrentTopic(fallbackTopic);
    }

    setEvaluationResult(null);
    setRecordedText('');
  }, [selectedGrade, selectedUnitId]);

  // Reset Chat messages when topic changes
  useEffect(() => {
    setChatMessages([{ sender: 'ai', text: currentTopic.chatStarter }]);
  }, [currentTopic]);

  // Handle custom topic creation
  const handleCreateCustomTopic = () => {
    audioService.playClickSound();
    if (!customTopicInput.trim()) return;

    const customName = customTopicInput.trim();
    const customData: TopicData = {
      unitId: `custom-${Date.now()}`,
      grade: selectedGrade,
      unitName: `Chủ đề tự chọn: ${customName}`,
      topicTitle: `Exploring ${customName}`,
      vocab: [
        { word: 'explore', pos: 'v', phonetic: '/ɪkˈsplɔːr/', vi: 'khám phá', example: `Let's explore ${customName}!` },
        { word: 'beautiful', pos: 'adj', phonetic: '/ˈbjuː.tɪ.fəl/', vi: 'đẹp đẽ', example: `${customName} is very beautiful.` },
        { word: 'enjoy', pos: 'v', phonetic: '/ɪnˈdʒɔɪ/', vi: 'thích thú', example: `I really enjoy learning about ${customName}.` },
        { word: 'awesome', pos: 'adj', phonetic: '/ˈɔː.səm/', vi: 'tuyệt vời', example: `${customName} is awesome!` }
      ],
      phrases: [
        `Today I want to talk about ${customName}.`,
        `I love ${customName} because it is very interesting.`,
        `My friends and I like ${customName} very much.`,
        `Thank you for listening to my story about ${customName}!`
      ],
      outline: [
        { step: '1', title: '1. Introduction (Mở đầu / Giới thiệu)', en: `Hello everyone! Today I want to share my thoughts on ${customName}.` },
        { step: '2', title: '2. Key Details (Nội dung chính)', en: `There are many cool things to learn about ${customName}.` },
        { step: '3', title: '3. Feelings & Reasons (Cảm xúc & Lý do)', en: `I feel super excited because ${customName} makes me feel happy.` },
        { step: '4', title: '4. Conclusion (Kết bài & Lời chào)', en: 'Thank you for listening! Hope you enjoyed my presentation!' }
      ],
      connectors: ['and', 'because', 'also', 'in my opinion', 'together'],
      readingParagraph: `Welcome to our topic on ${customName}! Today we explore new ideas and vocabulary. Learning about ${customName} with AI Dino is fun and exciting. Let's speak out loud with confidence!`,
      chatStarter: `Hi! That is a great topic: "${customName}". What do you like most about ${customName}?`
    };

    setCurrentTopic(customData);
    setCustomTopicInput('');
  };

  // Toggle Micro for Khung 5
  const toggleRecording = () => {
    audioService.playClickSound();
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn chưa hỗ trợ ghi âm trực tiếp. Hãy sử dụng Chrome hoặc Safari mới nhất nhé!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setRecordedText(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  // AI Grading (Khung 6)
  const handleEvaluateAI = () => {
    audioService.playClickSound();
    setIsEvaluating(true);

    setTimeout(() => {
      setIsEvaluating(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      if (onAddStars) onAddStars(10);

      setEvaluationResult({
        score: 95,
        fluency: 'Trôi chảy, tự nhiên',
        pronunciation: 'Phát âm chuẩn ngữ điệu',
        feedback: 'Bé phát âm rất rõ ràng, đúng trọng âm từ vựng và thể hiện ngữ điệu tự nhiên! Hãy tiếp tục duy trì nhé!'
      });
    }, 1200);
  };

  // Chat message send (Khung 7)
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    audioService.playClickSound();

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let aiResponse = `Awesome! I love how you talk about "${userMsg}". Can you tell me one more detail about it?`;
      setChatMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
      speakText(aiResponse);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#e8f3fe] text-slate-800 font-sans p-3 sm:p-5 select-none space-y-4">
      {/* 0. HEADER TOP BAR */}
      <div className="bg-white rounded-2xl p-4 border border-sky-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 transition cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Mic size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-sky-950">Topic Speaking — Luyện Nói Theo Chủ Đề</h1>
              <span className="px-2 py-0.5 text-xs font-bold bg-sky-100 text-sky-700 rounded-md border border-sky-300">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Xây dựng từ vựng, phát triển dàn ý bài nói chuẩn logic và giao tiếp tự nhiên cùng AI Dino
            </p>
          </div>
        </div>

        {/* Stars badge */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="bg-amber-100/90 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-2xs">
            <span>⭐ Ngôi Sao Tích Lũy:</span>
            <span className="text-amber-700 text-sm">{userStars}</span>
          </div>
        </div>
      </div>

      {/* 3-COLUMN MAIN TOP GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* KHUNG 1: Chọn hoặc Nhập Chủ Đề */}
        <div className="bg-white rounded-2xl border-2 border-sky-300 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sky-900 font-black text-sm">
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">1</span>
              <span>Chọn hoặc Nhập Chủ Đề</span>
            </div>

            {/* CHỌN KHỐI LỚP (LỚP 1 - 5) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 tracking-wider block">
                CHỌN KHỐI LỚP (LỚP 1 - 5):
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((g) => {
                  const isActive = selectedGrade === g;
                  return (
                    <button
                      key={`grade-btn-${g}`}
                      onClick={() => {
                        audioService.playClickSound();
                        setSelectedGrade(g);
                        setSelectedUnitId(`g${g}-u1`);
                      }}
                      className={`py-1.5 text-xs font-black rounded-xl transition cursor-pointer border ${
                        isActive
                          ? 'bg-[#0284c7] text-white border-sky-600 shadow-xs scale-102'
                          : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Lớp {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CHỦ ĐỀ THEO UNIT SGK */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 tracking-wider block">
                CHỦ ĐỀ THEO UNIT SGK:
              </label>
              <div className="relative">
                <select
                  value={selectedUnitId}
                  onChange={(e) => {
                    audioService.playClickSound();
                    setSelectedUnitId(e.target.value);
                  }}
                  className="w-full bg-white border border-sky-300 text-sky-950 font-bold text-xs py-2 px-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 appearance-none cursor-pointer"
                >
                  {(ALL_UNITS_PER_GRADE[selectedGrade] || []).map((u) => (
                    <option key={u.unitId} value={u.unitId}>
                      {u.title}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-2.5 top-2.5 text-sky-600 pointer-events-none" />
              </div>
            </div>

            {/* HOẶC TỰ NHẬP CHỦ ĐỀ */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 tracking-wider block">
                HOẶC TỰ NHẬP CHỦ ĐỀ (ANH / VIỆT):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateCustomTopic();
                  }}
                  placeholder="Ví dụ: Shopping, Thú cưng, Bóng đá..."
                  className="w-full bg-white border border-sky-200 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <Search size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <button
            onClick={handleCreateCustomTopic}
            className="w-full bg-[#0284c7] hover:bg-sky-700 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <Sparkles size={15} />
            <span>AI Tạo Chủ Đề Speaking</span>
          </button>
        </div>

        {/* KHUNG 2: Related Vocabulary */}
        <div className="bg-emerald-50/40 rounded-2xl border-2 border-emerald-400 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-950 font-black text-sm">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
                <span>Related Vocabulary</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300">
                4 Key Words
              </span>
            </div>

            {/* 2x2 Vocabulary Cards Grid */}
            <div className="grid grid-cols-2 gap-2">
              {currentTopic.vocab.map((v, idx) => (
                <div key={`vocab-${idx}`} className="bg-white border border-emerald-200 rounded-xl p-2.5 shadow-2xs space-y-1 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-950">
                      {v.word} <span className="text-[10px] text-slate-500 font-medium">({v.pos})</span>
                    </span>
                    <button
                      onClick={() => speakText(v.word)}
                      className="w-6 h-6 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition shrink-0 cursor-pointer"
                      title="Nghe phát âm"
                    >
                      <Volume2 size={12} />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">{v.phonetic}</p>
                  <p className="text-xs font-bold text-emerald-900">{v.vi}</p>
                  <p className="text-[10px] text-slate-600 italic line-clamp-1">{v.example}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-1 border-t border-emerald-200/60 flex items-center gap-1 text-[11px] font-bold text-emerald-800">
            <span>💡</span>
            <span>Nhấp nút 🔊 để nghe phát âm Voice.</span>
          </div>
        </div>

        {/* KHUNG 3: Sample Phrases */}
        <div className="bg-purple-50/40 rounded-2xl border-2 border-purple-300 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-purple-950 font-black text-sm">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">3</span>
              <span>Sample Phrases</span>
            </div>

            {/* List of sample phrase cards */}
            <div className="space-y-2">
              {currentTopic.phrases.map((phrase, idx) => (
                <div key={`phrase-${idx}`} className="bg-white border border-purple-200 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                  <p className="text-xs font-bold text-purple-950 leading-snug">{phrase}</p>
                  <button
                    onClick={() => speakText(phrase)}
                    className="w-6 h-6 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition shrink-0 cursor-pointer"
                    title="Nghe phát âm"
                  >
                    <Volume2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-1 border-t border-purple-200/60 flex items-start gap-1 text-[11px] font-medium text-purple-900 leading-snug">
            <span>💬</span>
            <span>Các mẫu câu chuẩn bản ngữ giúp bé trả lời tự tin và đặt câu hỏi tự nhiên.</span>
          </div>
        </div>
      </div>

      {/* 3-COLUMN MIDDLE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* KHUNG 4: Speaking Outline (Dàn Ý 4 Phần) - 3 COLS */}
        <div className="lg:col-span-3 bg-sky-50/30 rounded-2xl border-2 border-sky-300 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-950 font-black text-sm">
                <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">4</span>
                <span>Speaking Outline (Dàn Ý 4 Phần)</span>
              </div>
              <span className="text-[9px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded border border-sky-300">
                4 Steps Presentation
              </span>
            </div>

            {/* 4 Steps Outline List */}
            <div className="space-y-2">
              {currentTopic.outline.map((step, idx) => (
                <div key={`step-${idx}`} className="bg-white border border-sky-200 rounded-xl p-2.5 space-y-1 shadow-2xs relative">
                  <p className="text-xs font-black text-sky-900 flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] flex items-center justify-center shrink-0">
                      {step.step}
                    </span>
                    <span>{step.title}</span>
                  </p>
                  <div className="flex items-start justify-between gap-1.5">
                    <p className="text-[11px] text-slate-700 italic font-medium leading-snug">"{step.en}"</p>
                    <button
                      onClick={() => speakText(step.en)}
                      className="w-5 h-5 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shrink-0 transition cursor-pointer mt-0.5"
                    >
                      <Volume2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CONNECTORS */}
            <div className="bg-white border border-sky-200 rounded-xl p-2.5 space-y-1.5">
              <p className="text-[10px] font-black text-sky-900 tracking-wider">
                CONNECTORS (TỪ NỐI GIÚP CÂU DÀI HƠN):
              </p>
              <div className="flex flex-wrap gap-1">
                {currentTopic.connectors.map((c, i) => (
                  <span key={`connector-${i}`} className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded-md border border-sky-300">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-sky-200 flex items-start gap-1 text-[10px] font-bold text-sky-800 leading-tight">
            <span>✍️</span>
            <span>Dùng 4 phần mở - thân - lý do - kết bài trên để phát triển bài nói tự tin hơn.</span>
          </div>
        </div>

        {/* KHUNG 5: PRACTICE & RECORDING PARAGRAPH - 5 COLS */}
        <div className="lg:col-span-5 bg-amber-50/40 rounded-2xl border-2 border-amber-300 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">5</span>
                <span className="truncate max-w-[220px]">{currentTopic.topicTitle}</span>
              </div>
              <button
                onClick={() => speakText(currentTopic.readingParagraph)}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Volume2 size={14} />
                <span>Nghe đọc mẫu</span>
              </button>
            </div>

            {/* Reading Paragraph Card */}
            <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-2xs">
              <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                {currentTopic.readingParagraph}
              </p>
            </div>

            {/* Recording Section */}
            <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-4 text-center space-y-3">
              <p className="text-xs font-bold text-amber-950">Bấm nút micro để thu âm bài đọc của bé</p>

              {/* Big Red Recording Button */}
              <button
                onClick={toggleRecording}
                className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center text-white shadow-md transition cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 animate-pulse ring-4 ring-red-300'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
                title={isRecording ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
              >
                <Mic size={24} />
              </button>

              {/* Live Speech Recognition Box */}
              <div className="bg-white border border-amber-300 rounded-xl p-2.5 min-h-[44px] flex items-center justify-center text-center">
                {recordedText ? (
                  <p className="text-xs font-bold text-slate-800">{recordedText}</p>
                ) : (
                  <p className="text-xs text-slate-400 font-medium italic">
                    Giọng nói nhận diện trực tiếp sẽ xuất hiện tại đây...
                  </p>
                )}
              </div>

              {/* Grading Button */}
              <button
                onClick={handleEvaluateAI}
                disabled={isEvaluating}
                className="w-full bg-[#d97706] hover:bg-amber-700 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={15} />
                <span>{isEvaluating ? 'Đang chấm điểm...' : 'Chấm Điểm & Nhận AI Feedback'}</span>
              </button>

              <p className="text-[10px] font-bold text-amber-800 flex items-center justify-center gap-1">
                <span>⚡</span>
                <span>Hạn mức hôm nay: 2/2 lượt</span>
              </p>
            </div>
          </div>
        </div>

        {/* KHUNG 6: AI Feedback & Scoring - 4 COLS */}
        <div className="lg:col-span-4 bg-pink-50/40 rounded-2xl border-2 border-pink-300 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-pink-950 font-black text-sm">
              <span className="w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs">6</span>
              <span>AI Feedback & Scoring</span>
            </div>

            {/* Inner Display Box */}
            <div className="bg-white border border-pink-200 rounded-2xl p-4 shadow-2xs min-h-[200px] flex flex-col items-center justify-center text-center space-y-3">
              {evaluationResult ? (
                <div className="w-full text-left space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-pink-100 pb-2">
                    <span className="text-xs font-black text-slate-700">Điểm số bài nói:</span>
                    <span className="text-xl font-black text-pink-600">{evaluationResult.score}/100 ⭐</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-slate-800">
                      🎯 Độ trôi chảy: <span className="text-emerald-600 font-semibold">{evaluationResult.fluency}</span>
                    </p>
                    <p className="font-bold text-slate-800">
                      🗣️ Phát âm: <span className="text-sky-600 font-semibold">{evaluationResult.pronunciation}</span>
                    </p>
                  </div>
                  <div className="bg-pink-50 p-2.5 rounded-xl border border-pink-200 text-xs font-medium text-pink-950 leading-relaxed">
                    💡 {evaluationResult.feedback}
                  </div>
                </div>
              ) : (
                <>
                  <Sparkles size={24} className="text-pink-400" />
                  <p className="text-xs font-bold text-pink-900 leading-relaxed max-w-[240px]">
                    Bé hãy thực hành bài đọc ở <span className="text-pink-700 font-black">Khung 5</span> và nhấp <span className="text-amber-700 font-black">"Chấm Điểm AI"</span> để nhận đánh giá chi tiết nhé!
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KHUNG 7: Conversation Practice (Luyện Trực Tiếp Cùng AI Dino) - FULL WIDTH BOTTOM */}
      <div className="bg-cyan-50/50 rounded-2xl border-2 border-cyan-300 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-200 pb-2">
          <div className="flex items-center gap-2 text-cyan-950 font-black text-sm">
            <span className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs">7</span>
            <span>Conversation Practice (Luyện Trực Tiếp Cùng AI Dino)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-cyan-100 text-cyan-800 px-2.5 py-0.5 rounded-md border border-cyan-300">
              Hạn mức chat hôm nay: 15/15 câu
            </span>
            <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md border border-teal-300">
              Interactive Gemini AI Chat
            </span>
          </div>
        </div>

        {/* Chat History Box */}
        <div className="bg-white border border-cyan-200 rounded-2xl p-4 min-h-[90px] max-h-[220px] overflow-y-auto space-y-3 shadow-2xs">
          {chatMessages.map((msg, idx) => (
            <div
              key={`chat-msg-${idx}`}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-sky-400 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-2xs">
                  🦖
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs font-bold leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : 'bg-cyan-100/80 text-cyan-950 rounded-tl-none border border-cyan-200'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Input Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioService.playClickSound();
              const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
              if (!SpeechRecognition) {
                alert('Trình duyệt chưa hỗ trợ ghi âm trực tiếp!');
                return;
              }
              const rec = new SpeechRecognition();
              rec.lang = 'en-US';
              rec.onresult = (e: any) => {
                const text = e.results[0][0].transcript;
                setChatInput(text);
              };
              rec.start();
            }}
            className="bg-[#06b6d4] hover:bg-cyan-600 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-2xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Mic size={15} />
            <span>Thu âm</span>
          </button>

          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendChatMessage();
            }}
            placeholder="Gõ câu trả lời của bé..."
            className="flex-1 bg-white border border-cyan-300 text-xs font-medium py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-2xs"
          />

          <button
            onClick={handleSendChatMessage}
            className="bg-[#0f766e] hover:bg-teal-800 text-white font-black text-xs py-2.5 px-5 rounded-xl shadow-2xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Gửi</span>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
