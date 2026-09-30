import React, { useState, useEffect, useMemo } from 'react';
import {
  Volume2,
  BookOpen,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  Star,
  Trophy,
  Flame,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  Gift,
  Clock,
  Play,
  Pause,
  Volume1,
  SkipBack,
  SkipForward,
  Smile,
  Award,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';
import { audioService } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

interface ReadingComprehensionViewProps {
  user?: UserProfile;
  onAddStars?: (count: number) => void;
  onBack?: () => void;
  onLogout?: () => void;
  setActiveTab?: (tab: string) => void;
}

export interface ReadingUnit {
  id: string;
  unitNumber: number;
  grade: number;
  titleEn: string;
  titleVi: string;
  difficulty: string;
  icon: string;
  sentences: {
    en: string;
    vi: string;
  }[];
  question: {
    textEn: string;
    textVi?: string;
    options: { text: string; isCorrect: boolean }[];
  };
}

const READING_UNITS: ReadingUnit[] = [
  // --- GRADE 1 UNITS (16 units) ---
  {
    id: 'u1',
    unitNumber: 1,
    grade: 1,
    titleEn: 'Fun in the Playground',
    titleVi: 'Vui chơi trong sân trường',
    difficulty: 'GRADE 1 • DỄ',
    icon: '🎡',
    sentences: [
      { en: 'Hello! 🖐️ I am Bill.', vi: 'Xin chào! 🖐️ Tớ là Bill.' },
      { en: 'I have a big ball 🌎 in the school playground.', vi: 'Tớ có một quả bóng lớn 🌎 ở sân trường.' },
      { en: 'My blue bike 🚲 is under the tree.', vi: 'Chiếc xe đạp màu xanh dương 🚲 của tớ ở dưới cây.' },
      { en: 'I open my English book 📖 to learn.', vi: 'Tớ mở sách tiếng Anh 📖 ra để học.' },
      { en: 'Good job! 🏃 Do you have a bike? 🚲', vi: 'Giỏi lắm! 🏃 Bạn có xe đạp không? 🚲' },
    ],
    question: {
      textEn: 'What color is the bike?',
      options: [
        { text: 'Red (Đỏ)', isCorrect: false },
        { text: 'Blue (Xanh dương)', isCorrect: true },
        { text: 'Yellow (Vàng)', isCorrect: false },
      ],
    },
  },
  {
    id: 'u2',
    unitNumber: 2,
    grade: 1,
    titleEn: 'In the Dining Room',
    titleVi: 'Trong phòng ăn',
    difficulty: 'GRADE 1 • DỄ',
    icon: '🍽️',
    sentences: [
      { en: 'I am in the dining room. 🍽️', vi: 'Tớ đang ở trong phòng ăn. 🍽️' },
      { en: 'My cute cat 🐱 is sleeping.', vi: 'Chú mèo đáng yêu 🐱 của tớ đang ngủ.' },
      { en: 'I play with a red toy car. 🚗', vi: 'Tớ chơi với một chiếc ô tô đồ chơi màu đỏ. 🚗' },
      { en: 'There is a sweet cake 🍰 next to a cup. 🥛', vi: 'Có một chiếc bánh ngọt 🍰 bên cạnh cái cốc. 🥛' },
      { en: 'Great! 🌟 Do you like eating cake? 🍰', vi: 'Tuyệt vời! 🌟 Bạn có thích ăn bánh không? 🍰' },
    ],
    question: {
      textEn: 'What is next to the cup?',
      options: [
        { text: 'A dog (Con chó)', isCorrect: false },
        { text: 'A cake (Cái bánh)', isCorrect: true },
        { text: 'A ball (Quả bóng)', isCorrect: false },
      ],
    },
  },
  {
    id: 'u3',
    unitNumber: 3,
    grade: 1,
    titleEn: 'At the Street Market',
    titleVi: 'Tại chợ đường phố',
    difficulty: 'GRADE 1 • DỄ',
    icon: '🛒',
    sentences: [
      { en: 'My mother and I go to the street market. 🛒', vi: 'Mẹ và tớ đi đến chợ đường phố. 🛒' },
      { en: 'I wear a big hat 🎩 on my head.', vi: 'Tớ đội một chiếc mũ lớn 🎩 trên đầu.' },
      { en: 'I put a red apple 🍎 into my bag. 🎒', vi: 'Tớ cho một quả táo màu đỏ 🍎 vào cặp. 🎒' },
      { en: 'I can see a soda can. 🥤', vi: 'Tớ có thể nhìn thấy một lon nước ngọt. 🥤' },
      { en: 'Super! 🌟 What fruit do you like to eat? 🍎👍', vi: 'Siêu quá! 🌟 Bạn thích ăn quả gì? 🍎👍' },
    ],
    question: {
      textEn: 'Where is the apple?',
      options: [
        { text: 'In the bag (Trong cặp)', isCorrect: true },
        { text: 'On the desk (Trên bàn)', isCorrect: false },
        { text: 'Under the bike (Dưới xe đạp)', isCorrect: false },
      ],
    },
  },
  {
    id: 'u4',
    unitNumber: 4,
    grade: 1,
    titleEn: 'In the Bedroom',
    titleVi: 'Trong phòng ngủ',
    difficulty: 'GRADE 1 • DỄ',
    icon: '🛏️',
    sentences: [
      { en: 'This is my clean bedroom. 🛌', vi: 'Đây là phòng ngủ sạch sẽ của tớ. 🛌' },
      { en: 'My toy duck 🦆 is on the desk. 🛋️', vi: 'Con vịt đồ chơi 🦆 của tớ ở trên bàn. 🛋️' },
      { en: 'I see a cute dog 🐶 near the door. 🚪', vi: 'Tớ thấy một chú chó đáng yêu 🐶 ở gần cửa. 🚪' },
      { en: 'The dog wants to play with me.', vi: 'Chú chó muốn chơi cùng tớ.' },
      { en: 'Well done! 🏃 Do you have a dog? 🐶', vi: 'Giỏi lắm! 🏃 Bạn có chó không? 🐶' },
    ],
    question: {
      textEn: 'What is on the desk?',
      options: [
        { text: 'A pen (Bút mực)', isCorrect: false },
        { text: 'A duck (Con vịt)', isCorrect: true },
        { text: 'A cat (Con mèo)', isCorrect: false },
      ],
    },
  },
  {
    id: 'u5',
    unitNumber: 5,
    grade: 1,
    titleEn: 'At the Fish and Chip Shop',
    titleVi: 'Tại quán cá và khoai tây chiên',
    difficulty: 'GRADE 1 • DỄ',
    icon: '🍟',
    sentences: [
      { en: 'We are at the fish and chip shop. 🍟', vi: 'Chúng tớ đang ở quán cá và khoai tây chiên. 🍟' },
      { en: 'I eat fresh fish 🐟 with hot chips. 🍟', vi: 'Tớ ăn cá tươi 🐟 với khoai tây chiên nóng. 🍟' },
      { en: 'My father orders a cold lemonade. 🍋', vi: 'Bố tớ gọi một cốc nước chanh lạnh. 🍋' },
      { en: 'The food here is delicious!', vi: 'Món ăn ở đây thật thơm ngon!' },
      { en: 'Awesome! 🌟 Do you like fish and chips? 🍟', vi: 'Tuyệt vời! 🌟 Bạn có thích cá và khoai tây chiên không? 🍟' },
    ],
    question: {
      textEn: 'What does father order?',
      options: [
        { text: 'Cold lemonade (Nước chanh lạnh)', isCorrect: true },
        { text: 'Hot tea (Trà nóng)', isCorrect: false },
        { text: 'Milk (Sữa)', isCorrect: false },
      ],
    },
  },
  {
    id: 'u6',
    unitNumber: 6,
    grade: 1,
    titleEn: 'In the Classroom',
    titleVi: 'Trong lớp học',
    difficulty: 'GRADE 1 • DỄ',
    icon: '🏫',
    sentences: [
      { en: 'I am in my fun classroom. 🏫', vi: 'Tớ đang ở trong lớp học vui vẻ của tớ. 🏫' },
      { en: 'Listen! The school bell 🔔 is ringing.', vi: 'Lắng nghe này! Chuông trường 🔔 đang reo.' },
      { en: 'I have a red pen 🖊️ on my desk.', vi: 'Tớ có một chiếc bút màu đỏ 🖊️ trên bàn.' },
      { en: 'I draw a sun with my pencil. ✏️', vi: 'Tớ vẽ mặt trời bằng bút chì. ✏️' },
      { en: 'Wow, you are amazing! 🌟 What color is your pen? 🖊️', vi: 'Chà, bạn thật tuyệt! 🌟 Bút của bạn màu gì? 🖊️' },
    ],
    question: {
      textEn: 'What does the writer draw with a pencil?',
      options: [
        { text: 'A cat (Con mèo)', isCorrect: false },
        { text: 'A sun (Mặt trời)', isCorrect: true },
        { text: 'A ball (Quả bóng)', isCorrect: false },
      ],
    },
  },
  {
    id: 'u7',
    unitNumber: 7,
    grade: 1,
    titleEn: 'In the Garden',
    titleVi: 'Trong khu vườn',
    difficulty: 'GRADE 1 • DỄ',
    icon: '🏡',
    sentences: [
      { en: 'This is a big green garden. 🌳', vi: 'Đây là một khu vườn xanh mát lớn. 🌳' },
      { en: 'A happy girl 👧 opens the gate. 🚪', vi: 'Một cô bé vui vẻ 👧 mở cổng. 🚪' },
      { en: 'She sees a white goat 🐐 under the tree.', vi: 'Cô ấy thấy một con dê màu trắng 🐐 dưới cây.' },
      { en: 'The goat is eating green leaves.', vi: 'Con dê đang ăn những chiếc lá xanh.' },
      { en: 'Giỏi lắm! 🏃 Do you like playing in the garden? 🌳', vi: 'Giỏi lắm! 🏃 Bạn có thích chơi trong vườn không? 🌳' },
    ],
    question: {
      textEn: 'What color is the goat?',
      options: [
        { text: 'Black (Màu đen)', isCorrect: false },
        { text: 'White (Màu trắng)', isCorrect: true },
        { text: 'Brown (Màu nâu)', isCorrect: false },
      ],
    },
  },
  {
    id: 'u8',
    unitNumber: 8,
    grade: 1,
    titleEn: 'In the Park',
    titleVi: 'Trong công viên',
    difficulty: 'GRADE 1 • DỄ',
    icon: '🌳',
    sentences: [
      { en: 'We have fun in the park. 🌳', vi: 'Chúng tớ vui chơi trong công viên. 🌳' },
      { en: 'I touch my brown hair 💇 and my head. 👤', vi: 'Tớ chạm vào mái tóc màu nâu 💇 và đầu của tớ. 👤' },
      { en: 'I wave my hand ✋ to a big horse. 🐎', vi: 'Tớ vẫy tay ✋ chào một con ngựa lớn. 🐎' },
      { en: 'The horse can run fast on the grass.', vi: 'Con ngựa có thể chạy nhanh trên cỏ.' },
      { en: 'Fantastic! 🌟 Con có thể cưỡi ngựa không? 🐎', vi: 'Tuyệt vời! 🌟 Con có thể cưỡi ngựa không? 🐎' },
    ],
    question: {
      textEn: 'What animal does the writer wave to?',
      options: [
        { text: 'A dog (Con chó)', isCorrect: false },
        { text: 'A goat (Con dê)', isCorrect: false },
        { text: 'A horse (Con ngựa)', isCorrect: true },
      ],
    },
  },
  {
    id: 'u9',
    unitNumber: 9,
    grade: 1,
    titleEn: 'In the Shop',
    titleVi: 'Trong cửa hàng',
    difficulty: 'GRADE 1 • DỄ',
    icon: '🛍️',
    sentences: [
      { en: 'I go into the small shop. 🛍️', vi: 'Tớ đi vào cửa hàng nhỏ. 🛍️' },
      { en: 'I see a round clock ⏰ on the wall.', vi: 'Tớ thấy một chiếc đồng hồ tròn ⏰ trên tường.' },
      { en: 'A yellow lock 🔒 is next to a red pot. 🍲', vi: 'Một ổ khóa màu vàng 🔒 ở bên cạnh cái nồi màu đỏ. 🍲' },
      { en: 'The shopkeeper cleans the floor with a mop. 🧹', vi: 'Người bán hàng lau sàn bằng cây lau nhà. 🧹' },
      { en: 'Awesome! 🌟 Mẹ con có cái nồi màu đỏ không? 🍲', vi: 'Tuyệt vời! 🌟 Mẹ con có cái nồi màu đỏ không? 🍲' },
    ],
    question: {
      textEn: 'What color is the pot?',
      options: [
        { text: 'Blue (Xanh dương)', isCorrect: false },
        { text: 'Red (Màu đỏ)', isCorrect: true },
        { text: 'Green (Xanh lá)', isCorrect: false },
      ],
    },
  },
  {
    id: 'u10',
    unitNumber: 10,
    grade: 1,
    titleEn: 'At the Zoo',
    titleVi: 'Tại sở thú',
    difficulty: 'GRADE 1 • DỄ',
    icon: '🦁',
    sentences: [
      { en: 'I visit the zoo with my mother. 🦁', vi: 'Tớ đi thăm sở thú cùng mẹ. 🦁' },
      { en: 'I eat a sweet yellow mango. 🥭', vi: 'Tớ ăn một quả xoài vàng ngọt. 🥭' },
      { en: 'Look! A monkey 🐒 is jumping on the tree.', vi: 'Nhìn kìa! Một chú khỉ 🐒 đang nhảy trên cây.' },
      { en: 'A tiny mouse 🐭 is hiding under the leaf.', vi: 'Một chú chuột nhỏ 🐭 đang trốn dưới chiếc lá.' },
      { en: 'Giỏi lắm! 🏃 Con yêu con vật nào nhất? Hãy kể cho cô/thầy biết nhé! 🦁', vi: 'Giỏi lắm! 🏃 Con yêu con vật nào nhất? Hãy kể cho cô/thầy biết nhé! 🦁' },
    ],
    question: {
      textEn: 'Who does the writer go to the zoo with?',
      options: [
        { text: 'Mother (Mẹ)', isCorrect: true },
        { text: 'Father (Bố)', isCorrect: false },
        { text: 'Friend (Bạn bè)', isCorrect: false },
      ],
    },
  },
  {
    id: 'u11',
    unitNumber: 11,
    grade: 1,
    titleEn: 'At the Bus Stop',
    titleVi: 'Tại điểm dừng xe buýt',
    difficulty: 'GRADE 1 • DỄ',
    icon: '🚌',
    sentences: [
      { en: 'We wait at the bus stop. 🚌', vi: 'Chúng tớ đợi ở điểm dừng xe buýt. 🚌' },
      { en: 'The sun ☀️ is very bright today.', vi: 'Mặt trời ☀️ hôm nay rất rực rỡ.' },
      { en: 'I see a big red truck 🚚 drive by.', vi: 'Tớ thấy một chiếc xe tải màu đỏ lớn 🚚 chạy qua.' },
      { en: 'I run 🏃 to catch the school bus. 🚌', vi: 'Tớ chạy 🏃 để bắt xe buýt trường học. 🚌' },
      { en: 'Great job! 🏃 Con có đi học bằng xe buýt không? 🚌', vi: 'Tuyệt quá! 🏃 Con có đi học bằng xe buýt không? 🚌' },
    ],
    question: {
      textEn: 'What color is the truck?',
      options: [
        { text: 'Blue (Xanh dương)', isCorrect: false },
        { text: 'Red (Màu đỏ)', isCorrect: true },
        { text: 'Green (Xanh lá)', isCorrect: false },
      ],
    },
  },
  {
    id: 'u12',
    unitNumber: 12,
    grade: 1,
    titleEn: 'At the Lake',
    titleVi: 'Ở hồ nước',
    difficulty: 'GRADE 1 • DỄ',
    icon: '⛵',
    sentences: [
      { en: 'My friend Lucy 👧 is playing near the lake. 🏞️', vi: 'Bạn Lucy 👧 của tớ đang chơi gần hồ nước. 🏞️' },
      { en: 'The lake water is very clean.', vi: 'Nước hồ rất trong sạch.' },
      { en: 'She finds a big green leaf 🍃 on the grass.', vi: 'Cô ấy tìm thấy một chiếc lá xanh lớn 🍃 trên cỏ.' },
      { en: 'Look at the sour yellow lemons! 🍋', vi: 'Hãy nhìn những quả chanh vàng chua kìa! 🍋' },
      { en: 'Giỏi lắm! 🏃 Con có thích uống nước chanh không? 🍋', vi: 'Giỏi lắm! 🏃 Con có thích uống nước chanh không? 🍋' },
    ],
    question: {
      textEn: 'Who is playing near the lake?',
      options: [
        { text: 'Lucy (Bạn Lucy)', isCorrect: true },
        { text: 'Nick (Bạn Nick)', isCorrect: false },
        { text: 'Bill (Bạn Bill)', isCorrect: false },
      ],
    },
  },
  {
    id: 'u13',
    unitNumber: 13,
    grade: 1,
    titleEn: 'In the School Canteen',
    titleVi: 'Trong căn tin trường học',
    difficulty: 'GRADE 1 • DỄ',
    icon: '🍲',
    sentences: [
      { en: 'Nick 👦 goes to the school canteen.', vi: 'Nick 👦 đi đến căn tin trường học.' },
      { en: 'He eats a yellow banana. 🍌', vi: 'Cậu ấy ăn một quả chuối màu vàng. 🍌' },
      { en: 'I want to eat hot noodles. 🍜', vi: 'Tớ muốn ăn mì nóng. 🍜' },
      { en: 'There is a crunchy nut 🥜 on the plate.', vi: 'Có một hạt giòn 🥜 trên đĩa.' },
      { en: 'Super! 🌟 Con thích ăn mì 🍜 hay chuối 🍌 hơn?', vi: 'Siêu quá! 🌟 Con thích ăn mì 🍜 hay chuối 🍌 hơn?' },
    ],
    question: {
      textEn: 'What does Nick eat?',
      options: [
        { text: 'A banana (Quả chuối)', isCorrect: true },
        { text: 'Noodles (Mì)', isCorrect: false },
        { text: 'A nut (Hạt khô)', isCorrect: false },
      ],
    },
  },
  {
    id: 'u14',
    unitNumber: 14,
    grade: 1,
    titleEn: 'In the Toy Shop',
    titleVi: 'Trong cửa hàng đồ chơi',
    difficulty: 'GRADE 1 • DỄ',
    icon: '🧸',
    sentences: [
      { en: 'I am inside the toy shop. 🧸', vi: 'Tớ đang ở trong cửa hàng đồ chơi. 🧸' },
      { en: 'I play with a green toy turtle. 🐢', vi: 'Tớ chơi với một chú rùa đồ chơi màu xanh. 🐢' },
      { en: 'My sister holds a soft teddy bear. 🧸', vi: 'Chị tớ ôm một chú gấu bông mềm mại. 🧸' },
      { en: 'Look at the big tiger 🐅 and the spinning top! 🔮', vi: 'Hãy nhìn chú hổ lớn 🐅 và con quay kìa! 🔮' },
      { en: 'Wow, you are great! 🌟 Con thích đồ chơi nào nhất? 🧸🚗', vi: 'Chà, bạn thật tuyệt! 🌟 Con thích đồ chơi nào nhất? 🧸🚗' },
    ],
    question: {
      textEn: 'What toy does the sister hold?',
      options: [
        { text: 'A turtle (Con rùa)', isCorrect: false },
        { text: 'A teddy bear (Gấu bông)', isCorrect: true },
        { text: 'A tiger (Con hổ)', isCorrect: false },
      ],
    },
  },
  {
    id: 'u15',
    unitNumber: 15,
    grade: 1,
    titleEn: 'At the Football Match',
    titleVi: 'Tại trận đấu bóng đá',
    difficulty: 'GRADE 1 • DỄ',
    icon: '⚽',
    sentences: [
      { en: 'My father 👨 takes me to the football match. ⚽', vi: 'Bố tớ 👨 đưa tớ đến trận đấu bóng đá. ⚽' },
      { en: 'We play football together on the field.', vi: 'Chúng tớ cùng nhau chơi bóng đá trên sân.' },
      { en: 'I kick the ball with my strong foot. 🦶', vi: 'Tớ sút bóng bằng đôi chân khỏe mạnh của mình. 🦶' },
      { en: 'He has a happy face. 😊', vi: 'Bố có một khuôn mặt hạnh phúc. 😊' },
      { en: 'Giỏi lắm! 🏃 Con có thích chơi đá bóng không? ⚽', vi: 'Giỏi lắm! 🏃 Con có thích chơi đá bóng không? ⚽' },
    ],
    question: {
      textEn: 'Who takes the writer to the football match?',
      options: [
        { text: 'Father (Bố)', isCorrect: true },
        { text: 'Mother (Mẹ)', isCorrect: false },
        { text: 'Teacher (Cô giáo)', isCorrect: false },
      ],
    },
  },
  {
    id: 'u16',
    unitNumber: 16,
    grade: 1,
    titleEn: 'At Home',
    titleVi: 'Ở nhà',
    difficulty: 'GRADE 1 • DỄ',
    icon: '🏠',
    sentences: [
      { en: 'Wendy 👧 is at her warm home. 🏠', vi: 'Wendy 👧 đang ở ngôi nhà ấm áp của cô ấy. 🏠' },
      { en: 'I wash my dirty hands 🧼 with soap.', vi: 'Tớ rửa đôi tay bẩn 🧼 của mình bằng xà phòng.' },
      { en: 'I drink a glass of fresh water. 💧', vi: 'Tớ uống một cốc nước mát lành. 💧' },
      { en: 'She looks out of the open window. 🪟', vi: 'Cô ấy nhìn ra ngoài cửa sổ đang mở. 🪟' },
      { en: 'Wonderful! 🌟 Con đã rửa tay chưa? 🧼', vi: 'Tuyệt vời! 🌟 Con đã rửa tay chưa? 🧼' },
    ],
    question: {
      textEn: 'What does the writer wash?',
      options: [
        { text: 'Hands (Tay)', isCorrect: true },
        { text: 'Face (Mặt)', isCorrect: false },
        { text: 'Window (Cửa sổ)', isCorrect: false },
      ],
    },
  },
];

export const ReadingComprehensionView: React.FC<ReadingComprehensionViewProps> = ({
  user,
  onAddStars,
  onBack,
  onLogout,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [activeUnitIndex, setActiveUnitIndex] = useState<number>(0);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [completedUnits, setCompletedUnits] = useState<Record<string, boolean>>({});
  const [showGiftModal, setShowGiftModal] = useState<boolean>(false);

  // Audio Music / Timer Widget State
  const [timerSeconds, setTimerSeconds] = useState<number>(15 * 60); // 15 mins
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Format Timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filter units
  const filteredUnits = useMemo(() => {
    if (selectedGrade === 0) return READING_UNITS;
    return READING_UNITS.filter((u) => u.grade === selectedGrade);
  }, [selectedGrade]);

  const currentUnit = filteredUnits[activeUnitIndex % filteredUnits.length] || READING_UNITS[0];

  // Handle Option Pick
  const handleSelectOption = (idx: number, isCorrect: boolean) => {
    setSelectedOption(idx);
    audioService.playClickSound();

    if (isCorrect) {
      audioService.playSuccessSound();
      triggerConfetti('default');
      setIsCompleted(true);
      setCompletedUnits((prev) => ({ ...prev, [currentUnit.id]: true }));
      if (onAddStars) onAddStars(10);
    } else {
      audioService.playErrorSound();
    }
  };

  // Speak single word
  const handleSpeakWord = (word: string) => {
    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '');
    if (cleanWord.trim()) {
      audioService.speakEnglish(cleanWord.trim(), 0.9);
    }
  };

  // Speak full sentence
  const handleSpeakSentence = (sentence: string) => {
    audioService.playClickSound();
    // remove emojis for smooth speech synthesis
    const cleanSentence = sentence.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    audioService.speakEnglish(cleanSentence, 0.85);
  };

  // Completed Count
  const completedCount = Object.keys(completedUnits).length;

  return (
    <div className="space-y-5 select-none font-sans max-w-7xl mx-auto animate-fadeIn">
      {/* Back Button Top Left */}
      {onBack && (
        <div className="mb-4">
          <button
            onClick={() => {
              audioService.playClickSound();
              onBack();
            }}
            className="bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1 cursor-pointer transition active:scale-95"
          >
            <ArrowLeft size={14} />
            <span>Quay lại bài học</span>
          </button>
        </div>
      )}

      {/* Grade Selector Tabs (Filter 1) */}
      <div className="flex flex-wrap items-center gap-2 mb-4 bg-white/60 p-2 rounded-2xl border border-slate-200/60 shadow-2xs">
        <button
          onClick={() => {
            audioService.playClickSound();
            setSelectedGrade(0);
            setActiveUnitIndex(0);
            setIsCompleted(false);
            setSelectedOption(null);
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer border ${
            selectedGrade === 0
              ? 'bg-[#1d50b4] text-white border-[#1d50b4] shadow-2xs'
              : 'bg-white text-sky-700 border-dashed border-sky-300 hover:bg-sky-50'
          }`}
        >
          🌐 Tất cả
        </button>

        {[
          { g: 1, label: '🌸 Lớp 1', activeBg: 'bg-pink-500 text-white border-pink-500', outline: 'border-pink-300 text-pink-700' },
          { g: 2, label: '📙 Lớp 2', activeBg: 'bg-orange-500 text-white border-orange-500', outline: 'border-orange-300 text-orange-700' },
          { g: 3, label: '📘 Lớp 3', activeBg: 'bg-cyan-500 text-white border-cyan-500', outline: 'border-cyan-300 text-cyan-700' },
          { g: 4, label: '📗 Lớp 4', activeBg: 'bg-emerald-500 text-white border-emerald-500', outline: 'border-emerald-300 text-emerald-700' },
          { g: 5, label: '🔮 Lớp 5', activeBg: 'bg-purple-600 text-white border-purple-600', outline: 'border-purple-300 text-purple-700' },
        ].map((item) => (
          <button
            key={item.g}
            onClick={() => {
              audioService.playClickSound();
              setSelectedGrade(item.g);
              setActiveUnitIndex(0);
              setIsCompleted(false);
              setSelectedOption(null);
            }}
            className={`px-5 py-2 rounded-2xl text-xs font-black transition cursor-pointer border ${
              selectedGrade === item.g
                ? `${item.activeBg} shadow-2xs`
                : `bg-white border-dashed ${item.outline} hover:bg-slate-50`
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Story Unit Tabs Bar (Filter 2 - Horizontally Scrollable) */}
      <div className="relative mb-6 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-2 min-w-max">
          {filteredUnits.map((unit, idx) => {
            const isSelected = activeUnitIndex === idx;
            const isDone = completedUnits[unit.id];

            return (
              <button
                key={unit.id}
                onClick={() => {
                  audioService.playClickSound();
                  setActiveUnitIndex(idx);
                  setIsCompleted(false);
                  setSelectedOption(null);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#3b82f6] text-white border-[#3b82f6] shadow-2xs font-extrabold'
                    : 'bg-white border-dashed border-sky-300 text-slate-700 hover:bg-sky-50'
                }`}
              >
                <span>{unit.icon} {unit.titleEn}</span>
                {isDone && <CheckCircle2 size={14} className={isSelected ? 'text-emerald-200' : 'text-emerald-500'} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN READING CONTENT (STORY & QUIZ) */}
      <div className="space-y-6">
        {!isCompleted ? (
          /* ACTIVE READING CARD */
          <div className="bg-[#fff3f5] rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-sm space-y-6">
            {/* Story Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-pink-200/60 pb-4">
              <div>
                <span className="bg-pink-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  {currentUnit.difficulty}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  {currentUnit.titleEn}
                </h2>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  {currentUnit.titleVi}
                </p>
              </div>

              <button
                onClick={() => {
                  audioService.playClickSound();
                  setShowTranslation(!showTranslation);
                }}
                className="bg-[#3b82f6] hover:bg-blue-600 text-white px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
              >
                <Eye size={15} />
                <span>{showTranslation ? 'Ẩn dịch nghĩa' : 'Hiện dịch nghĩa'}</span>
              </button>
            </div>

            {/* Sentences List */}
            <div className="space-y-4">
              {currentUnit.sentences.map((sent, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeakSentence(sent.en)}
                      className="w-8 h-8 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 flex items-center justify-center shrink-0 cursor-pointer transition active:scale-90"
                      title="Nghe cả câu"
                    >
                      <Volume2 size={16} />
                    </button>

                    <div className="flex flex-wrap items-center gap-1 text-sm sm:text-base font-black text-slate-900">
                      {sent.en.split(' ').map((word, wIdx) => (
                        <span
                          key={wIdx}
                          onClick={() => handleSpeakWord(word)}
                          className="hover:text-blue-600 hover:underline cursor-pointer transition px-0.5"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>

                  {showTranslation && (
                    <p className="text-xs font-bold text-slate-500 italic ml-10">
                      {sent.vi}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Quiz Section Bottom */}
            <div className="bg-[#fffdf0] rounded-2xl p-5 border border-amber-200/80 space-y-4">
              <div className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                <span className="text-rose-500">❓</span>
                <span>Đố vui kiểm tra hiểu bài:</span>
              </div>

              <p className="text-sm font-extrabold text-slate-900">
                {currentUnit.question.textEn}
              </p>

              <div className="space-y-2">
                {currentUnit.question.options.map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx, opt.isCorrect)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black'
                            : 'bg-rose-100 border-rose-400 text-rose-950 font-black'
                          : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isSelected && opt.isCorrect && (
                        <CheckCircle2 size={18} className="text-emerald-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* COMPLETION SCREEN (Image 2 - "Đọc hiểu hoàn thành 🎉") */
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>Đọc hiểu hoàn thành</span>
                <span>🎉</span>
              </h2>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                Chúc mừng bé yêu đã trả lời đúng câu hỏi đọc hiểu!
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-dashed border-emerald-300 text-center space-y-5 shadow-sm">
              <div className="w-20 h-20 mx-auto rounded-full bg-white p-2 border border-emerald-200 shadow-2xs">
                <img
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=DinoHero"
                  alt="Dino Mascot"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-emerald-900">
                  Xuất sắc! Bé đã đọc xong truyện! 🌟 🎉
                </h3>
                <p className="text-xs font-bold text-emerald-800 max-w-lg mx-auto leading-relaxed">
                  Bé đã hoàn thành bài đọc "{currentUnit.titleEn}" và trả lời đúng câu hỏi thử thách. Bé nhận được 10 Sao vàng!
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <span className="bg-amber-100 text-amber-900 font-black text-xs px-4 py-2 rounded-2xl border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                  <Star size={16} className="text-amber-500 fill-amber-400" />
                  <span>+10 Sao vàng</span>
                </span>

                <span className="bg-purple-100 text-purple-900 font-black text-xs px-4 py-2 rounded-2xl border border-purple-300 flex items-center gap-1.5 shadow-2xs">
                  <Sparkles size={16} className="text-purple-500" />
                  <span>+5 Kim cương</span>
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    audioService.playClickSound();
                    setIsCompleted(false);
                    setSelectedOption(null);
                  }}
                  className="bg-[#3b82f6] hover:bg-blue-600 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-md transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <RotateCcw size={16} />
                  <span>Đọc lại truyện</span>
                </button>

                <button
                  onClick={() => {
                    audioService.playClickSound();
                    setIsCompleted(false);
                    setSelectedOption(null);
                    setActiveUnitIndex((prev) => (prev + 1) % filteredUnits.length);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-6 py-3 rounded-2xl shadow-md transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <span>Tiếp theo &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GIFT MODAL (Image 3: "Dino nhắn bé") */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-blue-400 shadow-2xl max-w-xs w-full text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 p-1 border border-emerald-200 overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=DinoModal"
                alt="Dino Modal"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">Dino nhắn bé</h3>
              <p className="text-xs font-bold text-slate-500 mt-1">
                Đang mở hộp quà mọt sách...
              </p>
            </div>

            <button
              onClick={() => {
                audioService.playSuccessSound();
                triggerConfetti('default');
                setShowGiftModal(false);
              }}
              className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-black text-xs py-2.5 rounded-2xl shadow-md transition cursor-pointer active:scale-95 flex items-center justify-center gap-1"
            >
              <span>Đồng ý ➔</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
