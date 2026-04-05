// App.tsx
import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { ChatWidget } from "./components/layout/ChatWidget";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SplashScreen } from "./components/SplashScreen";

import { HomePage } from "./pages/client/HomePage";
import { ProductsPage } from "./pages/client/ProductsPage";
import { ContactPage } from "./pages/client/ContactPage";
import { CartPage } from "./pages/client/CartPage";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import api from "./lib/api";

import './i18n';

// ------------------------
// Dynamic Loader Component
// ------------------------
function DynamicLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center gap-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="w-24 h-24 rounded-3xl bg-orange-50 flex items-center justify-center shadow-2xl shadow-orange-100/50 relative"
      >
        <img
          src="https://storage.googleapis.com/dala-prod-public-storage/attachments/d4100ad4-9ffe-48fa-a13d-5492823abfd0/1771921446551_1765997464780_1.jpg"
          alt="Simbo Poultry Farm Logo"
          className="w-16 h-16 object-contain rounded-2xl animate-pulse"
        />
        <div className="absolute inset-0 border-4 border-orange-600 rounded-3xl border-t-transparent animate-spin" />
      </motion.div>
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Simbo Farm</h2>
        <p className="text-[10px] text-orange-600 font-extrabold tracking-[0.3em] uppercase mt-1 animate-pulse">Loading Experience...</p>
      </div>
    </div>
  );
}

// ------------------------
// AppContent Component
// ------------------------
function AppContent() {
  const location = useLocation();

  // Test API connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.healthCheck();
        console.log('API Connection successful:', response);
      } catch (error) {
        console.error('API Connection failed:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen font-sans flex flex-col">
        <Header />

        <main className="flex-1 flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/cart" element={<CartPage />} />
                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
        <ChatWidget />

        <Toaster position="top-right" expand richColors closeButton />
      </div>
    </ErrorBoundary>
  );
}

// ------------------------
// App Component (Top-level)
// ------------------------
export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AnimatePresence>
            {showSplash && (
              <SplashScreen onComplete={handleSplashComplete} />
            )}
          </AnimatePresence>
          <Suspense fallback={<DynamicLoader />}>
            <AppContent />
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}