import { ArrowRight, Star, ChevronLeft, ChevronRight, ShoppingBag, Plus, ArrowUpRight } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import DesktopHero from '../DesktopHero';
import FullPageBanner from '../FullPageBanner';
import CollectionShowcase from '../CollectionShowcase';
import ProductGrid from '../ProductGrid';

export default function HomepageV2({ products, onNavigate, wishlist, onWishlistToggle, onAddToCart }: any) {
  const containerRef = useRef(null);
  
  const brandLogos = ['VERSACE', 'ZARA', 'GUCCI', 'PRADA', 'CALVIN KLEIN', 'BALENCIAGA', 'OFF-WHITE'];

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* HERO SECTION */}
      <DesktopHero onNavigate={onNavigate} />

      {/* MARQUEE */}
      <section className="py-8 md:py-14 border-y border-white/5 bg-white text-black overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...brandLogos, ...brandLogos, ...brandLogos].map((brand, i) => (
            <div key={i} className="flex items-center mx-6 md:mx-12">
              <span className="text-2xl md:text-4xl lg:text-5xl font-black font-['Syne'] tracking-tighter uppercase italic">{brand}</span>
              <div className="w-2 h-2 md:w-4 md:h-4 rounded-full bg-black mx-6 md:mx-12" />
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID - NEW ARRIVALS */}
      <ProductGrid 
        products={products} 
        onNavigate={onNavigate} 
        onWishlistToggle={onWishlistToggle}
        onAddToCart={onAddToCart}
        wishlist={wishlist}
        limit={8}
      />

      {/* MID-PAGE BANNER */}
      <FullPageBanner 
        title="BEYOND REALITY"
        subtitle="The Summer 2026 Archive is now live. Explore the intersection of high-performance technical wear and radical urban aesthetics."
        cta="SHOP THE VAULT"
      />

      {/* COLLECTIONS */}
      <CollectionShowcase onNavigate={onNavigate} />

      {/* TESTIMONIALS / PHILOSOPHY */}
      <section className="py-24 md:py-32 bg-black border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="mb-20 flex items-center gap-6">
             <div className="w-24 h-px bg-white" />
             <h2 className="font-['Syne'] text-sm md:text-lg font-black tracking-[0.5em] uppercase whitespace-nowrap">GLOBAL INFLUENCE</h2>
             <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24">
            {[
              { author: "KAI ZEN", role: "CREATIVE DIRECTOR", text: "THE ATTENTION TO DETAIL IN THE SEAMS AND FABRIC WEIGHT IS UNLIKE ANYTHING I'VE EXPERIENCED. CICADA IS THE FUTURE." },
              { author: "MIA WANG", role: "SNEAKERHEAD", text: "FINALLY FOUND PIECES THAT ACTUALLY COMPLEMENT MY RARE DROPS WITHOUT OVERPOWERING THEM. VIBE IS 10/10." },
              { author: "LUCAS M", role: "MODEL", text: "STREETWEAR HAS BECOME GENERIC. CICADA IS THE ANTIDOTE. THE RAW EDGE FINISHES ARE ABSOLUTELY ICONIC." }
            ].map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="flex flex-col relative"
              >
                <div className="absolute -top-10 -left-6 text-7xl font-black text-white/5 font-['Syne']">"</div>
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(star => <Star key={star} size={14} fill="white" stroke="white" />)}
                </div>
                <p className="text-xl md:text-2xl font-['Syne'] font-black tracking-tight leading-tight italic mb-10 text-white/90">
                  {t.text}
                </p>
                <div className="mt-auto border-l-2 border-white pl-6">
                  <div className="font-black text-xs tracking-[0.2em] mb-1 uppercase text-white">{t.author}</div>
                  <div className="text-[10px] font-bold text-white/40 tracking-[0.2em]">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 bg-white text-black text-center relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        >
          <div className="font-['Syne'] text-[20rem] font-black leading-none opacity-10">CICADA</div>
        </motion.div>
        
        <div className="relative z-10 px-6">
          <h2 className="font-['Syne'] text-5xl md:text-8xl font-black tracking-tighter uppercase italic mb-10 leading-none">
            JOIN THE<br />REVOLUTION
          </h2>
          <p className="max-w-xl mx-auto text-black/60 font-bold mb-12 text-lg">
            Be the first to know about upcoming drops, secret archives, and exclusive urban events.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input 
              type="email" 
              placeholder="ENTER EMAIL ADDRESS" 
              className="w-full sm:w-[400px] h-16 bg-gray-100 border-none px-8 font-black text-xs tracking-widest focus:ring-0"
            />
            <button className="w-full sm:w-auto h-16 px-12 bg-black text-white font-black text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .text-stroke {
          -webkit-text-stroke: 1px white;
        }
      `}</style>
    </div>
  );
}
