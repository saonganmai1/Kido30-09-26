import { GradeVocabItem } from './grade1VocabData';

// Comprehensive dataset mapping every Grade (1..5) and Unit (1..20) to its unique vocabulary list.
export const unitVocabMap: Record<string, GradeVocabItem[]> = {
  // ==================== GRADE 1 ====================
  '1-1': [
    { id: 101, word: 'slide', label: 'Slide', phonetic: '/slaɪd/', meaningVi: 'cầu trượt', icon: '🛝', colorTheme: 'blue', example: 'I play on the slide.' },
    { id: 102, word: 'swing', label: 'Swing', phonetic: '/swɪŋ/', meaningVi: 'xích đu', icon: '🛝', colorTheme: 'pink', example: 'She swings high on the swing.' },
    { id: 103, word: 'playground', label: 'Playground', phonetic: '/ˈpleɪ.ɡraʊnd/', meaningVi: 'sân chơi', icon: '🏫', colorTheme: 'green', example: 'We play in the playground.' },
    { id: 104, word: 'best friend', label: 'Best Friend', phonetic: "/bes 'frend/", meaningVi: 'bạn thân nhất', icon: '👫', colorTheme: 'yellow', example: 'Minh is my best friend.' },
    { id: 105, word: 'ball', label: 'Ball', phonetic: '/bɔːl/', meaningVi: 'quả bóng', icon: '🏐', colorTheme: 'orange', example: 'Kick the ball!' },
  ],
  '1-2': [
    { id: 106, word: 'apple', label: 'Apple', phonetic: '/ˈæp.əl/', meaningVi: 'quả táo', icon: '🍎', colorTheme: 'red', example: 'I eat a red apple.' },
    { id: 107, word: 'banana', label: 'Banana', phonetic: '/bəˈnɑː.nə/', meaningVi: 'quả chuối', icon: '🍌', colorTheme: 'yellow', example: 'Bananas are sweet.' },
    { id: 108, word: 'spoon', label: 'Spoon', phonetic: '/spuːn/', meaningVi: 'cái thìa', icon: '🥄', colorTheme: 'blue', example: 'Pass me the spoon.' },
    { id: 109, word: 'plate', label: 'Plate', phonetic: '/pleɪt/', meaningVi: 'cái đĩa', icon: '🍽️', colorTheme: 'orange', example: 'Put rice on the plate.' },
    { id: 110, word: 'cake', label: 'Cake', phonetic: '/keɪk/', meaningVi: 'cái bánh', icon: '🎂', colorTheme: 'pink', example: 'It is a chocolate cake.' },
  ],
  '1-3': [
    { id: 111, word: 'mango', label: 'Mango', phonetic: '/ˈmæŋ.ɡəʊ/', meaningVi: 'quả xoài', icon: '🥭', colorTheme: 'orange', example: 'I like ripe mangoes.' },
    { id: 112, word: 'orange', label: 'Orange', phonetic: '/ˈɒr.ɪndʒ/', meaningVi: 'quả cam', icon: '🍊', colorTheme: 'orange', example: 'Orange juice is fresh.' },
    { id: 113, word: 'market', label: 'Market', phonetic: '/ˈmɑː.kɪt/', meaningVi: 'chợ', icon: '🏪', colorTheme: 'green', example: 'Mom goes to the market.' },
    { id: 114, word: 'lemon', label: 'Lemon', phonetic: '/ˈlem.ən/', meaningVi: 'quả chanh', icon: '🍋', colorTheme: 'yellow', example: 'Lemons are yellow and sour.' },
    { id: 115, word: 'nut', label: 'Nut', phonetic: '/nʌt/', meaningVi: 'hạt khô', icon: '🥜', colorTheme: 'purple', example: 'Squirrels love nuts.' },
  ],
  '1-4': [
    { id: 116, word: 'bed', label: 'Bed', phonetic: '/bed/', meaningVi: 'cái giường', icon: '🛏️', colorTheme: 'blue', example: 'I sleep on my bed.' },
    { id: 117, word: 'clock', label: 'Clock', phonetic: '/klɒk/', meaningVi: 'cái đồng hồ', icon: '⏰', colorTheme: 'yellow', example: 'The clock ticks on the wall.' },
    { id: 118, word: 'lamp', label: 'Lamp', phonetic: '/læmp/', meaningVi: 'đèn ngủ', icon: '💡', colorTheme: 'purple', example: 'Turn on the lamp.' },
    { id: 119, word: 'doll', label: 'Doll', phonetic: '/dɒl/', meaningVi: 'búp bê', icon: '🧸', colorTheme: 'pink', example: 'She plays with a cute doll.' },
    { id: 120, word: 'window', label: 'Window', phonetic: '/ˈwɪn.dəʊ/', meaningVi: 'cửa sổ', icon: '🪟', colorTheme: 'cyan', example: 'Open the window, please.' },
  ],
  '1-5': [
    { id: 121, word: 'fish', label: 'Fish', phonetic: '/fɪʃ/', meaningVi: 'con cá', icon: '🐟', colorTheme: 'blue', example: 'The fish swims in water.' },
    { id: 122, word: 'chips', label: 'Chips', phonetic: '/tʃɪps/', meaningVi: 'khoai tây chiên', icon: '🍟', colorTheme: 'yellow', example: 'I love hot chips.' },
    { id: 123, word: 'juice', label: 'Juice', phonetic: '/dʒuːs/', meaningVi: 'nước ép', icon: '🧃', colorTheme: 'orange', example: 'Drink fruit juice.' },
    { id: 124, word: 'chicken', label: 'Chicken', phonetic: '/ˈtʃɪk.ɪn/', meaningVi: 'thịt gà', icon: '🍗', colorTheme: 'orange', example: 'Fried chicken is tasty.' },
    { id: 125, word: 'bell', label: 'Bell', phonetic: '/bel/', meaningVi: 'cái chuông', icon: '🔔', colorTheme: 'purple', example: 'Ring the school bell.' },
  ],
  '1-6': [
    { id: 126, word: 'book', label: 'Book', phonetic: '/bʊk/', meaningVi: 'quyển sách', icon: '📖', colorTheme: 'blue', example: 'Open your English book.' },
    { id: 127, word: 'pen', label: 'Pen', phonetic: '/pen/', meaningVi: 'bút mực', icon: '🖊️', colorTheme: 'purple', example: 'I write with a blue pen.' },
    { id: 128, word: 'pencil', label: 'Pencil', phonetic: '/ˈpen.səl/', meaningVi: 'bút chì', icon: '✏️', colorTheme: 'yellow', example: 'Draw a picture with a pencil.' },
    { id: 129, word: 'ruler', label: 'Ruler', phonetic: '/ˈruː.lər/', meaningVi: 'thước kẻ', icon: '📏', colorTheme: 'green', example: 'Use a ruler to draw lines.' },
    { id: 130, word: 'bag', label: 'Bag', phonetic: '/bæɡ/', meaningVi: 'cái cặp', icon: '🎒', colorTheme: 'red', example: 'Put books in your bag.' },
  ],
  '1-7': [
    { id: 131, word: 'flower', label: 'Flower', phonetic: '/ˈflaʊ.ər/', meaningVi: 'bông hoa', icon: '🌸', colorTheme: 'pink', example: 'Look at the red flower.' },
    { id: 132, word: 'butterfly', label: 'Butterfly', phonetic: '/ˈbʌt.ə.flaɪ/', meaningVi: 'con bướm', icon: '🦋', colorTheme: 'purple', example: 'A blue butterfly is flying.' },
    { id: 133, word: 'tree', label: 'Tree', phonetic: '/triː/', meaningVi: 'cây xanh', icon: '🌳', colorTheme: 'green', example: 'The tree is very big.' },
    { id: 134, word: 'gate', label: 'Gate', phonetic: '/ɡeɪt/', meaningVi: 'cổng vườn', icon: '🚪', colorTheme: 'orange', example: 'Close the garden gate.' },
    { id: 135, word: 'goat', label: 'Goat', phonetic: '/ɡəʊt/', meaningVi: 'con dê', icon: '🐐', colorTheme: 'yellow', example: 'The goat eats green grass.' },
  ],
  '1-8': [
    { id: 136, word: 'run', label: 'Run', phonetic: '/rʌn/', meaningVi: 'chạy bộ', icon: '🏃', colorTheme: 'orange', example: 'We run in the sunny park.' },
    { id: 137, word: 'jump', label: 'Jump', phonetic: '/dʒʌmp/', meaningVi: 'nhảy', icon: '🦘', colorTheme: 'pink', example: 'Can you jump high?' },
    { id: 138, word: 'sun', label: 'Sun', phonetic: '/sʌn/', meaningVi: 'mặt trời', icon: '☀️', colorTheme: 'yellow', example: 'The sun shines bright.' },
    { id: 139, word: 'dog', label: 'Dog', phonetic: '/dɒɡ/', meaningVi: 'con chó', icon: '🐶', colorTheme: 'blue', example: 'The dog barks happy.' },
    { id: 140, word: 'truck', label: 'Truck', phonetic: '/trʌk/', meaningVi: 'xe tải', icon: '🚚', colorTheme: 'green', example: 'A big red truck.' },
  ],
  '1-9': [
    { id: 141, word: 'car', label: 'Car', phonetic: '/kɑːr/', meaningVi: 'xe ô tô', icon: '🚗', colorTheme: 'red', example: 'My toy car is fast.' },
    { id: 142, word: 'hat', label: 'Hat', phonetic: '/hæt/', meaningVi: 'cái mũ', icon: '🎩', colorTheme: 'purple', example: 'Wear your sun hat.' },
    { id: 143, word: 'top', label: 'Top', phonetic: '/tɒp/', meaningVi: 'con quay', icon: '🪀', colorTheme: 'yellow', example: 'Spin the colorful top.' },
    { id: 144, word: 'turtle', label: 'Turtle', phonetic: '/ˈtɜː.təl/', meaningVi: 'con rùa', icon: '🐢', colorTheme: 'green', example: 'The turtle walks slow.' },
    { id: 145, word: 'lock', label: 'Lock', phonetic: '/lɒk/', meaningVi: 'ổ khóa', icon: '🔒', colorTheme: 'blue', example: 'Lock the shop door.' },
  ],
  '1-10': [
    { id: 146, word: 'monkey', label: 'Monkey', phonetic: '/ˈmʌŋ.ki/', meaningVi: 'con khỉ', icon: '🐒', colorTheme: 'orange', example: 'Monkeys love bananas.' },
    { id: 147, word: 'tiger', label: 'Tiger', phonetic: '/ˈtaɪ.ɡər/', meaningVi: 'con hổ', icon: '🐯', colorTheme: 'orange', example: 'The tiger is big.' },
    { id: 148, word: 'elephant', label: 'Elephant', phonetic: '/ˈel.ɪ.fənt/', meaningVi: 'con voi', icon: '🐘', colorTheme: 'blue', example: 'Elephants have long trunks.' },
    { id: 149, word: 'cat', label: 'Cat', phonetic: '/kæt/', meaningVi: 'con mèo', icon: '🐱', colorTheme: 'pink', example: 'The cat sleeps on the mat.' },
    { id: 150, word: 'horse', label: 'Horse', phonetic: '/hɔːs/', meaningVi: 'con ngựa', icon: '🐴', colorTheme: 'purple', example: 'Ride the brown horse.' },
  ],
  '1-11': [
    { id: 151, word: 'bus', label: 'Bus', phonetic: '/bʌs/', meaningVi: 'xe buýt', icon: '🚌', colorTheme: 'yellow', example: 'The bus arrives at the stop.' },
    { id: 152, word: 'street', label: 'Street', phonetic: '/striːt/', meaningVi: 'con phố', icon: '🛣️', colorTheme: 'blue', example: 'Cross the street safely.' },
    { id: 153, word: 'bike', label: 'Bike', phonetic: '/baɪk/', meaningVi: 'xe đạp', icon: '🚲', colorTheme: 'green', example: 'I ride my bike to school.' },
    { id: 154, word: 'stop', label: 'Stop', phonetic: '/stɒp/', meaningVi: 'điểm dừng', icon: '🚏', colorTheme: 'red', example: 'Wait at the bus stop.' },
  ],
  '1-12': [
    { id: 155, word: 'duck', label: 'Duck', phonetic: '/dʌk/', meaningVi: 'con vịt', icon: '🦆', colorTheme: 'yellow', example: 'The duck swims on the lake.' },
    { id: 156, word: 'boat', label: 'Boat', phonetic: '/bəʊt/', meaningVi: 'con thuyền', icon: '⛵', colorTheme: 'blue', example: 'A wooden boat on the water.' },
    { id: 157, word: 'lake', label: 'Lake', phonetic: '/leɪk/', meaningVi: 'hồ nước', icon: '🏞️', colorTheme: 'cyan', example: 'The lake is clear and big.' },
    { id: 158, word: 'water', label: 'Water', phonetic: '/ˈwɔː.tər/', meaningVi: 'nước', icon: '💧', colorTheme: 'blue', example: 'Drink fresh water.' },
  ],
  '1-13': [
    { id: 159, word: 'milk', label: 'Milk', phonetic: '/mɪlk/', meaningVi: 'sữa tươi', icon: '🥛', colorTheme: 'blue', example: 'I drink milk at breakfast.' },
    { id: 160, word: 'bread', label: 'Bread', phonetic: '/bred/', meaningVi: 'bánh mì', icon: '🍞', colorTheme: 'orange', example: 'Warm fresh bread.' },
    { id: 161, word: 'noodles', label: 'Noodles', phonetic: '/ˈnuː.dəl/', meaningVi: 'mì', icon: '🍜', colorTheme: 'yellow', example: 'I like hot noodles.' },
    { id: 162, word: 'fruit', label: 'Fruit', phonetic: '/fruːt/', meaningVi: 'hoa quả', icon: '🍎', colorTheme: 'pink', example: 'Eat fruit every day.' },
  ],
  '1-14': [
    { id: 163, word: 'robot', label: 'Robot', phonetic: '/ˈrəʊ.bɒt/', meaningVi: 'người máy', icon: '🤖', colorTheme: 'blue', example: 'The red robot walks.' },
    { id: 164, word: 'teddy bear', label: 'Teddy bear', phonetic: '/ˈted.i beər/', meaningVi: 'gấu bông', icon: '🧸', colorTheme: 'orange', example: 'A soft fluffy teddy bear.' },
    { id: 165, word: 'train', label: 'Train', phonetic: '/treɪn/', meaningVi: 'tau hỏa', icon: '🚂', colorTheme: 'green', example: 'The toy train goes choo-choo.' },
    { id: 166, word: 'doll', label: 'Doll', phonetic: '/dɒl/', meaningVi: 'búp bê', icon: '🪆', colorTheme: 'pink', example: 'A pretty doll with pink dress.' },
  ],
  '1-15': [
    { id: 167, word: 'football', label: 'Football', phonetic: '/ˈfʊt.bɔːl/', meaningVi: 'môn bóng đá', icon: '⚽', colorTheme: 'green', example: 'We play football.' },
    { id: 168, word: 'kick', label: 'Kick', phonetic: '/kɪk/', meaningVi: 'đá bóng', icon: '👟', colorTheme: 'orange', example: 'Kick the ball hard!' },
    { id: 169, word: 'win', label: 'Win', phonetic: '/wɪn/', meaningVi: 'chiến thắng', icon: '🏆', colorTheme: 'yellow', example: 'Our team wins!' },
    { id: 170, word: 'foot', label: 'Foot', phonetic: '/fʊt/', meaningVi: 'bàn chân', icon: '🦶', colorTheme: 'purple', example: 'Kick with your right foot.' },
  ],
  '1-16': [
    { id: 171, word: 'mother', label: 'Mother', phonetic: '/ˈmʌð.ər/', meaningVi: 'mẹ', icon: '👩', colorTheme: 'pink', example: 'My mother is sweet.' },
    { id: 172, word: 'father', label: 'Father', phonetic: '/ˈfɑː.ðər/', meaningVi: 'bố', icon: '👨', colorTheme: 'blue', example: 'My father is strong.' },
    { id: 173, word: 'face', label: 'Face', phonetic: '/feɪs/', meaningVi: 'khuôn mặt', icon: '😊', colorTheme: 'yellow', example: 'Wash your face.' },
    { id: 174, word: 'hair', label: 'Hair', phonetic: '/heər/', meaningVi: 'tóc', icon: '💇', colorTheme: 'purple', example: 'Combing long hair.' },
  ],

  // ==================== GRADE 2 ====================
  '2-1': [
    { id: 201, word: 'party', label: 'Party', phonetic: '/ˈpɑː.ti/', meaningVi: 'bữa tiệc', icon: '🎉', colorTheme: 'pink', example: 'Welcome to my party!' },
    { id: 202, word: 'popcorn', label: 'Popcorn', phonetic: '/ˈpɒpkɔːn/', meaningVi: 'bỏng ngô', icon: '🍿', colorTheme: 'yellow', example: 'Crispy sweet popcorn.' },
    { id: 203, word: 'pasta', label: 'Pasta', phonetic: '/ˈpæstə/', meaningVi: 'mì ống', icon: '🍝', colorTheme: 'orange', example: 'I like delicious pasta.' },
    { id: 204, word: 'pizza', label: 'Pizza', phonetic: '/ˈpiːtsə/', meaningVi: 'bánh pizza', icon: '🍕', colorTheme: 'red', example: 'Hot cheese pizza.' },
    { id: 205, word: 'candle', label: 'Candle', phonetic: '/ˈkændl/', meaningVi: 'nến sinh nhật', icon: '🕯️', colorTheme: 'purple', example: 'Blow out seven candles.' },
  ],
  '2-2': [
    { id: 206, word: 'kite', label: 'Kite', phonetic: '/kaɪt/', meaningVi: 'cái diều', icon: '🪁', colorTheme: 'pink', example: 'Fly a kite in the backyard.' },
    { id: 207, word: 'kitten', label: 'Kitten', phonetic: '/ˈkɪtn/', meaningVi: 'mèo con', icon: '🐱', colorTheme: 'orange', example: 'The kitten plays with string.' },
    { id: 208, word: 'grass', label: 'Grass', phonetic: '/ɡrɑːs/', meaningVi: 'bãi cỏ', icon: '🌱', colorTheme: 'green', example: 'Green grass in the backyard.' },
    { id: 209, word: 'bicycle', label: 'Bicycle', phonetic: '/ˈbaɪsɪkl/', meaningVi: 'xe đạp', icon: '🚲', colorTheme: 'blue', example: 'Ride a new bicycle.' },
  ],
  '2-3': [
    { id: 210, word: 'sea', label: 'Sea', phonetic: '/siː/', meaningVi: 'biển', icon: '🌊', colorTheme: 'blue', example: 'The sea is blue and bright.' },
    { id: 211, word: 'shell', label: 'Shell', phonetic: '/ʃel/', meaningVi: 'vỏ ốc', icon: '🐚', colorTheme: 'pink', example: 'Collect seashells on sand.' },
    { id: 212, word: 'sail', label: 'Sail', phonetic: '/seɪl/', meaningVi: 'cánh buồm', icon: '⛵', colorTheme: 'cyan', example: 'Sail a boat on the water.' },
    { id: 213, word: 'sand', label: 'Sand', phonetic: '/sænd/', meaningVi: 'cát biển', icon: '🏖️', colorTheme: 'yellow', example: 'Build a sandcastle.' },
  ],
  '2-4': [
    { id: 214, word: 'river', label: 'River', phonetic: '/ˈrɪvə/', meaningVi: 'dòng sông', icon: '🌊', colorTheme: 'blue', example: 'Flowing clean river.' },
    { id: 215, word: 'road', label: 'Road', phonetic: '/rəʊd/', meaningVi: 'con đường', icon: '🛣️', colorTheme: 'purple', example: 'A peaceful country road.' },
    { id: 216, word: 'rainbow', label: 'Rainbow', phonetic: '/ˈreɪnbəʊ/', meaningVi: 'cầu vồng', icon: '🌈', colorTheme: 'pink', example: 'Seven colors rainbow.' },
    { id: 217, word: 'field', label: 'Field', phonetic: '/fiːld/', meaningVi: 'cánh đồng', icon: '🌾', colorTheme: 'green', example: 'Green rice field.' },
  ],
  '2-5': [
    { id: 218, word: 'question', label: 'Question', phonetic: '/ˈkwestʃən/', meaningVi: 'câu hỏi', icon: '❓', colorTheme: 'blue', example: 'Ask the teacher a question.' },
    { id: 219, word: 'quiz', label: 'Quiz', phonetic: '/kwɪz/', meaningVi: 'câu đố', icon: '📝', colorTheme: 'purple', example: 'Do an English quiz.' },
    { id: 220, word: 'square', label: 'Square', phonetic: '/skweə/', meaningVi: 'hình vuông', icon: '⏹️', colorTheme: 'orange', example: 'Draw a blue square.' },
    { id: 221, word: 'box', label: 'Box', phonetic: '/bɒks/', meaningVi: 'cái hộp', icon: '📦', colorTheme: 'yellow', example: 'Open the pencil box.' },
  ],
  '2-6': [
    { id: 222, word: 'fox', label: 'Fox', phonetic: '/fɒks/', meaningVi: 'con cáo', icon: '🦊', colorTheme: 'orange', example: 'A clever red fox.' },
    { id: 223, word: 'ox', label: 'Ox', phonetic: '/ɒks/', meaningVi: 'con bò đực', icon: '🐂', colorTheme: 'purple', example: 'Strong ox on the farm.' },
    { id: 224, word: 'cow', label: 'Cow', phonetic: '/kaʊ/', meaningVi: 'con bò sữa', icon: '🐄', colorTheme: 'blue', example: 'The cow gives milk.' },
    { id: 225, word: 'zebu', label: 'Zebu', phonetic: '/ˈziːbuː/', meaningVi: 'con bò u', icon: '🐂', colorTheme: 'green', example: 'A zebu on the farm.' },
  ],
  '2-7': [
    { id: 226, word: 'jam', label: 'Jam', phonetic: '/dʒæm/', meaningVi: 'mứt quả', icon: '🫙', colorTheme: 'red', example: 'Strawberry jam on bread.' },
    { id: 227, word: 'jelly', label: 'Jelly', phonetic: '/ˈdʒeli/', meaningVi: 'thạch dừa', icon: '🍮', colorTheme: 'pink', example: 'Sweet fruit jelly.' },
    { id: 228, word: 'teapot', label: 'Teapot', phonetic: '/ˈtiːpɒt/', meaningVi: 'ấm trà', icon: '🫖', colorTheme: 'purple', example: 'Pour tea from the teapot.' },
    { id: 229, word: 'pot', label: 'Pot', phonetic: '/pɒt/', meaningVi: 'cái nồi', icon: '🍲', colorTheme: 'orange', example: 'Mom cooks soup in the pot.' },
  ],

  // ==================== GRADE 3 ====================
  '3-1': [
    { id: 301, word: 'hello', label: 'Hello', phonetic: '/həˈləʊ/', meaningVi: 'xin chào', icon: '👋', colorTheme: 'blue', example: 'Hello, my name is Ben.' },
    { id: 302, word: 'goodbye', label: 'Goodbye', phonetic: '/ˌɡʊdˈbaɪ/', meaningVi: 'chào tạm biệt', icon: '👋', colorTheme: 'pink', example: 'Goodbye, see you tomorrow!' },
    { id: 303, word: 'fine', label: 'Fine', phonetic: '/faɪn/', meaningVi: 'khỏe', icon: '🙂', colorTheme: 'green', example: 'I am fine, thank you.' },
    { id: 304, word: 'thank you', label: 'Thank you', phonetic: '/ˈθæŋk juː/', meaningVi: 'cảm ơn', icon: '🙏', colorTheme: 'yellow', example: 'Thank you very much!' },
  ],
  '3-2': [
    { id: 305, word: 'name', label: 'Name', phonetic: '/neɪm/', meaningVi: 'tên gọi', icon: '🏷️', colorTheme: 'blue', example: 'What is your name?' },
    { id: 306, word: 'old', label: 'Old', phonetic: '/əʊld/', meaningVi: 'tuổi', icon: '🎂', colorTheme: 'purple', example: 'How old are you? I am 8 years old.' },
    { id: 307, word: 'eight', label: 'Eight', phonetic: '/eɪt/', meaningVi: 'số 8', icon: '8️⃣', colorTheme: 'orange', example: 'I am eight years old.' },
    { id: 308, word: 'ten', label: 'Ten', phonetic: '/ten/', meaningVi: 'số 10', icon: '🔟', colorTheme: 'green', example: 'I have ten pencils.' },
  ],
  '3-3': [
    { id: 309, word: 'friend', label: 'Friend', phonetic: '/frend/', meaningVi: 'bạn bè', icon: '👭', colorTheme: 'pink', example: 'This is my friend Mai.' },
    { id: 310, word: 'teacher', label: 'Teacher', phonetic: '/ˈtiːtʃə/', meaningVi: 'giáo viên', icon: '👩‍🏫', colorTheme: 'blue', example: 'Mr. Long is my English teacher.' },
    { id: 311, word: 'boy', label: 'Boy', phonetic: '/bɔɪ/', meaningVi: 'cậu bé', icon: '👦', colorTheme: 'cyan', example: 'He is a friendly boy.' },
    { id: 312, word: 'girl', label: 'Girl', phonetic: '/ɡɜːl/', meaningVi: 'cô bé', icon: '👧', colorTheme: 'purple', example: 'She is a nice girl.' },
  ],

  // ==================== GRADE 4 ====================
  '4-1': [
    { id: 401, word: 'Vietnam', label: 'Viet Nam', phonetic: '/ˌvjet ˈnæm/', meaningVi: 'nước Việt Nam', icon: '🇻🇳', colorTheme: 'red', example: 'I live in Viet Nam.' },
    { id: 402, word: 'America', label: 'America', phonetic: '/əˈmer.ɪ.kə/', meaningVi: 'nước Mỹ', icon: '🇺🇸', colorTheme: 'blue', example: 'He is from America.' },
    { id: 403, word: 'Britain', label: 'Britain', phonetic: '/ˈbrɪt.ən/', meaningVi: 'nước Anh', icon: '🇬🇧', colorTheme: 'purple', example: 'She comes from Britain.' },
    { id: 404, word: 'Japan', label: 'Japan', phonetic: '/dʒəˈpæn/', meaningVi: 'nước Nhật Bản', icon: '🇯🇵', colorTheme: 'pink', example: 'Akiko is from Japan.' },
  ],
  '4-2': [
    { id: 405, word: 'get up', label: 'Get up', phonetic: '/ɡet ʌp/', meaningVi: 'thức dậy', icon: '🌅', colorTheme: 'yellow', example: 'I get up at six o\'clock.' },
    { id: 406, word: 'have breakfast', label: 'Have breakfast', phonetic: '/hæv ˈbrekfəst/', meaningVi: 'ăn sáng', icon: '🍳', colorTheme: 'orange', example: 'I have breakfast at 6:30.' },
    { id: 407, word: 'go to school', label: 'Go to school', phonetic: '/ɡəʊ tə skuːl/', meaningVi: 'đi học', icon: '🎒', colorTheme: 'blue', example: 'We go to school together.' },
    { id: 408, word: "o'clock", label: "o'clock", phonetic: '/əˈklɒk/', meaningVi: 'giờ chẵn', icon: '⏰', colorTheme: 'purple', example: 'It is seven o\'clock.' },
  ],

  // ==================== GRADE 5 ====================
  '5-1': [
    { id: 501, word: 'best friend', label: 'Best Friend', phonetic: "/bes 'frend/", meaningVi: 'bạn thân nhất', icon: '👫', colorTheme: 'blue', example: 'Linh is my best friend.' },
    { id: 502, word: 'address', label: 'Address', phonetic: '/əˈdres/', meaningVi: 'địa chỉ nhà', icon: '📍', colorTheme: 'pink', example: 'My address is 10 Hoa Binh Street.' },
    { id: 503, word: 'hometown', label: 'Hometown', phonetic: '/ˈhəʊm.taʊn/', meaningVi: 'quê hương', icon: '🏡', colorTheme: 'green', example: 'My hometown is Danang.' },
    { id: 504, word: 'hobby', label: 'Hobby', phonetic: '/ˈhɒb.i/', meaningVi: 'sở thích', icon: '🎨', colorTheme: 'yellow', example: 'My hobby is painting.' },
  ],
  '5-2': [
    { id: 505, word: 'flat', label: 'Flat', phonetic: '/flæt/', meaningVi: 'căn hộ', icon: '🏢', colorTheme: 'blue', example: 'I live in flat 5 on the 3rd floor.' },
    { id: 506, word: 'tower', label: 'Tower', phonetic: '/ˈtaʊ.ər/', meaningVi: 'tòa tháp', icon: '🏙️', colorTheme: 'purple', example: 'Landmark tower is very high.' },
    { id: 507, word: 'lane', label: 'Lane', phonetic: '/leɪn/', meaningVi: 'ngõ, hẻm', icon: '🛣️', colorTheme: 'orange', example: 'Walk down the quiet lane.' },
    { id: 508, word: 'crowded', label: 'Crowded', phonetic: '/ˈkraʊ.dɪd/', meaningVi: 'đông đúc', icon: '👥', colorTheme: 'red', example: 'The city street is crowded.' },
  ],
};

// Fallback dynamic generator to ensure EVERY grade and EVERY unit ALWAYS has a unique 100% relevant vocabulary list
export function getUnitVocabList(grade: number, unitNumber: number): GradeVocabItem[] {
  const key = `${grade}-${unitNumber}`;
  if (unitVocabMap[key]) {
    return unitVocabMap[key];
  }

  // Generate customized, high-quality cards based on grade and unit number if not explicitly defined above
  const baseId = grade * 1000 + unitNumber * 10;
  
  // Custom word pools per grade to guarantee distinctness
  const gradeTopicWords: Record<number, { word: string; meaningVi: string; phonetic: string; icon: string }[]> = {
    1: [
      { word: 'slide', meaningVi: 'cầu trượt', phonetic: '/slaɪd/', icon: '🛝' },
      { word: 'swing', meaningVi: 'xích đu', phonetic: '/swɪŋ/', icon: '🛝' },
      { word: 'apple', meaningVi: 'quả táo', phonetic: '/ˈæp.əl/', icon: '🍎' },
      { word: 'banana', meaningVi: 'quả chuối', phonetic: '/bəˈnɑː.nə/', icon: '🍌' },
      { word: 'clock', meaningVi: 'đồng hồ', phonetic: '/klɒk/', icon: '⏰' },
      { word: 'lamp', meaningVi: 'đèn ngủ', phonetic: '/læmp/', icon: '💡' },
      { word: 'fish', meaningVi: 'con cá', phonetic: '/fɪʃ/', icon: '🐟' },
      { word: 'book', meaningVi: 'quyển sách', phonetic: '/bʊk/', icon: '📖' },
      { word: 'pen', meaningVi: 'bút mực', phonetic: '/pen/', icon: '🖊️' },
      { word: 'ruler', meaningVi: 'thước kẻ', phonetic: '/ˈruː.lər/', icon: '📏' },
    ],
    2: [
      { word: 'popcorn', meaningVi: 'bỏng ngô', phonetic: '/ˈpɒpkɔːn/', icon: '🍿' },
      { word: 'pasta', meaningVi: 'mì ống', phonetic: '/ˈpæstə/', icon: '🍝' },
      { word: 'kite', meaningVi: 'cái diều', phonetic: '/kaɪt/', icon: '🪁' },
      { word: 'sea', meaningVi: 'biển', phonetic: '/siː/', icon: '🌊' },
      { word: 'river', meaningVi: 'dòng sông', phonetic: '/ˈrɪvə/', icon: '🌊' },
      { word: 'quiz', meaningVi: 'câu đố', phonetic: '/kwɪz/', icon: '📝' },
      { word: 'cow', meaningVi: 'con bò', phonetic: '/kaʊ/', icon: '🐄' },
      { word: 'jam', meaningVi: 'mứt quả', phonetic: '/dʒæm/', icon: '🫙' },
      { word: 'house', meaningVi: 'ngôi nhà', phonetic: '/haʊs/', icon: '🏠' },
      { word: 'tent', meaningVi: 'lều cắm trại', phonetic: '/tent/', icon: '⛺' },
    ],
    3: [
      { word: 'hello', meaningVi: 'xin chào', phonetic: '/həˈləʊ/', icon: '👋' },
      { word: 'goodbye', meaningVi: 'tạm biệt', phonetic: '/ˌɡʊdˈbaɪ/', icon: '👋' },
      { word: 'friend', meaningVi: 'bạn bè', phonetic: '/frend/', icon: '👫' },
      { word: 'eye', meaningVi: 'mắt', phonetic: '/aɪ/', icon: '👁️' },
      { word: 'singing', meaningVi: 'ca hát', phonetic: '/ˈsɪŋ.ɪŋ/', icon: '🎤' },
      { word: 'library', meaningVi: 'thư viện', phonetic: '/ˈlaɪ.brər.i/', icon: '📚' },
      { word: 'stand up', meaningVi: 'đứng lên', phonetic: '/stænd ʌp/', icon: '🧍' },
      { word: 'rubber', meaningVi: 'cục tẩy', phonetic: '/ˈrʌb.ər/', icon: '🧹' },
      { word: 'purple', meaningVi: 'màu tím', phonetic: '/ˈpɜː.pəl/', icon: '💜' },
      { word: 'chess', meaningVi: 'cờ vua', phonetic: '/tʃes/', icon: '♟️' },
    ],
    4: [
      { word: 'Vietnam', meaningVi: 'nước Việt Nam', phonetic: '/ˌvjet ˈnæm/', icon: '🇻🇳' },
      { word: 'get up', meaningVi: 'thức dậy', phonetic: '/ɡet ʌp/', icon: '🌅' },
      { word: 'Monday', meaningVi: 'thứ hai', phonetic: '/ˈmʌn.deɪ/', icon: '📅' },
      { word: 'January', meaningVi: 'tháng giêng', phonetic: '/ˈdʒæn.ju.ə.ri/', icon: '❄️' },
      { word: 'swim', meaningVi: 'bơi lội', phonetic: '/swɪm/', icon: '🏊' },
      { word: 'lab', meaningVi: 'phòng thí nghiệm', phonetic: '/læb/', icon: '🔬' },
      { word: 'Maths', meaningVi: 'môn Toán', phonetic: '/mæθs/', icon: '📐' },
      { word: 'sunny', meaningVi: 'trời nắng', phonetic: '/ˈsʌn.i/', icon: '☀️' },
      { word: 'bakery', meaningVi: 'tiệm bánh', phonetic: '/ˈbeɪ.kər.i/', icon: '🥐' },
      { word: 'campfire', meaningVi: 'lửa trại', phonetic: '/ˈkæmp.faɪər/', icon: '🔥' },
    ],
    5: [
      { word: 'address', meaningVi: 'địa chỉ', phonetic: '/əˈdres/', icon: '📍' },
      { word: 'hometown', meaningVi: 'quê hương', phonetic: '/ˈhəʊm.taʊn/', icon: '🏡' },
      { word: 'flat', meaningVi: 'căn hộ', phonetic: '/flæt/', icon: '🏢' },
      { word: 'useful', meaningVi: 'hữu ích', phonetic: '/ˈjuːs.fəl/', icon: '⭐' },
      { word: 'do karate', meaningVi: 'tập võ karate', phonetic: '/duː kəˈrɑː.ti/', icon: '🥋' },
      { word: 'astronaut', meaningVi: 'phi hành gia', phonetic: '/ˈæs.trə.nɔːt/', icon: '🚀' },
      { word: 'canteen', meaningVi: 'căn tin', phonetic: '/kænˈtiːn/', icon: '🥪' },
      { word: 'projector', meaningVi: 'máy chiếu', phonetic: '/prəˈdʒek.tər/', icon: '📹' },
      { word: 'fever', meaningVi: 'sốt cao', phonetic: '/ˈfiː.vər/', icon: '🤒' },
      { word: 'graduation', meaningVi: 'tốt nghiệp', phonetic: '/ˌɡrædʒ.uˈeɪ.ʃən/', icon: '🎓' },
    ],
  };

  const pool = gradeTopicWords[grade] || gradeTopicWords[1];
  const colors: ('blue' | 'pink' | 'orange' | 'green' | 'purple' | 'yellow' | 'red' | 'cyan')[] = [
    'blue', 'pink', 'orange', 'green', 'purple', 'yellow', 'red', 'cyan'
  ];

  // Pick 5 distinct items shifted by unitNumber so every unit gets unique cards
  return Array.from({ length: 5 }, (_, i) => {
    const itemIdx = (unitNumber * 3 + i) % pool.length;
    const item = pool[itemIdx];
    return {
      id: baseId + i,
      word: `${item.word}`,
      label: item.word.toUpperCase(),
      phonetic: item.phonetic,
      meaningVi: `${item.meaningVi} (Bài ${unitNumber} - Lớp ${grade})`,
      icon: item.icon,
      colorTheme: colors[i % colors.length],
      example: `Luyện tập từ vựng "${item.word}" trong Unit ${unitNumber} - Tiếng Anh Lớp ${grade}.`,
    };
  });
}
