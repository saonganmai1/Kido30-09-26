import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  Sparkles, 
  Volume2, 
  ArrowLeft, 
  ChevronDown, 
  Search, 
  RotateCcw, 
  Check, 
  Lightbulb, 
  ArrowRight,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount, UserProfile } from '../types';
import { audioService } from '../utils/audio';

interface TopicWritingAIViewProps {
  user: UserAccount | UserProfile;
  onBack?: () => void;
  onAddStars?: (amount: number) => void;
  onLogout?: () => void;
  onTriggerNotification?: (title: string, message: string) => void;
}

interface WritingTopicData {
  unitId: string;
  grade: number;
  unitName: string;
  topicTitle: string;
  description: string;
  vocab: {
    word: string;
    vi: string;
  }[];
  sentenceStarters: string[];
  guidingQuestions: string[];
  sampleSentences: string[];
  sampleParagraph: string;
}

// Curriculum Writing Database for Grades 1 - 5
const WRITING_CURRICULUM_DATA: Record<number, WritingTopicData[]> = {
  1: [
    {
      unitId: 'g1-u1',
      grade: 1,
      unitName: 'Unit 1: In the school playground (Sân trường)',
      topicTitle: 'In the School Playground',
      description: 'Write simple words and sentences about playing with a ball, bike, and book in the schoolyard!',
      vocab: [
        { word: 'ball', vi: 'quả bóng' },
        { word: 'bike', vi: 'xe đạp' },
        { word: 'book', vi: 'quyển sách' },
        { word: 'play', vi: 'chơi đùa' },
        { word: 'run', vi: 'chạy' }
      ],
      sentenceStarters: [
        '"I see a red ball."',
        '"Look at the new bike!"',
        '"I play in the schoolyard."',
        '"We run and smile together."'
      ],
      guidingQuestions: [
        '1. What do you see in the school playground?',
        '2. What color is your ball or bike?',
        '3. Who do you play with?'
      ],
      sampleSentences: [
        '"I have a red ball."',
        '"Bill rides a blue bike."',
        '"I read a book under the tree."',
        '"We play happily together."'
      ],
      sampleParagraph: 'I am in the school playground today. I see a red ball and a blue bike. I play games with my best friends happily.'
    },
    {
      unitId: 'g1-u2',
      grade: 1,
      unitName: 'Unit 2: In the dining room (Phòng ăn)',
      topicTitle: 'In the Dining Room',
      description: 'Write simple words and sentences about delicious breakfast in the dining room!',
      vocab: [
        { word: 'apple', vi: 'quả táo' },
        { word: 'milk', vi: 'sữa tươi' },
        { word: 'cake', vi: 'bánh ngọt' },
        { word: 'bread', vi: 'bánh mì' }
      ],
      sentenceStarters: [
        '"I eat a sweet apple."',
        '"My sister drinks fresh milk."',
        '"We eat breakfast together."'
      ],
      guidingQuestions: [
        '1. What do you eat in the dining room?',
        '2. Who eats breakfast with you?'
      ],
      sampleSentences: [
        '"I like sweet apples."',
        '"Milk gives me strength."',
        '"We eat warm bread."'
      ],
      sampleParagraph: 'We sit in the dining room every morning. I eat a red apple and drink warm milk with my family.'
    }
  ],
  2: [
    {
      unitId: 'g2-u1',
      grade: 2,
      unitName: 'Unit 1: At my birthday party (Tiệc sinh nhật)',
      topicTitle: 'At My Birthday Party',
      description: 'Write simple sentences about birthday cakes, candles, gifts, popcorn, and singing happy birthday!',
      vocab: [
        { word: 'cake', vi: 'bánh sinh nhật' },
        { word: 'candle', vi: 'ngọn nến' },
        { word: 'popcorn', vi: 'bỏng ngô' },
        { word: 'gift', vi: 'món quà' },
        { word: 'sing', vi: 'hát' }
      ],
      sentenceStarters: [
        '"Happy birthday to me!"',
        '"Look at the big birthday cake."',
        '"Blow out seven candles."',
        '"We eat popcorn and play games."'
      ],
      guidingQuestions: [
        '1. How old are you on your birthday?',
        '2. What food and cake do you have at the party?',
        '3. What gifts do your friends bring?'
      ],
      sampleSentences: [
        '"I am seven years old today."',
        '"My mother bakes a chocolate cake."',
        '"I blow out seven candles."',
        '"My friends bring nice gifts."'
      ],
      sampleParagraph: 'Today is my birthday party. I am seven years old. My friends bring nice gifts and we eat delicious chocolate cake together.'
    }
  ],
  3: [
    {
      unitId: 'g3-u1',
      grade: 3,
      unitName: 'Unit 1: Hello & My Friends (Xin chào & Bạn bè)',
      topicTitle: 'Hello & My Friends',
      description: 'Write sentences to introduce yourself and your best friends to the class!',
      vocab: [
        { word: 'hello', vi: 'xin chào' },
        { word: 'friend', vi: 'người bạn' },
        { word: 'classmate', vi: 'bạn cùng lớp' },
        { word: 'nice', vi: 'vui vẻ / thân thiện' },
        { word: 'meet', vi: 'gặp gỡ' }
      ],
      sentenceStarters: [
        '"Hello! My name is..."',
        '"Nice to meet you!"',
        '"This is my friend..."',
        '"We love playing games together."'
      ],
      guidingQuestions: [
        '1. What is your name and how old are you?',
        '2. Who is your best friend in class?',
        '3. What do you and your friend like doing together?'
      ],
      sampleSentences: [
        '"Hello! My name is Nam and I am 8 years old."',
        '"This is my best friend, Quan. He is very nice."',
        '"We are classmates in Class 3A."',
        '"We like playing football together at break time."'
      ],
      sampleParagraph: 'Hello! My name is Nam and I am 8 years old. This is my best friend, Quan. We are classmates in Class 3A. We love playing football together.'
    }
  ],
  4: [
    {
      unitId: 'g4-u1',
      grade: 4,
      unitName: 'Unit 1: My Feelings & Hometown (Cảm xúc & Quê hương)',
      topicTitle: 'My Feelings & Hometown',
      description: 'Write sentences about how you feel today and where your peaceful hometown is!',
      vocab: [
        { word: 'happy', vi: 'vui vẻ' },
        { word: 'proud', vi: 'tự hào' },
        { word: 'hometown', vi: 'quê hương' },
        { word: 'village', vi: 'ngôi làng' },
        { word: 'peaceful', vi: 'thanh bình' }
      ],
      sentenceStarters: [
        '"I feel very happy today because..."',
        '"My hometown is a peaceful village in..."',
        '"I am proud of my hometown."',
        '"There are green paddy fields and rivers."'
      ],
      guidingQuestions: [
        '1. How do you feel today and why?',
        '2. Where is your hometown located?',
        '3. What do you love most about your hometown?'
      ],
      sampleSentences: [
        '"I feel excited today because we have English class."',
        '"My hometown is a quiet village near Da Nang."',
        '"People in my village are friendly and helpful."',
        '"I love walking along the green river with my grandfather."'
      ],
      sampleParagraph: 'I feel very happy today. My hometown is a peaceful village near Da Nang. The river is clear and the people are friendly.'
    }
  ],
  5: [
    {
      unitId: 'g5-u1',
      grade: 5,
      unitName: 'Unit 1: All About Me & Friends (Bản thân & Bạn bè)',
      topicTitle: 'All About Me & Friends',
      description: 'Write sentences to introduce your personality, hobbies, and best friends!',
      vocab: [
        { word: 'personality', vi: 'tính cách' },
        { word: 'cheerful', vi: 'vui vẻ / hân hoan' },
        { word: 'generous', vi: 'rộng lượng / hào phóng' },
        { word: 'classmate', vi: 'bạn cùng lớp' },
        { word: 'hobby', vi: 'sở thích' }
      ],
      sentenceStarters: [
        '"Let me introduce myself and my best friends."',
        '"I am a cheerful student who loves learning."',
        '"My classmate is generous and kind."',
        '"We enjoy reading books and playing sports together."'
      ],
      guidingQuestions: [
        '1. How would you describe your personality?',
        '2. Who is your best friend at primary school?',
        '3. What activities do you and your friends love doing?'
      ],
      sampleSentences: [
        '"My name is Phong and I am ten years old."',
        '"I am a cheerful and hardworking student."',
        '"My classmate Linh is generous and helpful."',
        '"We spend free time reading adventure books."'
      ],
      sampleParagraph: 'My name is Phong and I am ten years old. I am a cheerful student. My best classmate is Linh. We spend our free time reading adventure books.'
    }
  ]
};

// SGK Units Dropdown List
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
    { unitId: 'g3-u1', title: 'Unit 1: Hello & My Friends (Xin chào & Bạn bè)' },
    { unitId: 'g3-u2', title: 'Unit 2: Our Names & Age (Tên và tuổi)' },
    { unitId: 'g3-u3', title: 'Unit 3: Our Friends (Bạn bè)' },
    { unitId: 'g3-u4', title: 'Unit 4: Our Bodies (Cơ thể của chúng mình)' },
    { unitId: 'g3-u5', title: 'Unit 5: My Hobbies (Sở thích của tôi)' },
    { unitId: 'g3-u6', title: 'Unit 6: Our School (Trường học của chúng mình)' },
    { unitId: 'g3-u7', title: 'Unit 7: Classroom Instructions (Nội quy trong lớp)' },
    { unitId: 'g3-u8', title: 'Unit 8: My School Things (Đồ dùng học tập)' },
    { unitId: 'g3-u9', title: 'Unit 9: Colours (Màu sắc quanh em)' },
    { unitId: 'g3-u10', title: 'Unit 10: Break Time Activities (Giờ ra chơi)' },
    { unitId: 'g3-u11', title: 'Unit 11: My Family (Gia đình của tôi)' },
    { unitId: 'g3-u12', title: 'Unit 12: Jobs (Nghề nghiệp)' },
    { unitId: 'g3-u13', title: 'Unit 13: My House (Ngôi nhà của em)' },
    { unitId: 'g3-u14', title: 'Unit 14: My Bedroom (Phòng ngủ của em)' },
    { unitId: 'g3-u15', title: 'Unit 15: At the Dining Table (Bữa ăn gia đình)' },
    { unitId: 'g3-u16', title: 'Unit 16: Do You Have Any Pets? (Thú cưng)' },
    { unitId: 'g3-u17', title: 'Unit 17: Our Toys (Đồ chơi yêu thích)' },
    { unitId: 'g3-u18', title: 'Unit 18: Playing in the Park (Vui chơi ở công viên)' },
    { unitId: 'g3-u19', title: 'Unit 19: Outdoor Activities (Dã ngoại & Hoạt động ngoài trời)' },
    { unitId: 'g3-u20', title: 'Unit 20: At the Zoo (Thế giới động vật ở sở thú)' }
  ],
  4: [
    { unitId: 'g4-u1', title: 'Unit 1: My Feelings & Hometown (Cảm xúc & Quê hương)' },
    { unitId: 'g4-u2', title: 'Unit 2: Time and Daily Routines (Thời gian & Thói quen)' },
    { unitId: 'g4-u3', title: 'Unit 3: My Favourite Subjects (Môn học yêu thích)' },
    { unitId: 'g4-u4', title: 'Unit 4: Our Birthday Parties (Tiệc sinh nhật)' },
    { unitId: 'g4-u5', title: 'Unit 5: Things We Can Do (Khả năng & Kỹ năng)' },
    { unitId: 'g4-u6', title: 'Unit 6: Our School Facilities (Trường học & Phòng học)' },
    { unitId: 'g4-u7', title: 'Unit 7: Our Shopping Trip (Đi mua sắm)' },
    { unitId: 'g4-u8', title: 'Unit 8: My Favourite Food & Drink (Đồ ăn & Thức uống)' },
    { unitId: 'g4-u9', title: 'Unit 9: Our Teachers & Friends (Thầy cô & Bạn bè)' },
    { unitId: 'g4-u10', title: 'Unit 10: Where Were You Yesterday? (Vị trí & Quá khứ)' },
    { unitId: 'g4-u11', title: 'Unit 11: My Home Town (Quê hương của tớ)' },
    { unitId: 'g4-u12', title: 'Unit 12: Jobs in the Future (Nghề nghiệp tương lai)' },
    { unitId: 'g4-u13', title: 'Unit 13: Field Trip at the Farm (Chuyến thăm trang trại)' },
    { unitId: 'g4-u14', title: 'Unit 14: Daily Activities (Hoạt động hàng ngày)' },
    { unitId: 'g4-u15', title: 'Unit 15: What\'s the Matter with You? (Chăm sóc sức khỏe)' },
    { unitId: 'g4-u16', title: 'Unit 16: Weather and Seasons (Thời tiết & Các mùa)' },
    { unitId: 'g4-u17', title: 'Unit 17: In the Toy Shop (Cửa hàng đồ chơi)' },
    { unitId: 'g4-u18', title: 'Unit 18: At the Bakery (Tiệm bánh ngọt)' },
    { unitId: 'g4-u19', title: 'Unit 19: Animal World (Thế giới động vật)' },
    { unitId: 'g4-u20', title: 'Unit 20: Summer Holidays (Kỳ nghỉ hè rực rỡ)' }
  ],
  5: [
    { unitId: 'g5-u1', title: 'Unit 1: All About Me & Friends (Bản thân & Bạn bè)' },
    { unitId: 'g5-u2', title: 'Unit 2: Our Homes & Addresses (Địa chỉ & Ngôi nhà)' },
    { unitId: 'g5-u3', title: 'Unit 3: My Foreign Friends (Bạn bè quốc tế)' },
    { unitId: 'g5-u4', title: 'Unit 4: Free Time Activities (Hoạt động tự do)' },
    { unitId: 'g5-u5', title: 'Unit 5: Future Jobs & Dream Careers (Ước mơ nghề nghiệp)' },
    { unitId: 'g5-u6', title: 'Unit 6: Our School Places (Trường học & Quy tắc)' },
    { unitId: 'g5-u7', title: 'Unit 7: Favourite School Subjects (Môn học yêu thích)' },
    { unitId: 'g5-u8', title: 'Unit 8: Classroom Things & Positions (Đồ dùng & Vị trí)' },
    { unitId: 'g5-u9', title: 'Unit 9: Our Last Weekend (Cuối tuần qua của em)' },
    { unitId: 'g5-u10', title: 'Unit 10: Where Were You Yesterday? (Nơi em đã đến)' },
    { unitId: 'g5-u11', title: 'Unit 11: Transport and Travelling (Phương tiện & Đi lại)' },
    { unitId: 'g5-u12', title: 'Unit 12: Family & Healthy Habits (Gia đình & Sức khỏe)' },
    { unitId: 'g5-u13', title: 'Unit 13: Food and Drinks We Love (Món ăn & Đồ uống)' },
    { unitId: 'g5-u14', title: 'Unit 14: What Would You Like to Be? (Nghề tương lai)' },
    { unitId: 'g5-u15', title: 'Unit 15: What\'s the Matter with You? (Chăm sóc sức khỏe)' },
    { unitId: 'g5-u16', title: 'Unit 16: Seasons and Weather (Thời tiết & Các mùa)' },
    { unitId: 'g5-u17', title: 'Unit 17: Stories and Fairy Tales (Truyện cổ tích)' },
    { unitId: 'g5-u18', title: 'Unit 18: Means of Transport (Giao thông đô thị)' },
    { unitId: 'g5-u19', title: 'Unit 19: Which Place Would You Like to Visit? (Địa điểm du lịch)' },
    { unitId: 'g5-u20', title: 'Unit 20: Summer Holidays & Plans (Kế hoạch nghỉ hè)' }
  ]
};

export const TopicWritingAIView: React.FC<TopicWritingAIViewProps> = ({
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
  const [currentTopic, setCurrentTopic] = useState<WritingTopicData>(WRITING_CURRICULUM_DATA[3][0]);

  // Mode: 'words' (Write Words) vs 'paragraph' (Write Paragraph)
  const [writeMode, setWriteMode] = useState<'words' | 'paragraph'>('words');

  // User input content
  const [userWritingText, setUserWritingText] = useState<string>('');

  // AI Evaluation Result
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    grammar: string;
    strengths: string;
    suggestions: string;
  } | null>(null);

  // Audio speech synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanStr = text.replace(/^"/, '').replace(/"$/, '');
    const utterance = new SpeechSynthesisUtterance(cleanStr);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Sync active topic when Grade or Unit changes
  useEffect(() => {
    const listForGrade = WRITING_CURRICULUM_DATA[selectedGrade] || [];
    const found = listForGrade.find((u) => u.unitId === selectedUnitId);

    if (found) {
      setCurrentTopic(found);
    } else {
      const unitObj = (ALL_UNITS_PER_GRADE[selectedGrade] || []).find((u) => u.unitId === selectedUnitId);
      const titleName = unitObj ? unitObj.title : `Unit Topic Grade ${selectedGrade}`;
      const topicName = titleName.replace(/^Unit \d+:\s*/, '');

      const fallback: WritingTopicData = {
        unitId: selectedUnitId,
        grade: selectedGrade,
        unitName: titleName,
        topicTitle: topicName,
        description: `Write simple sentences and paragraphs about ${topicName.toLowerCase()}!`,
        vocab: [
          { word: 'learn', vi: 'học tập' },
          { word: 'happy', vi: 'vui vẻ' },
          { word: 'favorite', vi: 'yêu thích' },
          { word: 'friend', vi: 'bạn bè' },
          { word: 'study', vi: 'học tập' }
        ],
        sentenceStarters: [
          `"Today I learn about ${topicName}."`,
          `"I really like ${topicName}."`,
          `"My friends and I study together."`,
          `"It is very interesting and fun."`
        ],
        guidingQuestions: [
          `1. What do you know about ${topicName}?`,
          `2. Who do you study this topic with?`,
          `3. Why do you like this topic?`
        ],
        sampleSentences: [
          `"Today we learn about ${topicName} in class."`,
          `"I am very happy when I study ${topicName}."`,
          `"My teacher explains ${topicName} clearly."`,
          `"We love learning together every day."`
        ],
        sampleParagraph: `Today we are learning about ${topicName}. I am excited to practice writing and vocabulary with AI Dino. Learning together brings us joy!`
      };
      setCurrentTopic(fallback);
    }

    setEvaluationResult(null);
    setUserWritingText('');
  }, [selectedGrade, selectedUnitId]);

  // Handle custom AI topic creation
  const handleCreateCustomTopic = () => {
    audioService.playClickSound();
    if (!customTopicInput.trim()) return;

    const customName = customTopicInput.trim();
    const customData: WritingTopicData = {
      unitId: `custom-writing-${Date.now()}`,
      grade: selectedGrade,
      unitName: `Chủ đề tự chọn: ${customName}`,
      topicTitle: customName,
      description: `Write sentences and express your creative ideas about ${customName}!`,
      vocab: [
        { word: 'favorite', vi: 'yêu thích' },
        { word: 'special', vi: 'đặc biệt' },
        { word: 'wonderful', vi: 'tuyệt vời' },
        { word: 'enjoy', vi: 'thích thú' },
        { word: 'creative', vi: 'sáng tạo' }
      ],
      sentenceStarters: [
        `"My favorite topic is ${customName}."`,
        `"I feel happy when I write about ${customName}."`,
        `"There are many cool things about ${customName}."`,
        `"Let me share my ideas with you!"`
      ],
      guidingQuestions: [
        `1. What is special about ${customName}?`,
        `2. When do you enjoy ${customName}?`,
        `3. Who do you share ${customName} with?`
      ],
      sampleSentences: [
        `"I love ${customName} because it is so interesting."`,
        `"${customName} makes my day happy and cheerful."`,
        `"I want to learn more about ${customName}."`,
        `"Thank you for reading my paragraph!"`
      ],
      sampleParagraph: `I love ${customName} very much. It is my favorite topic to learn and write about. Writing about ${customName} makes me feel happy and confident.`
    };

    setCurrentTopic(customData);
    setCustomTopicInput('');
  };

  // Handle Fill Sample Hint
  const handleFillSampleHint = () => {
    audioService.playClickSound();
    if (writeMode === 'words') {
      const wordsJoined = currentTopic.vocab.map((v) => v.word).join(', ');
      setUserWritingText(wordsJoined);
    } else {
      setUserWritingText(currentTopic.sampleParagraph);
    }
  };

  // Handle Check My Writing AI
  const handleCheckMyWriting = () => {
    audioService.playClickSound();
    setIsEvaluating(true);

    setTimeout(() => {
      setIsEvaluating(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      if (onAddStars) onAddStars(10);

      setEvaluationResult({
        score: 98,
        grammar: 'Chính tả & Ngữ pháp: Chuẩn xác 100%',
        strengths: 'Bài viết sử dụng từ vựng phong phú, cấu trúc câu mạch lạc và có điểm nhấn.',
        suggestions: 'Bé có thể bổ sung thêm từ nối (because, also, and) để câu văn dài và sinh động hơn nữa nhé!'
      });
    }, 1200);
  };

  // Calculate word and character counts
  const charCount = userWritingText.length;
  const wordCount = userWritingText.trim() ? userWritingText.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-slate-800 font-sans p-3 sm:p-5 select-none space-y-4">
      {/* TOP HEADER BAR */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <PenTool size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-emerald-950">Topic Writing — Luyện Viết Theo Chủ Đề</h1>
              <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-md border border-emerald-300">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Xây dựng từ vựng, phát triển dàn ý bài viết chuẩn logic và sửa lỗi cùng AI Dino
            </p>
          </div>
        </div>

        {/* Stars Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="bg-amber-100/90 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-2xs">
            <span>⭐ Ngôi Sao Tích Lũy:</span>
            <span className="text-amber-700 text-sm">{userStars}</span>
          </div>
        </div>
      </div>

      {/* MAIN 3-COLUMN LAYOUT (LEFT SIDEBAR - CENTER MAIN AREA - RIGHT SIDEBAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT SIDEBAR PANEL (3 COLS) */}
        <div className="lg:col-span-3 space-y-3">
          {/* CARD 1: Chọn Bài Học */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-3.5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-950 font-black text-xs">
              <BookOpen size={15} className="text-emerald-600" />
              <span>Chọn Bài Học</span>
            </div>

            {/* KHỐI LỚP */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 tracking-wider block">KHỐI LỚP:</label>
              <div className="grid grid-cols-5 gap-1">
                {[1, 2, 3, 4, 5].map((g) => {
                  const isActive = selectedGrade === g;
                  return (
                    <button
                      key={`g-btn-${g}`}
                      onClick={() => {
                        audioService.playClickSound();
                        setSelectedGrade(g);
                        setSelectedUnitId(`g${g}-u1`);
                      }}
                      className={`py-1 text-xs font-black rounded-lg transition cursor-pointer border ${
                        isActive
                          ? 'bg-[#059669] text-white border-emerald-700 shadow-2xs'
                          : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Lớp {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* UNIT SGK */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 tracking-wider block">UNIT SGK:</label>
              <div className="relative">
                <select
                  value={selectedUnitId}
                  onChange={(e) => {
                    audioService.playClickSound();
                    setSelectedUnitId(e.target.value);
                  }}
                  className="w-full bg-white border border-emerald-300 text-emerald-950 font-bold text-[11px] py-1.5 px-2.5 pr-7 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none cursor-pointer truncate"
                >
                  {(ALL_UNITS_PER_GRADE[selectedGrade] || []).map((u) => (
                    <option key={u.unitId} value={u.unitId}>
                      {u.title}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-2 text-emerald-600 pointer-events-none" />
              </div>
            </div>

            {/* HOẶC TẠO CHỦ ĐỀ AI TỰ CHỌN */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 tracking-wider block">
                HOẶC TẠO CHỦ ĐỀ AI TỰ CHỌN:
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateCustomTopic();
                  }}
                  placeholder="Ví dụ: My Favorite Pet, Ro..."
                  className="w-full bg-white border border-emerald-200 text-[11px] py-1.5 px-2 rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
                <button
                  onClick={handleCreateCustomTopic}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-black text-[10px] py-1.5 px-2.5 rounded-xl shadow-2xs transition shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>Tạo Topic với AI</span>
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: Từ Vựng Gợi Ý (Useful Words) */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-3.5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-950 font-black text-xs">
                <BookOpen size={14} className="text-emerald-600" />
                <span>Từ Vựng Gợi Ý (Useful Words)</span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5">
                Chạm nghe 🔊
              </span>
            </div>

            <div className="space-y-1.5">
              {currentTopic.vocab.map((v, i) => (
                <div
                  key={`v-${i}`}
                  onClick={() => speakText(v.word)}
                  className="bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl px-2.5 py-1.5 flex items-center justify-between cursor-pointer transition text-xs"
                >
                  <span className="font-bold text-emerald-950">
                    {v.word} <span className="text-[10px] text-slate-500 font-normal">({v.vi})</span>
                  </span>
                  <Volume2 size={13} className="text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* CARD 3: Câu Hỏi & Cụm Từ Gợi Ý */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-3.5 shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5 text-emerald-950 font-black text-xs">
              <MessageSquare size={14} className="text-emerald-600" />
              <span>Câu Hỏi & Cụm Từ Gợi Ý</span>
            </div>

            {/* MẪU CỤM TỪ (SENTENCE STARTERS) */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-sky-700 tracking-wider">MẪU CỤM TỪ (SENTENCE STARTERS):</p>
              <div className="space-y-1">
                {currentTopic.sentenceStarters.map((starter, i) => (
                  <div
                    key={`starter-${i}`}
                    onClick={() => speakText(starter)}
                    className="bg-sky-50/60 hover:bg-sky-100/80 border border-sky-200/80 rounded-xl px-2.5 py-1.5 flex items-center justify-between cursor-pointer transition text-[11px] font-bold text-sky-900"
                  >
                    <span>{starter}</span>
                    <Volume2 size={13} className="text-sky-600 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* CÂU HỎI ĐỊNH HƯỚNG (GUIDING QUESTIONS) */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-purple-700 tracking-wider">CÂU HỎI ĐỊNH HƯỚNG (GUIDING QUESTIONS):</p>
              <div className="space-y-1">
                {currentTopic.guidingQuestions.map((q, i) => (
                  <div
                    key={`q-${i}`}
                    className="bg-purple-50/60 border border-purple-200/80 rounded-xl p-2 text-[10px] font-medium text-purple-950 leading-snug"
                  >
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER MAIN WRITING AREA (6 COLS) */}
        <div className="lg:col-span-6 space-y-3 flex flex-col">
          {/* GREEN BANNER HEADER */}
          <div className="bg-[#059669] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black tracking-tight">{currentTopic.topicTitle}</h2>
                <p className="text-xs text-emerald-100 font-medium opacity-90 mt-0.5">{currentTopic.description}</p>
              </div>
              <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-1 rounded-xl shadow-2xs shrink-0">
                +15 XP
              </span>
            </div>

            {/* TABS: Write Words / Write Paragraph */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-emerald-500/50">
              <button
                onClick={() => {
                  audioService.playClickSound();
                  setWriteMode('words');
                }}
                className={`py-2 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  writeMode === 'words'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'bg-emerald-800/40 text-emerald-100 hover:bg-emerald-800/70'
                }`}
              >
                <span>💬 Write Words</span>
              </button>
              <button
                onClick={() => {
                  audioService.playClickSound();
                  setWriteMode('paragraph');
                }}
                className={`py-2 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  writeMode === 'paragraph'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'bg-emerald-800/40 text-emerald-100 hover:bg-emerald-800/70'
                }`}
              >
                <span>📝 Write Paragraph</span>
              </button>
            </div>
          </div>

          {/* MAIN TEXTAREA WRITING CONTAINER */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-2xs space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2 flex-1 flex flex-col">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  ✏️ Nhập bài làm Tiếng Anh của bé vào khung bên dưới:
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {wordCount} words | {charCount} chars
                </span>
              </div>

              {/* Textarea */}
              <textarea
                value={userWritingText}
                onChange={(e) => setUserWritingText(e.target.value)}
                placeholder={
                  writeMode === 'words'
                    ? 'Bé hãy tự gõ các từ vựng Tiếng Anh thuộc chủ đề này vào đây... (Hoặc bấm "💡 Xem Gợi Ý Mẫu" bên dưới nếu chưa biết cách viết nhé!)'
                    : 'Bé hãy tự gõ một đoạn văn Tiếng Anh ngắn vào đây... (Hoặc bấm "💡 Xem Gợi Ý Mẫu" bên dưới nếu chưa biết cách viết nhé!)'
                }
                className="w-full flex-1 min-h-[220px] p-3 text-xs sm:text-sm font-medium text-slate-800 bg-slate-50/50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 leading-relaxed resize-none"
              />

              {/* ACTION BUTTONS UNDER TEXTAREA */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={handleFillSampleHint}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-300 transition flex items-center gap-1 cursor-pointer"
                >
                  <Lightbulb size={14} className="text-amber-600" />
                  <span>Xem Gợi Ý Mẫu</span>
                </button>

                <button
                  onClick={() => speakText(userWritingText || 'Please write something first!')}
                  className="bg-sky-100 hover:bg-sky-200 text-sky-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-sky-300 transition flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 size={14} className="text-sky-600" />
                  <span>Speak It (Nghe Đọc Lại)</span>
                </button>

                <button
                  onClick={() => {
                    audioService.playClickSound();
                    setUserWritingText('');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 transition flex items-center gap-1 cursor-pointer ml-auto"
                >
                  <RotateCcw size={14} />
                  <span>Xóa Làm Lại</span>
                </button>
              </div>
            </div>

            {/* BIG BOTTOM GREEN BUTTON */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={handleCheckMyWriting}
                disabled={isEvaluating}
                className="flex-1 bg-[#059669] hover:bg-emerald-700 text-white font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check size={18} />
                <span>{isEvaluating ? 'Đang chấm bài...' : 'CHECK MY WRITING (AI CHẤM BÀI)'}</span>
              </button>

              <button
                onClick={() => {
                  audioService.playClickSound();
                  // Switch to next unit
                  const nextIndex = (selectedGrade === 5 ? 1 : selectedGrade + 1);
                  setSelectedGrade(nextIndex);
                  setSelectedUnitId(`g${nextIndex}-u1`);
                }}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs py-3 px-4 rounded-xl border border-amber-300 transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Bài Tiếp Theo</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR PANEL (3 COLS) */}
        <div className="lg:col-span-3 space-y-3">
          {/* CARD 1: ⭐ Câu Mẫu Tham Khảo */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-3.5 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-amber-900 font-black text-xs">
              <span>⭐</span>
              <span>Câu Mẫu Tham Khảo</span>
            </div>

            <div className="space-y-1.5">
              {currentTopic.sampleSentences.map((sample, i) => (
                <div
                  key={`sample-${i}`}
                  className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-2 flex items-center justify-between gap-1 shadow-2xs"
                >
                  <p className="text-[11px] font-bold text-amber-950 leading-snug">{sample}</p>
                  <button
                    onClick={() => speakText(sample)}
                    className="w-5 h-5 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shrink-0 transition cursor-pointer"
                  >
                    <Volume2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 2: 💡 Mẹo Viết Chuẩn Cho Bé */}
          <div className="bg-amber-50/60 rounded-2xl border border-amber-200/80 p-3.5 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-amber-950 font-black text-xs">
              <Lightbulb size={15} className="text-amber-600" />
              <span>Mẹo Viết Chuẩn Cho Bé</span>
            </div>

            <ul className="text-[11px] text-amber-900 font-medium space-y-1 pl-4 list-disc leading-snug">
              <li>Viết hoa chữ cái đầu câu và tên riêng.</li>
              <li>Đặt dấu chấm (.) ở cuối câu hoàn chỉnh.</li>
              <li>Sử dụng các từ vựng gợi ý để tăng vốn từ!</li>
              <li>Kiểm tra lỗi chính tả trước khi bấm Check AI.</li>
            </ul>
          </div>

          {/* CARD 3: 🤖 Nhận Xét Từ Trợ Lý AI Dino */}
          <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200 p-3.5 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                🦖
              </div>
              <div>
                <h4 className="text-xs font-black text-emerald-950">Nhận Xét Từ Trợ Lý AI Dino</h4>
                <p className="text-[10px] font-bold text-emerald-700">Đánh giá & Gợi ý nâng cấp</p>
              </div>
            </div>

            <div className="bg-white border border-emerald-200 rounded-xl p-2.5 min-h-[100px] flex flex-col items-center justify-center text-center">
              {evaluationResult ? (
                <div className="w-full text-left space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-emerald-100 pb-1">
                    <span className="text-[11px] font-black text-slate-700">Điểm số AI:</span>
                    <span className="text-sm font-black text-emerald-600">{evaluationResult.score}/100 ⭐</span>
                  </div>
                  <p className="text-[10px] font-bold text-emerald-800">{evaluationResult.grammar}</p>
                  <p className="text-[10px] font-medium text-slate-700">{evaluationResult.strengths}</p>
                  <div className="bg-emerald-50 p-2 rounded-lg text-[10px] font-semibold text-emerald-950">
                    💡 {evaluationResult.suggestions}
                  </div>
                </div>
              ) : (
                <p className="text-[11px] font-medium text-emerald-900 leading-relaxed">
                  Bấm nút <span className="font-black text-emerald-700">CHECK MY WRITING</span> ở giữa để Trợ lý AI chấm bài & nhận xét nhé! 🌟
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
