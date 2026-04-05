import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function Gallery() {
  const { t } = useTranslation();
  
  const images = [
    "https://storage.googleapis.com/dala-prod-public-storage/generated-images/bd6a7ca0-01db-4d64-8307-483208f69f39/gallery-1-987654321.webp",
    "https://storage.googleapis.com/dala-prod-public-storage/generated-images/bd6a7ca0-01db-4d64-8307-483208f69f39/gallery-2-987654322.webp",
    "https://storage.googleapis.com/dala-prod-public-storage/generated-images/bd6a7ca0-01db-4d64-8307-483208f69f39/gallery-3-987654323.webp",
    "https://storage.googleapis.com/dala-prod-public-storage/generated-images/bd6a7ca0-01db-4d64-8307-483208f69f39/gallery-4-987654324.webp",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {images.map((img, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl group"
        >
          <img 
            src={img} 
            alt="Farm View" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-orange-600/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <p className="text-white font-black text-xs uppercase tracking-widest">Simbo Farm Life</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}