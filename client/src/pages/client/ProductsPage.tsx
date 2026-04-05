import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../../hooks/useProducts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ShoppingCart, Search } from "lucide-react";
import { cn } from "../../lib/utils";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "react-i18next";

export function ProductsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories: { key: string; label: string }[] = [
    { key: "all", label: t("common.all") },
    { key: "eggs", label: t("common.eggs") },
    { key: "broilers", label: t("common.broilers") },
    { key: "chicks", label: t("common.chicks") },
    { key: "feed", label: t("common.feed") },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 text-center md:text-left">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase">
              {t("common.products")}
            </h1>
            <p className="text-gray-500 font-medium mt-1 uppercase tracking-[0.2em] text-[10px]">
              {t("common.qualityAssured")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("common.searchProducts")}
                className="pl-10 h-11 border-gray-200 focus:ring-orange-500 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar justify-center md:justify-start">
              {categories.map((cat) => (
                <Button
                  key={cat.key}
                  variant={category === cat.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat.key)}
                  className={cn(
                    "rounded-xl h-11 px-6 font-bold tracking-widest text-[10px] uppercase transition-all whitespace-nowrap",
                    category === cat.key ? "bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-100" : "border-gray-200"
                  )}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
              Loading Products...
            </div>
          ) : error ? (
            <div className="col-span-full py-20 text-center text-red-400 font-bold uppercase tracking-widest text-xs">
              Error loading products: {error}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden h-full flex flex-col border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2rem] bg-white group">
                    <div className="h-56 overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-black px-4 py-2 rounded-xl shadow-lg uppercase tracking-widest">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="p-6">
                      <CardTitle className="text-xl font-black text-gray-900 uppercase tracking-tight">{product.name}</CardTitle>
                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">
                        {t(`common.${product.category}`, { defaultValue: product.category })}
                      </span>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 flex-1">
                      <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2">{product.description}</p>
                      <div className="mt-6 flex items-center justify-between">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg",
                          product.stock > 10 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          {product.stock > 0
                            ? `${product.stock} ${t("common.inStock")}`
                            : t("common.outOfStock")}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button
                        className="w-full h-12 gap-2 bg-orange-600 hover:bg-orange-700 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-100 transition-all active:scale-95 group"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                        {product.stock === 0 ? t("common.outOfStock") : t("common.addToCart")}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gray-100 text-gray-400 mb-6">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
              {t("common.products")} – 0
            </h3>
            <p className="text-gray-500 font-medium mt-2">
              {t("common.searchProducts")}
            </p>
            <Button
              variant="outline"
              className="mt-8 rounded-2xl border-gray-200 font-black uppercase tracking-widest text-xs"
              onClick={() => { setSearch(""); setCategory("all"); }}
            >
              {t("common.all")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}