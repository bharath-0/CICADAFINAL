import { ArrowUpRight, Send } from 'lucide-react';
import { useState } from 'react';

export default function Footer({ onNavigate }: any) {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-black text-white border-t border-white/5">
      {/* CTA Banner */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-10 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-end">
          <div>
            <h2 className="font-['Syne'] text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-[0.85]">
              JOIN THE<br /><span className="text-white/20">ARCHIVE</span>
            </h2>
          </div>
          <div>
            <p className="text-white/40 font-bold text-xs md:text-sm mb-4 md:mb-6 leading-relaxed">
              Get exclusive early access to drops, archival edits, and loyalty perks. No spam—just heat.
            </p>
            <div className="flex gap-2 md:gap-3">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL"
                className="flex-1 h-10 md:h-11 bg-white/5 border border-white/10 px-3 md:px-5 text-[9px] md:text-[10px] font-black tracking-widest placeholder:text-white/20 focus:outline-none focus:border-white/30 rounded-lg md:rounded-xl"
              />
              <button className="h-10 w-10 md:h-11 md:w-11 bg-white text-black flex items-center justify-center rounded-lg md:rounded-xl hover:bg-white/80 transition-colors flex-shrink-0">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-8 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-10 md:mb-16">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="font-['Syne'] text-lg md:text-xl font-black tracking-tighter italic mb-2 md:mb-3">CICADA</div>
              <p className="text-white/30 text-xs md:text-sm font-medium leading-relaxed">
                Archival streetwear for the <br className="hidden md:block" />
                next generation of culture. <br className="hidden md:block" />
                EST. 2026
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-[8px] md:text-[9px] font-black tracking-[0.3em] uppercase mb-3 md:mb-4 text-white/40">NAVIGATION</h3>
              <ul className="space-y-2 md:space-y-3">
                {['Shop', 'Collections', 'Releases', 'About'].map(link => (
                  <li key={link}>
                    <button 
                      onClick={() => onNavigate?.(link.toLowerCase())} 
                      className="text-xs md:text-sm font-bold text-white/50 hover:text-white transition-colors group flex items-center gap-1 md:gap-2"
                    >
                      {link}
                      <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[8px] md:text-[9px] font-black tracking-[0.3em] uppercase mb-3 md:mb-4 text-white/40">SUPPORT</h3>
              <ul className="space-y-2 md:space-y-3">
                {['Shipping', 'Returns', 'Size Guide', 'Contact'].map(link => (
                  <li key={link}>
                    <button className="text-xs md:text-sm font-bold text-white/50 hover:text-white transition-colors">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[8px] md:text-[9px] font-black tracking-[0.3em] uppercase mb-3 md:mb-4 text-white/40">SOCIAL</h3>
              <ul className="space-y-2 md:space-y-3">
                {['Instagram', 'Twitter / X', 'Discord', 'TikTok'].map(link => (
                  <li key={link}>
                    <button className="text-xs md:text-sm font-bold text-white/50 hover:text-white transition-colors group flex items-center gap-1 md:gap-2">
                      {link}
                      <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 md:pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <span className="text-[8px] md:text-[9px] font-bold text-white/20 tracking-widest uppercase">
              © 2026 CICADA ARCHIVAL. ALL RIGHTS RESERVED.
            </span>
            <div className="flex gap-4 md:gap-6">
              <button className="text-[8px] md:text-[9px] font-bold text-white/20 tracking-widest uppercase hover:text-white/60 transition-colors">PRIVACY</button>
              <button className="text-[8px] md:text-[9px] font-bold text-white/20 tracking-widest uppercase hover:text-white/60 transition-colors">TERMS</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
