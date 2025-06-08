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

      const randomResponse = adminResponses[Math.floor(Math.random() * adminResponses.length)];
      
      const adminMessage: Message = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'admin',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, adminMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
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
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#FF4655] to-[#FF4655]/80 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
        aria-label="Open chat"
      >
        {isOpen ? (
          <FiX className="w-6 h-6" />
        ) : (
          <FiMessageCircle className="w-6 h-6" />
        )}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
          />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 h-[500px] bg-white dark:bg-[#1F2731] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#FF4655]/20 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#FF4655] to-[#FF4655]/80 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FiUser className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Eren Kılıç</h3>
                  <div className="flex items-center gap-1 text-xs text-white/80">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Çevrimiçi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-[#FF4655] text-white rounded-br-none'
                        : 'bg-gray-100 dark:bg-[#0F1923] text-gray-800 dark:text-white rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className={`flex items-center gap-1 mt-1 text-xs ${
                      message.sender === 'user' 
                        ? 'text-white/70' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      <FiClock className="w-3 h-3" />
                      <span>{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-[#0F1923] p-3 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-[#FF4655]/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 p-3 border border-gray-300 dark:border-[#FF4655]/20 rounded-full bg-gray-50 dark:bg-[#0F1923] text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF4655] text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={inputMessage.trim() === ""}
                  className="bg-[#FF4655] text-white p-3 rounded-full hover:bg-[#FF4655]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
