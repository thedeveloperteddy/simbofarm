import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, Minus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";
import { useTranslation } from "react-i18next";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const [message, setMessage] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'admin', text: 'Hello! How can we help you today?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen, isMinimized, isRegistered, isReviewing]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.phone.trim()) {
      setIsRegistered(true);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'client',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory([...chatHistory, newMsg]);
    setMessage("");
    setIsReviewing(true);

    // Simulate admin reply after 3 seconds, removing the "reviewing" message
    setTimeout(() => {
      setIsReviewing(false);
      setChatHistory(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'admin',
        text: `Hi ${formData.name.split(' ')[0]}, our team has received your inquiry and will be with you shortly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-orange-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-orange-700 transition-all hover:scale-110 active:scale-90"
          >
            <MessageCircle size={32} />
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={cn(
              "bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden flex flex-col transition-all duration-300",
              isMinimized ? "w-72 h-16" : "w-[90vw] sm:w-96 h-[500px]"
            )}
          >
            {/* Header */}
            <div className="bg-orange-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Simbo Support</h3>
                  <p className="text-[10px] text-orange-100 font-medium uppercase tracking-widest">
                    {isRegistered ? 'Live Chat' : 'Get in touch'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10 rounded-lg" onClick={() => setIsMinimized(!isMinimized)}>
                  <Minus size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10 rounded-lg" onClick={() => setIsOpen(false)}>
                  <X size={18} />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {!isRegistered ? (
                  // Registration Form
                  <form onSubmit={handleRegister} className="flex-1 p-6 overflow-y-auto space-y-4 bg-orange-50/20">
                    <div className="mb-6 text-center">
                      <h4 className="font-bold text-gray-900 text-lg">Welcome to Simbo Farm!</h4>
                      <p className="text-xs text-gray-500 mt-2">Please introduce yourself so our support team can assist you properly.</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 mb-1 ml-1 block uppercase tracking-wider">Full Name *</label>
                        <Input
                          required
                          placeholder="Abebe Girma"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="rounded-xl border-gray-200 h-12 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 mb-1 ml-1 block uppercase tracking-wider">Phone Number *</label>
                        <Input
                          required
                          type="tel"
                          placeholder="+251 911 000000"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="rounded-xl border-gray-200 h-12 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 mb-1 ml-1 block uppercase tracking-wider">Email <span className="text-gray-400 font-medium">(Optional)</span></label>
                        <Input
                          type="email"
                          placeholder="abebe@example.com"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="rounded-xl border-gray-200 h-12 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold tracking-wide"
                    >
                      START CHAT
                    </Button>
                  </form>
                ) : (
                  // Chat Room
                  <>
                    <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-orange-50/30 space-y-4 custom-scrollbar">
                      {chatHistory.map((msg) => (
                        <div key={msg.id} className={cn("flex flex-col", msg.sender === 'admin' ? "items-start" : "items-end")}>
                          <div className={cn(
                            "max-w-[85%] p-3.5 rounded-2xl text-sm font-medium shadow-sm",
                            msg.sender === 'admin'
                              ? "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                              : "bg-orange-600 text-white rounded-tr-none"
                          )}>
                            {msg.text}
                          </div>
                          <span className="text-[9px] font-black text-gray-400 mt-1 uppercase tracking-widest px-1">
                            {msg.timestamp}
                          </span>
                        </div>
                      ))}

                      {isReviewing && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col items-start"
                        >
                          <div className="max-w-[85%] p-3.5 rounded-2xl text-sm font-medium shadow-sm bg-orange-100/50 text-orange-800 rounded-tl-none border border-orange-200 flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin text-orange-600" />
                            We are reviewing request please wait until we answer your request
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-orange-50 flex gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="rounded-xl border-orange-100 focus:ring-orange-600 focus:border-orange-600 h-12 font-medium"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!message.trim()}
                        className="h-12 w-12 bg-orange-600 hover:bg-orange-700 rounded-xl shrink-0 shadow-lg shadow-orange-100 transition-all active:scale-90 disabled:opacity-50"
                      >
                        <Send size={18} />
                      </Button>
                    </form>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}