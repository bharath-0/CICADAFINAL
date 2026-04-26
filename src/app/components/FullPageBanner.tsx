import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FullPageBannerProps {
  title?: string;
  subtitle?: string;
  image?: string;
  cta?: string;
}

const FullPageBanner: React.FC<FullPageBannerProps> = ({
  title = "URBAN ARCHIVE SS26",
  subtitle = "Minimalist silhouettes meet bold street aesthetics. Discover our latest collection featuring premium fabrics.",
  image = "https://images.unsplash.com/photo-1558769132-cb1aea661d6?w=1600&q=80",
  cta = "Explore Collection"
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative h-[80vh] overflow-hidden bg-black flex items-center">
      <motion.div style={{ y }} className="absolute inset-0 z-0 scale-110">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover brightness-50 contrast-125 grayscale-[30%]" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
      </motion.div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
        <motion.div 
          style={{ opacity }}
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          className="max-w-2xl"
        >
          <span className="inline-block text-[10px] font-black tracking-[0.6em] uppercase text-white/40 mb-6">
            LIMITED EDITION / VAULT
          </span>
          <h2 className="font-['Syne'] text-[clamp(2rem,6vw,4.5rem)] font-black leading-[0.9] tracking-tighter uppercase mb-8 italic">
            {title.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? "text-transparent text-stroke-white" : ""}>
                {word}{' '}
              </span>
            ))}
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-lg">
            {subtitle}
          </p>
          
          <button className="flex items-center gap-6 group">
            <span className="text-sm font-black tracking-[0.3em] uppercase border-b-2 border-white pb-2 group-hover:pr-6 transition-all duration-300">
              {cta}
            </span>
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              <ArrowUpRight size={20} />
            </div>
          </button>
        </motion.div>
      </div>

      {/* Decorative vertical text */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block">
        <div className="[writing-mode:vertical-lr] text-[8px] font-black tracking-[1em] uppercase text-white/20">
          CICADA DESIGN SYSTEM © 2026
        </div>
      </div>

      <style>{`
        .text-stroke-white {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </section>
  );
};

export default FullPageBanner;
