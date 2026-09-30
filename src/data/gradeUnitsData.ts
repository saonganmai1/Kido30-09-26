export interface GradeUnit {
  id: number;
  unitNumber: number;
  title: string;
  subtitle: string;
  description?: string;
  isUnlocked: boolean;
  isCompleted?: boolean;
  icon: string;
  colorType?: string;
}

export interface ParentGuideUnit {
  id: number;
  title: string;
  topic: string;
  grammar: string;
  game: string;
  gameDesc: string;
}

export interface ChecklistTask {
  id: string;
  unitId: number;
  title: string;
  subtitle: string;
  category: string;
}

// 1. Full Grade Units Data (KNTT English Grades 1 - 5)
export const gradeUnitsData: Record<number, GradeUnit[]> = {
  1: [
    { id: 1, unitNumber: 1, title: 'Unit 1: In the school playground', subtitle: 'Trong sân trường', description: 'Từ vựng sân trường và trò chơi: playground, slide, swing. Mẫu câu: I can see a...', isUnlocked: true, icon: '🏫', colorType: 'pink' },
    { id: 2, unitNumber: 2, title: 'Unit 2: In the dining room', subtitle: 'Trong phòng ăn', description: 'Đồ ăn và dụng cụ phòng ăn: apple, banana, spoon, plate. Mẫu câu: Pass me the...', isUnlocked: false, icon: '🍽️', colorType: 'yellow' },
    { id: 3, unitNumber: 3, title: 'Unit 3: At the street market', subtitle: 'Tại chợ đường phố', description: 'Hoa quả và chợ quê: mango, orange, market. Mẫu câu: I want two...', isUnlocked: false, icon: '🏪', colorType: 'green' },
    { id: 4, unitNumber: 4, title: 'Unit 4: In the bedroom', subtitle: 'Trong phòng ngủ', description: 'Đồ dùng phòng ngủ: bed, clock, lamp, doll. Mẫu câu: Where is my...?', isUnlocked: false, icon: '🛏️', colorType: 'blue' },
    { id: 5, unitNumber: 5, title: 'Unit 5: At the fish and chip shop', subtitle: 'Cửa hàng ăn nhanh', description: 'Thực phẩm cửa hàng: fish, chips, juice. Mẫu câu: I want to eat...', isUnlocked: false, icon: '🍟', colorType: 'purple' },
    { id: 6, unitNumber: 6, title: 'Unit 6: In the classroom', subtitle: 'Trong lớp học', description: 'Đồ dùng học tập: book, pen, ruler, bag. Mẫu câu: Open your...', isUnlocked: false, icon: '📚', colorType: 'cyan' },
    { id: 7, unitNumber: 7, title: 'Unit 7: In the garden', subtitle: 'Trong khu vườn', description: 'Cây cối côn trùng: flower, butterfly, tree. Mẫu câu: Look at the...', isUnlocked: false, icon: '🏡', colorType: 'pink' },
    { id: 8, unitNumber: 8, title: 'Unit 8: In the park', subtitle: 'Trong công viên', description: 'Hoạt động công viên: run, jump, ball, dog. Mẫu câu: Let\'s play...', isUnlocked: false, icon: '🌳', colorType: 'yellow' },
    { id: 9, unitNumber: 9, title: 'Unit 9: In the shop', subtitle: 'Trong cửa hàng', description: 'Đồ chơi và hàng hóa: car, ball, hat. Mẫu câu: How much is it?', isUnlocked: false, icon: '🛍️', colorType: 'green' },
    { id: 10, unitNumber: 10, title: 'Unit 10: At the zoo', subtitle: 'Tại sở thú', description: 'Động vật sở thú: monkey, tiger, elephant. Mẫu câu: It is a big...', isUnlocked: false, icon: '🦁', colorType: 'blue' },
    { id: 11, unitNumber: 11, title: 'Unit 11: At the bus stop', subtitle: 'Tại điểm dừng xe buýt', description: 'Phương tiện: bus, car, bike. Mẫu câu: The bus is coming!', isUnlocked: false, icon: '🚏', colorType: 'purple' },
    { id: 12, unitNumber: 12, title: 'Unit 12: At the lake', subtitle: 'Ở hồ nước', description: 'Cảnh quan hồ: duck, boat, fish, water. Mẫu câu: Look at the duck!', isUnlocked: false, icon: '🏞️', colorType: 'cyan' },
    { id: 13, unitNumber: 13, title: 'Unit 13: In the school canteen', subtitle: 'Trong căn tin trường', description: 'Thức ăn canteen: milk, bread, cake, fruit. Mẫu câu: I like milk.', isUnlocked: false, icon: '🥪', colorType: 'pink' },
    { id: 14, unitNumber: 14, title: 'Unit 14: In the toy shop', subtitle: 'Trong cửa hàng đồ chơi', description: 'Đồ chơi bé thích: robot, teddy bear, train. Mẫu câu: I have a robot.', isUnlocked: false, icon: '🧸', colorType: 'yellow' },
    { id: 15, unitNumber: 15, title: 'Unit 15: At the football match', subtitle: 'Trận thi đấu bóng đá', description: 'Thể thao: football, kick, run, win. Mẫu câu: Kick the ball!', isUnlocked: false, icon: '⚽', colorType: 'green' },
    { id: 16, unitNumber: 16, title: 'Unit 16: At home', subtitle: 'Ở nhà', description: 'Gia đình nhà cửa: home, mom, dad, baby. Mẫu câu: Welcome home!', isUnlocked: false, icon: '🏠', colorType: 'blue' },
  ],
  2: [
    { id: 1, unitNumber: 1, title: 'Unit 1: At my birthday party', subtitle: 'Tại bữa tiệc sinh nhật', description: 'Sinh nhật: cake, candle, gift, party. Mẫu câu: Happy birthday!', isUnlocked: true, icon: '🎂', colorType: 'pink' },
    { id: 2, unitNumber: 2, title: 'Unit 2: In the backyard', subtitle: 'Trong sân sau', description: 'Sân chơi nhà: grass, kite, bicycle. Mẫu câu: I can fly a kite.', isUnlocked: false, icon: '🏡', colorType: 'yellow' },
    { id: 3, unitNumber: 3, title: 'Unit 3: At the seaside', subtitle: 'Ở bãi biển', description: 'Bãi biển: sea, shell, boat, crab. Mẫu câu: Look at the sea!', isUnlocked: false, icon: '🏖️', colorType: 'green' },
    { id: 4, unitNumber: 4, title: 'Unit 4: In the countryside', subtitle: 'Ở nông thôn', description: 'Nông thôn: river, field, village, tree. Mẫu câu: Is there a river?', isUnlocked: false, icon: '🌾', colorType: 'blue' },
    { id: 5, unitNumber: 5, title: 'Unit 5: In the classroom', subtitle: 'Trong lớp học', description: 'Đồ dùng học tập: desk, chair, board, chalk. Mẫu câu: Sit down, please.', isUnlocked: false, icon: '🏫', colorType: 'purple' },
    { id: 6, unitNumber: 6, title: 'Unit 6: On the farm', subtitle: 'Trên trang trại', description: 'Trang trại: cow, chicken, horse, duck. Mẫu câu: I see a cow.', isUnlocked: false, icon: '🚜', colorType: 'cyan' },
    { id: 7, unitNumber: 7, title: 'Unit 7: In the kitchen', subtitle: 'Trong nhà bếp', description: 'Nhà bếp: cup, glass, pot, bowl. Mẫu câu: Pass me the cup.', isUnlocked: false, icon: '🍳', colorType: 'pink' },
    { id: 8, unitNumber: 8, title: 'Unit 8: In the village', subtitle: 'Trong làng', description: 'Làng quê: house, road, lake, garden. Mẫu câu: Welcome to my village.', isUnlocked: false, icon: '🏘️', colorType: 'yellow' },
    { id: 9, unitNumber: 9, title: 'Unit 9: In the grocery store', subtitle: 'Trong cửa hàng tạp hóa', description: 'Mua sắm: bread, butter, eggs, rice. Mẫu câu: I want some bread.', isUnlocked: false, icon: '🛒', colorType: 'green' },
    { id: 10, unitNumber: 10, title: 'Unit 10: At the zoo', subtitle: 'Tại sở thú', description: 'Động vật: giraffe, hippo, zebra, lion. Mẫu câu: Look at the giraffe!', isUnlocked: false, icon: '🦁', colorType: 'blue' },
    { id: 11, unitNumber: 11, title: 'Unit 11: In the playground', subtitle: 'Trên sân chơi', description: 'Sân chơi: merry-go-round, seesaw, slide. Mẫu câu: Let\'s play on the seesaw.', isUnlocked: false, icon: '🛝', colorType: 'purple' },
    { id: 12, unitNumber: 12, title: 'Unit 12: At the café', subtitle: 'Tại quán cà phê', description: 'Quán nước: tea, coffee, juice, cake. Mẫu câu: Would you like juice?', isUnlocked: false, icon: '☕', colorType: 'cyan' },
    { id: 13, unitNumber: 13, title: 'Unit 13: In the maths class', subtitle: 'Giờ học Toán', description: 'Toán học: numbers, shapes, count, plus. Mẫu câu: Count the apples!', isUnlocked: false, icon: '📐', colorType: 'pink' },
    { id: 14, unitNumber: 14, title: 'Unit 14: At home', subtitle: 'Ở nhà', description: 'Gia đình: living room, TV, sofa, lamp. Mẫu câu: Watch TV in living room.', isUnlocked: false, icon: '🏠', colorType: 'yellow' },
    { id: 15, unitNumber: 15, title: 'Unit 15: In the clothes shop', subtitle: 'Trong cửa hàng quần áo', description: 'Quần áo: shirt, shorts, dress, shoes. Mẫu câu: Put on your shoes.', isUnlocked: false, icon: '👕', colorType: 'green' },
    { id: 16, unitNumber: 16, title: 'Unit 16: At the campsite', subtitle: 'Tại khu cắm trại', description: 'Cắm trại: tent, campfire, flashlight, forest. Mẫu câu: Sleep in the tent.', isUnlocked: false, icon: '⛺', colorType: 'blue' },
  ],
  3: [
    { id: 1, unitNumber: 1, title: 'Unit 1: Hello', subtitle: 'Chào hỏi và tự giới thiệu', description: 'Chào hỏi: Hello, Hi, Nice to meet you. Mẫu câu: How are you? - I am fine.', isUnlocked: true, icon: '👋', colorType: 'pink' },
    { id: 2, unitNumber: 2, title: 'Unit 2: Our names', subtitle: 'Hỏi và trả lời về tên và tuổi', description: 'Tên & Tuổi: Name, years old, number 1-10. Mẫu câu: How old are you?', isUnlocked: false, icon: '📛', colorType: 'yellow' },
    { id: 3, unitNumber: 3, title: 'Unit 3: Our friends', subtitle: 'Giới thiệu người khác', description: 'Bạn bè: friend, boy, girl, teacher. Mẫu câu: This is my friend.', isUnlocked: false, icon: '🤝', colorType: 'green' },
    { id: 4, unitNumber: 4, title: 'Unit 4: Our bodies', subtitle: 'Bộ phận cơ thể và chỉ dẫn', description: 'Cơ thể: eye, ear, nose, mouth, hand. Mẫu câu: Touch your nose!', isUnlocked: false, icon: '👁️', colorType: 'blue' },
    { id: 5, unitNumber: 5, title: 'Unit 5: My hobbies', subtitle: 'Sở thích', description: 'Sở thích: singing, dancing, drawing, cooking. Mẫu câu: My hobby is singing.', isUnlocked: false, icon: '🎨', colorType: 'purple' },
    { id: 6, unitNumber: 6, title: 'Unit 6: Our school', subtitle: 'Trường học và các phòng', description: 'Trường học: library, gym, music room, playground. Mẫu câu: Is this our gym?', isUnlocked: false, icon: '🏫', colorType: 'cyan' },
    { id: 7, unitNumber: 7, title: 'Unit 7: Classroom instructions', subtitle: 'Mệnh lệnh trong lớp', description: 'Lớp học: Stand up, Sit down, Open your book, Be quiet. Mẫu câu: May I come in?', isUnlocked: false, icon: '📢', colorType: 'pink' },
    { id: 8, unitNumber: 8, title: 'Unit 8: My school things', subtitle: 'Đồ dùng học tập', description: 'Đồ dùng: pen, pencil, rubber, notebook, pencil case. Mẫu câu: I have a pen.', isUnlocked: false, icon: '✏️', colorType: 'yellow' },
    { id: 9, unitNumber: 9, title: 'Unit 9: Colours', subtitle: 'Màu sắc', description: 'Màu sắc: red, blue, yellow, green, pink, purple. Mẫu câu: What colour is it?', isUnlocked: false, icon: '🌈', colorType: 'green' },
    { id: 10, unitNumber: 10, title: 'Unit 10: Break time activities', subtitle: 'Hoạt động ra chơi', description: 'Ra chơi: football, chess, badminton, jump rope. Mẫu câu: I play football.', isUnlocked: false, icon: '⚽', colorType: 'blue' },
    { id: 11, unitNumber: 11, title: 'Unit 11: My family', subtitle: 'Gia đình', description: 'Gia đình: father, mother, brother, sister, grandfather. Mẫu câu: Who is this?', isUnlocked: false, icon: '👨‍👩‍👧', colorType: 'purple' },
    { id: 12, unitNumber: 12, title: 'Unit 12: Jobs', subtitle: 'Nghề nghiệp', description: 'Nghề nghiệp: doctor, nurse, teacher, driver, pilot. Mẫu câu: He is a doctor.', isUnlocked: false, icon: '👩‍⚕️', colorType: 'cyan' },
    { id: 13, unitNumber: 13, title: 'Unit 13: My house', subtitle: 'Ngôi nhà', description: 'Ngôi nhà: living room, bedroom, kitchen, bathroom, garden. Mẫu câu: Where is mom?', isUnlocked: false, icon: '🏡', colorType: 'pink' },
    { id: 14, unitNumber: 14, title: 'Unit 14: My bedroom', subtitle: 'Phòng ngủ', description: 'Phòng ngủ: bed, door, window, picture, desk. Mẫu câu: There is a bed in my room.', isUnlocked: false, icon: '🛏️', colorType: 'yellow' },
    { id: 15, unitNumber: 15, title: 'Unit 15: At the dining table', subtitle: 'Đồ ăn thức uống', description: 'Ăn uống: rice, meat, fish, water, juice, milk. Mẫu câu: Would you like some milk?', isUnlocked: false, icon: '🍲', colorType: 'green' },
    { id: 16, unitNumber: 16, title: 'Unit 16: My pets', subtitle: 'Thú cưng', description: 'Thú cưng: dog, cat, parrot, rabbit, goldfish. Mẫu câu: Do you have any pets?', isUnlocked: false, icon: '🐶', colorType: 'blue' },
    { id: 17, unitNumber: 17, title: 'Unit 17: Our toys', subtitle: 'Đồ chơi', description: 'Đồ chơi: doll, car, robot, kite, plane. Mẫu câu: Where is my doll?', isUnlocked: false, icon: '🧸', colorType: 'purple' },
    { id: 18, unitNumber: 18, title: 'Unit 18: Playing and doing', subtitle: 'Hoạt động đang làm', description: 'Hành động: playing, reading, listening, writing. Mẫu câu: What are you doing?', isUnlocked: false, icon: '🏃', colorType: 'cyan' },
    { id: 19, unitNumber: 19, title: 'Unit 19: Outdoor activities', subtitle: 'Hoạt động ngoài trời', description: 'Ngoài trời: cycling, skating, flying a kite. Mẫu câu: The weather is sunny.', isUnlocked: false, icon: '🚴', colorType: 'pink' },
    { id: 20, unitNumber: 20, title: 'Unit 20: At the zoo', subtitle: 'Tại sở thú', description: 'Sở thú: tiger, monkey, elephant, bear, peacock. Mẫu câu: I like monkeys.', isUnlocked: false, icon: '🦁', colorType: 'yellow' },
  ],
  4: [
    { id: 1, unitNumber: 1, title: 'Unit 1: My friends', subtitle: 'Những người bạn của tớ', description: 'Quốc gia: Vietnam, America, England, Japan, Australia. Mẫu câu: Where are you from?', isUnlocked: true, icon: '💙', colorType: 'pink' },
    { id: 2, unitNumber: 2, title: 'Unit 2: Time and daily routines', subtitle: 'Thời gian và thói quen', description: 'Thời gian: get up, have breakfast, go to school. Mẫu câu: What time is it?', isUnlocked: false, icon: '⏰', colorType: 'yellow' },
    { id: 3, unitNumber: 3, title: 'Unit 3: My week', subtitle: 'Tuần lễ của tớ', description: 'Thứ trong tuần: Monday, Tuesday, Wednesday... Mẫu câu: What do you do on Mondays?', isUnlocked: false, icon: '📅', colorType: 'green' },
    { id: 4, unitNumber: 4, title: 'Unit 4: My birthday party', subtitle: 'Bữa tiệc sinh nhật', description: 'Tháng trong năm: January, February, March... Mẫu câu: When is your birthday?', isUnlocked: false, icon: '🎂', colorType: 'blue' },
    { id: 5, unitNumber: 5, title: 'Unit 5: Things we can do', subtitle: 'Khả năng của chúng ta', description: 'Kỹ năng: swim, dance, play piano, ride a bike. Mẫu câu: Can you play the piano?', isUnlocked: false, icon: '🎨', colorType: 'purple' },
    { id: 6, unitNumber: 6, title: 'Unit 6: Our school facilities', subtitle: 'Cơ sở vật chất trường học', description: 'Trường học: computer room, art room, science lab. Mẫu câu: Where is the art room?', isUnlocked: false, icon: '🏫', colorType: 'cyan' },
    { id: 7, unitNumber: 7, title: 'Unit 7: Our timetables', subtitle: 'Thời khóa biểu', description: 'Môn học: Maths, Vietnamese, English, Science, Art. Mẫu câu: What subjects do you have?', isUnlocked: false, icon: '📚', colorType: 'pink' },
    { id: 8, unitNumber: 8, title: 'Unit 8: My favourite subjects', subtitle: 'Môn học yêu thích', description: 'Môn học: Music, PE, IT, History. Mẫu câu: Why do you like English?', isUnlocked: false, icon: '🎨', colorType: 'yellow' },
    { id: 9, unitNumber: 9, title: 'Unit 9: Our sports day', subtitle: 'Ngày hội thể thao', description: 'Thể thao: Sports Day, running race, tug of war. Mẫu câu: When is Sports Day?', isUnlocked: false, icon: '🏅', colorType: 'green' },
    { id: 10, unitNumber: 10, title: 'Unit 10: Our summer holidays', subtitle: 'Kỳ nghỉ hè', description: 'Kỳ nghỉ: Ha Long Bay, Phu Quoc, Nha Trang. Mẫu câu: Where were you last summer?', isUnlocked: false, icon: '🏖️', colorType: 'blue' },
    { id: 11, unitNumber: 11, title: 'Unit 11: My home', subtitle: 'Ngôi nhà của tớ', description: 'Vị trí nhà: city, countryside, mountain, island. Mẫu câu: What is your house like?', isUnlocked: false, icon: '🏠', colorType: 'purple' },
    { id: 12, unitNumber: 12, title: 'Unit 12: Jobs and workplaces', subtitle: 'Nghề nghiệp & Nơi làm việc', description: 'Nghề nghiệp: doctor, farmer, teacher, worker, hospital, farm. Mẫu câu: Where does he work?', isUnlocked: false, icon: '👨‍⚕️', colorType: 'cyan' },
    { id: 13, unitNumber: 13, title: 'Unit 13: Appearance', subtitle: 'Ngoại hình', description: 'Miêu tả: tall, short, slim, strong, friendly, kind. Mẫu câu: What does he look like?', isUnlocked: false, icon: '👤', colorType: 'pink' },
    { id: 14, unitNumber: 14, title: 'Unit 14: Daily activities', subtitle: 'Hoạt động hàng ngày', description: 'Thói quen: wash face, brush teeth, do homework. Mẫu câu: What do you do in the morning?', isUnlocked: false, icon: '☀️', colorType: 'yellow' },
    { id: 15, unitNumber: 15, title: 'Unit 15: My family\'s weekends', subtitle: 'Cuối tuần của gia đình', description: 'Cuối tuần: go shopping, visit grandparents, watch film. Mẫu câu: What does your family do?', isUnlocked: false, icon: '👨‍👩‍👧', colorType: 'green' },
    { id: 16, unitNumber: 16, title: 'Unit 16: Weather and clothes', subtitle: 'Thời tiết & Trang phục', description: 'Thời tiết: sunny, rainy, windy, snowy, coat, hat. Mẫu câu: What is the weather like?', isUnlocked: false, icon: '🌤️', colorType: 'blue' },
    { id: 17, unitNumber: 17, title: 'Unit 17: In the city', subtitle: 'Trong thành phố', description: 'Địa điểm thành phố: cinema, bakery, pharmacy, supermarket. Mẫu câu: Excuse me, where is the bakery?', isUnlocked: false, icon: '🏙️', colorType: 'purple' },
    { id: 18, unitNumber: 18, title: 'Unit 18: At the shopping centre', subtitle: 'Tại trung tâm mua sắm', description: 'Mua sắm: T-shirt, skirt, shoes, price. Mẫu câu: How much is this T-shirt?', isUnlocked: false, icon: '🛍️', colorType: 'cyan' },
    { id: 19, unitNumber: 19, title: 'Unit 19: The animal world', subtitle: 'Thế giới động vật', description: 'Động vật hoang dã: crocodile, elephant, tiger, kangaroo, fast, scary. Mẫu câu: Why do you like kangaroos?', isUnlocked: false, icon: '🦁', colorType: 'pink' },
    { id: 20, unitNumber: 20, title: 'Unit 20: At summer camp', subtitle: 'Tại trại hè', description: 'Trại hè: campfire, sing songs, build tent. Mẫu câu: What are you going to do this summer?', isUnlocked: false, icon: '⛺', colorType: 'yellow' },
  ],
  5: [
    { id: 1, unitNumber: 1, title: 'Unit 1: All about me!', subtitle: 'Thông tin cá nhân và sở thích', description: 'Thông tin cá nhân: address, hometown, hobby, secondary school. Mẫu câu: What is your address?', isUnlocked: true, icon: '💙', colorType: 'pink' },
    { id: 2, unitNumber: 2, title: 'Unit 2: Our homes', subtitle: 'Nơi ở và địa chỉ', description: 'Nơi ở: flat, lane, tower, village, quiet, crowded. Mẫu câu: What is the village like?', isUnlocked: false, icon: '🏡', colorType: 'yellow' },
    { id: 3, unitNumber: 3, title: 'Unit 3: My foreign friends', subtitle: 'Quốc tịch và tính cách', description: 'Tính cách & Quốc tịch: American, British, Japanese, helpful, polite, generous. Mẫu câu: What is she like?', isUnlocked: false, icon: '🌍', colorType: 'green' },
    { id: 4, unitNumber: 4, title: 'Unit 4: Our free-time activities', subtitle: 'Hoạt động trong thời gian rảnh', description: 'Giải trí: surf the Internet, do karate, go fishing, read comic books. Mẫu câu: What do you do in your free time?', isUnlocked: false, icon: '🎮', colorType: 'blue' },
    { id: 5, unitNumber: 5, title: 'Unit 5: My future job', subtitle: 'Nghề nghiệp tương lai', description: 'Ước mơ: astronaut, architect, pilot, writer, reporter. Mẫu câu: What would you like to be in the future?', isUnlocked: false, icon: '🚀', colorType: 'purple' },
    { id: 6, unitNumber: 6, title: 'Unit 6: Our school rooms', subtitle: 'Các phòng học và vị trí', description: 'Phòng chức năng: language lab, principal\'s office, canteen, 1st floor, 2nd floor. Mẫu câu: Where is the language lab?', isUnlocked: false, icon: '🏫', colorType: 'cyan' },
    { id: 7, unitNumber: 7, title: 'Unit 7: Our favourite school activities', subtitle: 'Hoạt động yêu thích tại trường', description: 'Hoạt động: singing English songs, doing science experiments, playing basketball. Mẫu câu: What school activity do you like best?', isUnlocked: false, icon: '🎨', colorType: 'pink' },
    { id: 8, unitNumber: 8, title: 'Unit 8: In our classroom', subtitle: 'Đồ vật trong lớp học', description: 'Trang thiết bị: projector, bookshelf, map, clock, cupboard. Mẫu câu: Where is the projector?', isUnlocked: false, icon: '✏️', colorType: 'yellow' },
    { id: 9, unitNumber: 9, title: 'Unit 9: Our outdoor activities', subtitle: 'Hoạt động ngoài trời quá khứ', description: 'Quá khứ: played badminton, visited a farm, planted trees. Mẫu câu: What did you do yesterday?', isUnlocked: false, icon: '🌳', colorType: 'green' },
    { id: 10, unitNumber: 10, title: 'Unit 10: Our school trips', subtitle: 'Chuyến tham quan của trường', description: 'Chuyến đi: Dam Sen Park, Cu Chi Tunnels, National Park, by bus. Mẫu câu: Where did you go on your school trip?', isUnlocked: false, icon: '🚌', colorType: 'blue' },
    { id: 11, unitNumber: 11, title: 'Unit 11: Our family activities', subtitle: 'Hoạt động gia đình quá khứ', description: 'Gia đình: had a picnic, cooked dinner, visited relatives. Mẫu câu: Did you have a good time?', isUnlocked: false, icon: '👨‍👩‍👧', colorType: 'purple' },
    { id: 12, unitNumber: 12, title: 'Unit 12: Our Tet holiday plans', subtitle: 'Kế hoạch cho ngày Tết', description: 'Ngày Tết: decorate the house, buy peach blossoms, get lucky money, visit grandparents. Mẫu câu: What are you going to do for Tet?', isUnlocked: false, icon: '🧧', colorType: 'cyan' },
    { id: 13, unitNumber: 13, title: 'Unit 13: Our special holidays and food', subtitle: 'Các ngày lễ đặc biệt và ăn uống', description: 'Lễ hội & Ẩm thực: Mid-Autumn Festival, Teachers\' Day, mooncakes, spring rolls. Mẫu câu: What do you eat on special days?', isUnlocked: false, icon: '🥮', colorType: 'pink' },
    { id: 14, unitNumber: 14, title: 'Unit 14: Healthy living and frequency', subtitle: 'Lối sống lành mạnh & Tần suất', description: 'Sức khỏe & Tần suất: always, usually, often, sometimes, do exercise, eat vegetables. Mẫu câu: How often do you do exercise?', isUnlocked: false, icon: '🥗', colorType: 'yellow' },
    { id: 15, unitNumber: 15, title: 'Unit 15: Health problems and advice', subtitle: 'Sức khỏe & Lời khuyên', description: 'Bệnh tật & Lời khuyên: fever, headache, toothache, sore throat, rest, see a doctor. Mẫu câu: You should rest in bed.', isUnlocked: false, icon: '🩺', colorType: 'green' },
    { id: 16, unitNumber: 16, title: 'Unit 16: Weather and seasonal clothes', subtitle: 'Thời tiết & Trang phục mùa', description: 'Mùa & Trang phục: spring, summer, autumn, winter, raincoat, sweater, boots. Mẫu câu: What do you wear in winter?', isUnlocked: false, icon: '❄️', colorType: 'blue' },
    { id: 17, unitNumber: 17, title: 'Unit 17: Stories we love', subtitle: 'Những câu chuyện yêu thích', description: 'Truyện cổ tích: Snow White, The Fox and the Crow, Aladdin, kind, greedy, clever. Mẫu câu: What do you think of An Tiem?', isUnlocked: false, icon: '📖', colorType: 'purple' },
    { id: 18, unitNumber: 18, title: 'Unit 18: Means of transport', subtitle: 'Phương tiện giao thông', description: 'Phương tiện: motorbike, plane, train, coach, underground. Mẫu câu: How can I get to Phu Quoc?', isUnlocked: false, icon: '✈️', colorType: 'cyan' },
    { id: 19, unitNumber: 19, title: 'Unit 19: Places of interest', subtitle: 'Địa điểm tham quan', description: 'Danh lam: Thien Mu Pagoda, Ben Thanh Market, Museum of History. Mẫu câu: Which place would you like to visit?', isUnlocked: false, icon: '⛩️', colorType: 'pink' },
    { id: 20, unitNumber: 20, title: 'Unit 20: Our graduation day', subtitle: 'Ngày lễ tốt nghiệp tiểu học', description: 'Tốt nghiệp: primary school graduation, cap, certificate, memory, best wish. Mẫu câu: Congratulations on your graduation!', isUnlocked: false, icon: '🎓', colorType: 'yellow' },
  ]
};

// 2. Parent Guide Units Data (Grades 1 - 5)
export const parentGuideUnitsData: Record<number, ParentGuideUnit[]> = {
  1: gradeUnitsData[1].map((u) => ({
    id: u.id,
    title: u.title,
    topic: u.subtitle,
    grammar: u.description || `Mẫu câu thực hành ${u.title}`,
    game: `Trò chơi tương tác ${u.subtitle}`,
    gameDesc: `Ba mẹ cùng bé vận động thực hành từ vựng chủ đề ${u.subtitle} tại nhà. Hô từ tiếng Anh để bé nhanh tay tìm đồ vật và phát âm to.`
  })),
  2: gradeUnitsData[2].map((u) => ({
    id: u.id,
    title: u.title,
    topic: u.subtitle,
    grammar: u.description || `Mẫu câu thực hành ${u.title}`,
    game: `Trò chơi tương tác ${u.subtitle}`,
    gameDesc: `Ba mẹ và bé đóng vai đối thoại bằng tiếng Anh chủ đề ${u.subtitle}. Khen thưởng bé +2 Sao Vàng khi nói chuẩn xác!`
  })),
  3: gradeUnitsData[3].map((u) => ({
    id: u.id,
    title: u.title,
    topic: u.subtitle,
    grammar: u.description || `Mẫu câu thực hành ${u.title}`,
    game: `Trò chơi tương tác ${u.subtitle}`,
    gameDesc: `Luyện tập phản xạ tiếng Anh chủ đề ${u.subtitle}. Ba mẹ hỏi câu hỏi tiếng Anh, bé trả lời và đập tay ăn mừng!`
  })),
  4: gradeUnitsData[4].map((u) => ({
    id: u.id,
    title: u.title,
    topic: u.subtitle,
    grammar: u.description || `Mẫu câu thực hành ${u.title}`,
    game: `Trò chơi tương tác ${u.subtitle}`,
    gameDesc: `Tổ chức minigame đố vui gia đình chủ đề ${u.subtitle}. Cho bé đóng vai thầy cô giáo nhỏ giảng bài cho cả nhà!`
  })),
  5: gradeUnitsData[5].map((u) => ({
    id: u.id,
    title: u.title,
    topic: u.subtitle,
    grammar: u.description || `Mẫu câu thực hành ${u.title}`,
    game: `Trò chơi tương tác ${u.subtitle}`,
    gameDesc: `Thực hành thuyết trình tiếng Anh 2 phút về chủ đề ${u.subtitle}. Ba mẹ làm khán giả vỗ tay cổ vũ và chụp hình lưu niệm!`
  }))
};

// 3. Parent Checklist Tasks per Grade (Distinct tasks for every Unit in Grades 1 - 5)
export const parentChecklistTasksByGrade: Record<number, ChecklistTask[]> = {
  1: gradeUnitsData[1].map((u) => ({
    id: `chk-g1-${u.id}`,
    unitId: u.id,
    title: `Thực hành Lớp 1 - ${u.title}`,
    subtitle: `Cùng con chơi trò chơi offline và ôn tập từ vựng & mẫu câu bài ${u.subtitle}`,
    category: 'Bài học Lớp 1'
  })),
  2: gradeUnitsData[2].map((u) => ({
    id: `chk-g2-${u.id}`,
    unitId: u.id,
    title: `Thực hành Lớp 2 - ${u.title}`,
    subtitle: `Cùng con chơi trò chơi offline và ôn tập từ vựng & mẫu câu bài ${u.subtitle}`,
    category: 'Bài học Lớp 2'
  })),
  3: gradeUnitsData[3].map((u) => ({
    id: `chk-g3-${u.id}`,
    unitId: u.id,
    title: `Thực hành Lớp 3 - ${u.title}`,
    subtitle: `Cùng con chơi trò chơi offline và ôn tập từ vựng & mẫu câu bài ${u.subtitle}`,
    category: 'Bài học Lớp 3'
  })),
  4: gradeUnitsData[4].map((u) => ({
    id: `chk-g4-${u.id}`,
    unitId: u.id,
    title: `Thực hành Lớp 4 - ${u.title}`,
    subtitle: `Cùng con chơi trò chơi offline và ôn tập từ vựng & mẫu câu bài ${u.subtitle}`,
    category: 'Bài học Lớp 4'
  })),
  5: gradeUnitsData[5].map((u) => ({
    id: `chk-g5-${u.id}`,
    unitId: u.id,
    title: `Thực hành Lớp 5 - ${u.title}`,
    subtitle: `Cùng con chơi trò chơi offline và ôn tập từ vựng & mẫu câu bài ${u.subtitle}`,
    category: 'Bài học Lớp 5'
  }))
};
