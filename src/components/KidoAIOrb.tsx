import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, X, Sparkles, Move, Lightbulb, MessageSquare } from 'lucide-react';
import { audioService } from '../utils/audio';

interface KidoAIOrbProps {
  userName: string;
}

export const KidoAIOrb: React.FC<KidoAIOrbProps> = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'dino' | 'user'; text: string }>>([
    {
      sender: 'dino',
      text: `Chào ${userName}! Tớ là Trợ lý Kido AI đây. Hôm nay bé muốn hỏi từ vựng nào hay cần tớ giải thích bài học gì không? 🦖🌟`,
    },
  ]);

  // Quick suggestion chips
  const suggestions = [
    "Từ 'Apple' nghĩa là gì?",
    "Luyện đọc: 'Good morning'",
    "Đố bé từ Tiếng Anh con Mèo?",
    "Kể 1 câu chuyện vui ngắn 📖",
  ];

  // Draggable position state (null = default bottom-right)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initX: 0, initY: 0, moved: false });

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isOpen]);

  // Handle window resize to keep orb and chat box strictly within screen bounds
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      if (pos) {
        const maxX = window.innerWidth - 80;
        const maxY = window.innerHeight - 80;
        if (pos.x > maxX || pos.y > maxY || pos.x < 0 || pos.y < 0) {
          setPos(null);
        } else {
          setPos((prev) => {
            if (!prev) return null;
            return {
              x: Math.max(10, Math.min(maxX, prev.x)),
              y: Math.max(10, Math.min(maxY, prev.y)),
            };
          });
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pos]);

  // Calculate smart position & dimensions for chat box to avoid screen overflowing
  const getChatStyle = (): React.CSSProperties => {
    const isMobile = windowSize.width < 640;

    if (isMobile) {
      return {
        position: 'fixed',
        bottom: '84px',
        left: '12px',
        right: '12px',
        width: 'calc(100vw - 24px)',
        height: 'min(480px, calc(100vh - 100px))',
        maxHeight: 'calc(100vh - 100px)',
        zIndex: 99999,
      };
    }

    if (pos) {
      const chatWidth = 380;
      const chatHeight = Math.min(520, windowSize.height - 100);

      // Try rendering above the orb
      let top = pos.y - chatHeight - 12;
      let left = pos.x + 64 - chatWidth;

      // If top goes above screen margin, place below orb instead
      if (top < 12) {
        top = pos.y + 70;
      }

      // Clamp top within screen
      if (top + chatHeight > windowSize.height - 12) {
        top = Math.max(12, windowSize.height - chatHeight - 12);
      }

      // Clamp left within screen
      if (left < 12) left = 12;
      if (left + chatWidth > windowSize.width - 12) {
        left = Math.max(12, windowSize.width - chatWidth - 12);
      }

      return {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        width: `${chatWidth}px`,
        height: `${chatHeight}px`,
        maxHeight: `${chatHeight}px`,
        zIndex: 99999,
      };
    }

    const defaultChatHeight = Math.min(520, windowSize.height - 110);
    return {
      position: 'fixed',
      bottom: '90px',
      right: '24px',
      width: '380px',
      height: `${defaultChatHeight}px`,
      maxHeight: `calc(100vh - 110px)`,
      zIndex: 99999,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isOpen) {
      audioService.playClickSound();
      setIsOpen(false);
      return;
    }

    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: rect.left,
      initY: rect.top,
      moved: false,
    };

    setIsDragging(true);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;

      if (Math.hypot(dx, dy) > 5) {
        dragRef.current.moved = true;
      }

      if (dragRef.current.moved) {
        const maxX = window.innerWidth - rect.width - 10;
        const maxY = window.innerHeight - rect.height - 10;
        const newX = Math.max(10, Math.min(maxX, dragRef.current.initX + dx));
        const newY = Math.max(10, Math.min(maxY, dragRef.current.initY + dy));

        setPos({ x: newX, y: newY });
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      setIsDragging(false);

      if (!dragRef.current.moved) {
        audioService.playClickSound();
        setIsOpen((prev) => !prev);
        setHasUnread(false);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const sendQuery = (userQuery: string) => {
    if (!userQuery.trim()) return;

    audioService.playClickSound();
    const cleanQuery = userQuery.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: cleanQuery }]);
    setInputText('');

    // Simulated Kido response with kids-friendly AI voice speech
    setTimeout(() => {
      let reply = `Kido nghe rõ rồi! Câu "${cleanQuery}" rất hay đấy. Bé hãy phát âm to và rõ từng từ nhé! 🌟`;
      const queryLower = cleanQuery.toLowerCase();

      if (queryLower.includes('apple') || queryLower.includes('táo')) {
        reply = `'Apple' đọc là /ˈæp.əl/ nghĩa là "Quả Táo" chín đỏ mọng ngọt ngào đó bé! 🍎`;
      } else if (queryLower.includes('good morning') || queryLower.includes('sáng')) {
        reply = `'Good morning' /ɡʊd ˈmɔː.nɪŋ/ là lời chào "Chào buổi sáng" thật năng lượng! 🌅`;
      } else if (queryLower.includes('con mèo') || queryLower.includes('mèo') || queryLower.includes('cat')) {
        reply = `Con Mèo trong tiếng Anh là 'Cat' /kæt/ nè bé! Meo meo! 🐱`;
      } else if (queryLower.includes('truyện') || queryLower.includes('kể')) {
        reply = `Ngày xửa ngày xưa, có chú khủng long Kido rất thích học tiếng Anh. Mỗi ngày Kido học thêm 3 từ mới và được thưởng rất nhiều Sao Vàng! 🌟`;
      } else if (queryLower.includes('hello') || queryLower.includes('chào')) {
        reply = `Hello ${userName}! Kido chúc bé một ngày học tập thật rực rỡ và nhận nhiều sao vàng! 🌟`;
      } else if (queryLower.includes('kido') || queryLower.includes('dino')) {
        reply = `Roar! Kido luôn ở đây để đồng hành cùng ${userName} học Tiếng Anh thật giỏi nè! 🦖`;
      }

      setChatMessages((prev) => [...prev, { sender: 'dino', text: reply }]);
      setIsSpeaking(true);
      audioService.speakEnglish(reply.replace(/[^a-zA-Z0-9 ]/g, ''));
      setTimeout(() => setIsSpeaking(false), 2500);
    }, 500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(inputText);
  };

  return (
    <>
      {/* Expanded Interactive AI Chat Box - POSITIONED SMARTLY WITHIN VIEWPORT */}
      {isOpen && (
        <div
          style={getChatStyle()}
          className="bg-white rounded-[26px] shadow-2xl border-2 border-indigo-100 flex flex-col font-sans overflow-hidden animate-fadeIn select-none shrink-0"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1d50b4] via-blue-600 to-indigo-600 px-3.5 py-2.5 text-white flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-emerald-400 p-0.5 flex items-center justify-center text-lg shrink-0 shadow-sm border border-white/60">
                  🦖
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-300 border-2 border-white rounded-full" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm flex items-center gap-1 leading-tight">
                  <span>Trợ Lý Kido AI</span>
                  <Sparkles size={12} className="text-amber-300 fill-amber-300" />
                </h4>
                <p className="text-[10px] text-sky-100 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                  <span>Gia sư tiếng Anh 24/7</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 text-white flex items-center justify-center cursor-pointer transition shrink-0"
              aria-label="Đóng chat Kido AI"
            >
              <X size={15} />
            </button>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-2.5 py-2 bg-sky-50/90 border-b border-sky-100 flex items-center gap-1.5 overflow-x-auto max-w-full no-scrollbar shrink-0 min-w-0">
            <div className="flex items-center gap-1 shrink-0 mr-0.5">
              <Lightbulb size={11} className="text-amber-500 fill-amber-300 shrink-0" />
              <span className="text-[9px] font-black text-[#1d50b4] uppercase tracking-wider">Gợi ý:</span>
            </div>
            {suggestions.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => sendQuery(chip)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-sky-100 text-[#1d50b4] border border-sky-200 text-[10px] font-extrabold transition cursor-pointer shadow-2xs active:scale-95 shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="p-3 flex-1 overflow-y-auto space-y-2.5 bg-slate-50/70 text-xs font-bold min-h-0 custom-scrollbar">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'dino' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-400 text-base flex items-center justify-center shrink-0 shadow-2xs border border-white">
                    🦖
                  </div>
                )}
                <div
                  className={`p-2.5 rounded-2xl max-w-[85%] leading-relaxed break-words ${
                    msg.sender === 'user'
                      ? 'bg-[#1d50b4] text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <p className="text-xs font-bold leading-relaxed">{msg.text}</p>
                  {msg.sender === 'dino' && (
                    <button
                      onClick={() => {
                        audioService.speakEnglish(msg.text);
                        setIsSpeaking(true);
                        setTimeout(() => setIsSpeaking(false), 2000);
                      }}
                      className="mt-1 text-[10px] text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-2 py-0.5 rounded-lg border border-sky-200 inline-flex items-center gap-1 font-extrabold cursor-pointer transition active:scale-95"
                    >
                      <Volume2 size={11} className={isSpeaking ? 'animate-bounce text-emerald-600' : ''} />
                      <span>Nghe đọc 🔊</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-2 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
          >
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                placeholder="Hỏi Kido từ vựng hoặc câu tiếng Anh..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-sky-50 border border-transparent focus:border-sky-300 transition"
              />
              <MessageSquare size={13} className="absolute right-2.5 text-slate-400 pointer-events-none" />
            </div>
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-xl bg-[#1d50b4] hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center shadow-xs cursor-pointer transition active:scale-95 shrink-0"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* CIRCULAR AVATAR ORB FLOATING BUTTON - AT THE BOTTOM */}
      <div
        style={
          pos
            ? { position: 'fixed', left: `${pos.x}px`, top: `${pos.y}px` }
            : undefined
        }
        className={`${
          pos ? 'fixed z-[9999]' : 'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999]'
        } touch-none select-none flex flex-col items-end gap-2.5`}
      >
        <div
          onPointerDown={handlePointerDown}
          className="relative group cursor-pointer flex flex-col items-center"
        >
          {/* Tooltip Pill directly above circular orb when hovered or when closed */}
          {!isOpen && (
            <div className="absolute bottom-full mb-2 right-0 bg-white/95 backdrop-blur-md text-[#1d50b4] font-black text-xs px-3 py-1.5 rounded-2xl shadow-lg border border-sky-200 whitespace-nowrap flex items-center gap-1.5 pointer-events-none animate-bounce">
              <Sparkles size={12} className="text-amber-400 fill-amber-400 shrink-0" />
              <span>Hỏi Kido AI nè! 🦖</span>
            </div>
          )}

          {/* Circular Avatar Orb Frame */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#1d50b4] via-blue-600 to-indigo-600 p-1 shadow-xl hover:shadow-2xl hover:scale-108 active:scale-95 transition-all flex items-center justify-center border-2 border-white">
            {/* Subtle Outer Glow Ring */}
            <div className="absolute -inset-1 rounded-full bg-sky-400/30 blur-sm animate-pulse pointer-events-none" />

            {/* Inner Circular Frame with Photo/Dinosaur Image */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-300 to-teal-500 flex items-center justify-center text-2xl sm:text-3xl shadow-inner border border-white/80 relative z-10 overflow-hidden">
              {isOpen ? (
                <div className="w-full h-full bg-slate-900/80 text-white flex items-center justify-center text-lg font-black">
                  <X size={22} />
                </div>
              ) : (
                <span className="drop-shadow-xs transform group-hover:scale-115 transition">🦖</span>
              )}
            </div>

            {/* Red Alert Notification Badge for Unread Messages */}
            {hasUnread && !isOpen && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 border-2 border-white text-white font-black text-[10px] flex items-center justify-center shadow-md animate-pulse z-20">
                !
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

