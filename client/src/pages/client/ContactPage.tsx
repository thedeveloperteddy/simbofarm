import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import { publicApi } from "../../utils/api";

export function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const messageData = {
        id: Math.random().toString(36).substr(2, 9),
        customerId: formData.email,
        subject: formData.message, // Map message to subject for backend storage
        history: [],
        updatedAt: new Date().toISOString()
      };

      const response = await publicApi.post('/messages', messageData);

      if (response.success) {
        toast.success("Message sent! We'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (err) {
      toast.error("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: "Jiregna", value: "+251 929 119 330", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Phone, label: "Teddy", value: "+251 922 972 961", color: "text-green-600", bg: "bg-green-50" },
    { icon: Phone, label: "Rahel", value: "+251 939 450 709", color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="pt-24 pb-20 bg-[#FDFDFD]">
      {/* Hero Header */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-600/10 blur-[120px] rounded-full -mr-32 -mt-32" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">{t('common.getInTouch')}</h1>
            <p className="text-gray-400 font-medium max-w-2xl mx-auto uppercase tracking-widest text-xs">{t('common.contactDesc')}</p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-500"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6", info.bg, info.color)}>
                  <info.icon size={28} />
                </div>
                <h3 className="font-black text-xl text-gray-900 uppercase tracking-tight">{info.label}</h3>
                <p className="text-gray-500 font-bold mt-2">{info.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-50">
            <div className="lg:col-span-3 p-8 md:p-12">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">{t('common.sendMessage')}</h2>
                <div className="w-12 h-1.5 bg-orange-600 rounded-full" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">{t('common.fullName')}</label>
                    <Input
                      placeholder="John Doe"
                      className="h-14 border-gray-100 bg-gray-50/50 rounded-2xl focus:ring-orange-500 font-bold"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">{t('common.emailAddress')}</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="h-14 border-gray-100 bg-gray-50/50 rounded-2xl focus:ring-orange-500 font-bold"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">{t('common.message')}</label>
                  <textarea
                    className="w-full min-h-[180px] rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-4 text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    placeholder="How can we help your farm today?"
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button
                  disabled={isSubmitting}
                  className="w-full h-16 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-orange-100 transition-all hover:scale-[1.02] active:scale-[0.98] gap-3"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={20} /> {t('common.sendMessage')}
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-gray-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 opacity-10 rounded-full blur-[80px] -mr-32 -mt-32" />

              <div className="relative z-10 space-y-12">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">{t('common.quickConnect')}</h2>
                  <p className="text-gray-400 font-medium">Prefer a faster response? Reach us directly on WhatsApp or visit our social media channels.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-all">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Working Hours</p>
                      <p className="text-sm font-bold">Mon - Sat: 5:00 AM - 9:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-all">
                      <Globe size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Live Support</p>
                      <p className="text-sm font-bold">24/7 Response via Chat Widget</p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full h-16 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs gap-3 transition-all">
                  <MessageCircle size={22} className="text-green-500" /> {t('common.whatsappChat')}
                </Button>
              </div>

              <div className="mt-12 pt-12 border-t border-white/10 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-600">
                    <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="Manager" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Jiregna Dereje</p>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Farm Manager</p>
                  </div>
                </div>
                <div className="h-40 rounded-3xl border border-white/5 relative overflow-hidden shadow-inner">
                  <iframe
                    title="Our location map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=38.7436%2C8.9850%2C38.7836%2C9.0254&layer=mapnik&marker=9.0054%2C38.7636"
                    className="absolute inset-0 w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                  <MapPin size={32} className="text-orange-600 absolute bottom-4 right-4 animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}