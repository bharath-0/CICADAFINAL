import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Plus } from 'lucide-react';

interface DesktopHeroProps {
  onNavigate?: (page: string, params?: any) => void;
}

const DesktopHero: React.FC<DesktopHeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative h-[85vh] md:h-[95vh] flex items-center overflow-hidden bg-black">
      {/* Background with motion effect */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/hero_street_car.png" 
          alt="Hero Streetwear" 
          className="w-full h-full object-cover grayscale-[20%] contrast-[1.1] brightness-75 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
      </motion.div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full pt-12">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          className="max-w-5xl"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-16 md:w-24 h-[1px] bg-white/60 mb-6 origin-left"
          />
          
          <div className="flex flex-col gap-2 mb-8">
            <span className="text-[10px] md:text-[12px] font-black tracking-[0.5em] uppercase text-white/50">
              NEW SEASON / SS2026
            </span>
            <h1 className="font-['Syne'] text-[clamp(1.25rem,5vw,3.5rem)] font-black leading-[0.85] tracking-tighter uppercase italic">
              DEFY THE<br />
              <span className="text-white">ORDINARY</span>
            </h1>
          </div>
          
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-14 mt-4">
            <p className="text-gray-300 text-[7px] md:text-[9px] max-w-md leading-relaxed font-medium">
              Breaking boundaries with radical designs. Engineered for those who command the streets and rewrite the rules of fashion.
            </p>
            
            <div className="flex items-center gap-6">
              <button
                onClick={() => onNavigate?.('shop')}
                className="group relative h-14 md:h-16 px-10 md:px-12 bg-white text-black rounded-full font-black text-xs tracking-[0.2em] flex items-center gap-3 overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all"
              >
                <span className="relative z-10">EXPLORE DROP</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                <motion.div
                  className="absolute inset-0 bg-neutral-200"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </button>
              
              <button className="h-14 w-14 md:h-16 md:w-16 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition-all group">
                 <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Side Numbers */}
      <div className="absolute hidden lg:flex flex-col gap-20 right-12 top-1/2 -translate-y-1/2 z-20">
        <div className="flex items-center gap-4 group cursor-pointer rotate-90 origin-right translate-x-12">
          <span className="h-[1px] w-12 bg-white/20 group-hover:w-20 group-hover:bg-white transition-all duration-500"></span>
          <span className="text-xs font-black tracking-widest text-white/40 group-hover:text-white uppercase transform -rotate-180">Spring Edition</span>
        </div>
        <div className="flex items-center gap-4 group cursor-pointer rotate-90 origin-right translate-x-12 opacity-50">
          <span className="h-[1px] w-12 bg-white/20"></span>
          <span className="text-xs font-black tracking-widest text-white/40 uppercase transform -rotate-180">Winter Vault</span>
        </div>
      </div>

      <div className="absolute bottom-10 left-6 md:left-12 z-20 flex items-center gap-4">
        <div className="flex -space-x-4">
          {[1,2,3].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-neutral-800 overflow-hidden">
              <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="user" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <p className="text-[10px] md:text-xs font-bold text-white/60 tracking-tight">
          <span className="text-white">5k+</span> Trendsetters already joined the drop
        </p>
      </div>
    </section>
  );
};

export default DesktopHero;
