"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend, FiUser, FiClock } from "react-icons/fi";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'admin';
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Merhaba! Ben Eren. Size nasıl yardımcı olabilirim?",
      sender: 'admin',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() === "") return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate admin response
    setTimeout(() => {
      const adminResponses = [
        "Teşekkürler! Mesajınızı aldım. Size en kısa sürede dönüş yapacağım.",
        "Projenizle ilgili detayları öğrenmek isterim. Email adresinizi paylaşabilir misiniz?",
        "Bu konu hakkında konuşmak için bir görüşme planlayabiliriz.",
        "Portfolyomdaki projelerle ilgili sorularınızı yanıtlamaktan memnuniyet duyarım.",
        "LinkedIn veya email yoluyla da iletişime geçebilirsiniz."
      ];

      const currentResponse = adminResponses[responseIndex % adminResponses.length];
      setResponseIndex(prev => prev + 1);
      
      const adminMessage: Message = {
        id: Date.now() + 1,
        text: currentResponse,
        sender: 'admin',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, adminMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Enhanced Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] text-white p-3 md:p-4 rounded-full transition-all duration-300 border-2 border-white/10"
        aria-label="Open chat"
      >
        <motion.div
          animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <FiX className="w-5 h-5 md:w-6 md:h-6" />
          ) : (
            <FiMessageCircle className="w-5 h-5 md:w-6 md:h-6" />
          )}
        </motion.div>
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
          />
        )}

      </motion.button>

      {/* Enhanced Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-16 right-2 left-2 md:bottom-24 md:right-6 md:left-auto z-40 w-auto md:w-80 lg:w-96 h-[70vh] md:h-[500px] bg-gradient-to-br from-[#1F2731] via-[#1A252F] to-[#0F1923] rounded-2xl border border-[#FF4655]/30 overflow-hidden backdrop-blur-xl"
          >
            {/* Enhanced Chat Header */}
            <div className="bg-gradient-to-r from-[#FF4655] via-[#FF6B7A] to-[#FF4655] text-white p-3 md:p-4 flex items-center justify-between relative overflow-hidden">
              <div className="flex items-center gap-3 relative z-10">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30"
                >
                  <FiUser className="w-4 h-4 md:w-5 md:h-5" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-sm md:text-base">Eren KALAYCI</h3>
                  <div className="flex items-center gap-1 text-xs text-white/90">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 bg-green-400 rounded-full"
                    ></motion.div>
                    <span className="font-medium">Aktif • Genellikle hızlı yanıtlar</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10"
              >
                <FiX className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            </div>

            {/* Enhanced Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gradient-to-b from-[#0F1923]/50 to-[#1F2731]/30">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] text-white rounded-br-md border border-[#FF4655]/20'
                        : 'bg-gradient-to-r from-[#2A3441] to-[#1F2731] text-white rounded-bl-md border border-[#FF4655]/10'
                    }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
                    <div className={`flex items-center gap-1 mt-2 text-xs ${
                      message.sender === 'user' 
                        ? 'text-white/80' 
                        : 'text-gray-300'
                    }`}>
                      <FiClock className="w-3 h-3" />
                      <span>{formatTime(message.timestamp)}</span>
                      {message.sender === 'user' && (
                        <span className="ml-auto">✓✓</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Enhanced Typing Indicator */}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gradient-to-r from-[#2A3441] to-[#1F2731] p-3 md:p-4 rounded-2xl rounded-bl-md border border-[#FF4655]/10">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-[#FF4655] rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-[#FF4655] rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-[#FF4655] rounded-full"
                        />
                      </div>
                      <span className="text-xs text-gray-300 ml-2">Eren yazıyor...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input Area */}
            <div className="p-3 md:p-4 border-t border-[#FF4655]/20 bg-gradient-to-r from-[#1F2731]/80 to-[#2A3441]/80 backdrop-blur-sm">
              <div className="flex gap-2 md:gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Mesajınızı yazın..."
                    className="w-full p-3 md:p-4 border border-[#FF4655]/30 rounded-2xl bg-[#0F1923]/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4655]/50 focus:border-[#FF4655] text-sm md:text-base transition-all duration-300 backdrop-blur-sm"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF4655]/5 to-transparent opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={inputMessage.trim() === ""}
                  className="bg-gradient-to-r from-[#FF4655] to-[#FF6B7A] text-white p-3 md:p-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-[#FF4655]/20"
                >
                  <FiSend className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <span>💡 Projelerim hakkında soru sorabilirsiniz</span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Çevrimiçi
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
