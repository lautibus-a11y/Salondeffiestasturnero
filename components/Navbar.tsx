
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  isAdmin: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/#servicios' },
    { name: 'Reservar', path: '/#reserva' },
    { name: 'Nosotros', path: '/#nosotros' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className={`bg-white/90 backdrop-blur-md rounded-2xl px-6 h-16 flex justify-between items-center shadow-sm border border-pink-100 transition-all duration-300 ${scrolled ? 'shadow-lg shadow-pink-100/20' : ''}`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg shadow-sm group-hover:rotate-12 transition-transform">
              🌈
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Mundo Mágico
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-500 hover:text-pink-500 font-semibold text-sm transition-colors relative"
              >
                {link.name}
              </Link>
            ))}

            <div className="h-4 w-px bg-pink-100 mx-2" />

            {isAdmin ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-purple-100 transition-all flex items-center gap-2"
                >
                  <LayoutDashboard size={14} /> PANEL
                </Link>
                <button
                  onClick={onLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/admin"
                className="text-gray-400 hover:text-pink-400 font-bold text-[10px] uppercase tracking-widest transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-pink-500"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-x-4 top-24 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-pink-50 z-[100] safe-area-padding"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={toggleMenu}
                  className="text-3xl font-black text-gray-900 hover:text-pink-500 transition-colors flex items-center justify-between group"
                >
                  {link.name}
                  <ChevronRight size={24} className="text-pink-100 group-hover:text-pink-500 transition-colors" />
                </Link>
              ))}
              <div className="h-px bg-gradient-to-r from-transparent via-pink-100 to-transparent" />
              <Link
                to="/admin"
                onClick={toggleMenu}
                className="flex items-center justify-center gap-4 bg-gray-900 text-white p-6 rounded-[1.5rem] text-lg font-bold shadow-lg shadow-gray-200"
              >
                <LayoutDashboard size={20} /> Panel Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Added missing default export
export default Navbar;
