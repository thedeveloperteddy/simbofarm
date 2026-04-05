import { Trash2, Plus, Minus, CreditCard, ArrowLeft, Truck, ShieldCheck, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import { cn } from "../../lib/utils";
import { publicApi } from "../../utils/api";

import { useState } from "react";

export function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const shipping = cart.length > 0 ? 10.00 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!address || !phone) {
      toast.error("Please fill in your address and phone number");
      return;
    }

    try {
      const orderData = {
        id: Math.random().toString(36).substr(2, 9),
        customer_name: "Guest User",
        customer_email: "guest@example.com",
        customer_phone: phone,
        items: cart,
        total_amount: total,
        status: 'pending'
      };

      const response = await publicApi.post('/orders', orderData);

      if (response.success) {
        toast.success("Order placed successfully! Redirecting...");
        setTimeout(() => {
          clearCart();
          navigate("/");
        }, 2000);
      } else {
        toast.error("Failed to place order.");
      }
    } catch (err) {
      toast.error("Server error. Try again later.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-32 container mx-auto px-4 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
          <Trash2 className="text-gray-300" size={40} />
        </div>
        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">{t('common.emptyCart')}</h2>
        <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore our farm fresh products and start shopping.</p>
        <Link to="/products">
          <Button className="gap-3 h-14 px-10 rounded-2xl bg-orange-600 hover:bg-orange-700 font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-100 transition-all hover:scale-105 active:scale-95">
            <ArrowLeft size={18} /> {t('common.continueShopping')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#FDFDFD] min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">{t('common.shoppingCart')}</h1>
            <p className="text-orange-600 font-black uppercase tracking-[0.3em] text-[10px] mt-2">Ready for checkout</p>
          </div>
          <Link to="/products" className="text-gray-500 hover:text-orange-600 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-colors">
            <ArrowLeft size={14} /> {t('common.continueShopping')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <Card key={item.id} className="overflow-hidden border-none shadow-xl bg-white rounded-3xl group transition-all hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="relative overflow-hidden rounded-2xl w-32 h-32 flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt={item.name} />
                      <div className="absolute inset-0 bg-black/5" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-black text-xl text-gray-900 uppercase tracking-tight">{item.name}</h3>
                      <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">{item.category}</p>
                      <p className="text-sm text-gray-400 font-medium mt-2 line-clamp-1">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center border border-gray-100 rounded-xl bg-gray-50/50 p-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-gray-500">
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-black text-sm text-gray-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-gray-500">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                        <p className="font-black text-xl text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="p-6 bg-white rounded-3xl border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-tight">Secure Payment</p>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">100% Encrypted transactions</p>
                </div>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-tight">Express Delivery</p>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Same day in Addis Ababa</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-2xl bg-gray-900 text-white rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-8">{t('common.orderSummary')}</h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-gray-400 text-sm font-bold">
                    <span className="uppercase tracking-widest">{t('common.subtotal')}</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400 text-sm font-bold">
                    <span className="uppercase tracking-widest">{t('common.shipping')}</span>
                    <span className="text-white">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-white/10 my-6" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black uppercase tracking-tighter">{t('common.total')}</span>
                    <span className="text-3xl font-black text-orange-500">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">{t('common.address')}</label>
                    <Input
                      className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-orange-500 text-white placeholder:text-gray-600 font-bold"
                      placeholder="e.g. Bole Road, Addis Ababa"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">{t('common.phone')}</label>
                    <Input
                      className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-orange-500 text-white placeholder:text-gray-600 font-bold"
                      placeholder="+251 ..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full h-16 gap-3 text-sm font-black uppercase tracking-widest mt-4 bg-orange-600 hover:bg-orange-700 rounded-2xl shadow-xl shadow-orange-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    onClick={handleCheckout}
                  >
                    <CreditCard size={20} /> {t('common.checkout')}
                  </Button>
                  <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-[0.1em] mt-4">
                    <Truck size={14} className="text-orange-500" /> {t('common.sameDayDelivery')}
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-[10px] text-gray-400 font-black uppercase tracking-widest">
              By proceeding, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}