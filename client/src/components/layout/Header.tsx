import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Globe, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { totalItems } = useCart();
  const langRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  const navLinks = [
    { name: t('common.home'), path: "/" },
    { name: t('common.products'), path: "/products" },
    { name: t('common.contact'), path: "/contact" },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'am', name: '\u12a0\u121b\u122d\u129b' },
    { code: 'om', name: 'Oromoo' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-orange-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-12 w-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-100 transition-transform">
            <img
              src="https://storage.googleapis.com/dala-prod-public-storage/attachments/d4100ad4-9ffe-48fa-a13d-5492823abfd0/1771921446551_1765997464780_1.jpg"
              alt="Simbo Poultry Farm Logo"
              className="w-10 h-10 object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl text-[#111827] leading-none tracking-tight">SIMBO</span>
            <span className="text-[10px] text-orange-600 font-black tracking-[0.2em] uppercase">Poultry Farm</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-[11px] font-black transition-all hover:text-orange-600 relative py-2 uppercase tracking-[0.2em]",
                location.pathname === link.path
                  ? "text-orange-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-600"
                  : "text-gray-500"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Custom Language Switcher */}
          <div className="relative hidden sm:block" ref={langRef}>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:bg-orange-50 rounded-xl px-4 h-10 border border-transparent hover:border-orange-100 transition-all"
              onClick={() => setIsLangOpen(!isLangOpen)}
            >
              <Globe className="h-4 w-4 text-orange-600" />
              <span className="uppercase text-[10px] font-black tracking-widest">{i18n.language}</span>
              <ChevronDown className={cn("h-3 w-3 transition-transform text-gray-400", isLangOpen && "rotate-180")} />
            </Button>

            {isLangOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-orange-50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 z-[100]">
                <div className="p-2 space-y-1">
                  {languages.map((lng) => (
                    <button
                      key={lng.code}
                      onClick={() => changeLanguage(lng.code)}
                      className={cn(
                        "w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl",
                        i18n.language === lng.code
                          ? "bg-orange-600 text-white shadow-lg shadow-orange-100"
                          : "text-gray-600 hover:bg-orange-50"
                      )}
                    >
                      {lng.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="hover:bg-orange-50 rounded-xl w-10 h-10 transition-all active:scale-90 border border-transparent hover:border-orange-100">
              <ShoppingCart className="h-5 w-5 text-[#111827]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg shadow-orange-200">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          <button className="lg:hidden p-2 text-[#111827] rounded-xl hover:bg-orange-50 transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-orange-100 shadow-2xl animate-in slide-in-from-top duration-300 fixed inset-x-0 top-20 z-40 overflow-y-auto max-h-[calc(100vh-5rem)]">
          <div className="p-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-black text-gray-900 flex items-center justify-between uppercase tracking-tighter hover:text-orange-600 transition-colors"
              >
                {link.name}
                <div className="w-3 h-3 rounded-full bg-orange-100" />
              </Link>
            ))}

            <div className="pt-8 mt-4 border-t border-gray-50 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Switch Language</span>
                <div className="grid grid-cols-3 gap-3">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { changeLanguage(l.code); setIsOpen(false); }}
                      className={cn(
                        "px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                        i18n.language === l.code
                          ? "bg-orange-600 text-white shadow-xl shadow-orange-100"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      )}
                    >
                      {l.code}
                    </button>
                  ))}
                </div>
              </div>


            </div>
          </div>
        </div>
      )}
    </header>
  );
}