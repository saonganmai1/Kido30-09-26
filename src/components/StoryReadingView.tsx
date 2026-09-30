import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Volume2,
  Mic,
  Eye,
  EyeOff,
  Trophy,
  Flame,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  Award,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';
import { audioService } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

interface StoryReadingViewProps {
  user?: UserProfile;
  onAddStars?: (count: number) => void;
  onBack?: () => void;
  onLogout?: () => void;
  setActiveTab?: (tab: string) => void;
}

export interface StorySlide {
  slideNumber: number;
  titleEn: string;
  titleVi: string;
  image: string;
  sentences: {
    en: string;
    vi: string;
    keywords: string[];
  }[];
}

export interface StoryItem {
  id: string;
  tag: string;
  tagBg: string;
  tagColor: string;
  titleEn: string;
  titleVi: string;
  desc: string;
  slideCount: number;
  thumbnail: string;
  buttonBg: string;
  borderColor: string;
  slides: StorySlide[];
}

export const STORIES_DATA: StoryItem[] = [
  {
    id: 's1',
    tag: 'MỚI',
    tagBg: 'bg-purple-100 border-purple-300',
    tagColor: 'text-purple-700',
    titleEn: 'Our Amazing Earth',
    titleVi: 'Trái Đất Kỳ Diệu Của Chúng Ta',
    desc: 'Khám phá hành trình xanh thân yêu, dải ngân hà rực rỡ và những bí ẩn kỳ diệu xung quanh chúng ta!',
    slideCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
    buttonBg: 'bg-[#0284c7] hover:bg-sky-700',
    borderColor: 'border-sky-300 hover:border-sky-500',
    slides: [
      {
        slideNumber: 1,
        titleEn: 'Welcome to Our Amazing Earth',
        titleVi: 'Chào Mừng Đến Với Trái Đất Kỳ Diệu',
        image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Welcome to our exciting space journey! Today, we will explore our wonderful home planet.',
            vi: 'Chào mừng đến với hành trình vũ trụ thú vị! Hôm nay chúng ta cùng khám phá hành trình thân yêu.',
            keywords: ['Welcome', 'space journey', 'explore', 'home planet']
          },
          {
            en: 'Look at the shining stars and planets in the vast galaxy!',
            vi: 'Hãy ngắm nhìn những ngôi sao và hành tinh lấp lánh trong dải ngân hà bao la!',
            keywords: ['shining stars', 'planets', 'vast galaxy']
          },
          {
            en: 'Our Earth is full of deep blue oceans, green forests, and high mountains.',
            vi: 'Trái Đất có những đại dương xanh thẳm, rừng cây xanh mát và những ngọn núi cao.',
            keywords: ['deep blue oceans', 'green forests', 'high mountains']
          }
        ]
      },
      {
        slideNumber: 2,
        titleEn: 'The Blue Oceans and Continents',
        titleVi: 'Đại Dương Xanh Và Các Lục Địa',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'More than seventy percent of Earth is covered with sparkling water.',
            vi: 'Hơn bảy mươi phần trăm Trái Đất được bao phủ bởi nước biển lấp lánh.',
            keywords: ['seventy percent', 'covered', 'sparkling water']
          },
          {
            en: 'Whales, dolphins, and colorful fish swim happily in the ocean.',
            vi: 'Cá voi, cá heo và những chú cá sặc sỡ bơi lội vui vẻ đại dương.',
            keywords: ['Whales', 'dolphins', 'colorful fish']
          },
          {
            en: 'Keep our water clean and safe for all sea creatures.',
            vi: 'Hãy giữ nguồn nước luôn sạch sẽ và an toàn cho tất cả loài sinh vật biển.',
            keywords: ['clean', 'safe', 'sea creatures']
          }
        ]
      },
      {
        slideNumber: 3,
        titleEn: 'Green Forests and Wildlife',
        titleVi: 'Rừng Xanh Và Thế Giới Động Vật',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Trees produce fresh air and clean oxygen for us to breathe.',
            vi: 'Cây xanh tạo ra không khí trong lành và oxy sạch cho chúng ta hít thở.',
            keywords: ['fresh air', 'clean oxygen', 'breathe']
          },
          {
            en: 'Birds sing melodious songs high up in the green branches.',
            vi: 'Những chú chim hót líu lo rộn ràng trên các cành cây xanh.',
            keywords: ['melodious songs', 'green branches']
          },
          {
            en: 'Animals find food and cozy homes inside the wild forest.',
            vi: 'Các loài động vật tìm thấy thức ăn và mái nhà ấm áp trong rừng sâu.',
            keywords: ['cozy homes', 'wild forest']
          }
        ]
      },
      {
        slideNumber: 4,
        titleEn: 'Beautiful Mountains and Rivers',
        titleVi: 'Những Mạch Núi Và Dòng Sông Hùng Vĩ',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Snowy mountain peaks touch the soft white clouds.',
            vi: 'Dãy núi phủ tuyết trắng chạm tới những đám mây bồng bềnh.',
            keywords: ['Snowy mountain', 'soft white clouds']
          },
          {
            en: 'Fresh river water flows down to nourish plants and flowers.',
            vi: 'Dòng nước sông tươi mát chảy xuống tưới mát cho cây cối hoa cỏ.',
            keywords: ['Fresh river water', 'nourish plants']
          },
          {
            en: 'Nature creates magnificent landscapes for everyone to admire.',
            vi: 'Thiên nhiên tạo nên những cảnh quan tuyệt đẹp cho mọi người chiêm ngưỡng.',
            keywords: ['magnificent landscapes', 'admire']
          }
        ]
      },
      {
        slideNumber: 5,
        titleEn: 'Protect Our Precious Planet',
        titleVi: 'Cùng Nhau Bảo Vệ Hành Tinh Thân Yêu',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Planting trees and recycling paper help keep our Earth healthy.',
            vi: 'Trồng cây xanh và tái chế giấy giúp giữ Trái Đất luôn xanh tươi.',
            keywords: ['Planting trees', 'recycling paper', 'healthy']
          },
          {
            en: 'Turn off unused lights and save every drop of water.',
            vi: 'Tắt đèn khi không dùng và tiết kiệm từng giọt nước quý giá.',
            keywords: ['Turn off lights', 'save water']
          },
          {
            en: 'Together, we make our world a happier and cleaner place!',
            vi: 'Cùng nhau, chúng ta biến thế giới thành một nơi hạnh phúc và sạch đẹp hơn!',
            keywords: ['Together', 'happier', 'cleaner place']
          }
        ]
      }
    ]
  },
  {
    id: 's2',
    tag: 'CRAYON',
    tagBg: 'bg-cyan-100 border-cyan-300',
    tagColor: 'text-cyan-700',
    titleEn: 'A Fun Day at the Water Park',
    titleVi: 'Ngày Vui Ở Công Viên Nước',
    desc: 'Chuyến tham quan công viên nước tràn ngập niềm vui mùa hè của bé Nam cùng gia đình với trò trượt nước, dòng sông lười và ly kem mát lạnh.',
    slideCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=800&auto=format&fit=crop&q=80',
    buttonBg: 'bg-[#0284c7] hover:bg-sky-700',
    borderColor: 'border-sky-300 hover:border-sky-500',
    slides: [
      {
        slideNumber: 1,
        titleEn: 'Arriving at the Water Park',
        titleVi: 'Đến Công Viên Nước Rực Rỡ',
        image: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'On a sunny weekend, Nam and his family visit the Water Park.',
            vi: 'Vào một cuối tuần nắng đẹp, Nam và gia đình đi chơi công viên nước.',
            keywords: ['sunny weekend', 'Water Park']
          },
          {
            en: 'Look at the huge colorful rainbow gate!',
            vi: 'Hãy nhìn chiếc cổng cầu vồng khổng lồ rực rỡ kìa!',
            keywords: ['huge colorful', 'rainbow gate']
          },
          {
            en: 'Nam puts on his cute blue swimsuit excitedly.',
            vi: 'Nam hào hứng mặc chiếc bộ đồ bơi màu xanh đáng yêu.',
            keywords: ['blue swimsuit', 'excitedly']
          }
        ]
      },
      {
        slideNumber: 2,
        titleEn: 'Zooming Down the Giant Water Slide',
        titleVi: 'Trượt Ống Nước Khổng Lồ',
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Nam slides down the spiraling yellow slide super fast!',
            vi: 'Nam trượt xuống ống trượt màu vàng xoắn ốc cực nhanh!',
            keywords: ['spiraling slide', 'super fast']
          },
          {
            en: 'Splash! Water spray flies everywhere into the air.',
            vi: 'Ào! Bọt nước tung tóe khắp nơi trong không trung.',
            keywords: ['Splash', 'Water spray']
          },
          {
            en: 'He laughs loudly and waves his hands with pure joy.',
            vi: 'Cậu bé cười lớn và vẫy tay tràn ngập niềm vui.',
            keywords: ['laughs loudly', 'pure joy']
          }
        ]
      },
      {
        slideNumber: 3,
        titleEn: 'Relaxing on the Lazy River',
        titleVi: 'Thư Giãn Trên Dòng Sông Lười',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'The gentle current carries Nam and Dad on yellow float rings.',
            vi: 'Dòng nước nhẹ nhàng đưa Nam và Bố trôi trên chiếc phao tròn màu vàng.',
            keywords: ['gentle current', 'float rings']
          },
          {
            en: 'Warm sunshine beams down on the sparkling clear water.',
            vi: 'Ánh nắng ấm áp chiếu xuống mặt nước trong suốt lấp lánh.',
            keywords: ['Warm sunshine', 'sparkling water']
          },
          {
            en: 'Mom takes a sweet family photo with a big smile.',
            vi: 'Mẹ chụp một tấm hình gia đình thật tươi và ấm áp.',
            keywords: ['family photo', 'big smile']
          }
        ]
      },
      {
        slideNumber: 4,
        titleEn: 'Yummy Ice Cream Treat',
        titleVi: 'Thưởng Thức Ly Kem Mát Lạnh',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'After swimming, Nam gets a double-scoop chocolate ice cream.',
            vi: 'Sau khi bơi thỏa thích, Nam thưởng thức ly kem socola hai viên.',
            keywords: ['double-scoop', 'chocolate ice cream']
          },
          {
            en: 'His little sister chooses sweet strawberry syrup topping.',
            vi: 'Em gái nhỏ chọn phủ sốt dâu tây ngọt ngào.',
            keywords: ['sweet strawberry', 'syrup']
          },
          {
            en: 'Eating cool snacks under the beach umbrella feels amazing!',
            vi: 'Ăn đồ mát dưới dù che nắng thật là tuyệt vời!',
            keywords: ['cool snacks', 'beach umbrella']
          }
        ]
      },
      {
        slideNumber: 5,
        titleEn: 'Saying Goodbye to a Wonderful Day',
        titleVi: 'Tạm Biệt Một Ngày Tuyệt Vời',
        image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'The sun sets slowly, painting the blue sky in golden orange.',
            vi: 'Mặt trời từ từ lặn, nhuộm bầu trời màu cam vàng rực rỡ.',
            keywords: ['sun sets', 'golden orange']
          },
          {
            en: 'Nam thanks his parents for the unforgettable water adventure.',
            vi: 'Nam cảm ơn bố mẹ vì chuyến phiêu lưu công viên nước đáng nhớ.',
            keywords: ['thanks parents', 'unforgettable adventure']
          },
          {
            en: 'He promises to practice swimming well every single day!',
            vi: 'Cậu hứa sẽ chăm chỉ tập bơi thật giỏi mỗi ngày!',
            keywords: ['practice swimming', 'every single day']
          }
        ]
      }
    ]
  },
  {
    id: 's3',
    tag: 'LEGO 3D',
    tagBg: 'bg-emerald-100 border-emerald-300',
    tagColor: 'text-emerald-700',
    titleEn: 'Nha Trang Beach Blocky Adventure',
    titleVi: 'Cuộc Phiêu Lưu Biển Nha Trang Voxel',
    desc: 'Hành trình khối vuông Lego Minecraft cực ngầu của bé Long tại biển Nha Trang: đi cáp treo qua biển, xây lâu đài cát khổng lồ, lặn biển ngắm san hô.',
    slideCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    buttonBg: 'bg-[#0284c7] hover:bg-sky-700',
    borderColor: 'border-sky-300 hover:border-sky-500',
    slides: [
      {
        slideNumber: 1,
        titleEn: 'Riding the Over-Ocean Cable Car',
        titleVi: 'Đi Cáp Treo Vượt Biển Nha Trang',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Welcome to sunny Nha Trang, the famous beach paradise of Vietnam!',
            vi: 'Chào mừng đến với Nha Trang rực nắng, thiên đường biển nổi tiếng của Việt Nam!',
            keywords: ['sunny Nha Trang', 'beach paradise']
          },
          {
            en: 'Long and his family ride a LEGO cable car high above the blue ocean.',
            vi: 'Long cùng gia đình đi cáp treo LEGO ngắm nhìn biển xanh bao la.',
            keywords: ['LEGO cable car', 'blue ocean']
          },
          {
            en: 'Look at the sparkling blocky sea below!',
            vi: 'Nhìn mặt biển khối vuông lấp lánh bên dưới kìa!',
            keywords: ['sparkling blocky sea', 'below']
          }
        ]
      },
      {
        slideNumber: 2,
        titleEn: 'Building a Giant Voxel Sandcastle',
        titleVi: 'Xây Lâu Đài Cát Khối Vuông',
        image: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Long scoops fine golden sand to build a huge blocky fortress.',
            vi: 'Long múc cát vàng mịn để xây pháo đài khối vuông khổng lồ.',
            keywords: ['golden sand', 'blocky fortress']
          },
          {
            en: 'He places tiny sea shells on top of the tall towers.',
            vi: 'Cậu đặt những vỏ ốc nhỏ xinh lên đỉnh ngọn tháp cao.',
            keywords: ['sea shells', 'tall towers']
          },
          {
            en: 'Waves splash gently against his sandy LEGO creation.',
            vi: 'Sóng biển vỗ nhẹ vào tác phẩm Lego cát tuyệt đẹp.',
            keywords: ['Waves splash', 'LEGO creation']
          }
        ]
      },
      {
        slideNumber: 3,
        titleEn: 'Scuba Diving with Colorful Fish',
        titleVi: 'Lặn Biển Ngắm San Hô',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Long puts on snorkeling goggles and dives into the turquoise water.',
            vi: 'Long đeo kính lặn và hòa mình vào làn nước ngọc bích.',
            keywords: ['snorkeling goggles', 'turquoise water']
          },
          {
            en: 'Bright clownfish swim happily among neon coral reefs.',
            vi: 'Cá hề rực rỡ bơi tung tăng quanh rặng san hô phát sáng.',
            keywords: ['clownfish', 'neon coral reefs']
          },
          {
            en: 'The undersea world is vibrant, magical, and full of life!',
            vi: 'Thế giới lòng đại dương thật sống động, kỳ diệu và tràn đầy sức sống!',
            keywords: ['undersea world', 'vibrant']
          }
        ]
      },
      {
        slideNumber: 4,
        titleEn: 'Fresh Seafood BBQ by the Shore',
        titleVi: 'Tiệc Nướng Hải Sản Bờ Biển',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Delicious grilled lobsters and squid smell so tasty!',
            vi: 'Tôm hùm và mực nướng thơm lừng cực kỳ hấp dẫn!',
            keywords: ['grilled lobsters', 'squid']
          },
          {
            en: 'Dad pours fresh coconut water into bamboo cups.',
            vi: 'Bố rót nước dừa tươi nguyên chất vào ly ống trúc.',
            keywords: ['coconut water', 'bamboo cups']
          },
          {
            en: 'Everyone eats happily while listening to ocean breeze.',
            vi: 'Mọi người ăn uống ngon miệng trong tiếng gió biển rì rào.',
            keywords: ['ocean breeze', 'happily']
          }
        ]
      },
      {
        slideNumber: 5,
        titleEn: 'Night Lights over Vinpearl Island',
        titleVi: 'Ánh Đèn Đêm Đảo Vinpearl',
        image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Colorful lights illuminate the grand Ferris wheel at night.',
            vi: 'Ánh đèn lung linh thắp sáng vòng quay mặt trời vào ban đêm.',
            keywords: ['Colorful lights', 'Ferris wheel']
          },
          {
            en: 'Long takes a souvenir photo holding his 3D blocky sailboat.',
            vi: 'Long chụp ảnh kỷ niệm tay cầm thuyền thuyền Lego 3D.',
            keywords: ['souvenir photo', '3D sailboat']
          },
          {
            en: 'Nha Trang is truly a dream holiday destination for kids!',
            vi: 'Nha Trang đúng là điểm đến nghỉ dưỡng trong mơ của các bé!',
            keywords: ['dream holiday', 'destination']
          }
        ]
      }
    ]
  },
  {
    id: 's4',
    tag: 'OILPAINT',
    tagBg: 'bg-amber-100 border-amber-300',
    tagColor: 'text-amber-800',
    titleEn: 'A Day at the Green Zoo',
    titleVi: 'Một Ngày Ở Sở Thú Xanh',
    desc: 'Chuyến tham quan sở thú xanh rợp bóng cây cổ thụ của bé Huy và gia đình: xem đàn khỉ nghịch ngợm, cho hươu cao cổ ăn lá xanh.',
    slideCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&auto=format&fit=crop&q=80',
    buttonBg: 'bg-[#c2410c] hover:bg-amber-800',
    borderColor: 'border-amber-400 hover:border-amber-600',
    slides: [
      {
        slideNumber: 1,
        titleEn: 'Arriving at the Zoo Gate',
        titleVi: 'Đến Cổng Sở Thú Cổ Kính',
        image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'On a beautiful morning, Huy and his family visit the green Zoo.',
            vi: 'Vào một buổi sáng nắng đẹp, Huy cùng gia đình đi thăm sở thú xanh.',
            keywords: ['beautiful morning', 'green Zoo']
          },
          {
            en: 'Tall ancient trees cover the historic zoo gate with cool shade.',
            vi: 'Hàng cây cổ thụ rợp bóng che mát cổng sở thú lâu đời.',
            keywords: ['Tall ancient trees', 'cool shade']
          },
          {
            en: 'Huy holds his camera excitedly to take photos of animals.',
            vi: 'Huy hào hứng cầm máy ảnh để chụp những chú động vật.',
            keywords: ['camera', 'take photos']
          }
        ]
      },
      {
        slideNumber: 2,
        titleEn: 'Watching Playful Monkeys',
        titleVi: 'Xem Đàn Khỉ Nghịch Ngợm',
        image: 'https://images.unsplash.com/photo-1540573133985-778788177267?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Little monkeys swing effortlessly from vine to vine.',
            vi: 'Những chú khỉ con chuyền cành nhẹ nhàng qua các dây leo.',
            keywords: ['Little monkeys', 'swing']
          },
          {
            en: 'One cheeky monkey peels a sweet yellow banana.',
            vi: 'Một chú khỉ lém lỉnh đang bóc quả chuối chín vàng ngọt ngào.',
            keywords: ['cheeky monkey', 'sweet banana']
          },
          {
            en: 'Huy giggles as the baby monkey makes funny faces.',
            vi: 'Huy khúc khích khi thấy khỉ con làm mặt hài hước.',
            keywords: ['Huy giggles', 'funny faces']
          }
        ]
      },
      {
        slideNumber: 3,
        titleEn: 'Feeding the Friendly Giraffe',
        titleVi: 'Cho Hươu Cao Cổ Ăn Lá',
        image: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'A tall giraffe stretches its long neck over the wooden fence.',
            vi: 'Chú hươu cao cổ vươn chiếc cổ dài qua hàng rào gỗ.',
            keywords: ['tall giraffe', 'long neck']
          },
          {
            en: 'Huy gently hands fresh green tree leaves to the friendly giant.',
            vi: 'Huy nhẹ nhàng đưa cành lá xanh tươi cho bạn hươu hiền lành.',
            keywords: ['fresh green leaves', 'friendly giant']
          },
          {
            en: 'The giraffe licks the leaf softly with its dark blue tongue.',
            vi: 'Chú hươu liếm nhẹ chiếc lá bằng chiếc lưỡi màu xanh sẫm.',
            keywords: ['dark blue tongue', 'softly']
          }
        ]
      },
      {
        slideNumber: 4,
        titleEn: 'The Majestic Tiger and Waterfall',
        titleVi: 'Chú Hổ Hùng Vĩ Bên Thác Nước',
        image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'A strong Bengal tiger rests on a mossy rock near the waterfall.',
            vi: 'Chú hổ Bengal dũng mãnh nằm nghỉ trên tảng đá phủ rêu bên thác.',
            keywords: ['Bengal tiger', 'mossy rock']
          },
          {
            en: 'Its orange fur with bold black stripes glows in the sunlight.',
            vi: 'Bộ lông màu cam điểm vằn đen nổi bật lấp lánh dưới nắng.',
            keywords: ['orange fur', 'black stripes']
          },
          {
            en: 'Huy learns how important it is to protect endangered wild tigers.',
            vi: 'Huy hiểu được tầm quan trọng của việc bảo vệ loài hổ quý hiếm.',
            keywords: ['protect endangered', 'wild tigers']
          }
        ]
      },
      {
        slideNumber: 5,
        titleEn: 'Memorable Family Moments',
        titleVi: 'Kỷ Niệm Gia Đình Đáng Nhớ',
        image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Huy buys a plush lion toy at the souvenir shop.',
            vi: 'Huy mua một chú sư tử gấu bông ở cửa hàng lưu niệm.',
            keywords: ['plush lion toy', 'souvenir shop']
          },
          {
            en: 'They rest under the banyan tree and drink fresh lemonade.',
            vi: 'Gia đình nghỉ chân dưới gốc cây đa và uống nước chanh mát lạnh.',
            keywords: ['banyan tree', 'fresh lemonade']
          },
          {
            en: 'What an educational and fun adventure at Saigon Zoo!',
            vi: 'Thật là một chuyến đi bổ ích và nhiều niềm vui tại Thảo Cầm Viên!',
            keywords: ['educational', 'Saigon Zoo']
          }
        ]
      }
    ]
  },
  {
    id: 's5',
    tag: 'CLAYART',
    tagBg: 'bg-emerald-100 border-emerald-300',
    tagColor: 'text-emerald-800',
    titleEn: 'A Magical Trip to Da Lat',
    titleVi: 'Chuyến Du Lịch Đà Lạt Kỳ Diệu',
    desc: 'Hành trình nặn đất sét đáng yêu của bé Mai tham quan Đà Lạt: đi cáp treo qua đồi thông, thăm vườn hoa cẩm tú cầu, hái dâu tây.',
    slideCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    buttonBg: 'bg-[#059669] hover:bg-emerald-800',
    borderColor: 'border-emerald-300 hover:border-emerald-500',
    slides: [
      {
        slideNumber: 1,
        titleEn: 'Riding the Cable Car',
        titleVi: 'Đi Cáp Treo Ngắm Đồi Thông',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Welcome to Da Lat, the romantic city of flowers and pine trees!',
            vi: 'Chào mừng đến Đà Lạt, thành phố mộng mơ của hoa và đồi thông!',
            keywords: ['Da Lat', 'romantic city', 'pine trees']
          },
          {
            en: 'Mai and her family ride a red cable car over misty green hills.',
            vi: 'Mai và gia đình đi cáp treo đỏ lướt qua những ngọn đồi sương mờ.',
            keywords: ['red cable car', 'misty green hills']
          },
          {
            en: 'Mai wears a cozy yellow wool beanie and smiles brightly.',
            vi: 'Mai đội chiếc mũ len vàng ấm áp và mỉm cười rạng rỡ.',
            keywords: ['cozy yellow wool beanie', 'smiles']
          }
        ]
      },
      {
        slideNumber: 2,
        titleEn: 'Wandering in the Hydrangea Flower Garden',
        titleVi: 'Dạo Bước Ở Vườn Hoa Cẩm Tú Cầu',
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Giant hydrangea blooms turn pink, purple, and sky blue.',
            vi: 'Những đóa cẩm tú cầu nở to tròn chuyển màu hồng, tím và xanh.',
            keywords: ['Giant hydrangea', 'sky blue']
          },
          {
            en: 'Mai carefully snips a pretty flower stem with her mom.',
            vi: 'Mai cẩn thận cắt một cành hoa đẹp cùng mẹ.',
            keywords: ['flower stem', 'mom']
          },
          {
            en: 'Butterflies flutter cheerfully around the sweet blossoms.',
            vi: 'Những chú bướm chập chờn vui vẻ quanh các khóm hoa.',
            keywords: ['Butterflies flutter', 'sweet blossoms']
          }
        ]
      },
      {
        slideNumber: 3,
        titleEn: 'Horse-Drawn Carriage by Xuan Huong Lake',
        titleVi: 'Xe Ngựa Kéo Bên Hồ Xuân Hương',
        image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Clop-clop! A gentle brown horse pulls the wooden carriage.',
            vi: 'Lộc cốc! Chú ngựa nâu hiền lành kéo chiếc xe gỗ quanh hồ.',
            keywords: ['brown horse', 'wooden carriage']
          },
          {
            en: 'Cool mountain breeze blows across the quiet blue lake.',
            vi: 'Gió núi mát rượi thổi qua mặt hồ xanh êm đềm.',
            keywords: ['Cool mountain breeze', 'quiet lake']
          },
          {
            en: 'Pine trees cast peaceful shadows along the flower path.',
            vi: 'Rặng thông rủ bóng bình yên xuống con đường ngợp hoa.',
            keywords: ['Pine trees', 'flower path']
          }
        ]
      },
      {
        slideNumber: 4,
        titleEn: 'Harvesting Sweet Red Strawberries',
        titleVi: 'Hái Dâu Tây Đỏ Mọng',
        image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Inside the greenhouse, ripe red strawberries hang everywhere.',
            vi: 'Trong nhà kính, những quả dâu tây đỏ mọng treo lủng lẳng.',
            keywords: ['ripe red strawberries', 'greenhouse']
          },
          {
            en: 'Mai picks a basket full of juicy fruit straight from the vine.',
            vi: 'Mai hái đầy một giỏ dâu tây tươi mọng trực tiếp trên cây.',
            keywords: ['basket full', 'juicy fruit']
          },
          {
            en: 'The strawberry taste is naturally sweet and super fresh!',
            vi: 'Vị dâu tây ngọt tự nhiên và vô cùng tươi ngon!',
            keywords: ['sweet', 'super fresh']
          }
        ]
      },
      {
        slideNumber: 5,
        titleEn: 'Warm Grilled Snacks at Da Lat Night Market',
        titleVi: 'Món Nướng Ấm Áp Ở Chợ Đêm',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'At night, the cool air makes hot grilled rice paper taste delicious.',
            vi: 'Buổi tối, tiết trời se lạnh khiến bánh tráng nướng nóng hổi ngon tuyệt.',
            keywords: ['cool air', 'grilled rice paper']
          },
          {
            en: 'Mom drinks hot soy milk while Dad enjoys grilled sweet corn.',
            vi: 'Mẹ uống sữa đậu nành nóng còn Bố thưởng thức bắp nướng.',
            keywords: ['hot soy milk', 'grilled sweet corn']
          },
          {
            en: 'Mai loves the cozy clayart charm of dreamlike Da Lat!',
            vi: 'Mai yêu quý vẻ đẹp đất sét ấm áp của Đà Lạt mộng mơ!',
            keywords: ['cozy clayart charm', 'Da Lat']
          }
        ]
      }
    ]
  },
  {
    id: 's6',
    tag: 'LÒNG TỐT',
    tagBg: 'bg-emerald-100 border-emerald-300',
    tagColor: 'text-emerald-800',
    titleEn: 'Sharing An Umbrella',
    titleVi: 'Chiếc Ô Sẻ Chia',
    desc: 'Câu chuyện ấm áp về lòng tốt của bé An và Minh khi chia sẻ chiếc ô cùng bà cụ dưới cơn mưa rào mùa hè.',
    slideCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=80',
    buttonBg: 'bg-[#059669] hover:bg-emerald-800',
    borderColor: 'border-emerald-300 hover:border-emerald-500',
    slides: [
      {
        slideNumber: 1,
        titleEn: 'Sudden Summer Rain',
        titleVi: 'Cơn Mưa Rào Mùa Hè',
        image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Minh and An are walking home from school.',
            vi: 'Minh và An đang trên đường đi học về nhà.',
            keywords: ['walking home', 'school']
          },
          {
            en: 'Suddenly, dark clouds cover the sky and rain starts to fall.',
            vi: 'Bất ngờ mây đen kéo tới phủ kín bầu trời và mưa bắt đầu rơi.',
            keywords: ['dark clouds', 'rain starts']
          },
          {
            en: 'An opens her bright yellow umbrella.',
            vi: 'An giơ chiếc ô màu vàng rực rỡ lên.',
            keywords: ['bright yellow umbrella']
          }
        ]
      },
      {
        slideNumber: 2,
        titleEn: 'Meeting Grandma on the Sidewalk',
        titleVi: 'Gặp Bà Cụ Bên Đường',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'An old grandmother is standing under a tree without an umbrella.',
            vi: 'Một bà cụ đang đứng trú dưới gốc cây mà không có ô che.',
            keywords: ['old grandmother', 'without umbrella']
          },
          {
            en: 'Her clothes are getting wet from the heavy rain drops.',
            vi: 'Quần áo bà đang bị ướt bởi những hạt mưa rơi hạt to.',
            keywords: ['heavy rain drops', 'wet']
          },
          {
            en: 'Minh and An run over quickly to help her.',
            vi: 'Minh và An nhanh chóng chạy lại để giúp đỡ bà.',
            keywords: ['run over quickly', 'help her']
          }
        ]
      },
      {
        slideNumber: 3,
        titleEn: 'Sharing Warmth and Care',
        titleVi: 'Sẻ Chia Hơi Ấm Và Lòng Tốt',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'An holds the yellow umbrella high to cover Grandma.',
            vi: 'An giơ cao chiếc ô vàng che chắn cho bà cụ.',
            keywords: ['holds umbrella high', 'cover Grandma']
          },
          {
            en: 'Minh carries Grandma\'s heavy grocery bag carefully.',
            vi: 'Minh cẩn thận xách giúp bà túi đồ nặng.',
            keywords: ['grocery bag', 'carefully']
          },
          {
            en: 'Grandma smiles kindly and thanks the polite students.',
            vi: 'Bà cụ mỉm cười hiền hậu và cảm ơn hai người bạn ngoan.',
            keywords: ['smiles kindly', 'polite students']
          }
        ]
      },
      {
        slideNumber: 4,
        titleEn: 'A Beautiful Rainbow in the Sky',
        titleVi: 'Cầu Cồng Rực Rỡ Sau Mưa',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'The rain stops and a brilliant rainbow appears over the village.',
            vi: 'Cơn mưa tạnh hẳn và chiếc cầu vồng rực rỡ hiện lên trên làng.',
            keywords: ['rain stops', 'brilliant rainbow']
          },
          {
            en: 'Grandma arrives home safely and warm.',
            vi: 'Bà cụ về nhà an toàn và khô ráo.',
            keywords: ['arrives home', 'safely']
          },
          {
            en: 'She gives Minh and An two sweet apples as a thank you.',
            vi: 'Bà tặng Minh và An hai quả táo ngọt thay lời cảm ơn.',
            keywords: ['sweet apples', 'thank you']
          }
        ]
      },
      {
        slideNumber: 5,
        titleEn: 'Kindness Makes Hearts Happy',
        titleVi: 'Lòng Tốt Cho Tâm Hồn Vui Vẻ',
        image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Sharing with others brings true joy to our hearts.',
            vi: 'Biết chia sẻ với mọi người mang lại niềm vui đích thực cho trái tim.',
            keywords: ['Sharing', 'true joy']
          },
          {
            en: 'Small acts of kindness can brighten up rainy days.',
            vi: 'Những hành động tốt nhỏ bé có thể làm bừng sáng cả ngày mưa.',
            keywords: ['kindness', 'brighten up']
          },
          {
            en: 'Minh and An promise to always be helpful children.',
            vi: 'Minh và An hứa sẽ luôn là những em bé ngoan biết giúp đỡ.',
            keywords: ['helpful children', 'promise']
          }
        ]
      }
    ]
  },
  {
    id: 's7',
    tag: 'ORIGAMI',
    tagBg: 'bg-purple-100 border-purple-300',
    tagColor: 'text-purple-700',
    titleEn: 'The Animals of the Green Forest',
    titleVi: 'Những Bạn Nhỏ Trong Khu Rừng Xanh',
    desc: 'Câu chuyện origami 3D sặc sỡ về tình bạn của Chú Hươu Sao, Sóc Nâu và Chú Voi con cùng nhau bảo vệ khu rừng xanh mát.',
    slideCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    buttonBg: 'bg-[#7c3aed] hover:bg-purple-800',
    borderColor: 'border-purple-300 hover:border-purple-500',
    slides: [
      {
        slideNumber: 1,
        titleEn: 'A Sunny Morning in the Forest',
        titleVi: 'Buổi Sáng Nắng Đẹp Trong Rừng',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Good morning! Welcome to the colorful Origami Forest.',
            vi: 'Chào buổi sáng! Chào mừng đến với khu rừng Origami sặc sỡ.',
            keywords: ['Good morning', 'Origami Forest']
          },
          {
            en: 'Little Deer and Brown Squirrel are best friends.',
            vi: 'Hươu sao nhỏ và Sóc Nâu là đôi bạn thân thiết nhất.',
            keywords: ['Little Deer', 'Brown Squirrel', 'best friends']
          },
          {
            en: 'They love playing among the green paper trees.',
            vi: 'Họ rất thích chơi đùa giữa những vòm cây giấy xanh.',
            keywords: ['playing', 'green paper trees']
          }
        ]
      },
      {
        slideNumber: 2,
        titleEn: 'Searching for Crunchy Acorns',
        titleVi: 'Tìm Kiếm Món Hạt Dẻ Giòn',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Brown Squirrel leaps from oak branch to pine branch.',
            vi: 'Sóc Nâu chuyền từ cành sồi sang cành thông.',
            keywords: ['leaps', 'oak branch']
          },
          {
            en: 'He discovers a hidden treasure box filled with golden acorns.',
            vi: 'Chú phát hiện một chiếc hộp kho báu đầy hạt dẻ vàng.',
            keywords: ['hidden treasure box', 'golden acorns']
          },
          {
            en: 'Little Deer cheers excitedly for his clever friend!',
            vi: 'Hươu Sao nhỏ reo hò ủng hộ người bạn thông minh!',
            keywords: ['cheers excitedly', 'clever friend']
          }
        ]
      },
      {
        slideNumber: 3,
        titleEn: 'Helping Baby Elephant Drink Water',
        titleVi: 'Giúp Voi Con Uống Nước',
        image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'A cute origami baby elephant comes down to the river.',
            vi: 'Chú voi con origami xinh xắn đi xuống bờ sông.',
            keywords: ['baby elephant', 'river']
          },
          {
            en: 'Squirrel guides him to the sweetest clear spring water.',
            vi: 'Sóc Nâu dẫn voi con đến dòng suối trong ngọt nhất.',
            keywords: ['clear spring water', 'guides']
          },
          {
            en: 'Baby Elephant sprays water happily like a funny fountain.',
            vi: 'Voi con phun nước vui vẻ như một vòi phun nước ngộ nghĩnh.',
            keywords: ['sprays water', 'funny fountain']
          }
        ]
      },
      {
        slideNumber: 4,
        titleEn: 'Protecting the Green Woods Together',
        titleVi: 'Cùng Nhau Bảo Vệ Rừng Cây',
        image: 'https://images.unsplash.com/photo-1511497584788-876761c11969?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'When dry leaves fall, the animals gather them safely.',
            vi: 'Khi lá khô rơi, các bạn thú gom lại cẩn thận.',
            keywords: ['dry leaves', 'gather']
          },
          {
            en: 'They plant new paper flowers to keep the forest beautiful.',
            vi: 'Họ trồng thêm những bông hoa giấy để giữ rừng xanh tươi.',
            keywords: ['paper flowers', 'beautiful']
          },
          {
            en: 'Teamwork makes their origami forest a paradise for all.',
            vi: 'Sự đoàn kết biến khu rừng origami thành thiên đường.',
            keywords: ['Teamwork', 'paradise']
          }
        ]
      },
      {
        slideNumber: 5,
        titleEn: 'Peaceful Sunset in Origami Forest',
        titleVi: 'Hoàng Hôn Bình Yên Trong Rừng Origami',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Golden sunset light glows softly on the folded leaves.',
            vi: 'Ánh hoàng hôn vàng dịu chiếu lên từng tán lá gấp.',
            keywords: ['Golden sunset', 'folded leaves']
          },
          {
            en: 'Night birds sing gentle lullabies from tall tree tops.',
            vi: 'Chim đêm cất tiếng hát ru êm ả trên ngọn cây cao.',
            keywords: ['gentle lullabies', 'tree tops']
          },
          {
            en: 'Good night, dear friends of the origami green forest!',
            vi: 'Chúc ngủ ngon, những người bạn nhỏ của rừng xanh origami!',
            keywords: ['Good night', 'dear friends']
          }
        ]
      }
    ]
  },
  {
    id: 's8',
    tag: 'HOT',
    tagBg: 'bg-rose-100 border-rose-300',
    tagColor: 'text-rose-700',
    titleEn: 'Benny and the Magic Compass',
    titleVi: 'Benny và Chiếc La Bàn Kỳ Diệu',
    desc: 'Cùng Benny và chú cú Barnaby vượt qua dòng sông, tìm kiếm chiếc rương vàng và Viên Ngọc Ngôi Sao!',
    slideCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    buttonBg: 'bg-[#d97706] hover:bg-amber-700',
    borderColor: 'border-amber-300 hover:border-amber-500',
    slides: [
      {
        slideNumber: 1,
        titleEn: 'Benny and the Magic Compass',
        titleVi: 'Benny và Chiếc La Bàn Kỳ Diệu',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'One sunny morning, Benny finds a glowing golden compass in his garden.',
            vi: 'Vào buổi sáng nắng đẹp, Benny tìm thấy chiếc la bàn vàng phát sáng trong vườn.',
            keywords: ['sunny morning', 'glowing golden compass', 'garden']
          },
          {
            en: '"Look! The needle points directly to the Magic Forest!" says Benny excitedly.',
            vi: '"Nhìn kìa! Kim la bàn chỉ thẳng tới Rừng Kỳ Diệu!" Benny hào hứng nói.',
            keywords: ['needle points', 'Magic Forest', 'excitedly']
          },
          {
            en: 'Benny puts on his backpack and starts his adventurous trip.',
            vi: 'Benny đeo ba lô lên vai và bắt đầu chuyến phiêu lưu.',
            keywords: ['backpack', 'adventurous trip']
          }
        ]
      },
      {
        slideNumber: 2,
        titleEn: 'Meeting Barnaby the Wise Owl',
        titleVi: 'Gặp Chú Cú Barnaby Thông Thái',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'High up in the ancient oak tree sits Barnaby the wise owl.',
            vi: 'Trên cành cây sồi cổ thụ cao tít, chú cú Barnaby thông thái đang ngồi.',
            keywords: ['ancient oak tree', 'wise owl']
          },
          {
            en: 'Barnaby gives Benny an old secret map wrapped in blue ribbon.',
            vi: 'Barnaby trao cho Benny tấm bản đồ bí mật thắt nơ xanh.',
            keywords: ['secret map', 'blue ribbon']
          },
          {
            en: 'Follow the glowing stars to unlock the mystery chest!',
            vi: 'Hãy đi theo những ngôi sao phát sáng để mở rương bí ẩn!',
            keywords: ['glowing stars', 'mystery chest']
          }
        ]
      },
      {
        slideNumber: 3,
        titleEn: 'Crossing the Crystal Wooden Bridge',
        titleVi: 'Băng Qua Cầu Gỗ Pha Lê',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Benny steps carefully onto the narrow wooden river bridge.',
            vi: 'Benny cẩn thận bước qua chiếc cầu gỗ hẹp bắc qua dòng sông.',
            keywords: ['narrow wooden bridge', 'river']
          },
          {
            en: 'Sparkling river water glimmers like diamonds under sun rays.',
            vi: 'Làn nước sông lấp lánh như kim cương dưới ánh nắng.',
            keywords: ['Sparkling river', 'glimmers']
          },
          {
            en: 'He keeps his focus and crosses safely to the secret cave.',
            vi: 'Cậu tập trung và bước qua an toàn tới hang động bí mật.',
            keywords: ['keeps focus', 'secret cave']
          }
        ]
      },
      {
        slideNumber: 4,
        titleEn: 'Unlocking the Golden Treasure Chest',
        titleVi: 'Mở Khóa Rương Vàng Kỳ Diệu',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Inside the glowing cave, Benny discovers a golden treasure chest.',
            vi: 'Trong hang động phát sáng, Benny phát hiện rương báu bằng vàng.',
            keywords: ['glowing cave', 'golden chest']
          },
          {
            en: 'The magic compass key fits perfectly into the star lock!',
            vi: 'Chiếc chìa khóa la bàn khớp hoàn hảo vào ổ khóa hình ngôi sao!',
            keywords: ['magic key', 'star lock']
          },
          {
            en: 'The chest opens, revealing a dazzling Star Gem of Wisdom!',
            vi: 'Rương mở ra, lộ diện Viên Ngọc Ngôi Sao Trí Tuệ tuyệt đẹp!',
            keywords: ['Star Gem', 'Wisdom']
          }
        ]
      },
      {
        slideNumber: 5,
        titleEn: 'A Heroic Return Under Rainbow Sky',
        titleVi: 'Trở Về Tràn Đầy Niềm Tự Hào',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        sentences: [
          {
            en: 'Benny returns home with Barnaby under a bright rainbow sky.',
            vi: 'Benny trở về nhà cùng Barnaby dưới bầu trời cầu vồng tươi sáng.',
            keywords: ['Barnaby', 'rainbow sky']
          },
          {
            en: 'He shares his brave adventure story with his proud family.',
            vi: 'Cậu kể lại câu chuyện phiêu lưu dũng cảm cho gia đình tự hào.',
            keywords: ['brave adventure', 'proud family']
          },
          {
            en: 'Courage and curiosity open doors to marvelous discoveries!',
            vi: 'Lòng dũng cảm và sự tò mò sẽ mở ra những khám phá kỳ diệu!',
            keywords: ['Courage', 'curiosity', 'marvelous discoveries']
          }
        ]
      }
    ]
  }
];

export const StoryReadingView: React.FC<StoryReadingViewProps> = ({
  user,
  onAddStars,
  onBack,
  onLogout,
  setActiveTab
}) => {
  // Navigation & Active States
  const [viewMode, setViewMode] = useState<'catalog' | 'reader'>('catalog');
  const [activeStory, setActiveStory] = useState<StoryItem>(STORIES_DATA[0]);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  // Settings Toggles
  const [showVietnamese, setShowVietnamese] = useState<boolean>(true);
  const [showEnlargedModal, setShowEnlargedModal] = useState<boolean>(false);

  // Voice recording / Shadowing state
  const [recordingSentenceIndex, setRecordingSentenceIndex] = useState<number | null>(null);
  const [recordingScore, setRecordingScore] = useState<{ idx: number; score: number } | null>(null);

  const currentSlide = activeStory.slides[activeSlideIndex] || activeStory.slides[0];

  // Open a story
  const handleOpenStory = (story: StoryItem) => {
    audioService.playClickSound();
    setActiveStory(story);
    setActiveSlideIndex(0);
    setViewMode('reader');
  };

  // Speak sentence TTS
  const handleSpeakSentence = (text: string) => {
    audioService.speakEnglish(text, 0.9);
  };

  // Speak single word
  const handleSpeakWord = (word: string) => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    if (cleanWord) {
      audioService.speakEnglish(cleanWord, 0.9);
    }
  };

  // Trigger Shadowing Recording
  const handleStartShadowing = (idx: number, sentenceText: string) => {
    audioService.playClickSound();
    setRecordingSentenceIndex(idx);

    // Speak sentence first
    audioService.speakEnglish(sentenceText, 0.9);

    // After 2.5 seconds simulate AI voice scoring
    setTimeout(() => {
      setRecordingSentenceIndex(null);
      const score = Math.floor(Math.random() * 10) + 90; // 90 to 99
      setRecordingScore({ idx, score });
      audioService.playApplauseSound();
      triggerConfetti('default');
      if (onAddStars) onAddStars(5);
    }, 2800);
  };

  // Highlight words helper
  const renderSentenceWithHighlights = (sentenceText: string, keywords: string[]) => {
    const words = sentenceText.split(' ');

    const colors = [
      'text-[#9333ea] border-b-2 border-dotted border-[#9333ea]', // purple
      'text-[#0284c7] border-b-2 border-dotted border-[#0284c7]', // cyan
      'text-[#16a34a] border-b-2 border-dotted border-[#16a34a]', // green
      'text-[#ea580c] border-b-2 border-dotted border-[#ea580c]', // orange
      'text-[#2563eb] border-b-2 border-dotted border-[#2563eb]'  // blue
    ];

    let colorIdx = 0;

    return words.map((word, wIdx) => {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
      const isKeyword = keywords.some(
        (kw) => kw.toLowerCase().includes(cleanWord) && cleanWord.length > 2
      );

      if (isKeyword) {
        const styleClass = colors[colorIdx % colors.length];
        colorIdx++;

        return (
          <span
            key={`w-${wIdx}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSpeakWord(word);
            }}
            className={`font-black cursor-pointer hover:bg-amber-100 rounded px-0.5 transition inline-block mr-1 ${styleClass}`}
            title="Nhấp để nghe đọc từ này"
          >
            {word}
          </span>
        );
      }

      return (
        <span
          key={`w-${wIdx}`}
          onClick={(e) => {
            e.stopPropagation();
            handleSpeakWord(word);
          }}
          className="hover:text-blue-600 hover:bg-sky-100 cursor-pointer rounded px-0.5 transition inline-block mr-1"
        >
          {word}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#edf3fd] text-slate-800 font-sans p-3 sm:p-5 select-none space-y-4 animate-fadeIn">
      {/* ==================== TOP GLOBAL HEADER BAR ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="w-10 h-10 rounded-2xl bg-[#1e40af] text-white flex items-center justify-center shrink-0 shadow-2xs text-xl">
            📖
          </div>
          <div>
            <h1 className="text-xl font-black text-[#1e3a8a] tracking-tight flex items-center gap-2">
              <span>Truyện StoryBoard - Shadowing</span>
              <span className="text-base">📖</span>
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Đọc truyện lật trang 3D & luyện phát âm chuẩn AI cùng Dino
            </p>
          </div>
        </div>

        {/* TOP RIGHT STATS BADGES */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="bg-blue-100/90 border border-blue-200 text-blue-900 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-2xs relative overflow-hidden">
            <Trophy size={15} className="text-blue-600" />
            <span>Cấp độ 7</span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-200">
              <div className="h-full bg-blue-600 w-3/4"></div>
            </div>
          </div>

          <div className="bg-amber-100/90 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-2xs">
            <span>⭐</span>
            <span>313</span>
          </div>

          <div className="bg-rose-100/90 border border-rose-200 text-rose-900 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-2xs">
            <Flame size={15} className="text-rose-500 fill-rose-500" />
            <span>4 ngày</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden border border-white shadow-2xs">
            👦
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs transition cursor-pointer"
            >
              <LogOut size={14} />
              <span>Thoát</span>
            </button>
          )}
        </div>
      </div>

      {/* ==================== VIEW MODE 1: CATALOG STORY GRID (IMAGE 1 MATCH) ==================== */}
      {viewMode === 'catalog' ? (
        <div className="space-y-4">
          {/* SECTION HEADER BAR */}
          <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 shadow-2xs space-y-1">
            <h2 className="text-sm font-black text-[#1e3a8a] flex items-center gap-1.5">
              <span>✧</span>
              <span>KHO TRUYỆN STORYBOARD - SHADOWING</span>
            </h2>
            <p className="text-xs text-blue-700 font-semibold">
              Lật trang sinh động, tra từ điển thông minh & thu âm karaoke bôi màu từng chữ
            </p>
          </div>

          {/* 8 STORIES GRID (4 COLS x 2 ROWS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STORIES_DATA.map((story) => (
              <div
                key={story.id}
                onClick={() => handleOpenStory(story)}
                className={`bg-white rounded-3xl border-2 p-3.5 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3 group ${story.borderColor}`}
              >
                {/* THUMBNAIL CONTAINER */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={story.thumbnail}
                    alt={story.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  {/* TOP RIGHT TAG */}
                  <span
                    className={`absolute top-2 right-2 border text-[10px] font-black px-2 py-0.5 rounded-lg shadow-2xs uppercase ${story.tagBg} ${story.tagColor}`}
                  >
                    {story.tag}
                  </span>

                  {/* BOTTOM LEFT OVERLAY: 5 SLIDES */}
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {story.slideCount} Slides
                  </span>
                </div>

                {/* CONTENT SECTION */}
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-start gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5 border border-blue-200">
                        📖
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-800 line-clamp-1 leading-snug">
                          {story.titleEn}
                        </h3>
                        <p className="text-[11px] font-bold text-blue-600 line-clamp-1">
                          {story.titleVi}
                        </p>
                      </div>
                    </div>

                    {/* DESCRIPTION BOX */}
                    <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-2.5 text-[11px] text-slate-600 font-medium line-clamp-3 leading-relaxed">
                      {story.desc}
                    </div>
                  </div>

                  {/* BOTTOM ACTION BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenStory(story);
                    }}
                    className={`w-full text-white font-black text-xs py-2.5 rounded-2xl shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer ${story.buttonBg}`}
                  >
                    <span>ĐỌC NGAY</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ==================== VIEW MODE 2: 3D STORYBOARD READER (IMAGES 2-8 MATCH) ==================== */
        <div className="space-y-4">
          {/* TOP CONTROL NAVIGATION BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  audioService.playClickSound();
                  setViewMode('catalog');
                }}
                className="bg-[#78350f] hover:bg-[#58270a] text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={15} />
                <span>Danh Sách Truyện</span>
              </button>

              <span className="bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs px-3 py-1.5 rounded-full shadow-2xs">
                Slide {activeSlideIndex + 1} / {activeStory.slideCount}
              </span>
            </div>

            {/* SLIDE PAGINATION CONTROLS */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full shadow-2xs">
              <button
                disabled={activeSlideIndex === 0}
                onClick={() => {
                  audioService.playClickSound();
                  setActiveSlideIndex((prev) => Math.max(0, prev - 1));
                }}
                className="w-7 h-7 rounded-full bg-white text-slate-700 hover:bg-slate-200 disabled:opacity-40 flex items-center justify-center transition cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {activeStory.slides.map((s, idx) => {
                const isActive = activeSlideIndex === idx;
                return (
                  <button
                    key={`p-${idx}`}
                    onClick={() => {
                      audioService.playClickSound();
                      setActiveSlideIndex(idx);
                    }}
                    className={`w-7 h-7 rounded-full text-xs font-black transition cursor-pointer ${
                      isActive
                        ? 'bg-[#78350f] text-white shadow-xs'
                        : 'bg-white text-[#78350f] border border-amber-200 hover:bg-amber-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}

              <button
                disabled={activeSlideIndex === activeStory.slideCount - 1}
                onClick={() => {
                  audioService.playClickSound();
                  setActiveSlideIndex((prev) => Math.min(activeStory.slideCount - 1, prev + 1));
                }}
                className="w-7 h-7 rounded-full bg-white text-slate-700 hover:bg-slate-200 disabled:opacity-40 flex items-center justify-center transition cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* VIETNAMESE TRANSLATION TOGGLE */}
            <button
              onClick={() => {
                audioService.playClickSound();
                setShowVietnamese(!showVietnamese);
              }}
              className="bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-2xs transition flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
            >
              {showVietnamese ? <EyeOff size={15} /> : <Eye size={15} />}
              <span>{showVietnamese ? 'Hiện Dịch Tiếng Việt' : 'Ẩn Dịch Tiếng Việt'}</span>
            </button>
          </div>

          {/* MAIN 3D BOOK SPREAD CONTAINER */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* LEFT SIDEBAR: THUMBNAIL STRIP "TRANG TRUYỆN ⭐" */}
            <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-2 flex md:flex-col gap-2 shrink-0 md:w-28 items-center shadow-2xs">
              <div className="bg-amber-100/90 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-1 rounded-xl flex items-center gap-1 w-full justify-center">
                <span>TRANG TRUYỆN</span>
                <span>⭐</span>
              </div>

              {/* THUMBNAIL CARDS STACK */}
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[460px] w-full pr-1">
                {activeStory.slides.map((s, sIdx) => {
                  const isSelected = activeSlideIndex === sIdx;

                  return (
                    <div
                      key={`strip-${sIdx}`}
                      onClick={() => {
                        audioService.playClickSound();
                        setActiveSlideIndex(sIdx);
                      }}
                      className={`relative w-16 h-12 md:w-full md:h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition shrink-0 ${
                        isSelected
                          ? 'border-[#78350f] shadow-md scale-105'
                          : 'border-slate-200 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={s.image} alt={s.titleEn} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#78350f] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-2xs">
                        {sIdx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3D BOOK SPREAD FRAME */}
            <div className="flex-1 bg-sky-100/60 p-2 sm:p-4 rounded-3xl border-4 border-[#0284c7] shadow-xl">
              <div className="bg-white border-2 border-sky-300 rounded-2xl p-4 flex flex-col md:flex-row gap-5 relative shadow-inner min-h-[460px]">
                {/* LEFT PAGE: STORY ILLUSTRATION */}
                <div className="flex-1 relative flex flex-col items-center justify-center space-y-3 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                  <div className="relative w-full max-w-sm aspect-3/4 rounded-2xl overflow-hidden border-2 border-sky-200 shadow-md group">
                    <img
                      src={currentSlide.image}
                      alt={currentSlide.titleEn}
                      className="w-full h-full object-cover"
                    />

                    {/* FLOATING ACTION BUTTONS ON IMAGE */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          audioService.playClickSound();
                          setActiveSlideIndex((prev) => (prev + 1) % activeStory.slideCount);
                        }}
                        className="bg-amber-100/90 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full shadow-2xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>👇 Nhấp hình để lật trang ›</span>
                      </button>

                      <button
                        onClick={() => {
                          audioService.playClickSound();
                          setShowEnlargedModal(true);
                        }}
                        className="bg-[#78350f] hover:bg-[#58270a] text-white font-extrabold text-[10px] px-3 py-1 rounded-full shadow-2xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <Maximize2 size={11} />
                        <span>Phóng to</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* BOOK SPINE DIVIDER */}
                <div className="hidden md:block w-px bg-slate-200 self-stretch my-2 relative">
                  <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-12 bg-sky-200/80 rounded-full border border-sky-300"></div>
                </div>

                {/* RIGHT PAGE: STORY TEXT & SHADOWING KARAOKE */}
                <div className="flex-1 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* SLIDE TITLE ROW */}
                    <div className="flex items-start justify-between gap-2 border-b border-dashed border-amber-200 pb-2">
                      <div>
                        <h2 className="text-sm sm:text-base font-black text-slate-800 leading-snug">
                          {currentSlide.titleEn}
                        </h2>
                        {showVietnamese && (
                          <p className="text-xs font-semibold text-slate-500">
                            {currentSlide.titleVi}
                          </p>
                        )}
                      </div>

                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg shrink-0">
                        ⭐ Slide {activeSlideIndex + 1}/{activeStory.slideCount}
                      </span>
                    </div>

                    {/* 3 SENTENCE CARDS FOR SHADOWING PRACTICE */}
                    <div className="space-y-2.5 pt-1">
                      {currentSlide.sentences.map((st, idx) => {
                        const isRecording = recordingSentenceIndex === idx;
                        const scoreData = recordingScore?.idx === idx ? recordingScore : null;

                        return (
                          <div
                            key={`snt-${idx}`}
                            className="border-2 border-dashed border-sky-300 rounded-2xl p-3 bg-white hover:bg-sky-50/50 transition shadow-2xs flex items-center justify-between gap-2 relative"
                          >
                            <div className="space-y-1 flex-1 pr-1">
                              {/* ENGLISH SENTENCE WITH COLORED KEYWORDS */}
                              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                                {renderSentenceWithHighlights(st.en, st.keywords)}
                              </p>

                              {/* VIETNAMESE TRANSLATION */}
                              {showVietnamese && (
                                <p className="text-[11px] font-semibold text-[#0284c7] leading-snug">
                                  {st.vi}
                                </p>
                              )}

                              {/* RECORDING AI SCORE TOAST */}
                              {scoreData && (
                                <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300 animate-fadeIn mt-1">
                                  <Sparkles size={11} className="text-emerald-600" />
                                  <span>Đọc xuất sắc! {scoreData.score}% ⭐ +5 Sao</span>
                                </div>
                              )}
                            </div>

                            {/* RIGHT ACTION BUTTONS: SPEAKER & MICROPHONE */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* SPEAKER TTS BUTTON */}
                              <button
                                onClick={() => handleSpeakSentence(st.en)}
                                className="w-8 h-8 rounded-full border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-600 flex items-center justify-center transition cursor-pointer shadow-2xs"
                                title="Nghe đọc tiếng Anh"
                              >
                                <Volume2 size={15} />
                              </button>

                              {/* MICROPHONE SHADOWING BUTTON */}
                              <button
                                onClick={() => handleStartShadowing(idx, st.en)}
                                className={`w-8 h-8 rounded-full border flex items-center justify-center transition cursor-pointer shadow-2xs ${
                                  isRecording
                                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                                    : 'border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-600'
                                }`}
                                title="Bắt đầu thu âm Shadowing"
                              >
                                <Mic size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* BOTTOM RIGHT PAGE CORNER NUMBER */}
                  <div className="self-end pt-2">
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black flex items-center justify-center shadow-2xs">
                      {activeSlideIndex + 1}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ENLARGED IMAGE MODAL (PHÓNG TO) */}
      {showEnlargedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-sky-400 p-4 max-w-lg w-full space-y-3 shadow-2xl relative">
            <button
              onClick={() => setShowEnlargedModal(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer z-10"
            >
              <X size={18} />
            </button>

            <div className="space-y-1 text-center pr-8">
              <h3 className="text-sm font-black text-slate-800">{currentSlide.titleEn}</h3>
              <p className="text-xs text-blue-600 font-semibold">{currentSlide.titleVi}</p>
            </div>

            <div className="aspect-3/4 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <img src={currentSlide.image} alt="Enlarged slide" className="w-full h-full object-cover" />
            </div>

            <button
              onClick={() => setShowEnlargedModal(false)}
              className="w-full bg-[#78350f] hover:bg-[#58270a] text-white font-extrabold text-xs py-2 rounded-xl transition cursor-pointer"
            >
              Đóng xem ảnh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
