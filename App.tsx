
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar, Settings, LogOut, ChevronRight, CheckCircle, Clock, Trash2, Home, Info, Heart, Star, LayoutDashboard, Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import BookingSection from './components/BookingSection';
import About from './components/About';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import { supabase } from './lib/supabase/supabaseClient';

const LandingPage = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen"
  >
    <Hero />
    <Services />
    <BookingSection />
    <About />
  </motion.div>
);

const AppContent = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash, pathname]);

  return (
    <div className="relative">
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/admin"
            element={<AdminWrapper />}
          />
        </Routes>
      </main>
    </div>
  );
};

const AdminWrapper = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(!!session);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAdmin === null) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa]">
      <Loader2 className="animate-spin text-pink-500 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verificando sesión...</p>
    </div>
  );
  return isAdmin ? <AdminPanel /> : <Login />;
};

const NavbarWrapper = ({ onLogout }: { onLogout: () => void }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setIsAdmin(!!session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return <Navbar isAdmin={isAdmin} onLogout={onLogout} />;
};

const App: React.FC = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <HashRouter>
      <NavbarWrapper onLogout={handleLogout} />
      <AppContent />
      <Footer />

    </HashRouter>
  );
};

export default App;
