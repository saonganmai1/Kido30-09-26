export interface GradeVocabItem {
  id: number;
  word: string;
  label: string;
  phonetic: string;
  meaningVi: string;
  icon: string;
  mastered?: boolean;
  colorTheme?: 'green' | 'orange' | 'purple' | 'yellow' | 'white' | 'pink' | 'blue' | 'red' | 'cyan';
  example?: string;
}

export const grade1VocabList: GradeVocabItem[] = [
  // 1 - 16
  { id: 1, word: 'best friend', label: 'Best Friend', phonetic: "/bes 'frend/", meaningVi: 'bạn thân nhất', icon: '👫', mastered: false, colorTheme: 'blue' },
  { id: 2, word: 'ball', label: 'Ball', phonetic: '/bɔːl/', meaningVi: 'quả bóng', icon: '🏐', mastered: true, colorTheme: 'green' },
  { id: 3, word: 'bike', label: 'Bike', phonetic: '/baɪk/', meaningVi: 'xe đạp', icon: '🚲', mastered: true, colorTheme: 'green' },
  { id: 4, word: 'book', label: 'Book', phonetic: '/bʊk/', meaningVi: 'quyển sách', icon: '📖' },
  { id: 5, word: 'Bill', label: 'Bill', phonetic: '/bɪl/', meaningVi: 'bạn Bill', icon: '👦' },
  { id: 6, word: 'cake', label: 'Cake', phonetic: '/keɪk/', meaningVi: 'cái bánh', icon: '🎂' },
  { id: 7, word: 'car', label: 'Car', phonetic: '/kɑːr/', meaningVi: 'xe ô tô', icon: '🚗' },
  { id: 8, word: 'cat', label: 'Cat', phonetic: '/kæt/', meaningVi: 'con mèo', icon: '🐱' },
  { id: 9, word: 'cup', label: 'Cup', phonetic: '/kʌp/', meaningVi: 'cái cốc', icon: '☕' },
  { id: 10, word: 'apple', label: 'Apple', phonetic: '/ˈæp.əl/', meaningVi: 'quả táo', icon: '🍎' },
  { id: 11, word: 'bag', label: 'Bag', phonetic: '/bæɡ/', meaningVi: 'cái cặp', icon: '🎒' },
  { id: 12, word: 'can', label: 'Can', phonetic: '/kæn/', meaningVi: 'lon đồ uống', icon: '🥤' },
  { id: 13, word: 'hat', label: 'Hat', phonetic: '/hæt/', meaningVi: 'cái mũ', icon: '🎩' },
  { id: 14, word: 'desk', label: 'Desk', phonetic: '/desk/', meaningVi: 'cái bàn học', icon: '🪵' },
  { id: 15, word: 'dog', label: 'Dog', phonetic: '/dɒɡ/', meaningVi: 'con chó', icon: '🐶' },
  { id: 16, word: 'door', label: 'Door', phonetic: '/dɔːr/', meaningVi: 'cửa ra vào', icon: '🚪' },
  { id: 17, word: 'duck', label: 'Duck', phonetic: '/dʌk/', meaningVi: 'con vịt', icon: '🦆' },

  // 18 - 29
  { id: 18, word: 'chicken', label: 'Chicken', phonetic: '/ˈtʃɪk.ɪn/', meaningVi: 'thịt gà', icon: '🍗', colorTheme: 'orange' },
  { id: 19, word: 'chips', label: 'Chips', phonetic: '/tʃɪps/', meaningVi: 'khoai tây chiên', icon: '🍟', colorTheme: 'orange' },
  { id: 20, word: 'fish', label: 'Fish', phonetic: '/fɪʃ/', meaningVi: 'con cá', icon: '🐟', colorTheme: 'orange' },
  { id: 21, word: 'milk', label: 'Milk', phonetic: '/mɪlk/', meaningVi: 'sữa', icon: '🥛', colorTheme: 'orange' },
  { id: 22, word: 'bell', label: 'Bell', phonetic: '/bel/', meaningVi: 'cái chuông', icon: '🔔' },
  { id: 23, word: 'pen', label: 'Pen', phonetic: '/pen/', meaningVi: 'bút mực', icon: '🖊️' },
  { id: 24, word: 'pencil', label: 'Pencil', phonetic: '/ˈpen.səl/', meaningVi: 'bút chì', icon: '✏️' },
  { id: 25, word: 'red', label: 'Red', phonetic: '/red/', meaningVi: 'màu đỏ', icon: '🔴' },
  { id: 26, word: 'garden', label: 'Garden', phonetic: '/ˈɡɑː.dən/', meaningVi: 'khu vườn', icon: '🏡' },
  { id: 27, word: 'gate', label: 'Gate', phonetic: '/ɡeɪt/', meaningVi: 'cổng vườn', icon: '🚪' },
  { id: 28, word: 'girl', label: 'Girl', phonetic: '/ɡɜːl/', meaningVi: 'cô bé', icon: '👧' },
  { id: 29, word: 'goat', label: 'Goat', phonetic: '/ɡəʊt/', meaningVi: 'con dê', icon: '🐐' },

  // 30 - 37
  { id: 30, word: 'hair', label: 'Hair', phonetic: '/heər/', meaningVi: 'tóc', icon: '💇', colorTheme: 'purple' },
  { id: 31, word: 'hand', label: 'Hand', phonetic: '/hænd/', meaningVi: 'bàn tay', icon: '✋', colorTheme: 'purple' },
  { id: 32, word: 'head', label: 'Head', phonetic: '/hed/', meaningVi: 'cái đầu', icon: '💆', colorTheme: 'purple' },
  { id: 33, word: 'horse', label: 'Horse', phonetic: '/hɔːs/', meaningVi: 'con ngựa', icon: '🐴', colorTheme: 'purple' },
  { id: 34, word: 'clock', label: 'Clock', phonetic: '/klɒk/', meaningVi: 'cái đồng hồ', icon: '⏰' },
  { id: 35, word: 'lock', label: 'Lock', phonetic: '/lɒk/', meaningVi: 'ổ khóa', icon: '🔒' },
  { id: 36, word: 'mop', label: 'Mop', phonetic: '/mɒp/', meaningVi: 'cây lau nhà', icon: '🧹' },
  { id: 37, word: 'pot', label: 'Pot', phonetic: '/pɒt/', meaningVi: 'cái nồi', icon: '🍲' },

  // 38 - 53
  { id: 38, word: 'mango', label: 'Mango', phonetic: '/ˈmæŋ.ɡəʊ/', meaningVi: 'quả xoài', icon: '🥭' },
  { id: 39, word: 'monkey', label: 'Monkey', phonetic: '/ˈmʌŋ.ki/', meaningVi: 'con khỉ', icon: '🐒' },
  { id: 40, word: 'mother', label: 'Mother', phonetic: '/ˈmʌð.ər/', meaningVi: 'mẹ', icon: '👩' },
  { id: 41, word: 'mouse', label: 'Mouse', phonetic: '/maʊs/', meaningVi: 'con chuột', icon: '🐭' },
  { id: 42, word: 'bus', label: 'Bus', phonetic: '/bʌs/', meaningVi: 'xe buýt', icon: '🚌' },
  { id: 43, word: 'run', label: 'Run', phonetic: '/rʌn/', meaningVi: 'chạy bộ', icon: '🏃' },
  { id: 44, word: 'sun', label: 'Sun', phonetic: '/sʌn/', meaningVi: 'mặt trời', icon: '☀️' },
  { id: 45, word: 'truck', label: 'Truck', phonetic: '/trʌk/', meaningVi: 'xe ô tô tải', icon: '🚚' },
  { id: 46, word: 'lake', label: 'Lake', phonetic: '/leɪk/', meaningVi: 'hồ nước', icon: '🏞️' },
  { id: 47, word: 'leaf', label: 'Leaf', phonetic: '/liːf/', meaningVi: 'lá cây', icon: '🍃' },
  { id: 48, word: 'lemon', label: 'Lemon', phonetic: '/ˈlem.ən/', meaningVi: 'quả chanh', icon: '🍋' },
  { id: 49, word: 'Lucy', label: 'Lucy', phonetic: '/ˈluː.si/', meaningVi: 'bạn Lucy', icon: '👧' },
  { id: 50, word: 'banana', label: 'Banana', phonetic: '/bəˈnɑː.nə/', meaningVi: 'quả chuối', icon: '🍌' },
  { id: 51, word: 'noodles', label: 'Noodles', phonetic: '/ˈnuː.dəl/', meaningVi: 'mì', icon: '🍜' },
  { id: 52, word: 'nut', label: 'Nut', phonetic: '/nʌt/', meaningVi: 'hạt khô', icon: '🥜' },
  { id: 53, word: 'Nick', label: 'Nick', phonetic: '/nɪk/', meaningVi: 'bạn Nick', icon: '👦' },

  // 54 - 65
  { id: 54, word: 'teddy bear', label: 'Teddy bear', phonetic: '/ˈted.i beər/', meaningVi: 'gấu bông', icon: '🧸', colorTheme: 'yellow' },
  { id: 55, word: 'tiger', label: 'Tiger', phonetic: '/ˈtaɪ.ɡər/', meaningVi: 'con hổ', icon: '🐯', colorTheme: 'yellow' },
  { id: 56, word: 'top', label: 'Top', phonetic: '/tɒp/', meaningVi: 'con quay', icon: '🪀', colorTheme: 'yellow' },
  { id: 57, word: 'turtle', label: 'Turtle', phonetic: '/ˈtɜː.təl/', meaningVi: 'con rùa', icon: '🐢', colorTheme: 'yellow' },
  { id: 58, word: 'face', label: 'Face', phonetic: '/feɪs/', meaningVi: 'khuôn mặt', icon: '🧑' },
  { id: 59, word: 'father', label: 'Father', phonetic: '/ˈfɑː.ðər/', meaningVi: 'bố', icon: '👨' },
  { id: 60, word: 'foot', label: 'Foot', phonetic: '/fʊt/', meaningVi: 'bàn chân', icon: '🦶' },
  { id: 61, word: 'football', label: 'Football', phonetic: '/ˈfʊt.bɔːl/', meaningVi: 'môn bóng đá', icon: '⚽' },
  { id: 62, word: 'wash', label: 'Wash', phonetic: '/wɒʃ/', meaningVi: 'rửa, lau', icon: '🧼' },
  { id: 63, word: 'water', label: 'Water', phonetic: '/ˈwɔː.tər/', meaningVi: 'nước lọc', icon: '💧' },
  { id: 64, word: 'window', label: 'Window', phonetic: '/ˈwɪn.dəʊ/', meaningVi: 'cửa sổ', icon: '🪟' },
  { id: 65, word: 'Wendy', label: 'Wendy', phonetic: '/ˈwen.di/', meaningVi: 'bạn Wendy', icon: '👧' },
];
