export interface VocabQuizQuestion {
  id: number;
  wordEn: string;
  wordVi: string;
  hint: string;
  options: { id: number; label: string; image?: string; emoji?: string }[];
  correctOptionId: number;
}

export interface SentenceArrangeQuestion {
  id: number;
  sentenceEn: string;
  sentenceVi: string;
  hintVi: string;
  targetWords: string[];
  initialPool: string[];
}

export interface DialogueQuizQuestion {
  id: number;
  dialogueAudioText: string;
  dialogueTranscript: string;
  questionEn: string;
  options: { id: number; text: string }[];
  correctOptionId: number;
  hintText: string;
  explanation: string;
}

export const VOCAB_QUESTIONS_BY_GRADE: Record<number, VocabQuizQuestion[]> = {
  1: [
    {
      id: 101,
      wordEn: 'cat',
      wordVi: 'con mèo',
      hint: 'Gợi ý: Mèo con kêu meo meo (cat)',
      correctOptionId: 1,
      options: [
        { id: 1, label: 'con mèo', emoji: '🐱' },
        { id: 2, label: 'con chó', emoji: '🐶' },
        { id: 3, label: 'con cá', emoji: '🐟' },
        { id: 4, label: 'con chim', emoji: '🐦' },
      ],
    },
    {
      id: 102,
      wordEn: 'pen',
      wordVi: 'bút mực',
      hint: 'Gợi ý: Đồ dùng học tập dùng để viết chữ (pen)',
      correctOptionId: 2,
      options: [
        { id: 1, label: 'bút chì', emoji: '✏️' },
        { id: 2, label: 'bút mực', emoji: '🖊️' },
        { id: 3, label: 'cặp sách', emoji: '🎒' },
        { id: 4, label: 'thước kẻ', emoji: '📏' },
      ],
    },
    {
      id: 103,
      wordEn: 'red',
      wordVi: 'màu đỏ',
      hint: 'Gợi ý: Màu của quả dưa hấu hoặc quả táo (red)',
      correctOptionId: 3,
      options: [
        { id: 1, label: 'màu xanh', emoji: '💙' },
        { id: 2, label: 'màu vàng', emoji: '💛' },
        { id: 3, label: 'màu đỏ', emoji: '❤️' },
        { id: 4, label: 'màu cam', emoji: '🧡' },
      ],
    },
    {
      id: 104,
      wordEn: 'apple',
      wordVi: 'quả táo',
      hint: 'Gợi ý: Trái cây màu đỏ giòn ngọt (apple)',
      correctOptionId: 2,
      options: [
        { id: 1, label: 'quả chuối', emoji: '🍌' },
        { id: 2, label: 'quả táo', emoji: '🍎' },
        { id: 3, label: 'quả cam', emoji: '🍊' },
        { id: 4, label: 'quả lê', emoji: '🍐' },
      ],
    },
  ],
  2: [
    {
      id: 201,
      wordEn: 'skate',
      wordVi: 'trượt patanh',
      hint: 'Gợi ý: Trò chơi trượt trên đôi giày có bánh xe (skate)',
      correctOptionId: 2,
      options: [
        { id: 1, label: 'chạy bộ', emoji: '🏃' },
        { id: 2, label: 'trượt patanh', emoji: '🛼' },
        { id: 3, label: 'nhảy dây', emoji: '🪢' },
        { id: 4, label: 'đá bóng', emoji: '⚽' },
      ],
    },
    {
      id: 202,
      wordEn: 'scared',
      wordVi: 'sợ hãi',
      hint: 'Gợi ý: Cảm giác giật mình sợ hãi khi gặp quái vật (scared)',
      correctOptionId: 2,
      options: [
        { id: 1, label: 'vui vẻ', emoji: '😊' },
        { id: 2, label: 'sợ hãi', emoji: '😨' },
        { id: 3, label: 'buồn bã', emoji: '🥺' },
        { id: 4, label: 'tức giận', emoji: '😡' },
      ],
    },
    {
      id: 203,
      wordEn: 'rabbit',
      wordVi: 'con thỏ',
      hint: 'Gợi ý: Con vật tai dài thích ăn cà rốt (rabbit)',
      correctOptionId: 1,
      options: [
        { id: 1, label: 'con thỏ', emoji: '🐰' },
        { id: 2, label: 'con mèo', emoji: '🐱' },
        { id: 3, label: 'con khỉ', emoji: '🐒' },
        { id: 4, label: 'con gấu', emoji: '🐻' },
      ],
    },
    {
      id: 204,
      wordEn: 'playground',
      wordVi: 'sân chơi',
      hint: 'Gợi ý: Nơi có cầu trượt và xích đu ở trường (playground)',
      correctOptionId: 2,
      options: [
        { id: 1, label: 'phòng học', emoji: '🏫' },
        { id: 2, label: 'sân chơi', emoji: '🛝' },
        { id: 3, label: 'thư viện', emoji: '📚' },
        { id: 4, label: 'nhà bếp', emoji: '🍳' },
      ],
    },
  ],
  3: [
    {
      id: 301,
      wordEn: 'swimming',
      wordVi: 'bơi lội',
      hint: 'Gợi ý: Môn thể thao dưới nước vào mùa hè (swimming)',
      correctOptionId: 2,
      options: [
        { id: 1, label: 'chạy bộ', emoji: '🏃' },
        { id: 2, label: 'bơi lội', emoji: '🏊' },
        { id: 3, label: 'đạp xe', emoji: '🚴' },
        { id: 4, label: 'leo núi', emoji: '🧗' },
      ],
    },
    {
      id: 302,
      wordEn: 'library',
      wordVi: 'thư viện',
      hint: 'Gợi ý: Nơi chứa rất nhiều sách để đọc và mượn (library)',
      correctOptionId: 1,
      options: [
        { id: 1, label: 'thư viện', emoji: '📚' },
        { id: 2, label: 'sân vận động', emoji: '🏟️' },
        { id: 3, label: 'căn tin', emoji: '🥪' },
        { id: 4, label: 'bệnh viện', emoji: '🏥' },
      ],
    },
    {
      id: 303,
      wordEn: 'peacock',
      wordVi: 'con công',
      hint: 'Gợi ý: Loài chim có bộ lông xòe rực rỡ đẹp mắt (peacock)',
      correctOptionId: 2,
      options: [
        { id: 1, label: 'chim sẻ', emoji: '🐦' },
        { id: 2, label: 'con công', emoji: '🦚' },
        { id: 3, label: 'con vẹt', emoji: '🦜' },
        { id: 4, label: 'đại bàng', emoji: '🦅' },
      ],
    },
    {
      id: 304,
      wordEn: 'breakfast',
      wordVi: 'bữa sáng',
      hint: 'Gợi ý: Bữa ăn đầu tiên trong ngày vào buổi sáng (breakfast)',
      correctOptionId: 3,
      options: [
        { id: 1, label: 'bữa trưa', emoji: '🍱' },
        { id: 2, label: 'bữa tối', emoji: '🍲' },
        { id: 3, label: 'bữa sáng', emoji: '🥣' },
        { id: 4, label: 'bữa phụ', emoji: '🍎' },
      ],
    },
  ],
  4: [
    {
      id: 401,
      wordEn: 'timetable',
      wordVi: 'thời khóa biểu',
      hint: 'Gợi ý: Bảng lịch học các môn trong tuần (timetable)',
      correctOptionId: 2,
      options: [
        { id: 1, label: 'sổ liên lạc', emoji: '📒' },
        { id: 2, label: 'thời khóa biểu', emoji: '📅' },
        { id: 3, label: 'sách giáo khoa', emoji: '📖' },
        { id: 4, label: 'bảng đen', emoji: '⬛' },
      ],
    },
    {
      id: 402,
      wordEn: 'kangaroo',
      wordVi: 'chuột túi',
      hint: 'Gợi ý: Động vật mang con trong túi trước bụng (kangaroo)',
      correctOptionId: 2,
      options: [
        { id: 1, label: 'gấu trúc', emoji: '🐼' },
        { id: 2, label: 'chuột túi', emoji: '🦘' },
        { id: 3, label: 'hươu cao cổ', emoji: '🦒' },
        { id: 4, label: 'sư tử', emoji: '🦁' },
      ],
    },
    {
      id: 403,
      wordEn: 'sunbathe',
      wordVi: 'tắm nắng',
      hint: 'Gợi ý: Nằm thư giãn dưới ánh nắng ngoài bãi biển (sunbathe)',
      correctOptionId: 2,
      options: [
        { id: 1, label: 'xây lâu đài cát', emoji: '🏰' },
        { id: 2, label: 'tắm nắng', emoji: '🏖️' },
        { id: 3, label: 'lướt sóng', emoji: '🏄' },
        { id: 4, label: 'đi du thuyền', emoji: '🚢' },
      ],
    },
    {
      id: 404,
      wordEn: 'bakery',
      wordVi: 'tiệm bánh',
      hint: 'Gợi ý: Cửa hàng bán bánh mì và bánh ngọt thơm ngon (bakery)',
      correctOptionId: 2,
      options: [
        { id: 1, label: 'hiệu sách', emoji: '📚' },
        { id: 2, label: 'tiệm bánh', emoji: '🥖' },
        { id: 3, label: 'siêu thị', emoji: '🛒' },
        { id: 4, label: 'rạp chiếu phim', emoji: '🎬' },
      ],
    },
  ],
  5: [
    {
      id: 501,
      wordEn: 'ancient',
      wordVi: 'cổ kính, cổ xưa',
      hint: 'Gợi ý: Miêu tả các di tích lâu đời như Phố cổ Hội An (ancient)',
      correctOptionId: 1,
      options: [
        { id: 1, label: 'cổ kính', emoji: '🏛️' },
        { id: 2, label: 'hiện đại', emoji: '🏙️' },
        { id: 3, label: 'sầm uất', emoji: '🌃' },
        { id: 4, label: 'ồn ào', emoji: '📢' },
      ],
    },
    {
      id: 502,
      wordEn: 'waterfall',
      wordVi: 'thác nước',
      hint: 'Gợi ý: Dòng nước chảy từ trên núi cao xuống (waterfall)',
      correctOptionId: 2,
      options: [
        { id: 1, label: 'dòng sông', emoji: '🌊' },
        { id: 2, label: 'thác nước', emoji: '🏞️' },
        { id: 3, label: 'hòn đảo', emoji: '🏝️' },
        { id: 4, label: 'hang động', emoji: '🦇' },
      ],
    },
    {
      id: 503,
      wordEn: 'eco-farm',
      wordVi: 'trang trại sinh thái',
      hint: 'Gợi ý: Trang trại trồng rau sạch và chăm sóc động vật (eco-farm)',
      correctOptionId: 2,
      options: [
        { id: 1, label: 'công viên nước', emoji: '🏊' },
        { id: 2, label: 'trang trại sinh thái', emoji: '🚜' },
        { id: 3, label: 'trung tâm thương mại', emoji: '🏢' },
        { id: 4, label: 'sân bay', emoji: '✈️' },
      ],
    },
    {
      id: 504,
      wordEn: 'environment',
      wordVi: 'môi trường',
      hint: 'Gợi ý: Môi trường thiên nhiên xung quanh chúng ta (environment)',
      correctOptionId: 2,
      options: [
        { id: 1, label: 'thời tiết', emoji: '🌤️' },
        { id: 2, label: 'môi trường', emoji: '🌱' },
        { id: 3, label: 'khí hậu', emoji: '🌡️' },
        { id: 4, label: 'địa hình', emoji: '🗺️' },
      ],
    },
  ],
};

export const SENTENCE_QUESTIONS_BY_GRADE: Record<number, SentenceArrangeQuestion[]> = {
  1: [
    {
      id: 101,
      sentenceEn: 'This is my cat',
      sentenceVi: 'Đây là chú mèo của tớ',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Đây là chú mèo của tớ"',
      targetWords: ['This', 'is', 'my', 'cat'],
      initialPool: ['cat', 'This', 'my', 'is'],
    },
    {
      id: 102,
      sentenceEn: 'I have a red pen',
      sentenceVi: 'Tớ có một cây bút mực màu đỏ',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Tớ có một cây bút mực màu đỏ"',
      targetWords: ['I', 'have', 'a', 'red', 'pen'],
      initialPool: ['red', 'I', 'pen', 'have', 'a'],
    },
    {
      id: 103,
      sentenceEn: 'Look at the apple',
      sentenceVi: 'Hãy nhìn vào quả táo',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Hãy nhìn vào quả táo"',
      targetWords: ['Look', 'at', 'the', 'apple'],
      initialPool: ['apple', 'Look', 'the', 'at'],
    },
    {
      id: 104,
      sentenceEn: 'I love my mom',
      sentenceVi: 'Con yêu mẹ của con',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Con yêu mẹ của con"',
      targetWords: ['I', 'love', 'my', 'mom'],
      initialPool: ['mom', 'I', 'love', 'my'],
    },
  ],
  2: [
    {
      id: 201,
      sentenceEn: 'This is my classroom',
      sentenceVi: 'Đây là lớp học của em',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Đây là lớp học của em"',
      targetWords: ['This', 'is', 'my', 'classroom'],
      initialPool: ['classroom', 'This', 'is', 'my'],
    },
    {
      id: 202,
      sentenceEn: 'I love my school bag',
      sentenceVi: 'Em yêu chiếc cặp sách của em',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Em yêu chiếc cặp sách của em"',
      targetWords: ['I', 'love', 'my', 'school', 'bag'],
      initialPool: ['love', 'my', 'I', 'school', 'bag'],
    },
    {
      id: 203,
      sentenceEn: 'She can skate fast',
      sentenceVi: 'Cô ấy có thể trượt patanh nhanh',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Cô ấy có thể trượt patanh nhanh"',
      targetWords: ['She', 'can', 'skate', 'fast'],
      initialPool: ['skate', 'She', 'fast', 'can'],
    },
    {
      id: 204,
      sentenceEn: 'We play in the playground',
      sentenceVi: 'Chúng tớ chơi ở sân chơi',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Chúng tớ chơi ở sân chơi"',
      targetWords: ['We', 'play', 'in', 'the', 'playground'],
      initialPool: ['playground', 'in', 'We', 'the', 'play'],
    },
  ],
  3: [
    {
      id: 301,
      sentenceEn: 'My favorite subject is English',
      sentenceVi: 'Môn học yêu thích của tớ là Tiếng Anh',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Môn học yêu thích của tớ là Tiếng Anh"',
      targetWords: ['My', 'favorite', 'subject', 'is', 'English'],
      initialPool: ['English', 'favorite', 'My', 'is', 'subject'],
    },
    {
      id: 302,
      sentenceEn: 'We are reading in the library',
      sentenceVi: 'Chúng tớ đang đọc sách trong thư viện',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Chúng tớ đang đọc sách trong thư viện"',
      targetWords: ['We', 'are', 'reading', 'in', 'the', 'library'],
      initialPool: ['library', 'reading', 'We', 'in', 'are', 'the'],
    },
    {
      id: 303,
      sentenceEn: 'He likes playing badminton',
      sentenceVi: 'Cậu ấy thích chơi cầu lông',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Cậu ấy thích chơi cầu lông"',
      targetWords: ['He', 'likes', 'playing', 'badminton'],
      initialPool: ['badminton', 'likes', 'He', 'playing'],
    },
    {
      id: 304,
      sentenceEn: 'What do you do at break time',
      sentenceVi: 'Bạn làm gì vào giờ ra chơi',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Bạn làm gì vào giờ ra chơi"',
      targetWords: ['What', 'do', 'you', 'do', 'at', 'break', 'time'],
      initialPool: ['break', 'What', 'you', 'do', 'time', 'at', 'do'],
    },
  ],
  4: [
    {
      id: 401,
      sentenceEn: 'I have English on Mondays',
      sentenceVi: 'Tớ có môn Tiếng Anh vào các thứ Hai',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Tớ có môn Tiếng Anh vào các thứ Hai"',
      targetWords: ['I', 'have', 'English', 'on', 'Mondays'],
      initialPool: ['Mondays', 'English', 'I', 'on', 'have'],
    },
    {
      id: 402,
      sentenceEn: 'What time do you get up',
      sentenceVi: 'Bạn thức dậy lúc mấy giờ',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Bạn thức dậy lúc mấy giờ"',
      targetWords: ['What', 'time', 'do', 'you', 'get', 'up'],
      initialPool: ['get', 'What', 'you', 'time', 'up', 'do'],
    },
    {
      id: 403,
      sentenceEn: 'Where were you yesterday',
      sentenceVi: 'Hôm qua bạn đã ở đâu',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Hôm qua bạn đã ở đâu"',
      targetWords: ['Where', 'were', 'you', 'yesterday'],
      initialPool: ['yesterday', 'Where', 'you', 'were'],
    },
    {
      id: 404,
      sentenceEn: 'She went to the bakery to buy bread',
      sentenceVi: 'Cô ấy đã đến tiệm bánh để mua bánh mì',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Cô ấy đã đến tiệm bánh để mua bánh mì"',
      targetWords: ['She', 'went', 'to', 'the', 'bakery', 'to', 'buy', 'bread'],
      initialPool: ['bakery', 'She', 'buy', 'went', 'bread', 'to', 'the', 'to'],
    },
  ],
  5: [
    {
      id: 501,
      sentenceEn: 'I went to Hoi An Old Town last summer',
      sentenceVi: 'Tớ đã đến Phố cổ Hội An vào mùa hè năm ngoái',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Tớ đã đến Phố cổ Hội An vào mùa hè năm ngoái"',
      targetWords: ['I', 'went', 'to', 'Hoi', 'An', 'Old', 'Town', 'last', 'summer'],
      initialPool: ['Old', 'I', 'summer', 'went', 'Hoi', 'to', 'Town', 'An', 'last'],
    },
    {
      id: 502,
      sentenceEn: 'We should protect the environment',
      sentenceVi: 'Chúng ta nên bảo vệ môi trường',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Chúng ta nên bảo vệ môi trường"',
      targetWords: ['We', 'should', 'protect', 'the', 'environment'],
      initialPool: ['environment', 'protect', 'We', 'the', 'should'],
    },
    {
      id: 503,
      sentenceEn: 'What will you do at the eco-farm',
      sentenceVi: 'Bạn sẽ làm gì ở trang trại sinh thái',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Bạn sẽ làm gì ở trang trại sinh thái"',
      targetWords: ['What', 'will', 'you', 'do', 'at', 'the', 'eco-farm'],
      initialPool: ['eco-farm', 'What', 'do', 'will', 'at', 'you', 'the'],
    },
    {
      id: 504,
      sentenceEn: 'How can I get to Phong Nha Cave',
      sentenceVi: 'Làm sao tớ có thể đến Động Phong Nha',
      hintVi: 'Gợi ý nghĩa Tiếng Việt: "Làm sao tớ có thể đến Động Phong Nha"',
      targetWords: ['How', 'can', 'I', 'get', 'to', 'Phong', 'Nha', 'Cave'],
      initialPool: ['Phong', 'How', 'get', 'can', 'Cave', 'I', 'Nha', 'to'],
    },
  ],
};

export const DIALOGUE_QUESTIONS_BY_GRADE: Record<number, DialogueQuizQuestion[]> = {
  1: [
    {
      id: 101,
      dialogueAudioText: 'Ben: Hi, my name is Ben. I am 6 years old.',
      dialogueTranscript: '"Ben: Hi, my name is Ben. I am 6 years old."',
      questionEn: 'How old is Ben?',
      options: [
        { id: 1, text: '5 years old (5 tuổi)' },
        { id: 2, text: '6 years old (6 tuổi)' },
        { id: 3, text: '7 years old (7 tuổi)' },
      ],
      correctOptionId: 2,
      hintText: "Gợi ý: Ben nói: 'I am 6 years old', nghĩa là bạn ấy 6 tuổi.",
      explanation: "Ben nói: 'I am 6 years old' (Tớ 6 tuổi).",
    },
    {
      id: 102,
      dialogueAudioText: 'Mai: Look, Lily! I have a red apple and a yellow banana.',
      dialogueTranscript: '"Mai: Look, Lily! I have a red apple and a yellow banana."',
      questionEn: "What color is Mai's apple?",
      options: [
        { id: 1, text: 'Red (Màu đỏ)' },
        { id: 2, text: 'Yellow (Màu vàng)' },
        { id: 3, text: 'Green (Màu xanh)' },
      ],
      correctOptionId: 1,
      hintText: "Gợi ý: Mai nói: 'a red apple', quả táo của Mai có màu đỏ.",
      explanation: "Mai nói: 'a red apple' (quả táo màu đỏ).",
    },
  ],
  2: [
    {
      id: 201,
      dialogueAudioText: 'Kido: Look! I have a yellow ruler, a blue book and a pink eraser. They are in my school bag.',
      dialogueTranscript: '"Kido: Look! I have a yellow ruler, a blue book and a pink eraser. They are in my school bag."',
      questionEn: "What color is Kido's book?",
      options: [
        { id: 1, text: 'Yellow (Màu vàng)' },
        { id: 2, text: 'Blue (Màu xanh dương)' },
        { id: 3, text: 'Pink (Màu hồng)' },
      ],
      correctOptionId: 2,
      hintText: "Gợi ý: Kido nói: 'a blue book', tức là quyển sách có màu xanh dương.",
      explanation: "Kido nói: 'a blue book', tức là quyển sách có màu xanh dương.",
    },
    {
      id: 202,
      dialogueAudioText: 'Tom: I can play football in the playground. But I cannot skate.',
      dialogueTranscript: '"Tom: I can play football in the playground. But I cannot skate."',
      questionEn: 'What can Tom play?',
      options: [
        { id: 1, text: 'Skate (Trượt patanh)' },
        { id: 2, text: 'Football (Đá bóng)' },
        { id: 3, text: 'Badminton (Cầu lông)' },
      ],
      correctOptionId: 2,
      hintText: "Gợi ý: Tom nói: 'I can play football', bạn ấy có thể chơi đá bóng.",
      explanation: "Tom nói: 'I can play football' (Tớ có thể đá bóng).",
    },
  ],
  3: [
    {
      id: 301,
      dialogueAudioText: 'Linda: Today we have Music, Art and English. English is my favorite subject!',
      dialogueTranscript: '"Linda: Today we have Music, Art and English. English is my favorite subject!"',
      questionEn: "What is Linda's favorite subject?",
      options: [
        { id: 1, text: 'Music (Âm nhạc)' },
        { id: 2, text: 'Art (Mỹ thuật)' },
        { id: 3, text: 'English (Tiếng Anh)' },
      ],
      correctOptionId: 3,
      hintText: "Gợi ý: Linda nói: 'English is my favorite subject!', môn học yêu thích nhất là Tiếng Anh.",
      explanation: "Linda nói: 'English is my favorite subject!' (Tiếng Anh là môn học yêu thích nhất).",
    },
    {
      id: 302,
      dialogueAudioText: 'Peter: Where is Nam? - Nam is in the school library. He is reading a comic book.',
      dialogueTranscript: '"Peter: Where is Nam? - Nam is in the school library. He is reading a comic book."',
      questionEn: 'Where is Nam?',
      options: [
        { id: 1, text: 'In the classroom (Trong lớp học)' },
        { id: 2, text: 'In the library (Trong thư viện)' },
        { id: 3, text: 'In the computer room (Trong phòng máy)' },
      ],
      correctOptionId: 2,
      hintText: "Gợi ý: Peter nói: 'Nam is in the school library', Nam đang ở trong thư viện trường.",
      explanation: "Peter nói: 'Nam is in the school library' (Nam đang ở trong thư viện trường).",
    },
  ],
  4: [
    {
      id: 401,
      dialogueAudioText: 'Mary: What time do you have breakfast, Alex? - Alex: I have breakfast at 6:30 in the morning.',
      dialogueTranscript: '"Mary: What time do you have breakfast, Alex? - Alex: I have breakfast at 6:30 in the morning."',
      questionEn: 'What time does Alex have breakfast?',
      options: [
        { id: 1, text: '6:00 (6 giờ 00)' },
        { id: 2, text: '6:30 (6 giờ 30)' },
        { id: 3, text: '7:00 (7 giờ 00)' },
      ],
      correctOptionId: 2,
      hintText: "Gợi ý: Alex nói: 'I have breakfast at 6:30', Alex ăn sáng lúc 6:30.",
      explanation: "Alex nói: 'I have breakfast at 6:30' (Tớ ăn sáng lúc 6 giờ 30).",
    },
    {
      id: 402,
      dialogueAudioText: 'David: Yesterday was Sunday. I went to the zoo with my brother. We saw two kangaroos and three monkeys.',
      dialogueTranscript: '"David: Yesterday was Sunday. I went to the zoo with my brother. We saw two kangaroos and three monkeys."',
      questionEn: 'Where did David go yesterday?',
      options: [
        { id: 1, text: 'The zoo (Sở thú)' },
        { id: 2, text: 'The park (Công viên)' },
        { id: 3, text: 'The beach (Bãi biển)' },
      ],
      correctOptionId: 1,
      hintText: "Gợi ý: David nói: 'I went to the zoo', David đã đi sở thú.",
      explanation: "David nói: 'I went to the zoo' (Tớ đã đi sở thú).",
    },
  ],
  5: [
    {
      id: 501,
      dialogueAudioText: 'Lucy: Hello! Last summer, my family visited Hoi An Old Town. It was very peaceful and ancient. We ate delicious street food.',
      dialogueTranscript: '"Lucy: Hello! Last summer, my family visited Hoi An Old Town. It was very peaceful and ancient. We ate delicious street food."',
      questionEn: "Where did Lucy's family visit last summer?",
      options: [
        { id: 1, text: 'Ha Long Bay (Vịnh Hạ Long)' },
        { id: 2, text: 'Hoi An Old Town (Phố cổ Hội An)' },
        { id: 3, text: 'Phong Nha Cave (Động Phong Nha)' },
      ],
      correctOptionId: 2,
      hintText: "Gợi ý: Lucy nói: 'my family visited Hoi An Old Town', gia đình Lucy đã đi Phố cổ Hội An.",
      explanation: "Lucy nói: 'my family visited Hoi An Old Town' (gia đình tớ đã thăm Phố cổ Hội An).",
    },
    {
      id: 502,
      dialogueAudioText: 'Phong: Tomorrow, our class will visit an eco-farm. We will plant green trees and feed the ducks.',
      dialogueTranscript: '"Phong: Tomorrow, our class will visit an eco-farm. We will plant green trees and feed the ducks."',
      questionEn: "What will Phong's class do tomorrow?",
      options: [
        { id: 1, text: 'Visit a water park (Đi công viên nước)' },
        { id: 2, text: 'Visit an eco-farm (Thăm trang trại sinh thái)' },
        { id: 3, text: 'Go camping in the forest (Đi cắm trại)' },
      ],
      correctOptionId: 2,
      hintText: "Gợi ý: Phong nói: 'our class will visit an eco-farm', lớp của Phong sẽ đi trang trại sinh thái.",
      explanation: "Phong nói: 'our class will visit an eco-farm' (lớp tớ sẽ đi thăm trang trại sinh thái).",
    },
  ],
};

export const getVocabQuestions = (grade: number): VocabQuizQuestion[] => {
  if (grade >= 1 && grade <= 5) return VOCAB_QUESTIONS_BY_GRADE[grade] || VOCAB_QUESTIONS_BY_GRADE[1];
  return [
    ...VOCAB_QUESTIONS_BY_GRADE[1],
    ...VOCAB_QUESTIONS_BY_GRADE[2],
    ...VOCAB_QUESTIONS_BY_GRADE[3],
    ...VOCAB_QUESTIONS_BY_GRADE[4],
    ...VOCAB_QUESTIONS_BY_GRADE[5],
  ];
};

export const getSentenceQuestions = (grade: number): SentenceArrangeQuestion[] => {
  if (grade >= 1 && grade <= 5) return SENTENCE_QUESTIONS_BY_GRADE[grade] || SENTENCE_QUESTIONS_BY_GRADE[1];
  return [
    ...SENTENCE_QUESTIONS_BY_GRADE[1],
    ...SENTENCE_QUESTIONS_BY_GRADE[2],
    ...SENTENCE_QUESTIONS_BY_GRADE[3],
    ...SENTENCE_QUESTIONS_BY_GRADE[4],
    ...SENTENCE_QUESTIONS_BY_GRADE[5],
  ];
};

export const getDialogueQuestions = (grade: number): DialogueQuizQuestion[] => {
  if (grade >= 1 && grade <= 5) return DIALOGUE_QUESTIONS_BY_GRADE[grade] || DIALOGUE_QUESTIONS_BY_GRADE[1];
  return [
    ...DIALOGUE_QUESTIONS_BY_GRADE[1],
    ...DIALOGUE_QUESTIONS_BY_GRADE[2],
    ...DIALOGUE_QUESTIONS_BY_GRADE[3],
    ...DIALOGUE_QUESTIONS_BY_GRADE[4],
    ...DIALOGUE_QUESTIONS_BY_GRADE[5],
  ];
};
