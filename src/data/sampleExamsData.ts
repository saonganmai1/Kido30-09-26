export interface UnitOutline {
  id: number;
  title: string;
  themeColor: string; // e.g. emerald, purple, orange, cyan, pink
  vocab: { word: string; phonetic?: string }[];
  sentences: { en: string; vi: string }[];
  grammar: string;
  dialogue: { dino?: string; kido?: string; child: string };
  tip: string;
  quiz: {
    question: string;
    options: { text: string; isCorrect: boolean }[];
  };
}

export interface ExamQuestionPartA {
  q1: { text: string; audioText: string; options: { label: string; text: string; isCorrect: boolean }[] };
  q2: { text: string; audioText: string; options: { label: string; text: string; isCorrect: boolean }[] };
  q3: { text: string; audioText: string; items: { key: string; icon: string; label: string; isCorrect: boolean }[] };
  q4: { text: string; audioText: string; items: { key: string; icon: string; label: string; isCorrect: boolean }[] };
}

export interface ExamQuestionPartB {
  q1: { text: string; icon: string; statement: string; isCorrect: boolean };
  q2: { text: string; icon: string; statement: string; isCorrect: boolean };
  q3: { text: string; options: { text: string; isCorrect: boolean }[] };
  q4: { text: string; wordBank: string[]; passageTemplate: { id: number; prefix: string; answer: string; suffix: string }[] };
}

export interface ExamQuestionPartC {
  q1: { text: string; icon: string; prefix: string; answer: string; suffix: string };
  q2: { text: string; icon: string; prefix: string; answer: string; suffix: string };
  q3: { text: string; scrambled: string[]; answer: string };
  q4: { text: string; scrambled: string[]; answer: string };
}

export interface ExamQuestionPartD {
  title: string;
  subtitle: string;
  questions: {
    id: number;
    questionText: string;
    tip: string;
    suggestedAnswer: string;
  }[];
}

export interface SampleExamData {
  partA: ExamQuestionPartA;
  partB: ExamQuestionPartB;
  partC: ExamQuestionPartC;
  partD: ExamQuestionPartD;
}

// Map key format: `${grade}-${semester}` -> UnitOutline[]
export const unitOutlinesByGradeSemester: Record<string, UnitOutline[]> = {
  // ==================== GRADE 1 ====================
  '1-midterm-1': [
    {
      id: 1,
      title: 'Unit 1: In the school playground',
      themeColor: 'emerald',
      vocab: [{ word: 'ball' }, { word: 'bike' }, { word: 'book' }, { word: 'Bill' }],
      sentences: [
        { en: 'I have a big ball.', vi: 'Tớ có một quả bóng thật to.' },
        { en: 'This is my blue bike.', vi: 'Đây là chiếc xe đạp màu xanh dương của tớ.' }
      ],
      grammar: 'Cấu trúc sở hữu cơ bản: I have a... (Tớ có một...) và miêu tả: This is my... (Đây là... của tớ).',
      dialogue: { kido: '"Hello! I have a big ball."', child: '"Hi Kido! This is my blue bike."' },
      tip: 'Bé nhớ luyện nói các từ vựng ball, bike, book hàng ngày nhé!',
      quiz: { question: 'Từ nào sau đây có nghĩa là: "quả bóng"?', options: [{ text: 'A. ball', isCorrect: true }, { text: 'B. bike', isCorrect: false }, { text: 'C. book', isCorrect: false }] }
    },
    {
      id: 2,
      title: 'Unit 2: In the dining room',
      themeColor: 'purple',
      vocab: [{ word: 'car' }, { word: 'cat' }, { word: 'cake' }, { word: 'cup' }],
      sentences: [
        { en: 'I see a cat.', vi: 'Tớ thấy một con mèo.' },
        { en: 'It is a birthday cake.', vi: 'Đó là một chiếc bánh sinh nhật.' }
      ],
      grammar: 'Cấu trúc nhận biết đồ vật: I see a... và miêu tả: It is a...',
      dialogue: { kido: '"Look! I see a cat."', child: '"Oh, it is eating cake!"' },
      tip: 'Hãy chỉ vào các đồ vật quanh nhà và gọi tên bằng tiếng Anh nhé!',
      quiz: { question: 'Từ nào có nghĩa là "chiếc bánh"?', options: [{ text: 'A. cat', isCorrect: false }, { text: 'B. cake', isCorrect: true }, { text: 'C. cup', isCorrect: false }] }
    },
    {
      id: 3,
      title: 'Unit 3: At the street market',
      themeColor: 'orange',
      vocab: [{ word: 'apple' }, { word: 'ant' }, { word: 'axe' }, { word: 'alligator' }],
      sentences: [
        { en: 'An apple is red.', vi: 'Quả táo có màu đỏ.' },
        { en: 'Look at the ant!', vi: 'Nhìn con kiến kìa!' }
      ],
      grammar: 'Cách dùng mạo từ "an" trước danh từ bắt đầu bằng nguyên âm A (an apple, an ant).',
      dialogue: { kido: '"Do you want an apple?"', child: '"Yes, please! I love apples."' },
      tip: 'Trước từ apple và ant bé nhớ dùng mạo từ "an" nha!',
      quiz: { question: 'Chọn mạo từ đúng: ___ apple', options: [{ text: 'A. a', isCorrect: false }, { text: 'B. an', isCorrect: true }, { text: 'C. the', isCorrect: false }] }
    },
    {
      id: 4,
      title: 'Unit 4: In the bedroom',
      themeColor: 'cyan',
      vocab: [{ word: 'door' }, { word: 'dog' }, { word: 'duck' }, { word: 'doll' }],
      sentences: [
        { en: 'Close the door.', vi: 'Hãy đóng cửa lại.' },
        { en: 'The doll is cute.', vi: 'Búp bê rất đáng yêu.' }
      ],
      grammar: 'Mẫu câu mệnh lệnh đơn giản: Close the... (Đóng...) và Open the... (Mở...).',
      dialogue: { kido: '"Please close the door."', child: '"Okay, Kido!"' },
      tip: 'Mỗi khi vào phòng, bé hãy tự nhủ "Close the door" để quen miệng nhé!',
      quiz: { question: 'Từ "door" nghĩa là gì?', options: [{ text: 'A. Cái cửa', isCorrect: true }, { text: 'B. Búp bê', isCorrect: false }, { text: 'C. Con chó', isCorrect: false }] }
    },
    {
      id: 5,
      title: 'Unit 5: At the fish and chip shop',
      themeColor: 'pink',
      vocab: [{ word: 'fish' }, { word: 'chips' }, { word: 'face' }, { word: 'foot' }],
      sentences: [
        { en: 'I like fish and chips.', vi: 'Tớ thích cá và khoai tây chiên.' },
        { en: 'Wash your face.', vi: 'Hãy rửa mặt của bạn.' }
      ],
      grammar: 'Cấu trúc diễn tả sở thích ăn uống: I like... (Tớ thích...)',
      dialogue: { kido: '"What do you like to eat?"', child: '"I like fish and chips!"' },
      tip: 'Khi ăn món ưa thích, bé hãy nói "I like..." kèm tên món ăn nhé!',
      quiz: { question: 'Dịch câu: "I like fish."', options: [{ text: 'A. Tớ thích cá.', isCorrect: true }, { text: 'B. Tớ thấy cá.', isCorrect: false }, { text: 'C. Cá rất to.', isCorrect: false }] }
    }
  ],
  '1-final-1': [
    { id: 1, title: 'Unit 1: In the school playground', themeColor: 'emerald', vocab: [{ word: 'ball' }, { word: 'bike' }, { word: 'book' }], sentences: [{ en: 'I have a big ball.', vi: 'Tớ có quả bóng to.' }], grammar: 'Mẫu câu I have a...', dialogue: { kido: '"I have a ball."', child: '"Cool!"' }, tip: 'Luyện tập phát âm âm B', quiz: { question: 'Ball nghĩa là gì?', options: [{ text: 'A. Quả bóng', isCorrect: true }] } },
    { id: 2, title: 'Unit 2: In the dining room', themeColor: 'purple', vocab: [{ word: 'car' }, { word: 'cat' }, { word: 'cake' }], sentences: [{ en: 'I see a cat.', vi: 'Tớ thấy con mèo.' }], grammar: 'Mẫu câu I see a...', dialogue: { kido: '"I see a cat."', child: '"Meow!"' }, tip: 'Học các từ chỉ con vật', quiz: { question: 'Cat nghĩa là gì?', options: [{ text: 'A. Con mèo', isCorrect: true }] } },
    { id: 3, title: 'Unit 3: At the street market', themeColor: 'orange', vocab: [{ word: 'apple' }, { word: 'ant' }], sentences: [{ en: 'An apple is red.', vi: 'Quả táo có màu đỏ.' }], grammar: 'Dùng mạo từ an', dialogue: { kido: '"An apple!"', child: '"Yummy!"' }, tip: 'Phát âm âm A', quiz: { question: 'Apple là gì?', options: [{ text: 'A. Quả táo', isCorrect: true }] } },
    { id: 4, title: 'Unit 4: In the bedroom', themeColor: 'cyan', vocab: [{ word: 'door' }, { word: 'dog' }, { word: 'duck' }], sentences: [{ en: 'Close the door.', vi: 'Đóng cửa lại.' }], grammar: 'Mẫu câu mệnh lệnh', dialogue: { kido: '"Close the door."', child: '"Okay!"' }, tip: 'Đồ dùng phòng ngủ', quiz: { question: 'Door là gì?', options: [{ text: 'A. Cửa ra vào', isCorrect: true }] } },
    { id: 5, title: 'Unit 5: At the fish and chip shop', themeColor: 'pink', vocab: [{ word: 'fish' }, { word: 'chips' }], sentences: [{ en: 'I like fish.', vi: 'Tớ thích cá.' }], grammar: 'Cấu trúc I like', dialogue: { kido: '"I like fish."', child: '"Me too!"' }, tip: 'Thức ăn yêu thích', quiz: { question: 'Fish là gì?', options: [{ text: 'A. Con cá', isCorrect: true }] } },
    { id: 6, title: 'Unit 6: In the classroom', themeColor: 'emerald', vocab: [{ word: 'pen' }, { word: 'pencil' }, { word: 'paper' }], sentences: [{ en: 'I have a red pen.', vi: 'Tớ có một chiếc bút mực đỏ.' }], grammar: 'Dụng cụ học tập', dialogue: { kido: '"Pass me the pen."', child: '"Here you are!"' }, tip: 'Gọi tên dụng cụ học tập', quiz: { question: 'Pen là gì?', options: [{ text: 'A. Cái bút', isCorrect: true }] } },
    { id: 7, title: 'Unit 7: In the garden', themeColor: 'purple', vocab: [{ word: 'gate' }, { word: 'girl' }, { word: 'garden' }], sentences: [{ en: 'Open the gate.', vi: 'Mở cổng ra.' }], grammar: 'Open the...', dialogue: { kido: '"Open the gate!"', child: '"Yes Kido!"' }, tip: 'Từ vựng khu vườn', quiz: { question: 'Gate là gì?', options: [{ text: 'A. Cái cổng', isCorrect: true }] } },
    { id: 8, title: 'Unit 8: In the park', themeColor: 'orange', vocab: [{ word: 'tree' }, { word: 'bird' }, { word: 'sun' }], sentences: [{ en: 'The sun is bright.', vi: 'Mặt trời chiếu sáng.' }], grammar: 'Miêu tả thời tiết', dialogue: { kido: '"Look at the sun!"', child: '"So bright!"' }, tip: 'Từ vựng công viên', quiz: { question: 'Sun là gì?', options: [{ text: 'A. Mặt trời', isCorrect: true }] } },
    { id: 9, title: 'Unit 9: In the shop', themeColor: 'cyan', vocab: [{ word: 'hat' }, { word: 'bag' }, { word: 'shoes' }], sentences: [{ en: 'I want a hat.', vi: 'Tớ muốn một chiếc mũ.' }], grammar: 'I want a...', dialogue: { kido: '"Which hat?"', child: '"The blue one!"' }, tip: 'Hỏi mua đồ', quiz: { question: 'Hat là gì?', options: [{ text: 'A. Cái mũ', isCorrect: true }] } },
    { id: 10, title: 'Unit 10: At the zoo', themeColor: 'pink', vocab: [{ word: 'monkey' }, { word: 'tiger' }, { word: 'elephant' }], sentences: [{ en: 'Look at the monkey!', vi: 'Look at the monkey!' }], grammar: 'Gọi tên động vật', dialogue: { kido: '"A cute monkey!"', child: '"It is eating a banana!"' }, tip: 'Từ vựng sở thú', quiz: { question: 'Monkey là gì?', options: [{ text: 'A. Con khỉ', isCorrect: true }] } }
  ],
  '1-midterm-2': [
    { id: 11, title: 'Unit 11: At the bus stop', themeColor: 'emerald', vocab: [{ word: 'bus' }, { word: 'stop' }, { word: 'truck' }], sentences: [{ en: 'The bus is coming.', vi: 'Xe buýt đang đến.' }], grammar: 'The bus is...', dialogue: { kido: '"The bus is coming!"', child: '"Let us go!"' }, tip: 'Xe phương tiện', quiz: { question: 'Bus là gì?', options: [{ text: 'A. Xe buýt', isCorrect: true }] } },
    { id: 12, title: 'Unit 12: At the lake', themeColor: 'purple', vocab: [{ word: 'lake' }, { word: 'boat' }, { word: 'duck' }], sentences: [{ en: 'A red boat on the lake.', vi: 'Con thuyền đỏ trên hồ.' }], grammar: 'On the lake', dialogue: { kido: '"Look at the boat!"', child: '"It is fast!"' }, tip: 'Cảnh quan mặt hồ', quiz: { question: 'Boat là gì?', options: [{ text: 'A. Con thuyền', isCorrect: true }] } },
    { id: 13, title: 'Unit 13: In the school canteen', themeColor: 'orange', vocab: [{ word: 'milk' }, { word: 'water' }, { word: 'juice' }], sentences: [{ en: 'I drink fresh milk.', vi: 'Tớ uống sữa tươi.' }], grammar: 'I drink...', dialogue: { kido: '"Do you want milk?"', child: '"Yes, please!"' }, tip: 'Các loại đồ uống', quiz: { question: 'Milk là gì?', options: [{ text: 'A. Sữa', isCorrect: true }] } },
    { id: 14, title: 'Unit 14: In the toy shop', themeColor: 'cyan', vocab: [{ word: 'train' }, { word: 'robot' }, { word: 'kite' }], sentences: [{ en: 'My robot is strong.', vi: 'Người máy của tớ rất mạnh.' }], grammar: 'Đồ chơi yêu thích', dialogue: { kido: '"I like the robot!"', child: '"It can walk!"' }, tip: 'Tên món đồ chơi', quiz: { question: 'Robot là gì?', options: [{ text: 'A. Người máy', isCorrect: true }] } },
    { id: 15, title: 'Unit 15: At the football match', themeColor: 'pink', vocab: [{ word: 'kick' }, { word: 'ball' }, { word: 'goal' }], sentences: [{ en: 'Kick the ball with your foot.', vi: 'Sút bóng bằng chân.' }], grammar: 'Mệnh lệnh thể thao', dialogue: { kido: '"Kick it hard!"', child: '"Goal!"' }, tip: 'Từ vựng bóng đá', quiz: { question: 'Kick là gì?', options: [{ text: 'A. Sút / Đá bóng', isCorrect: true }] } }
  ],
  '1-final-2': [
    { id: 11, title: 'Unit 11: At the bus stop', themeColor: 'emerald', vocab: [{ word: 'bus' }], sentences: [{ en: 'The bus is here.', vi: 'Xe buýt ở đây rồi.' }], grammar: 'The bus', dialogue: { kido: '"Get on!"', child: '"Okay!"' }, tip: 'Bến xe buýt', quiz: { question: 'Bus là gì?', options: [{ text: 'A. Xe buýt', isCorrect: true }] } },
    { id: 12, title: 'Unit 12: At the lake', themeColor: 'purple', vocab: [{ word: 'lake' }], sentences: [{ en: 'The lake is green.', vi: 'Mặt hồ xanh mướt.' }], grammar: 'At the lake', dialogue: { kido: '"Nice lake!"', child: '"Yes!"' }, tip: 'Thiên nhiên', quiz: { question: 'Lake là gì?', options: [{ text: 'A. Cái hồ', isCorrect: true }] } },
    { id: 13, title: 'Unit 13: In the school canteen', themeColor: 'orange', vocab: [{ word: 'noodles' }], sentences: [{ en: 'I eat noodles.', vi: 'Tớ ăn mì.' }], grammar: 'I eat', dialogue: { kido: '"Noodles for lunch!"', child: '"Tasty!"' }, tip: 'Nhà ăn học đường', quiz: { question: 'Noodles là gì?', options: [{ text: 'A. Mì', isCorrect: true }] } },
    { id: 14, title: 'Unit 14: In the toy shop', themeColor: 'cyan', vocab: [{ word: 'car' }], sentences: [{ en: 'A blue toy car.', vi: 'Xe đồ chơi xanh.' }], grammar: 'Toy car', dialogue: { kido: '"Vroom!"', child: '"Fast car!"' }, tip: 'Cửa hàng đồ chơi', quiz: { question: 'Car là gì?', options: [{ text: 'A. Xe ô tô', isCorrect: true }] } },
    { id: 15, title: 'Unit 15: At the football match', themeColor: 'pink', vocab: [{ word: 'foot' }], sentences: [{ en: 'Play football.', vi: 'Chơi bóng đá.' }], grammar: 'Play football', dialogue: { kido: '"Score a goal!"', child: '"Yes!"' }, tip: 'Trận thi đấu', quiz: { question: 'Foot là gì?', options: [{ text: 'A. Bàn chân', isCorrect: true }] } },
    { id: 16, title: 'Unit 16: At home', themeColor: 'emerald', vocab: [{ word: 'window' }, { word: 'door' }, { word: 'roof' }], sentences: [{ en: 'Look out the window.', vi: 'Nhìn qua cửa sổ.' }], grammar: 'At home', dialogue: { kido: '"I see birds!"', child: '"So lovely!"' }, tip: 'Ngôi nhà ấm cúng', quiz: { question: 'Window là gì?', options: [{ text: 'A. Cửa sổ', isCorrect: true }] } },
    { id: 17, title: 'Unit 17: In the kitchen', themeColor: 'purple', vocab: [{ word: 'pot' }, { word: 'pan' }, { word: 'plate' }], sentences: [{ en: 'The plate is clean.', vi: 'Chiếc đĩa rất sạch.' }], grammar: 'In the kitchen', dialogue: { kido: '"Wash the plate!"', child: '"Yes Kido!"' }, tip: 'Đồ dùng nhà bếp', quiz: { question: 'Plate là gì?', options: [{ text: 'A. Cái đĩa', isCorrect: true }] } },
    { id: 18, title: 'Unit 18: In the bathroom', themeColor: 'orange', vocab: [{ word: 'soap' }, { word: 'towel' }, { word: 'water' }], sentences: [{ en: 'Wash hands with soap.', vi: 'Rửa tay bằng xà phòng.' }], grammar: 'Hygiene routines', dialogue: { kido: '"Use soap!"', child: '"Clean hands!"' }, tip: 'Vệ sinh cá nhân', quiz: { question: 'Soap là gì?', options: [{ text: 'A. Xà phòng', isCorrect: true }] } },
    { id: 19, title: 'Unit 19: On the farm', themeColor: 'cyan', vocab: [{ word: 'cow' }, { word: 'sheep' }, { word: 'pig' }], sentences: [{ en: 'A big white sheep.', vi: 'Con cừu trắng to.' }], grammar: 'Animals on farm', dialogue: { kido: '"Moo moo!"', child: '"A black cow!"' }, tip: 'Nông trại', quiz: { question: 'Sheep là gì?', options: [{ text: 'A. Con cừu', isCorrect: true }] } },
    { id: 20, title: 'Unit 20: At the seaside', themeColor: 'pink', vocab: [{ word: 'sand' }, { word: 'sea' }, { word: 'shell' }], sentences: [{ en: 'Find a pretty shell.', vi: 'Tìm vỏ ốc đẹp.' }], grammar: 'At seaside', dialogue: { kido: '"Look! A shell!"', child: '"So shiny!"' }, tip: 'Bờ biển mùa hè', quiz: { question: 'Sea là gì?', options: [{ text: 'A. Biển', isCorrect: true }] } }
  ],

  // ==================== GRADE 2 ====================
  '2-midterm-1': [
    {
      id: 1,
      title: 'Unit 1: At the countryside',
      themeColor: 'emerald',
      vocab: [{ word: 'hill' }, { word: 'horse' }, { word: 'house' }],
      sentences: [
        { en: 'There is a hill in the countryside.', vi: 'Có một ngọn đồi ở vùng quê.' },
        { en: 'I see a big brown horse.', vi: 'Tớ thấy một con ngựa đốm nâu thật to.' }
      ],
      grammar: 'Cấu trúc miêu tả nơi chốn: There is a... (Có một...)',
      dialogue: { kido: '"Look! There is a horse on the hill!"', child: '"Wow, it is running fast!"' },
      tip: 'Chữ cái H phát âm nhẹ nhàng như tiếng hà hơi nhé!',
      quiz: { question: 'Từ "hill" có nghĩa là gì?', options: [{ text: 'A. Ngọn đồi', isCorrect: true }, { text: 'B. Ngôi nhà', isCorrect: false }, { text: 'C. Con ngựa', isCorrect: false }] }
    },
    {
      id: 2,
      title: 'Unit 2: In the dining room',
      themeColor: 'purple',
      vocab: [{ word: 'jelly' }, { word: 'jam' }, { word: 'juice' }],
      sentences: [
        { en: 'I like strawberry jam.', vi: 'Tớ thích mứt dâu tây.' },
        { en: 'Pass me the apple juice, please.', vi: 'Hãy đưa tớ ly nước ép táo nhé.' }
      ],
      grammar: 'Cấu trúc lịch sự khi xin đồ ăn: Pass me the..., please.',
      dialogue: { kido: '"Would you like some jelly?"', child: '"Yes, please! I love jelly."' },
      tip: 'Âm J phát âm bật nhẹ ở đầu lưỡi bé nhé!',
      quiz: { question: 'Từ "jam" nghĩa là gì?', options: [{ text: 'A. Mứt', isCorrect: true }, { text: 'B. Thạch', isCorrect: false }, { text: 'C. Nước ép', isCorrect: false }] }
    },
    {
      id: 3,
      title: 'Unit 3: At the seaside',
      themeColor: 'orange',
      vocab: [{ word: 'kite' }, { word: 'kitten' }, { word: 'king' }],
      sentences: [
        { en: 'He is flying a kite at the seaside.', vi: 'Cậu ấy đang thả diều ở bờ biển.' },
        { en: 'The cute kitten is playing with sand.', vi: 'Mèo con đáng yêu đang chơi với cát.' }
      ],
      grammar: 'Thì hiện tại tiếp diễn cơ bản: He/She is flying... (Đang làm gì)',
      dialogue: { kido: '"Look at the kite in the sky!"', child: '"It is flying so high!"' },
      tip: 'Khi đi biển bé nhớ dùng mẫu câu "At the seaside" nhé!',
      quiz: { question: 'Từ "kite" nghĩa là gì?', options: [{ text: 'A. Con diều', isCorrect: true }, { text: 'B. Mèo con', isCorrect: false }, { text: 'C. Bờ biển', isCorrect: false }] }
    },
    {
      id: 4,
      title: 'Unit 4: In the countryside',
      themeColor: 'cyan',
      vocab: [{ word: 'lemon' }, { word: 'leaf' }, { word: 'lake' }],
      sentences: [
        { en: 'The leaf is green and clean.', vi: 'Chiếc lá xanh và sạch sẽ.' },
        { en: 'The lake is deep and blue.', vi: 'Cái hồ sâu và xanh biếc.' }
      ],
      grammar: 'Tính từ miêu tả đặc điểm: The leaf is green.',
      dialogue: { kido: '"Look at that green leaf!"', child: '"It is floating on the lake!"' },
      tip: 'Luyện âm L bằng cách uốn cong đầu lưỡi chạm vòm miệng trên nhé!',
      quiz: { question: 'Từ "leaf" có nghĩa là gì?', options: [{ text: 'A. Chiếc lá', isCorrect: true }, { text: 'B. Quả chanh', isCorrect: false }, { text: 'C. Mặt hồ', isCorrect: false }] }
    },
    {
      id: 5,
      title: 'Unit 5: In the classroom',
      themeColor: 'pink',
      vocab: [{ word: 'map' }, { word: 'mop' }, { word: 'monkey' }],
      sentences: [
        { en: 'Point to the map on the wall.', vi: 'Chỉ vào bản đồ trên tường.' },
        { en: 'Clean the floor with a mop.', vi: 'Lau sàn bằng cây lau nhà.' }
      ],
      grammar: 'Mẫu câu chỉ dẫn trong lớp học: Point to the... (Hãy chỉ vào...)',
      dialogue: { kido: '"Can you find Vietnam on the map?"', child: '"Yes, right here!"' },
      tip: 'Point to the map có nghĩa là Hãy chỉ vào bản đồ nha bé!',
      quiz: { question: 'Từ "map" có nghĩa là gì?', options: [{ text: 'A. Bản đồ', isCorrect: true }, { text: 'B. Cây lau nhà', isCorrect: false }, { text: 'C. Con khỉ', isCorrect: false }] }
    }
  ],
  '2-final-1': [
    { id: 1, title: 'Unit 1: At the countryside', themeColor: 'emerald', vocab: [{ word: 'hill' }, { word: 'horse' }], sentences: [{ en: 'There is a hill.', vi: 'Có ngọn đồi.' }], grammar: 'There is a...', dialogue: { kido: '"A hill!"', child: '"So high!"' }, tip: 'Âm H', quiz: { question: 'Hill là gì?', options: [{ text: 'A. Ngọn đồi', isCorrect: true }] } },
    { id: 2, title: 'Unit 2: In the dining room', themeColor: 'purple', vocab: [{ word: 'jam' }, { word: 'jelly' }], sentences: [{ en: 'Pass me jam.', vi: 'Đưa mứt cho tớ.' }], grammar: 'Pass me...', dialogue: { kido: '"Jam please!"', child: '"Here!"' }, tip: 'Đồ ăn sáng', quiz: { question: 'Jam là gì?', options: [{ text: 'A. Mứt', isCorrect: true }] } },
    { id: 3, title: 'Unit 3: At the seaside', themeColor: 'orange', vocab: [{ word: 'kite' }], sentences: [{ en: 'Fly a kite.', vi: 'Thả diều.' }], grammar: 'Fly a kite', dialogue: { kido: '"High kite!"', child: '"Yes!"' }, tip: 'Bãi biển', quiz: { question: 'Kite là gì?', options: [{ text: 'A. Con diều', isCorrect: true }] } },
    { id: 4, title: 'Unit 4: In the countryside', themeColor: 'cyan', vocab: [{ word: 'lake' }], sentences: [{ en: 'Look at the lake.', vi: 'Nhìn cái hồ.' }], grammar: 'Look at', dialogue: { kido: '"Blue lake!"', child: '"Nice!"' }, tip: 'Vùng quê', quiz: { question: 'Lake là gì?', options: [{ text: 'A. Cái hồ', isCorrect: true }] } },
    { id: 5, title: 'Unit 5: In the classroom', themeColor: 'pink', vocab: [{ word: 'map' }], sentences: [{ en: 'Point to map.', vi: 'Chỉ bản đồ.' }], grammar: 'Point to', dialogue: { kido: '"Where is map?"', child: '"Here!"' }, tip: 'Lớp học', quiz: { question: 'Map là gì?', options: [{ text: 'A. Bản đồ', isCorrect: true }] } },
    { id: 6, title: 'Unit 6: In the kitchen', themeColor: 'emerald', vocab: [{ word: 'nut' }, { word: 'noodles' }], sentences: [{ en: 'I eat noodles.', vi: 'Tớ ăn mì.' }], grammar: 'I eat', dialogue: { kido: '"Tasty noodles!"', child: '"Yummy!"' }, tip: 'Căn bếp', quiz: { question: 'Noodles là gì?', options: [{ text: 'A. Mì', isCorrect: true }] } },
    { id: 7, title: 'Unit 7: In the garden', themeColor: 'purple', vocab: [{ word: 'orange' }, { word: 'owl' }], sentences: [{ en: 'An orange is round.', vi: 'Quả cam tròn.' }], grammar: 'An orange', dialogue: { kido: '"Juicy orange!"', child: '"Sweet!"' }, tip: 'Khu vườn', quiz: { question: 'Orange là gì?', options: [{ text: 'A. Quả cam', isCorrect: true }] } },
    { id: 8, title: 'Unit 8: In the park', themeColor: 'orange', vocab: [{ word: 'pen' }, { word: 'pencil' }], sentences: [{ en: 'A long pencil.', vi: 'Cây bút chì dài.' }], grammar: 'A long pencil', dialogue: { kido: '"Draw a lion!"', child: '"Okay!"' }, tip: 'Công viên', quiz: { question: 'Pencil là gì?', options: [{ text: 'A. Bút chì', isCorrect: true }] } },
    { id: 9, title: 'Unit 9: In the grocery store', themeColor: 'cyan', vocab: [{ word: 'quiz' }, { word: 'queen' }], sentences: [{ en: 'Answer the quiz.', vi: 'Trả lời câu hỏi.' }], grammar: 'Answer the quiz', dialogue: { kido: '"Easy quiz!"', child: '"Correct!"' }, tip: 'Cửa hàng', quiz: { question: 'Quiz là gì?', options: [{ text: 'A. Câu đố', isCorrect: true }] } },
    { id: 10, title: 'Unit 10: At the zoo', themeColor: 'pink', vocab: [{ word: 'rabbit' }, { word: 'river' }], sentences: [{ en: 'The rabbit is cute.', vi: 'Thỏ rất đáng yêu.' }], grammar: 'The rabbit is', dialogue: { kido: '"Fast rabbit!"', child: '"Hop hop!"' }, tip: 'Sở thú', quiz: { question: 'Rabbit là gì?', options: [{ text: 'A. Con thỏ', isCorrect: true }] } }
  ],
  '2-midterm-2': [
    { id: 11, title: 'Unit 11: In the playground', themeColor: 'emerald', vocab: [{ word: 'sun' }, { word: 'sand' }], sentences: [{ en: 'Play with sand.', vi: 'Chơi với cát.' }], grammar: 'Play with', dialogue: { kido: '"Warm sun!"', child: '"Fun!"' }, tip: 'Sân chơi', quiz: { question: 'Sand là gì?', options: [{ text: 'A. Hạt cát', isCorrect: true }] } },
    { id: 12, title: 'Unit 12: In the living room', themeColor: 'purple', vocab: [{ word: 'television' }, { word: 'table' }], sentences: [{ en: 'Watch television.', vi: 'Xem tivi.' }], grammar: 'Watch TV', dialogue: { kido: '"Watch cartoons!"', child: '"Yay!"' }, tip: 'Phòng khách', quiz: { question: 'Table là gì?', options: [{ text: 'A. Cái bàn', isCorrect: true }] } },
    { id: 13, title: 'Unit 13: In the garden', themeColor: 'orange', vocab: [{ word: 'umbrella' }], sentences: [{ en: 'An umbrella in rain.', vi: 'Chiếc ô dưới mưa.' }], grammar: 'An umbrella', dialogue: { kido: '"Open umbrella!"', child: '"Dry now!"' }, tip: 'Thời tiết mưa', quiz: { question: 'Umbrella là gì?', options: [{ text: 'A. Chiếc ô / Dù', isCorrect: true }] } },
    { id: 14, title: 'Unit 14: In the toy shop', themeColor: 'cyan', vocab: [{ word: 'van' }, { word: 'violin' }], sentences: [{ en: 'Play the violin.', vi: 'Chơi đàn vĩ cầm.' }], grammar: 'Play the violin', dialogue: { kido: '"Nice music!"', child: '"Thank you!"' }, tip: 'Cửa hàng đồ chơi', quiz: { question: 'Violin là gì?', options: [{ text: 'A. Đàn vĩ cầm', isCorrect: true }] } },
    { id: 15, title: 'Unit 15: At the birthday party', themeColor: 'pink', vocab: [{ word: 'water' }, { word: 'watch' }], sentences: [{ en: 'Drink fresh water.', vi: 'Uống nước mát.' }], grammar: 'Drink water', dialogue: { kido: '"Happy birthday!"', child: '"Cake time!"' }, tip: 'Tiệc sinh nhật', quiz: { question: 'Water là gì?', options: [{ text: 'A. Nước uống', isCorrect: true }] } }
  ],
  '2-final-2': [
    { id: 11, title: 'Unit 11: In the playground', themeColor: 'emerald', vocab: [{ word: 'slide' }], sentences: [{ en: 'On the slide.', vi: 'Trên cầu trượt.' }], grammar: 'Slide', dialogue: { kido: '"Wheee!"', child: '"Fun!"' }, tip: 'Trò chơi', quiz: { question: 'Slide là gì?', options: [{ text: 'A. Cầu trượt', isCorrect: true }] } },
    { id: 12, title: 'Unit 12: In the living room', themeColor: 'purple', vocab: [{ word: 'sofa' }], sentences: [{ en: 'Sit on sofa.', vi: 'Ngồi ghế sofa.' }], grammar: 'Sit on', dialogue: { kido: '"Comfy sofa!"', child: '"Yes!"' }, tip: 'Đồ nội thất', quiz: { question: 'Sofa là gì?', options: [{ text: 'A. Ghế sofa', isCorrect: true }] } },
    { id: 13, title: 'Unit 13: In the garden', themeColor: 'orange', vocab: [{ word: 'flower' }], sentences: [{ en: 'A red flower.', vi: 'Bông hoa đỏ.' }], grammar: 'Red flower', dialogue: { kido: '"Smell flower!"', child: '"Nice!"' }, tip: 'Hoa cỏ', quiz: { question: 'Flower là gì?', options: [{ text: 'A. Bông hoa', isCorrect: true }] } },
    { id: 14, title: 'Unit 14: In the toy shop', themeColor: 'cyan', vocab: [{ word: 'doll' }], sentences: [{ en: 'A pretty doll.', vi: 'Búp bê đẹp.' }], grammar: 'Pretty doll', dialogue: { kido: '"Cute doll!"', child: '"I like it!"' }, tip: 'Đồ chơi', quiz: { question: 'Doll là gì?', options: [{ text: 'A. Búp bê', isCorrect: true }] } },
    { id: 15, title: 'Unit 15: At the birthday party', themeColor: 'pink', vocab: [{ word: 'candle' }], sentences: [{ en: 'Blow candles.', vi: 'Thổi nến.' }], grammar: 'Blow candles', dialogue: { kido: '"Make a wish!"', child: '"Happy!"' }, tip: 'Sinh nhật', quiz: { question: 'Candle là gì?', options: [{ text: 'A. Cây nến', isCorrect: true }] } },
    { id: 16, title: 'Unit 16: At the campsite', themeColor: 'emerald', vocab: [{ word: 'tent' }, { word: 'star' }], sentences: [{ en: 'Sleep in a tent.', vi: 'Ngủ trong lều.' }], grammar: 'In a tent', dialogue: { kido: '"Look at stars!"', child: '"So bright!"' }, tip: 'Cắm trại ngoài trời', quiz: { question: 'Tent là gì?', options: [{ text: 'A. Lều cắm trại', isCorrect: true }] } },
    { id: 17, title: 'Unit 17: At the bakery', themeColor: 'purple', vocab: [{ word: 'bread' }, { word: 'cake' }, { word: 'cookie' }], sentences: [{ en: 'I like sweet cookies.', vi: 'Tớ thích bánh quy ngọt.' }], grammar: 'At the bakery', dialogue: { kido: '"Smell fresh bread!"', child: '"Delicious!"' }, tip: 'Tiệm bánh mì ngọt', quiz: { question: 'Cookie là gì?', options: [{ text: 'A. Bánh quy', isCorrect: true }] } },
    { id: 18, title: 'Unit 18: In the pet shop', themeColor: 'orange', vocab: [{ word: 'rabbit' }, { word: 'parrot' }, { word: 'goldfish' }], sentences: [{ en: 'The goldfish is swimming.', vi: 'Con cá vàng đang bơi.' }], grammar: 'Pets and animals', dialogue: { kido: '"Look at parrot!"', child: '"It speaks!"' }, tip: 'Cửa hàng thú cưng', quiz: { question: 'Goldfish là gì?', options: [{ text: 'A. Con cá vàng', isCorrect: true }] } },
    { id: 19, title: 'Unit 19: In the music room', themeColor: 'cyan', vocab: [{ word: 'piano' }, { word: 'drum' }, { word: 'guitar' }], sentences: [{ en: 'Play the piano.', vi: 'Chơi đàn dương cầm.' }], grammar: 'Musical instruments', dialogue: { kido: '"Play drum!"', child: '"Boom boom!"' }, tip: 'Phòng âm nhạc', quiz: { question: 'Piano là gì?', options: [{ text: 'A. Đàn dương cầm', isCorrect: true }] } },
    { id: 20, title: 'Unit 20: On summer holiday', themeColor: 'pink', vocab: [{ word: 'beach' }, { word: 'sun' }, { word: 'sandcastle' }], sentences: [{ en: 'Build a big sandcastle.', vi: 'Xây lâu đài cát to.' }], grammar: 'Summer activities', dialogue: { kido: '"Fun beach!"', child: '"Love summer!"' }, tip: 'Kỳ nghỉ hè tuyệt vời', quiz: { question: 'Beach là gì?', options: [{ text: 'A. Bãi biển', isCorrect: true }] } }
  ],

  // ==================== GRADE 3 ====================
  '3-midterm-1': [
    {
      id: 1,
      title: 'Unit 1: Hello',
      themeColor: 'emerald',
      vocab: [{ word: 'hello' }, { word: 'hi' }, { word: 'goodbye' }, { word: 'bye' }],
      sentences: [
        { en: 'Hello, I am Mai.', vi: 'Xin chào, tớ là Mai.' },
        { en: 'How are you? - I am fine, thank you.', vi: 'Cậu khỏe không? - Tớ khỏe, cảm ơn cậu.' }
      ],
      grammar: 'Chào hỏi và tự giới thiệu tên: Hello, I am... / Hi, I am... và hỏi thăm sức khỏe.',
      dialogue: { kido: '"Hello! How are you?"', child: '"Hi Kido! I am fine, thank you."' },
      tip: 'Khi gặp bạn bè bé hãy nói "Hello" hoặc "Hi" thật tự tin nhé!',
      quiz: { question: 'Trả lời câu hỏi: "How are you?"', options: [{ text: 'A. I am fine, thank you.', isCorrect: true }, { text: 'B. My name is Mai.', isCorrect: false }, { text: 'C. Goodbye!', isCorrect: false }] }
    },
    {
      id: 2,
      title: 'Unit 2: Our names',
      themeColor: 'purple',
      vocab: [{ word: 'name' }, { word: 'spell' }, { word: 'what' }],
      sentences: [
        { en: 'What is your name? - My name is Ben.', vi: 'Tên cậu là gì? - Tên tớ là Ben.' },
        { en: 'How do you spell your name? - B-E-N.', vi: 'Cậu đánh vần tên mình như thế nào? - B-E-N.' }
      ],
      grammar: 'Hỏi tên: What is your name? và hỏi cách đánh vần tên: How do you spell your name?',
      dialogue: { kido: '"What is your name?"', child: '"My name is Linh. L-I-N-H."' },
      tip: 'Ghi nhớ bảng chữ cái Tiếng Anh để đánh vần tên thật chuẩn nhé!',
      quiz: { question: 'Dịch câu: "What is your name?"', options: [{ text: 'A. Tên bạn là gì?', isCorrect: true }, { text: 'B. Bạn bao nhiêu tuổi?', isCorrect: false }, { text: 'C. Bạn từ đâu đến?', isCorrect: false }] }
    },
    {
      id: 3,
      title: 'Unit 3: Our friends',
      themeColor: 'orange',
      vocab: [{ word: 'friend' }, { word: 'this' }, { word: 'that' }, { word: 'yes' }, { word: 'no' }],
      sentences: [
        { en: 'This is my friend, Peter.', vi: 'Đây là bạn của tớ, Peter.' },
        { en: 'Is that Mary? - Yes, it is.', vi: 'Kia có phải là Mary không? - Đúng rồi.' }
      ],
      grammar: 'Giới thiệu người khác: This is... (Đây là...) và hỏi xác nhận: Is that...? (Kia có phải...?)',
      dialogue: { kido: '"This is my friend, Bill."', child: '"Nice to meet you, Bill!"' },
      tip: 'Dùng "This is" cho người/vật ở gần và "That is" cho người/vật ở xa!',
      quiz: { question: 'Hoàn thành câu: "___ is my friend, Tony."', options: [{ text: 'A. This', isCorrect: true }, { text: 'B. Are', isCorrect: false }, { text: 'C. What', isCorrect: false }] }
    },
    {
      id: 4,
      title: 'Unit 4: Our bodies',
      themeColor: 'cyan',
      vocab: [{ word: 'face' }, { word: 'hand' }, { word: 'eye' }, { word: 'ear' }, { word: 'touch' }],
      sentences: [
        { en: 'Touch your hair.', vi: 'Hãy chạm vào tóc của bạn.' },
        { en: 'Open your eyes.', vi: 'Hãy mở mắt ra.' }
      ],
      grammar: 'Mệnh lệnh cơ bản chỉ bộ phận cơ thể: Touch your... / Open your...',
      dialogue: { kido: '"Touch your nose!"', child: '"Here is my nose!"' },
      tip: 'Luyện tập trò chơi "Simon says" để nhớ tên các bộ phận cơ thể thật nhanh nha!',
      quiz: { question: 'Từ "eye" nghĩa là gì?', options: [{ text: 'A. Mắt', isCorrect: true }, { text: 'B. Tai', isCorrect: false }, { text: 'C. Tay', isCorrect: false }] }
    },
    {
      id: 5,
      title: 'Unit 5: My hobbies',
      themeColor: 'pink',
      vocab: [{ word: 'singing' }, { word: 'dancing' }, { word: 'cooking' }, { word: 'painting' }, { word: 'swimming' }],
      sentences: [
        { en: 'What is your hobby? - It is singing.', vi: 'Sở thích của cậu là gì? - Đó là hát.' },
        { en: 'I like dancing and cooking.', vi: 'Tớ thích nhảy và nấu ăn.' }
      ],
      grammar: 'Hỏi và trả lời về sở thích: What is your hobby? - It is + V-ing.',
      dialogue: { kido: '"What is your hobby?"', child: '"It is swimming! I love water."' },
      tip: 'Các từ chỉ sở thích thường kết thúc bằng đuôi -ing (singing, dancing)!',
      quiz: { question: 'Điền từ còn thiếu: "What is your ___? - It is dancing."', options: [{ text: 'A. hobby', isCorrect: true }, { text: 'B. name', isCorrect: false }, { text: 'C. friend', isCorrect: false }] }
    }
  ],
  '3-final-1': [
    { id: 1, title: 'Unit 1: Hello', themeColor: 'emerald', vocab: [{ word: 'hello' }, { word: 'hi' }], sentences: [{ en: 'Hello, I am Nam.', vi: 'Xin chào, tớ là Nam.' }], grammar: 'Hello / Hi', dialogue: { kido: '"Hello Nam!"', child: '"Hi Kido!"' }, tip: 'Chào hỏi', quiz: { question: 'Hello nghĩa là gì?', options: [{ text: 'A. Xin chào', isCorrect: true }] } },
    { id: 2, title: 'Unit 2: Our names', themeColor: 'purple', vocab: [{ word: 'name' }], sentences: [{ en: 'What is your name?', vi: 'Tên bạn là gì?' }], grammar: 'What is your name?', dialogue: { kido: '"My name is Kido."', child: '"Nice name!"' }, tip: 'Hỏi tên', quiz: { question: 'Name nghĩa là gì?', options: [{ text: 'A. Tên', isCorrect: true }] } },
    { id: 3, title: 'Unit 3: Our friends', themeColor: 'orange', vocab: [{ word: 'friend' }], sentences: [{ en: 'This is my friend.', vi: 'Đây là bạn tớ.' }], grammar: 'This is my friend', dialogue: { kido: '"Meet Tony!"', child: '"Hello Tony!"' }, tip: 'Giới thiệu bạn', quiz: { question: 'Friend nghĩa là gì?', options: [{ text: 'A. Người bạn', isCorrect: true }] } },
    { id: 4, title: 'Unit 4: Our bodies', themeColor: 'cyan', vocab: [{ word: 'hand' }, { word: 'foot' }], sentences: [{ en: 'Touch your face.', vi: 'Chạm vào mặt.' }], grammar: 'Touch your...', dialogue: { kido: '"Touch your nose!"', child: '"Got it!"' }, tip: 'Bộ phận cơ thể', quiz: { question: 'Hand là gì?', options: [{ text: 'A. Bàn tay', isCorrect: true }] } },
    { id: 5, title: 'Unit 5: My hobbies', themeColor: 'pink', vocab: [{ word: 'singing' }], sentences: [{ en: 'My hobby is singing.', vi: 'Sở thích là hát.' }], grammar: 'My hobby is...', dialogue: { kido: '"Sing a song!"', child: '"La la la!"' }, tip: 'Sở thích', quiz: { question: 'Singing là gì?', options: [{ text: 'A. Ca hát', isCorrect: true }] } },
    { id: 6, title: 'Unit 6: Our school', themeColor: 'emerald', vocab: [{ word: 'school' }, { word: 'library' }], sentences: [{ en: 'Look at our school.', vi: 'Look at our school.' }], grammar: 'Is this our school?', dialogue: { kido: '"Big library!"', child: '"Read books!"' }, tip: 'Trường học', quiz: { question: 'Library là gì?', options: [{ text: 'A. Thư viện', isCorrect: true }] } },
    { id: 7, title: 'Unit 7: Classroom instructions', themeColor: 'purple', vocab: [{ word: 'stand' }, { word: 'sit' }], sentences: [{ en: 'Stand up, please.', vi: 'Hãy đứng lên.' }], grammar: 'Stand up / Sit down', dialogue: { kido: '"Sit down please."', child: '"Thank you!"' }, tip: 'Nội quy lớp', quiz: { question: 'Stand up là gì?', options: [{ text: 'A. Đứng lên', isCorrect: true }] } },
    { id: 8, title: 'Unit 8: My school things', themeColor: 'orange', vocab: [{ word: 'ruler' }, { word: 'eraser' }], sentences: [{ en: 'I have an eraser.', vi: 'Tớ có tẩy.' }], grammar: 'I have an eraser', dialogue: { kido: '"Need a ruler?"', child: '"Yes please!"' }, tip: 'Đồ dùng học tập', quiz: { question: 'Eraser là gì?', options: [{ text: 'A. Cục tẩy', isCorrect: true }] } },
    { id: 9, title: 'Unit 9: Colours', themeColor: 'cyan', vocab: [{ word: 'red' }, { word: 'yellow' }, { word: 'blue' }], sentences: [{ en: 'It is yellow.', vi: 'Nó có màu vàng.' }], grammar: 'What colour is it?', dialogue: { kido: '"What colour?"', child: '"It is blue!"' }, tip: 'Màu sắc', quiz: { question: 'Yellow là màu gì?', options: [{ text: 'A. Màu vàng', isCorrect: true }] } },
    { id: 10, title: 'Unit 10: Break time activities', themeColor: 'pink', vocab: [{ word: 'chess' }, { word: 'football' }], sentences: [{ en: 'Play chess at break time.', vi: 'Chơi cờ lúc ra ra chơi.' }], grammar: 'Play chess', dialogue: { kido: '"Play football?"', child: '"Let us play!"' }, tip: 'Giờ ra chơi', quiz: { question: 'Chess là gì?', options: [{ text: 'A. Cờ vua', isCorrect: true }] } }
  ],
  '3-midterm-2': [
    { id: 11, title: 'Unit 11: My family', themeColor: 'emerald', vocab: [{ word: 'father' }, { word: 'mother' }, { word: 'brother' }], sentences: [{ en: 'This is my father.', vi: 'Đây là bố tớ.' }], grammar: 'Who is this?', dialogue: { kido: '"Who is he?"', child: '"He is my father."' }, tip: 'Gia đình', quiz: { question: 'Father là ai?', options: [{ text: 'A. Bố / Cha', isCorrect: true }] } },
    { id: 12, title: 'Unit 12: My house', themeColor: 'purple', vocab: [{ word: 'living room' }, { word: 'kitchen' }], sentences: [{ en: 'There is a living room.', vi: 'Có phòng khách.' }], grammar: 'There is a...', dialogue: { kido: '"Where is mom?"', child: '"In the kitchen."' }, tip: 'Căn nhà', quiz: { question: 'Kitchen là gì?', options: [{ text: 'A. Phòng bếp', isCorrect: true }] } },
    { id: 13, title: 'Unit 13: Where is my book?', themeColor: 'orange', vocab: [{ word: 'desk' }, { word: 'chair' }, { word: 'bed' }], sentences: [{ en: 'It is on the desk.', vi: 'Nó ở trên bàn.' }], grammar: 'Where is the...?', dialogue: { kido: '"Where is book?"', child: '"On desk!"' }, tip: 'Vị trí đồ vật', quiz: { question: 'Desk là gì?', options: [{ text: 'A. Bàn học', isCorrect: true }] } },
    { id: 14, title: 'Unit 14: My bedroom', themeColor: 'cyan', vocab: [{ word: 'fan' }, { word: 'door' }, { word: 'window' }], sentences: [{ en: 'There are two fans.', vi: 'Có hai cái quạt.' }], grammar: 'There are two...', dialogue: { kido: '"How many fans?"', child: '"Two fans!"' }, tip: 'Phòng ngủ', quiz: { question: 'Fan là gì?', options: [{ text: 'A. Cái quạt', isCorrect: true }] } },
    { id: 15, title: 'Unit 15: At the dining table', themeColor: 'pink', vocab: [{ word: 'bread' }, { word: 'rice' }, { word: 'meat' }], sentences: [{ en: 'Would you like some bread?', vi: 'Cậu ăn chút bánh mì nhé?' }], grammar: 'Would you like some...?', dialogue: { kido: '"Bread please!"', child: '"Here you go!"' }, tip: 'Bàn ăn', quiz: { question: 'Bread là gì?', options: [{ text: 'A. Bánh mì', isCorrect: true }] } }
  ],
  '3-final-2': [
    { id: 11, title: 'Unit 11: My family', themeColor: 'emerald', vocab: [{ word: 'sister' }], sentences: [{ en: 'She is my sister.', vi: 'Cô ấy là chị tớ.' }], grammar: 'She is my...', dialogue: { kido: '"Pretty sister!"', child: '"Thank you!"' }, tip: 'Gia đình', quiz: { question: 'Sister là ai?', options: [{ text: 'A. Chị / Em gái', isCorrect: true }] } },
    { id: 12, title: 'Unit 12: My house', themeColor: 'purple', vocab: [{ word: 'garden' }], sentences: [{ en: 'A big garden.', vi: 'Khu vườn to.' }], grammar: 'Big garden', dialogue: { kido: '"Nice garden!"', child: '"I love it!"' }, tip: 'Ngôi nhà', quiz: { question: 'Garden là gì?', options: [{ text: 'A. Khu vườn', isCorrect: true }] } },
    { id: 13, title: 'Unit 13: Where is my book?', themeColor: 'orange', vocab: [{ word: 'under' }], sentences: [{ en: 'Under the bed.', vi: 'Dưới gầm giường.' }], grammar: 'Under', dialogue: { kido: '"Look under!"', child: '"Found it!"' }, tip: 'Giới từ', quiz: { question: 'Under là gì?', options: [{ text: 'A. Ở dưới', isCorrect: true }] } },
    { id: 14, title: 'Unit 14: My bedroom', themeColor: 'cyan', vocab: [{ word: 'lamp' }], sentences: [{ en: 'A desk lamp.', vi: 'Đèn bàn.' }], grammar: 'Desk lamp', dialogue: { kido: '"Bright lamp!"', child: '"Study time!"' }, tip: 'Đèn học', quiz: { question: 'Lamp là gì?', options: [{ text: 'A. Cái đèn', isCorrect: true }] } },
    { id: 15, title: 'Unit 15: At the dining table', themeColor: 'pink', vocab: [{ word: 'fish' }], sentences: [{ en: 'Eat fish.', vi: 'Ăn cá.' }], grammar: 'Eat fish', dialogue: { kido: '"Fresh fish!"', child: '"Yummy!"' }, tip: 'Bữa ăn', quiz: { question: 'Fish là gì?', options: [{ text: 'A. Con cá', isCorrect: true }] } },
    { id: 16, title: 'Unit 16: My pets', themeColor: 'emerald', vocab: [{ word: 'dog' }, { word: 'cat' }, { word: 'parrot' }], sentences: [{ en: 'I have a parrot.', vi: 'Tớ có con vẹt.' }], grammar: 'I have a pet', dialogue: { kido: '"Talking parrot!"', child: '"Hello Kido!"' }, tip: 'Thú cưng', quiz: { question: 'Parrot là gì?', options: [{ text: 'A. Con vẹt', isCorrect: true }] } },
    { id: 17, title: 'Unit 17: Our toys', themeColor: 'purple', vocab: [{ word: 'robot' }, { word: 'doll' }, { word: 'car' }], sentences: [{ en: 'I have a big red robot.', vi: 'Tớ có con robot đỏ to.' }], grammar: 'My favourite toy', dialogue: { kido: '"Cool robot!"', child: '"It walks!"' }, tip: 'Đồ chơi yêu thích', quiz: { question: 'Robot là gì?', options: [{ text: 'A. Người máy', isCorrect: true }] } },
    { id: 18, title: 'Unit 18: Playing in the park', themeColor: 'orange', vocab: [{ word: 'slide' }, { word: 'swing' }, { word: 'seesaw' }], sentences: [{ en: 'I play on the swing.', vi: 'Tớ chơi xích đu.' }], grammar: 'Park activities', dialogue: { kido: '"High swing!"', child: '"Wheee!"' }, tip: 'Trò chơi công viên', quiz: { question: 'Swing là gì?', options: [{ text: 'A. Xích đu', isCorrect: true }] } },
    { id: 19, title: 'Unit 19: Outdoor activities', themeColor: 'cyan', vocab: [{ word: 'skating' }, { word: 'cycling' }, { word: 'running' }], sentences: [{ en: 'I like cycling with friends.', vi: 'Tớ thích đi xe đạp cùng bạn.' }], grammar: 'Outdoor sports', dialogue: { kido: '"Cycle fast!"', child: '"Be careful!"' }, tip: 'Hoạt động ngoài trời', quiz: { question: 'Cycling là gì?', options: [{ text: 'A. Đi xe đạp', isCorrect: true }] } },
    { id: 20, title: 'Unit 20: At the zoo', themeColor: 'pink', vocab: [{ word: 'elephant' }, { word: 'tiger' }, { word: 'monkey' }], sentences: [{ en: 'The elephant is huge.', vi: 'Con voi rất to lớn.' }], grammar: 'Zoo animals', dialogue: { kido: '"Look at elephant!"', child: '"Long trunk!"' }, tip: 'Động vật sở thú', quiz: { question: 'Elephant là gì?', options: [{ text: 'A. Con voi', isCorrect: true }] } }
  ],

  // ==================== GRADE 4 ====================
  '4-midterm-1': [
    {
      id: 1,
      title: 'Unit 1: My hometown',
      themeColor: 'emerald',
      vocab: [{ word: 'city' }, { word: 'village' }, { word: 'town' }, { word: 'countryside' }],
      sentences: [
        { en: 'Where are you from? - I am from Vietnam.', vi: 'Cậu từ đâu đến? - Tớ đến từ Việt Nam.' },
        { en: 'I live in a quiet village.', vi: 'Tớ sống ở một ngôi làng yên bình.' }
      ],
      grammar: 'Hỏi quê quán: Where are you from? - I am from... và miêu tả nơi sống.',
      dialogue: { kido: '"Where are you from?"', child: '"I am from Hanoi, Vietnam!"' },
      tip: 'Nhớ viết hoa chữ cái đầu của tên quốc gia và thành phố nhé!',
      quiz: { question: 'Dịch câu: "Where are you from?"', options: [{ text: 'A. Bạn đến từ đâu?', isCorrect: true }, { text: 'B. Bạn sống ở đâu?', isCorrect: false }, { text: 'C. Quê bạn có đẹp không?', isCorrect: false }] }
    },
    {
      id: 2,
      title: 'Unit 2: Time and daily routines',
      themeColor: 'purple',
      vocab: [{ word: 'clock' }, { word: 'o clock' }, { word: 'morning' }, { word: 'afternoon' }],
      sentences: [
        { en: 'What time is it? - It is seven o clock.', vi: 'Mấy giờ rồi? - Bây giờ là 7 giờ đúng.' },
        { en: 'I get up at six o clock in the morning.', vi: 'Tớ thức dậy lúc 6 giờ sáng.' }
      ],
      grammar: 'Hỏi giờ: What time is it? - It is + [giờ] + o clock. Dùng giới từ "at" trước mốc giờ.',
      dialogue: { kido: '"What time do you go to school?"', child: '"At seven o clock in the morning!"' },
      tip: 'Chỉ dùng "o clock" cho giờ tròn đúng (như 6:00, 7:00) thôi nha bé!',
      quiz: { question: 'Điền giới từ đúng: "I get up ___ 6 o clock."', options: [{ text: 'A. at', isCorrect: true }, { text: 'B. in', isCorrect: false }, { text: 'C. on', isCorrect: false }] }
    },
    {
      id: 3,
      title: 'Unit 3: My week',
      themeColor: 'orange',
      vocab: [{ word: 'Monday' }, { word: 'Wednesday' }, { word: 'Friday' }, { word: 'Sunday' }],
      sentences: [
        { en: 'What day is it today? - It is Monday.', vi: 'Hôm nay là thứ mấy? - Hôm nay là Thứ Hai.' },
        { en: 'I play football on Sundays.', vi: 'Tớ chơi đá bóng vào các Chủ Nhật.' }
      ],
      grammar: 'Hỏi thứ trong tuần: What day is it today? Dùng giới từ "on" trước các thứ.',
      dialogue: { kido: '"What do you do on Saturdays?"', child: '"I go swimming with my dad!"' },
      tip: 'Tất cả các thứ trong tuần trong Tiếng Anh đều phải viết hoa chữ cái đầu!',
      quiz: { question: 'Thứ Hai trong tiếng Anh là gì?', options: [{ text: 'A. Monday', isCorrect: true }, { text: 'B. Sunday', isCorrect: false }, { text: 'C. Friday', isCorrect: false }] }
    },
    {
      id: 4,
      title: 'Unit 4: My birthday party',
      themeColor: 'cyan',
      vocab: [{ word: 'January' }, { word: 'May' }, { word: 'October' }, { word: 'present' }],
      sentences: [
        { en: 'When is your birthday? - It is in May.', vi: 'Sinh nhật cậu khi nào? - Vào tháng Năm.' },
        { en: 'My birthday is on the 5th of October.', vi: 'Sinh nhật tớ vào ngày 5 tháng 10.' }
      ],
      grammar: 'Hỏi ngày sinh nhật: When is your birthday? Dùng "in" với tháng, "on" với ngày tháng.',
      dialogue: { kido: '"When is your birthday?"', child: '"It is in August! I will have a big party."' },
      tip: 'Dùng IN cho tháng (in May), dùng ON cho ngày cụ thể (on 5th of May)!',
      quiz: { question: 'Điền từ đúng: "My birthday is ___ June."', options: [{ text: 'A. in', isCorrect: true }, { text: 'B. on', isCorrect: false }, { text: 'C. at', isCorrect: false }] }
    },
    {
      id: 5,
      title: 'Unit 5: Things we can do',
      themeColor: 'pink',
      vocab: [{ word: 'swim' }, { word: 'sing' }, { word: 'play guitar' }, { word: 'cook' }],
      sentences: [
        { en: 'Can you swim? - Yes, I can.', vi: 'Cậu biết bơi không? - Tớ có biết.' },
        { en: 'I can play the guitar, but I cannot cook.', vi: 'Tớ biết chơi guitar nhưng không biết nấu ăn.' }
      ],
      grammar: 'Hỏi khả năng: Can you + V? - Yes, I can. / No, I cannot (can\'t).',
      dialogue: { kido: '"Can you speak English?"', child: '"Yes, I can speak English very well!"' },
      tip: 'Sau động từ khuyết thiếu CAN luôn là động từ nguyên thể nhé!',
      quiz: { question: 'Trả lời câu hỏi: "Can you swim?"', options: [{ text: 'A. Yes, I can.', isCorrect: true }, { text: 'B. I am fine.', isCorrect: false }, { text: 'C. No, I am not.', isCorrect: false }] }
    }
  ],
  '4-final-1': [
    { id: 1, title: 'Unit 1: My hometown', themeColor: 'emerald', vocab: [{ word: 'city' }], sentences: [{ en: 'I live in a city.', vi: 'Tớ sống ở thành phố.' }], grammar: 'I live in...', dialogue: { kido: '"Where live?"', child: '"In city!"' }, tip: 'Quê hương', quiz: { question: 'City nghĩa là gì?', options: [{ text: 'A. Thành phố', isCorrect: true }] } },
    { id: 2, title: 'Unit 2: Time and daily routines', themeColor: 'purple', vocab: [{ word: 'clock' }], sentences: [{ en: 'It is 7 o clock.', vi: 'Bây giờ 7 giờ.' }], grammar: 'What time is it?', dialogue: { kido: '"Time for school!"', child: '"Let us go!"' }, tip: 'Thời gian', quiz: { question: 'Clock nghĩa là gì?', options: [{ text: 'A. Đồng hồ', isCorrect: true }] } },
    { id: 3, title: 'Unit 3: My week', themeColor: 'orange', vocab: [{ word: 'Monday' }], sentences: [{ en: 'Today is Monday.', vi: 'Hôm nay Thứ Hai.' }], grammar: 'What day is it?', dialogue: { kido: '"Happy Monday!"', child: '"Study hard!"' }, tip: 'Các ngày trong tuần', quiz: { question: 'Monday là thứ mấy?', options: [{ text: 'A. Thứ Hai', isCorrect: true }] } },
    { id: 4, title: 'Unit 4: My birthday party', themeColor: 'cyan', vocab: [{ word: 'birthday' }], sentences: [{ en: 'When is birthday?', vi: 'Khi nào sinh nhật?' }], grammar: 'When is your birthday?', dialogue: { kido: '"Party time!"', child: '"Yay!"' }, tip: 'Sinh nhật', quiz: { question: 'Birthday nghĩa là gì?', options: [{ text: 'A. Sinh nhật', isCorrect: true }] } },
    { id: 5, title: 'Unit 5: Things we can do', themeColor: 'pink', vocab: [{ word: 'swim' }], sentences: [{ en: 'I can swim.', vi: 'Tớ biết bơi.' }], grammar: 'I can + V', dialogue: { kido: '"Swim fast!"', child: '"Yes I can!"' }, tip: 'Khả năng', quiz: { question: 'Swim nghĩa là gì?', options: [{ text: 'A. Bơi lội', isCorrect: true }] } },
    { id: 6, title: 'Unit 6: Our school facilities', themeColor: 'emerald', vocab: [{ word: 'computer room' }], sentences: [{ en: 'We have a computer room.', vi: 'Có phòng máy tính.' }], grammar: 'Facilities', dialogue: { kido: '"Computers!"', child: '"Learn IT!"' }, tip: 'Cơ sở vật chất', quiz: { question: 'Computer room là gì?', options: [{ text: 'A. Phòng máy tính', isCorrect: true }] } },
    { id: 7, title: 'Unit 7: Our timetables', themeColor: 'purple', vocab: [{ word: 'Maths' }, { word: 'English' }], sentences: [{ en: 'I have English on Tuesday.', vi: 'Có môn Tiếng Anh thứ Ba.' }], grammar: 'Subject timetable', dialogue: { kido: '"Love English!"', child: '"Me too!"' }, tip: 'Thời khóa biểu', quiz: { question: 'Maths là môn gì?', options: [{ text: 'A. Môn Toán', isCorrect: true }] } },
    { id: 8, title: 'Unit 8: My favourite subjects', themeColor: 'orange', vocab: [{ word: 'Art' }, { word: 'Music' }], sentences: [{ en: 'My favourite subject is Art.', vi: 'Môn yêu thích là Mỹ thuật.' }], grammar: 'Favourite subject', dialogue: { kido: '"Draw a pic!"', child: '"I love Art!"' }, tip: 'Môn học yêu thích', quiz: { question: 'Art là môn gì?', options: [{ text: 'A. Mỹ thuật', isCorrect: true }] } },
    { id: 9, title: 'Unit 9: Our sports day', themeColor: 'cyan', vocab: [{ word: 'Sports Day' }], sentences: [{ en: 'Sports Day is in November.', vi: 'Ngày hội thể thao tháng 11.' }], grammar: 'Sports day', dialogue: { kido: '"Run fast!"', child: '"Win a cup!"' }, tip: 'Sự kiện trường', quiz: { question: 'Sports Day là gì?', options: [{ text: 'A. Ngày hội thể thao', isCorrect: true }] } },
    { id: 10, title: 'Unit 10: Our school sports', themeColor: 'pink', vocab: [{ word: 'badminton' }, { word: 'volleyball' }], sentences: [{ en: 'Play badminton.', vi: 'Chơi cầu lông.' }], grammar: 'Play sports', dialogue: { kido: '"Play badminton?"', child: '"Let us play!"' }, tip: 'Môn thể thao', quiz: { question: 'Badminton là môn gì?', options: [{ text: 'A. Cầu lông', isCorrect: true }] } }
  ],
  '4-midterm-2': [
    { id: 11, title: 'Unit 11: My home address', themeColor: 'emerald', vocab: [{ word: 'street' }, { word: 'road' }, { word: 'lane' }], sentences: [{ en: 'I live in Green Street.', vi: 'Tớ sống ở phố Xanh.' }], grammar: 'Where do you live?', dialogue: { kido: '"Your address?"', child: '"10 Green Street."' }, tip: 'Địa chỉ nhà', quiz: { question: 'Street nghĩa là gì?', options: [{ text: 'A. Con đường / Phố', isCorrect: true }] } },
    { id: 12, title: 'Unit 12: Jobs', themeColor: 'purple', vocab: [{ word: 'doctor' }, { word: 'teacher' }, { word: 'nurse' }], sentences: [{ en: 'My mother is a doctor.', vi: 'Mẹ tớ là bác sĩ.' }], grammar: 'What does your father do?', dialogue: { kido: '"What job?"', child: '"A doctor!"' }, tip: 'Nghề nghiệp', quiz: { question: 'Doctor nghĩa là gì?', options: [{ text: 'A. Bác sĩ', isCorrect: true }] } },
    { id: 13, title: 'Unit 13: Appearance and personality', themeColor: 'orange', vocab: [{ word: 'tall' }, { word: 'short' }, { word: 'kind' }], sentences: [{ en: 'He is tall and kind.', vi: 'Anh ấy cao và tốt bụng.' }], grammar: 'What does he look like?', dialogue: { kido: '"Is he tall?"', child: '"Yes he is!"' }, tip: 'Ngoại hình', quiz: { question: 'Tall nghĩa là gì?', options: [{ text: 'A. Cao lớn', isCorrect: true }] } },
    { id: 14, title: 'Unit 14: Daily activities', themeColor: 'cyan', vocab: [{ word: 'wash face' }, { word: 'brush teeth' }], sentences: [{ en: 'I brush my teeth every morning.', vi: 'Tớ đánh răng mỗi sáng.' }], grammar: 'Daily routines', dialogue: { kido: '"Brush teeth!"', child: '"Clean teeth!"' }, tip: 'Thói quen hàng ngày', quiz: { question: 'Brush teeth là gì?', options: [{ text: 'A. Đánh răng', isCorrect: true }] } },
    { id: 15, title: 'Unit 15: At the shopping mall', themeColor: 'pink', vocab: [{ word: 'clothes' }, { word: 'shoes' }], sentences: [{ en: 'How much is this shirt?', vi: 'Áo này bao nhiêu tiền?' }], grammar: 'How much is it?', dialogue: { kido: '"How much?"', child: '"Ten dollars!"' }, tip: 'Mua sắm', quiz: { question: 'Clothes là gì?', options: [{ text: 'A. Quần áo', isCorrect: true }] } }
  ],
  '4-final-2': [
    { id: 11, title: 'Unit 11: My home address', themeColor: 'emerald', vocab: [{ word: 'address' }], sentences: [{ en: 'What is your address?', vi: 'Địa chỉ bạn là gì?' }], grammar: 'Address', dialogue: { kido: '"Tell address!"', child: '"Main Road!"' }, tip: 'Địa chỉ', quiz: { question: 'Address là gì?', options: [{ text: 'A. Địa chỉ', isCorrect: true }] } },
    { id: 12, title: 'Unit 12: Jobs', themeColor: 'purple', vocab: [{ word: 'pilot' }], sentences: [{ en: 'A brave pilot.', vi: 'Phi công dũng cảm.' }], grammar: 'Pilot', dialogue: { kido: '"Fly plane!"', child: '"Cool job!"' }, tip: 'Nghề phi công', quiz: { question: 'Pilot là gì?', options: [{ text: 'A. Phi công', isCorrect: true }] } },
    { id: 13, title: 'Unit 13: Appearance and personality', themeColor: 'orange', vocab: [{ word: 'friendly' }], sentences: [{ en: 'She is friendly.', vi: 'Cô ấy thân thiện.' }], grammar: 'Personality', dialogue: { kido: '"Nice girl!"', child: '"Very friendly!"' }, tip: 'Tính cách', quiz: { question: 'Friendly là gì?', options: [{ text: 'A. Thân thiện', isCorrect: true }] } },
    { id: 14, title: 'Unit 14: Daily activities', themeColor: 'cyan', vocab: [{ word: 'shower' }], sentences: [{ en: 'Take a shower.', vi: 'Tắm gội.' }], grammar: 'Take a shower', dialogue: { kido: '"Clean body!"', child: '"Fresh!"' }, tip: 'Hoạt động', quiz: { question: 'Shower là gì?', options: [{ text: 'A. Tắm vòi hoa sen', isCorrect: true }] } },
    { id: 15, title: 'Unit 15: At the shopping mall', themeColor: 'pink', vocab: [{ word: 'bakery' }], sentences: [{ en: 'Buy bread at bakery.', vi: 'Mua bánh tiệm bánh.' }], grammar: 'At bakery', dialogue: { kido: '"Fresh bread!"', child: '"Yummy!"' }, tip: 'Tiệm bánh', quiz: { question: 'Bakery là gì?', options: [{ text: 'A. Tiệm bánh mì', isCorrect: true }] } },
    { id: 16, title: 'Unit 16: Weather', themeColor: 'emerald', vocab: [{ word: 'rainy' }, { word: 'sunny' }, { word: 'cloudy' }], sentences: [{ en: 'What is the weather like? - It is sunny.', vi: 'Thời tiết thế nào? - Trời nắng.' }], grammar: 'Weather report', dialogue: { kido: '"Is it rainy?"', child: '"No, it is sunny!"' }, tip: 'Thời tiết', quiz: { question: 'Sunny là gì?', options: [{ text: 'A. Nắng ấm', isCorrect: true }] } },
    { id: 17, title: 'Unit 17: In the bookshop', themeColor: 'purple', vocab: [{ word: 'comic book' }, { word: 'dictionary' }, { word: 'notebook' }], sentences: [{ en: 'I want to buy a comic book.', vi: 'Tớ muốn mua một cuốn truyện tranh.' }], grammar: 'Want to buy', dialogue: { kido: '"Buy comic book?"', child: '"Yes, please!"' }, tip: 'Nhà sách', quiz: { question: 'Comic book là gì?', options: [{ text: 'A. Truyện tranh', isCorrect: true }] } },
    { id: 18, title: 'Unit 18: At the supermarket', themeColor: 'orange', vocab: [{ word: 'apple' }, { word: 'banana' }, { word: 'orange' }], sentences: [{ en: 'How much are these apples?', vi: 'Mấy quả táo này bao nhiêu tiền?' }], grammar: 'Plural prices', dialogue: { kido: '"Fresh apples!"', child: '"Buy three!"' }, tip: 'Siêu thị', quiz: { question: 'Supermarket là gì?', options: [{ text: 'A. Siêu thị', isCorrect: true }] } },
    { id: 19, title: 'Unit 19: Animal world', themeColor: 'cyan', vocab: [{ word: 'crocodile' }, { word: 'giraffe' }, { word: 'hippo' }], sentences: [{ en: 'The giraffe has a long neck.', vi: 'Hươu cao cổ có cái cổ dài.' }], grammar: 'Describing animals', dialogue: { kido: '"Tall giraffe!"', child: '"So high!"' }, tip: 'Thế giới động vật', quiz: { question: 'Giraffe là con gì?', options: [{ text: 'A. Hươu cao cổ', isCorrect: true }] } },
    { id: 20, title: 'Unit 20: Summer holidays', themeColor: 'pink', vocab: [{ word: 'island' }, { word: 'seafood' }, { word: 'boat' }], sentences: [{ en: 'We took a boat to the island.', vi: 'Bọn tớ đi thuyền ra đảo.' }], grammar: 'Summer trips', dialogue: { kido: '"Go by boat!"', child: '"Exciting!"' }, tip: 'Du lịch hè', quiz: { question: 'Island là gì?', options: [{ text: 'A. Hòn đảo', isCorrect: true }] } }
  ],

  // ==================== GRADE 5 ====================
  '5-midterm-1': [
    {
      id: 1,
      title: 'Unit 1: All about me',
      themeColor: 'emerald',
      vocab: [{ word: 'address' }, { word: 'hometown' }, { word: 'flat' }, { word: 'tower' }],
      sentences: [
        { en: 'What is your address? - It is 81 Tran Hung Dao Street.', vi: 'Địa chỉ của bạn là gì? - Là số 81 đường Trần Hưng Đạo.' },
        { en: 'I live in a modern flat on the third floor.', vi: 'Tớ sống trong một căn hộ hiện đại ở tầng 3.' }
      ],
      grammar: 'Hỏi địa chỉ chi tiết: What is your address? và mô tả nơi ở (flat, tower, lane).',
      dialogue: { kido: '"Do you live in a house or a flat?"', child: '"I live in a big flat in Landmark Tower!"' },
      tip: 'Đừng quên dùng "on" cho tầng nhà (on the third floor) nha!',
      quiz: { question: 'Từ "flat" nghĩa là gì?', options: [{ text: 'A. Căn hộ', isCorrect: true }, { text: 'B. Ngôi nhà', isCorrect: false }, { text: 'C. Con hẻm', isCorrect: false }] }
    },
    {
      id: 2,
      title: 'Unit 2: Our school',
      themeColor: 'purple',
      vocab: [{ word: 'always' }, { word: 'usually' }, { word: 'often' }, { word: 'sometimes' }, { word: 'never' }],
      sentences: [
        { en: 'How often do you go to the library? - I usually go twice a week.', vi: 'Cậu có thường xuyên đến thư viện không? - Tớ thường đi 2 lần một tuần.' },
        { en: 'I always do my homework in the evening.', vi: 'Tớ luôn làm bài tập về nhà vào buổi tối.' }
      ],
      grammar: 'Hỏi tần suất: How often do you...? Trả lời bằng Trạng từ tần suất (always, usually) hoặc once/twice/three times a week.',
      dialogue: { kido: '"How often do you play computer games?"', child: '"I only play once a week on Sundays."' },
      tip: '1 lần = once, 2 lần = twice, từ 3 lần trở lên = three times, four times...',
      quiz: { question: '"Twice a week" nghĩa là gì?', options: [{ text: 'A. 2 lần một tuần', isCorrect: true }, { text: 'B. 1 lần một tuần', isCorrect: false }, { text: 'C. Hàng ngày', isCorrect: false }] }
    },
    {
      id: 3,
      title: 'Unit 3: My foreign friends',
      themeColor: 'orange',
      vocab: [{ word: 'English' }, { word: 'American' }, { word: 'Japanese' }, { word: 'Australian' }],
      sentences: [
        { en: 'Where did you go on holiday? - I went to Japan.', vi: 'Cậu đã đi đâu vào kỳ nghỉ? - Tớ đã đi Nhật Bản.' },
        { en: 'I have two Japanese penfriends.', vi: 'Tớ có hai người bạn qua thư người Nhật.' }
      ],
      grammar: 'Thì Quá khứ đơn hỏi địa điểm đã đi: Where did you go? - I went to...',
      dialogue: { kido: '"Where did you go last summer?"', child: '"I went to Phu Quoc Island with my family!"' },
      tip: 'Quá khứ của GO là WENT bé nhé!',
      quiz: { question: 'Dạng quá khứ của động từ "go" là gì?', options: [{ text: 'A. went', isCorrect: true }, { text: 'B. goed', isCorrect: false }, { text: 'C. gone', isCorrect: false }] }
    },
    {
      id: 4,
      title: 'Unit 4: Our free-time activities',
      themeColor: 'cyan',
      vocab: [{ word: 'picnic' }, { word: 'party' }, { word: 'funfair' }, { word: 'enjoy' }],
      sentences: [
        { en: 'Did you go to the party? - Yes, I did.', vi: 'Cậu có đến bữa tiệc không? - Tớ có.' },
        { en: 'We enjoyed good food and played games.', vi: 'Bọn tớ đã thưởng thức đồ ăn ngon và chơi trò chơi.' }
      ],
      grammar: 'Câu hỏi Yes/No ở thì Quá khứ đơn: Did you + V? - Yes, I did. / No, I didn\'t.',
      dialogue: { kido: '"Did you enjoy the funfair yesterday?"', child: '"Yes! We rode the Ferris wheel and had a great time!"' },
      tip: 'Thêm đuôi -ed vào sau động từ có quy tắc khi kể về chuyện quá khứ (enjoyed, played)!',
      quiz: { question: 'Trả lời câu hỏi: "Did you go to the party?"', options: [{ text: 'A. Yes, I did.', isCorrect: true }, { text: 'B. Yes, I do.', isCorrect: false }, { text: 'C. Yes, I am.', isCorrect: false }] }
    },
    {
      id: 5,
      title: 'Unit 5: My future job',
      themeColor: 'pink',
      vocab: [{ word: 'pilot' }, { word: 'architect' }, { word: 'writer' }, { word: 'astronaut' }],
      sentences: [
        { en: 'What would you like to be in the future? - I would like to be an architect.', vi: 'Cậu muốn làm nghề gì trong tương lai? - Tớ muốn trở thành một kiến trúc sư.' },
        { en: 'Why would you like to be a writer? - Because I want to write stories for children.', vi: 'Tại sao cậu muốn làm nhà văn? - Vì tớ muốn viết truyện cho trẻ em.' }
      ],
      grammar: 'Hỏi ước mơ nghề nghiệp: What would you like to be in the future? - I would like to be...',
      dialogue: { kido: '"What would you like to be?"', child: '"I would like to be a pilot to fly planes!"' },
      tip: 'Would like = want (muốn), viết tắt là \'d like (I\'d like to be)!',
      quiz: { question: 'Dịch câu: "I would like to be an architect."', options: [{ text: 'A. Tớ muốn trở thành kiến trúc sư.', isCorrect: true }, { text: 'B. Tớ là phi công.', isCorrect: false }, { text: 'C. Tớ muốn làm bác sĩ.', isCorrect: false }] }
    }
  ],
  '5-final-1': [
    { id: 1, title: 'Unit 1: All about me', themeColor: 'emerald', vocab: [{ word: 'address' }], sentences: [{ en: 'My address is 10 Main Street.', vi: 'Địa chỉ tớ số 10 đường Chính.' }], grammar: 'What is your address?', dialogue: { kido: '"Where live?"', child: '"Main street!"' }, tip: 'Mô tả địa chỉ', quiz: { question: 'Address là gì?', options: [{ text: 'A. Địa chỉ', isCorrect: true }] } },
    { id: 2, title: 'Unit 2: Our school', themeColor: 'purple', vocab: [{ word: 'usually' }], sentences: [{ en: 'I usually study.', vi: 'Tớ thường học.' }], grammar: 'How often...?', dialogue: { kido: '"Study hard?"', child: '"Usually!"' }, tip: 'Tần suất', quiz: { question: 'Usually là gì?', options: [{ text: 'A. Thường xuyên', isCorrect: true }] } },
    { id: 3, title: 'Unit 3: My foreign friends', themeColor: 'orange', vocab: [{ word: 'Japan' }], sentences: [{ en: 'I went to Japan.', vi: 'Tớ đã đến Nhật.' }], grammar: 'Where did you go?', dialogue: { kido: '"Nice trip!"', child: '"Awesome!"' }, tip: 'Du lịch', quiz: { question: 'Japan là nước nào?', options: [{ text: 'A. Nhật Bản', isCorrect: true }] } },
    { id: 4, title: 'Unit 4: Our free-time activities', themeColor: 'cyan', vocab: [{ word: 'party' }], sentences: [{ en: 'Did you go to party?', vi: 'Có dự tiệc không?' }], grammar: 'Did you...?', dialogue: { kido: '"Fun party?"', child: '"Yes!"' }, tip: 'Hoạt động', quiz: { question: 'Party là gì?', options: [{ text: 'A. Bữa tiệc', isCorrect: true }] } },
    { id: 5, title: 'Unit 5: My future job', themeColor: 'pink', vocab: [{ word: 'architect' }], sentences: [{ en: 'I would like to be an architect.', vi: 'Muốn làm kiến trúc sư.' }], grammar: 'What would you like to be?', dialogue: { kido: '"Build house?"', child: '"Yes!"' }, tip: 'Nghề nghiệp tương lai', quiz: { question: 'Architect là gì?', options: [{ text: 'A. Kiến trúc sư', isCorrect: true }] } },
    { id: 6, title: 'Unit 6: Our school trip', themeColor: 'emerald', vocab: [{ word: 'zoo' }, { word: 'museum' }], sentences: [{ en: 'We went to the museum.', vi: 'Bọn tớ đến bảo tàng.' }], grammar: 'Where did you go on school trip?', dialogue: { kido: '"Big museum!"', child: '"Learned history!"' }, tip: 'Chuyến tham quan', quiz: { question: 'Museum là gì?', options: [{ text: 'A. Bảo tàng', isCorrect: true }] } },
    { id: 7, title: 'Unit 7: Our favourite stories', themeColor: 'purple', vocab: [{ word: 'Snow White' }, { word: 'fable' }], sentences: [{ en: 'What do you think of Snow White? - She is kind.', vi: 'Cậu nghĩ gì về Bạch Tuyết? - Cô ấy tốt bụng.' }], grammar: 'What do you think of...?', dialogue: { kido: '"Like Snow White?"', child: '"Yes, very kind!"' }, tip: 'Truyện cổ tích', quiz: { question: 'Fable là gì?', options: [{ text: 'A. Truyện ngụ ngôn', isCorrect: true }] } },
    { id: 8, title: 'Unit 8: In the countryside', themeColor: 'orange', vocab: [{ word: 'fresh air' }, { word: 'peaceful' }], sentences: [{ en: 'The countryside is peaceful.', vi: 'Quê nhà yên bình.' }], grammar: 'Comparative adjectives', dialogue: { kido: '"Fresh air!"', child: '"Love it!"' }, tip: 'Vùng quê tươi đẹp', quiz: { question: 'Peaceful là gì?', options: [{ text: 'A. Yên bình', isCorrect: true }] } },
    { id: 9, title: 'Unit 9: Protecting our environment', themeColor: 'cyan', vocab: [{ word: 'recycle' }, { word: 'plant trees' }], sentences: [{ en: 'We should plant more trees.', vi: 'Nên trồng thêm cây xanh.' }], grammar: 'Should / Shouldn\'t', dialogue: { kido: '"Plant trees!"', child: '"Save Earth!"' }, tip: 'Bảo vệ môi trường', quiz: { question: 'Recycle là gì?', options: [{ text: 'A. Tái chế', isCorrect: true }] } },
    { id: 10, title: 'Unit 10: Our health and wellness', themeColor: 'pink', vocab: [{ word: 'headache' }, { word: 'fever' }, { word: 'rest' }], sentences: [{ en: 'What is the matter with you? - I have a headache.', vi: 'Cậu bị sao thế? - Tớ bị đau đầu.' }], grammar: 'What is the matter?', dialogue: { kido: '"Have a fever?"', child: '"Need to rest!"' }, tip: 'Sức khỏe', quiz: { question: 'Headache là gì?', options: [{ text: 'A. Đau đầu', isCorrect: true }] } }
  ],
  '5-midterm-2': [
    { id: 11, title: 'Unit 11: Family weekend', themeColor: 'emerald', vocab: [{ word: 'camping' }, { word: 'barbecue' }], sentences: [{ en: 'We had a barbecue in the garden.', vi: 'Bọn tớ nướng thịt ngoài vườn.' }], grammar: 'Past simple events', dialogue: { kido: '"Tasty barbecue!"', child: '"So good!"' }, tip: 'Cuối tuần gia đình', quiz: { question: 'Camping là gì?', options: [{ text: 'A. Cắm trại', isCorrect: true }] } },
    { id: 12, title: 'Unit 12: Our gadgets', themeColor: 'purple', vocab: [{ word: 'laptop' }, { word: 'smartphone' }], sentences: [{ en: 'I use a laptop to study English.', vi: 'Tớ dùng laptop học Tiếng Anh.' }], grammar: 'Use something to do something', dialogue: { kido: '"Smart laptop!"', child: '"Helpful!"' }, tip: 'Thiết bị công nghệ', quiz: { question: 'Laptop là gì?', options: [{ text: 'A. Máy tính xách tay', isCorrect: true }] } },
    { id: 13, title: 'Unit 13: In the science lab', themeColor: 'orange', vocab: [{ word: 'experiment' }, { word: 'robot' }], sentences: [{ en: 'We do science experiments.', vi: 'Bọn tớ làm thí nghiệm khoa học.' }], grammar: 'Science activities', dialogue: { kido: '"Cool science!"', child: '"I love experiments!"' }, tip: 'Phòng thí nghiệm', quiz: { question: 'Experiment là gì?', options: [{ text: 'A. Thí nghiệm', isCorrect: true }] } },
    { id: 14, title: 'Unit 14: Seasons and weather', themeColor: 'cyan', vocab: [{ word: 'spring' }, { word: 'summer' }], sentences: [{ en: 'I like summer.', vi: 'Tớ thích mùa hè.' }], grammar: 'Seasons', dialogue: { kido: '"Favourite season?"', child: '"Summer!"' }, tip: 'Các mùa', quiz: { question: 'Spring là mùa gì?', options: [{ text: 'A. Mùa xuân', isCorrect: true }] } },
    { id: 15, title: 'Unit 15: Means of transport', themeColor: 'pink', vocab: [{ word: 'underground' }], sentences: [{ en: 'Go by underground.', vi: 'Đi bằng tàu điện ngầm.' }], grammar: 'Transport', dialogue: { kido: '"How to go?"', child: '"By underground!"' }, tip: 'Phương tiện', quiz: { question: 'Underground là gì?', options: [{ text: 'A. Tàu điện ngầm', isCorrect: true }] } }
  ],
  '5-final-2': [
    { id: 11, title: 'Unit 11: Family weekend', themeColor: 'emerald', vocab: [{ word: 'camping' }], sentences: [{ en: 'Go camping.', vi: 'Đi cắm trại.' }], grammar: 'Go camping', dialogue: { kido: '"Fun camp!"', child: '"Yes!"' }, tip: 'Dã ngoại', quiz: { question: 'Camping là gì?', options: [{ text: 'A. Cắm trại', isCorrect: true }] } },
    { id: 12, title: 'Unit 12: Our gadgets', themeColor: 'purple', vocab: [{ word: 'tablet' }], sentences: [{ en: 'A smart tablet.', vi: 'Máy tính bảng thông minh.' }], grammar: 'Tablet', dialogue: { kido: '"Read books on tablet!"', child: '"Convenient!"' }, tip: 'Công nghệ', quiz: { question: 'Tablet là gì?', options: [{ text: 'A. Máy tính bảng', isCorrect: true }] } },
    { id: 13, title: 'Unit 13: In the science lab', themeColor: 'orange', vocab: [{ word: 'lab' }], sentences: [{ en: 'Work in the lab.', vi: 'Làm việc ở lab.' }], grammar: 'In the lab', dialogue: { kido: '"Science lab!"', child: '"Fun!"' }, tip: 'Khoa học', quiz: { question: 'Lab là gì?', options: [{ text: 'A. Phòng thí nghiệm', isCorrect: true }] } },
    { id: 14, title: 'Unit 14: Seasons and weather', themeColor: 'cyan', vocab: [{ word: 'winter' }], sentences: [{ en: 'Winter is cold.', vi: 'Mùa đông lạnh.' }], grammar: 'Winter', dialogue: { kido: '"Cold winter!"', child: '"Wear coat!"' }, tip: 'Thời tiết mùa', quiz: { question: 'Winter là mùa gì?', options: [{ text: 'A. Mùa đông', isCorrect: true }] } },
    { id: 15, title: 'Unit 15: Means of transport', themeColor: 'pink', vocab: [{ word: 'plane' }], sentences: [{ en: 'Fly by plane.', vi: 'Đi bằng máy bay.' }], grammar: 'By plane', dialogue: { kido: '"Fast plane!"', child: '"High sky!"' }, tip: 'Máy bay', quiz: { question: 'Plane là gì?', options: [{ text: 'A. Máy bay', isCorrect: true }] } },
    { id: 16, title: 'Unit 16: Visiting landmarks', themeColor: 'emerald', vocab: [{ word: 'Halong Bay' }], sentences: [{ en: 'I visited Halong Bay.', vi: 'Tớ đã thăm vịnh Hạ Long.' }], grammar: 'Landmarks', dialogue: { kido: '"Beautiful bay!"', child: '"Proud!"' }, tip: 'Danh lam thắng cảnh', quiz: { question: 'Halong Bay là gì?', options: [{ text: 'A. Vịnh Hạ Long', isCorrect: true }] } },
    { id: 17, title: 'Unit 17: Life stories of famous people', themeColor: 'purple', vocab: [{ word: 'hero' }, { word: 'inventor' }], sentences: [{ en: 'He was a great inventor.', vi: 'Ông ấy từng là nhà sáng chế vĩ đại.' }], grammar: 'Past simple stories', dialogue: { kido: '"Inspiring story!"', child: '"I learn a lot!"' }, tip: 'Nhân vật lịch sử', quiz: { question: 'Inventor là gì?', options: [{ text: 'A. Nhà sáng chế', isCorrect: true }] } },
    { id: 18, title: 'Unit 18: Future goals', themeColor: 'orange', vocab: [{ word: 'scientist' }, { word: 'space' }], sentences: [{ en: 'I want to explore outer space.', vi: 'Tớ muốn khám phá vũ trụ bao la.' }], grammar: 'Future aspirations', dialogue: { kido: '"Fly to space?"', child: '"Dream big!"' }, tip: 'Ước mơ tương lai', quiz: { question: 'Scientist là gì?', options: [{ text: 'A. Nhà khoa học', isCorrect: true }] } },
    { id: 19, title: 'Unit 19: Which one would you like to visit?', themeColor: 'cyan', vocab: [{ word: 'pagoda' }, { word: 'bridge' }], sentences: [{ en: 'Which one would you like to visit, One Pillar Pagoda or Trang Tien Bridge?', vi: 'Cậu muốn thăm Chùa Một Cột hay Cầu Tràng Tiền?' }], grammar: 'Which one would you like to visit?', dialogue: { kido: '"Visit Pagoda?"', child: '"Yes, it is famous!"' }, tip: 'Lựa chọn điểm đến', quiz: { question: 'Pagoda nghĩa là gì?', options: [{ text: 'A. Ngôi chùa', isCorrect: true }] } },
    { id: 20, title: 'Unit 20: Farewell party', themeColor: 'pink', vocab: [{ word: 'memories' }, { word: 'friends' }], sentences: [{ en: 'We had wonderful memories in primary school.', vi: 'Bọn tớ có nhiều kỷ niệm đẹp thời tiểu học.' }], grammar: 'Looking back and ahead', dialogue: { kido: '"Goodbye Grade 5!"', child: '"Hello secondary school!"' }, tip: 'Chia tay cấp 1', quiz: { question: 'Memories nghĩa là gì?', options: [{ text: 'A. Kỷ niệm', isCorrect: true }] } }
  ]
};

// Helper to get an icon for common English words
function getWordIcon(word: string): string {
  const lower = word.toLowerCase();
  if (lower.includes('ball') || lower.includes('football')) return '⚽';
  if (lower.includes('bike')) return '🚲';
  if (lower.includes('book')) return '📚';
  if (lower.includes('car')) return '🚗';
  if (lower.includes('cat')) return '🐱';
  if (lower.includes('dog')) return '🐶';
  if (lower.includes('duck')) return '🦆';
  if (lower.includes('fish')) return '🐟';
  if (lower.includes('horse')) return '🐴';
  if (lower.includes('kite')) return '🪁';
  if (lower.includes('leaf')) return '🍃';
  if (lower.includes('lemon')) return '🍋';
  if (lower.includes('map')) return '🗺️';
  if (lower.includes('milk')) return '🥛';
  if (lower.includes('sun')) return '☀️';
  if (lower.includes('tree')) return '🌳';
  if (lower.includes('pen') || lower.includes('pencil')) return '✏️';
  if (lower.includes('ruler')) return '📏';
  if (lower.includes('bag')) return '🎒';
  if (lower.includes('sing') || lower.includes('music')) return '🎤';
  if (lower.includes('swim')) return '🏊';
  if (lower.includes('dance')) return '💃';
  if (lower.includes('paint') || lower.includes('art')) return '🎨';
  if (lower.includes('guitar')) return '🎸';
  if (lower.includes('clock') || lower.includes('time')) return '⏰';
  if (lower.includes('vietnam')) return '🇻🇳';
  if (lower.includes('flat') || lower.includes('tower') || lower.includes('building')) return '🏢';
  if (lower.includes('island') || lower.includes('sea')) return '🏖️';
  if (lower.includes('pilot')) return '🧑‍✈️';
  if (lower.includes('doctor')) return '👨‍⚕️';
  if (lower.includes('teacher')) return '👩‍🏫';
  if (lower.includes('friend')) return '🤝';
  if (lower.includes('eye')) return '👀';
  if (lower.includes('hand') || lower.includes('touch')) return '✋';
  if (lower.includes('jam') || lower.includes('juice')) return '🧃';
  if (lower.includes('cake')) return '🍰';
  if (lower.includes('apple')) return '🍎';
  if (lower.includes('hill') || lower.includes('mountain')) return '🏔️';
  return '🌟';
}

// Helper for deterministic sentence scrambling (no Math.random glitches)
function deterministicScramble(sentence: string, seed: number): string[] {
  const words = sentence.trim().split(/\s+/);
  if (words.length <= 1) return words;
  const result = [...words];
  for (let i = result.length - 1; i > 0; i--) {
    const j = (seed * 7 + i * 13) % (i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  if (result.join(' ') === sentence && result.length > 1) {
    const temp = result[0];
    result[0] = result[1];
    result[1] = temp;
  }
  return result;
}

// Function to generate dynamic sample exam data for any Grade (1-5), Semester, Exam Number, and optional Unit/Bài
export function getSampleExamData(
  grade: number, 
  semester: string, 
  examNum: number,
  unitId: number | 'all' = 'all'
): SampleExamData {
  const key = `${grade}-${semester}`;
  const outlines = unitOutlinesByGradeSemester[key] || unitOutlinesByGradeSemester['1-midterm-1'];
  
  let selectedUnits = outlines;
  if (unitId !== 'all') {
    const found = outlines.find(u => u.id === unitId);
    if (found) {
      selectedUnits = [found];
    }
  }

  // Pick target units based on examNum offset for maximum variety across Đề 1 - Đề 5
  const uLen = selectedUnits.length;
  const idx1 = (examNum - 1) % uLen;
  const idx2 = (examNum) % uLen;
  const idx3 = (examNum + 1) % uLen;
  const idx4 = (examNum + 2) % uLen;

  const u1 = selectedUnits[idx1];
  const u2 = selectedUnits[idx2];
  const u3 = selectedUnits[idx3];
  const u4 = selectedUnits[idx4];

  const v1 = u1.vocab[0] || { word: 'apple' };
  const v2 = u1.vocab[1] || u2.vocab[0] || { word: 'book' };
  const v3 = u2.vocab[0] || { word: 'cat' };
  const v4 = u3.vocab[0] || u4.vocab[0] || { word: 'dog' };

  const s1 = u1.sentences[0] || { en: 'This is my book.', vi: 'Đây là quyển sách của tôi.' };
  const s2 = u2.sentences[0] || u1.sentences[1] || { en: 'I have a ball.', vi: 'Tôi có một quả bóng.' };

  const unitTitleText = unitId !== 'all' ? u1.title : `Lớp ${grade} - Đề số ${examNum}`;

  // Distractor word generator for Odd-One-Out based on examNum & grade
  const distractors = [
    ['red', 'yellow', 'blue', 'green'],
    ['happy', 'sad', 'big', 'small'],
    ['teacher', 'doctor', 'nurse', 'pilot'],
    ['Monday', 'Friday', 'Sunday', 'Wednesday'],
    ['always', 'usually', 'often', 'never']
  ];
  const currentDistractorList = distractors[(examNum - 1) % distractors.length];
  const oddWord = currentDistractorList[(grade + examNum) % currentDistractorList.length];

  return {
    partA: {
      q1: {
        text: `Nghe và chọn câu đúng (Đề ${examNum} - ${u1.title}):`,
        audioText: s1.en,
        options: [
          { label: 'A', text: s1.en, isCorrect: true },
          { label: 'B', text: s2.en, isCorrect: false }
        ]
      },
      q2: {
        text: `Nghe và chọn đáp án phù hợp (Đề ${examNum} - ${u2.title}):`,
        audioText: s2.en,
        options: [
          { label: 'A', text: s2.en, isCorrect: true },
          { label: 'B', text: `I see a ${v4.word}.`, isCorrect: false }
        ]
      },
      q3: {
        text: `Nghe và chọn từ/hình đúng cho âm (${v1.word}):`,
        audioText: v1.word,
        items: [
          { key: 'A', icon: getWordIcon(v1.word), label: `A. ${v1.word}`, isCorrect: true },
          { key: 'B', icon: getWordIcon(v3.word), label: `B. ${v3.word}`, isCorrect: false },
          { key: 'C', icon: getWordIcon(v4.word), label: `C. ${v4.word}`, isCorrect: false }
        ]
      },
      q4: {
        text: `Nghe và chọn từ/hình đúng cho âm (${v2.word}):`,
        audioText: v2.word,
        items: [
          { key: 'A', icon: getWordIcon(v3.word), label: `A. ${v3.word}`, isCorrect: false },
          { key: 'B', icon: getWordIcon(v2.word), label: `B. ${v2.word}`, isCorrect: true },
          { key: 'C', icon: getWordIcon(v4.word), label: `C. ${v4.word}`, isCorrect: false }
        ]
      }
    },
    partB: {
      q1: {
        text: `Đọc và đánh dấu Đúng (✓) hoặc Sai (✗) theo hình:`,
        icon: getWordIcon(v1.word),
        statement: `This is a ${v1.word}.`,
        isCorrect: true
      },
      q2: {
        text: `Đọc và đánh dấu Đúng (✓) hoặc Sai (✗) theo hình:`,
        icon: getWordIcon(v2.word),
        statement: `I see a ${v4.word}.`,
        isCorrect: false
      },
      q3: {
        text: `Chọn từ khác nhóm (Odd one out - Đề số ${examNum}):`,
        options: [
          { text: `A. ${v1.word}`, isCorrect: false },
          { text: `B. ${v2.word}`, isCorrect: false },
          { text: `C. ${v3.word}`, isCorrect: false },
          { text: `D. ${oddWord}`, isCorrect: true }
        ]
      },
      q4: {
        text: `Hoàn thành đoạn văn theo từ gợi ý:`,
        wordBank: [v1.word, v2.word, v3.word, v4.word],
        passageTemplate: [
          { id: 1, prefix: `Look! This is my `, answer: v1.word, suffix: '.' },
          { id: 2, prefix: `I like to play with `, answer: v2.word, suffix: ' every day.' }
        ]
      }
    },
    partC: {
      q1: {
        text: `Nhìn hình và điền từ còn thiếu:`,
        icon: getWordIcon(v1.word),
        prefix: 'Point to the ',
        answer: v1.word,
        suffix: '.'
      },
      q2: {
        text: `Nhìn hình và điền từ còn thiếu:`,
        icon: getWordIcon(v2.word),
        prefix: 'I can see a ',
        answer: v2.word,
        suffix: '.'
      },
      q3: {
        text: `Sắp xếp các từ thành câu hoàn chỉnh (Đề ${examNum} - Câu 1):`,
        scrambled: deterministicScramble(s1.en, examNum * 11 + grade),
        answer: s1.en
      },
      q4: {
        text: `Sắp xếp các từ thành câu hoàn chỉnh (Đề ${examNum} - Câu 2):`,
        scrambled: deterministicScramble(s2.en, examNum * 17 + grade),
        answer: s2.en
      }
    },
    partD: {
      title: `Phỏng vấn Nói Tiếng Anh với Kido AI (Lớp ${grade} - Đề số ${examNum})`,
      subtitle: `Bé nhấn nút Micro và đọc to phản xạ nói Tiếng Anh cùng Kido AI nhé!`,
      questions: [
        {
          id: 1,
          questionText: `Hello! What is your name and how old are you?`,
          tip: `Trả lời: Hello Kido! My name is [Tên bé], I am ${grade + 5} years old.`,
          suggestedAnswer: `Hello Kido! My name is Minh and I am ${grade + 5} years old!`
        },
        {
          id: 2,
          questionText: `Can you read aloud this sentence: "${s1.en}"?`,
          tip: `Đọc to chuẩn xác: ${s1.en} (${s1.vi})`,
          suggestedAnswer: s1.en
        },
        {
          id: 3,
          questionText: `What is your favourite vocabulary in ${u1.title}? Is it "${v1.word}"?`,
          tip: `Trả lời: My favourite word is ${v1.word}.`,
          suggestedAnswer: `My favourite word is ${v1.word}!`
        },
        {
          id: 4,
          questionText: `Let's practice the sentence: "${s2.en}"`,
          tip: `Đọc to câu: ${s2.en} (${s2.vi})`,
          suggestedAnswer: s2.en
        },
        {
          id: 5,
          questionText: `Great job! Do you enjoy studying English Grade ${grade} with Kido AI?`,
          tip: `Trả lời: Yes, I love learning English with Kido AI!`,
          suggestedAnswer: `Yes! I love learning English Grade ${grade} with Kido AI!`
        }
      ]
    }
  };
}
