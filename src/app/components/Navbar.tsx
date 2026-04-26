import { ShoppingBag, Search, Heart, User, Menu, X, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar({ cartCount, wishlistCount, onNavigate }: any) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'ARCHIVE', path: 'shop' },
    { name: 'COLLECTIONS', path: 'collections' },
    { name: 'RELEASES', path: 'releases' },
    { name: 'ABOUT', path: 'about' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
          isScrolled 
          ? 'py-2 md:py-3 bg-black/80 backdrop-blur-2xl border-b border-white/5' 
          : 'py-3 md:py-5 bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="group cursor-pointer flex flex-col"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <img src="/logo.png" alt="Cicada Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain group-hover:rotate-12 transition-transform duration-500" />
              <div className="flex flex-col">
                <span className="font-['Syne'] text-3xl md:text-4xl font-black tracking-[-0.05em] leading-none group-hover:scale-x-110 transition-transform origin-left duration-500 italic">
                  CICADA
                </span>
                <span className="text-[6px] md:text-[7px] font-black tracking-[0.4em] opacity-40 uppercase mt-0.5">Archival Streetwear</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => onNavigate(link.path)}
                className="text-[10px] font-black tracking-[0.3em] hover:text-white/50 transition-colors uppercase relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-white transition-all duration-500 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3 md:gap-5">
            <button className="hidden md:block hover:text-white/50 transition-colors">
              <Search size={18} strokeWidth={2} />
            </button>
            <button 
              onClick={() => onNavigate('wishlist')}
              className="relative hover:text-white/50 transition-colors group"
            >
              <Heart size={17} strokeWidth={2} className="md:w-[18px] md:h-[18px]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => onNavigate('cart')}
              className="relative hover:text-white/50 transition-colors group"
            >
              <ShoppingBag size={17} strokeWidth={2} className="md:w-[18px] md:h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => onNavigate('account')} className="hidden md:block hover:text-white/50 transition-colors">
              <User size={18} strokeWidth={2} />
            </button>
            <button 
              className="lg:hidden hover:text-white/50 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (Bottom Sheet) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />
            
            {/* Sheet */}
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[101] bg-[#0A0A0A] border-t border-white/10 rounded-t-[2rem] p-6 pb-12 flex flex-col max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-['Syne'] text-2xl font-black tracking-tighter italic">MENU</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="bg-white/5 p-2 rounded-full border border-white/10">
                  <X size={24} strokeWidth={2} />
                </button>
              </div>
              
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => {
                      onNavigate(link.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className="font-['Syne'] text-4xl font-black tracking-tighter text-left uppercase italic hover:translate-x-4 transition-transform"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
              
              <div className="mt-12 flex flex-col gap-4">
                <button 
                  onClick={() => { onNavigate('account'); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-4 text-lg font-bold p-4 bg-white/5 rounded-2xl border border-white/5"
                >
                  <User size={22} /> PROFILE
                </button>
                <button 
                  onClick={() => { onNavigate('admin'); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-4 text-lg font-bold text-white/60 p-4 border border-white/5 rounded-2xl hover:text-white transition-colors"
                >
                  <LayoutDashboard size={22} /> ADMIN PANEL
                </button>
                
                <div className="h-[1px] bg-white/10 my-4" />
                <div className="flex justify-between opacity-40 text-[10px] font-black tracking-widest uppercase px-2">
                  <span>INSTAGRAM</span>
                  <span>TWITTER</span>
                  <span>DISCORD</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
