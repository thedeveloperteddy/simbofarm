import { Bird, Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

export function Footer() {
  return (
    <footer className="bg-[#111827] text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -ml-48 -mb-48" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-900/20 rotate-3">
                <img
                  src="https://storage.googleapis.com/dala-prod-public-storage/attachments/d4100ad4-9ffe-48fa-a13d-5492823abfd0/1771921446551_1765997464780_1.jpg"
                  alt="Simbo Poultry Farm Logo"
                  className="h-10 w-auto object-contain rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl leading-none tracking-tight">SIMBO</span>
                <span className="text-[10px] text-orange-500 font-black tracking-[0.3em] uppercase">Farm Excellence</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              Providing premium quality poultry products since 2010. Our commitment to organic farming and high-tech sustainability ensures the healthiest produce for your family.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                <button key={idx} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-orange-600 transition-all duration-300 hover:-translate-y-1">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-8">Quick Navigation</h4>
            <ul className="space-y-4">
              {[
                { label: 'Home', path: '/' },
                { label: 'Products', path: '/products' },
                { label: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-white flex items-center gap-2 group transition-colors text-sm font-bold">
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-orange-500" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-8">Our Categories</h4>
            <ul className="space-y-4">
              {['Premium Broilers', 'Fresh Farm Eggs', 'Day-Old Chicks', 'Poultry Feed'].map((item) => (
                <li key={item}>
                  <Link to="/products" className="text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-orange-500 transition-colors" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-8">Contact Info</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-orange-600/10 text-orange-500">
                  <MapPin size={18} />
                </div>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">weserbi wereda <br />
                  Sululta<br />Oromiya, Ethiopia
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-orange-600/10 text-orange-500">
                  <Phone size={18} />
                </div>
                <p className="text-gray-400 text-sm font-bold">
                  +251 929 119 330</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-orange-600/10 text-orange-500">
                  <Mail size={18} />
                </div>
                <p className="text-gray-400 text-sm font-bold">
                  simbopolutryfarm@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} Simbo Poultry Farm. Crafted for excellence.
          </p>
          <div className="flex gap-8">
            <Link to="#" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Terms of Service</Link>
            <Link to="#" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}