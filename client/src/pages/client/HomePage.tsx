import { motion, Variants } from "framer-motion";
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, Zap, Star, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { Gallery } from "../../components/Gallery";
import { ScrollVideoBackground } from "../../components/ScrollVideoBackground";
import { useTranslation } from "react-i18next";


export function HomePage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: ShieldCheck,
      title: t('common.qualityAssured'),
      desc: t('common.qualityDesc'),
      color: "bg-orange-100 text-orange-600 shadow-orange-100"
    },
    {
      icon: Truck,
      title: t('common.fastDelivery'),
      desc: t('common.deliveryDesc'),
      color: "bg-blue-100 text-blue-600 shadow-blue-100"
    },
    {
      icon: Zap,
      title: t('common.competitivePrices'),
      desc: t('common.pricesDesc'),
      color: "bg-green-100 text-green-600 shadow-green-100"
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="pt-20 overflow-x-hidden relative min-h-[800vh]">
      {/* Scroll-Controlled Video Background */}
      <ScrollVideoBackground />

      {/* Hero Section - now part of the scrolling story */}
      <section className="relative min-h-[100vh] flex items-center bg-transparent pointer-events-none">
        <div className="container mx-auto px-4 relative z-10">

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl space-y-8"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-3 px-5 py-2.5 bg-white shadow-xl shadow-black/[0.03] text-orange-600 rounded-full border border-orange-100/50 backdrop-blur-sm"
            >
              <div className="relative">
                <Zap size={16} fill="currentColor" className="animate-pulse" />
                <div className="absolute inset-0 bg-orange-400 blur-lg opacity-20" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">{t('common.heroBadge')}</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl lg:text-[120px] font-black text-slate-900 leading-[0.85] uppercase tracking-tighter"
            >
              {t('common.heroTitle1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">{t('common.heroTitle2')}</span> <br />
              {t('common.heroTitle3')}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-500 font-medium max-w-lg leading-relaxed"
            >
              {t('common.heroDesc')}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-5 pt-4"
            >
              <Link to="/products">
                <Button className="h-16 px-10 rounded-2xl bg-orange-600 hover:bg-orange-700 text-lg font-black uppercase tracking-widest shadow-2xl shadow-orange-200 gap-3 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    {t('common.orderNow')} <ArrowRight className="group-hover:translate-x-2 transition-transform duration-500" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"
                    initial={false}
                    whileHover={{ scale: 1.5 }}
                  />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="h-16 px-10 rounded-2xl border-2 border-slate-100 text-lg font-black uppercase tracking-widest hover:bg-slate-50 gap-3 backdrop-blur-sm bg-white/50">
                  <ShoppingBag size={20} />
                  {t('common.learnMore')}
                </Button>
              </Link>
            </motion.div>

            {/* Hero Stats */}
            <motion.div
              variants={itemVariants}
              className="flex gap-10 pt-12 border-t border-slate-100"
            >
              <div>
                <p className="text-3xl font-black text-slate-900">15k+</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('common.happyClients')}</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">100%</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('common.organicCert')}</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">24/7</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('common.fastDelivery')}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10" />
      </section>


      {/* Floating Trust Badges */}
      <section className="relative z-20 -mt-10 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[4rem] p-8 md:p-12 flex flex-wrap justify-center md:justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-orange-500" />
              <span className="font-black uppercase text-sm tracking-widest text-slate-700">{t('common.ecoFriendly')}</span>
            </div>
            <div className="h-px w-12 bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-3">
              <Star className="text-orange-500" fill="currentColor" />
              <span className="font-black uppercase text-sm tracking-widest text-slate-700">{t('common.topRated')}</span>
            </div>
            <div className="h-px w-12 bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-3 text-slate-700 font-black uppercase text-sm tracking-widest">
              <ShieldCheck className="text-orange-500" />
              {t('common.sgsCert')}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 w-96 h-96 bg-orange-100 rounded-full blur-[150px] opacity-30" />
        <div className="absolute bottom-0 left-0 -ml-20 w-96 h-96 bg-blue-100 rounded-full blur-[150px] opacity-30" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-sm font-black text-orange-600 uppercase tracking-[0.3em]">Why Choose Us</h2>
            <p className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">Commitment to Excellence</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white p-12 rounded-[4rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-50 group"
              >
                <div className={`${feature.color} w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  <feature.icon size={36} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest cursor-pointer">
                  Read More <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Gallery Section */}
      <section className="pb-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h2 className="text-sm font-black text-orange-600 uppercase tracking-[0.3em]">Our Facility</h2>
              <p className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">Modern Poultry <br /> Environments</p>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="font-black uppercase tracking-widest text-xs hover:bg-orange-50 hover:text-orange-600 transition-all p-0 group">
                View All Products <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <Gallery />
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative rounded-[4rem] bg-slate-900 overflow-hidden p-12 md:p-24">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
              <img
                src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/bd6a7ca0-01db-4d64-8307-483208f69f39/farm-background-397aadc1-1771924136525.webp"
                className="w-full h-full object-cover grayscale"
                alt="Farm Background"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900 to-transparent" />

            <div className="relative z-10 max-w-2xl space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                Ready to taste <br />
                <span className="text-orange-500">Pure Quality?</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium">
                Join thousands of families who trust Simbo Farm for their daily nutrition. Fresh, organic, and delivered to your doorstep.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button className="h-16 px-10 rounded-2xl bg-orange-600 hover:bg-orange-700 text-lg font-black uppercase tracking-widest">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="h-16 px-10 rounded-2xl border-2 border-white/10 text-white text-lg font-black uppercase tracking-widest hover:bg-white/5">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}