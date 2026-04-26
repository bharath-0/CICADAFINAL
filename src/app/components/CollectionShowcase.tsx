import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface CollectionShowcaseProps {
  onNavigate?: (page: string, params?: any) => void;
}

const collections = [
  {
    id: "techwear",
    name: "CYBERPUNK",
    subtitle: "FUNCTIONAL GEAR",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80",
    size: "large"
  },
  {
    id: "minimal",
    name: "ZENITH",
    subtitle: "ESSENTIAL CUTS",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    size: "small"
  },
  {
    id: "bold",
    name: "OVERDRIVE",
    subtitle: "BOLDER GRAPHICS",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80",
    size: "small"
  }
];

const CollectionShowcase: React.FC<CollectionShowcaseProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 bg-black overflow-hidden px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-[10px] font-black tracking-[0.6em] uppercase text-white/30 mb-4 block">
              CURATED ARCHIVES
            </span>
            <h2 className="font-['Syne'] text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.8]">
              STYLE<br />
              <span className="text-transparent text-stroke-white">COLLECTIONS</span>
            </h2>
          </div>
          <p className="text-gray-500 font-bold max-w-sm text-sm tracking-tight leading-relaxed">
            Every collection tells a different story. Choose your aesthetic and redefine your presence. Built for the modern nomad.
          </p>
        </div>

        <div className="@container w-full h-auto @md:h-[700px]">
          <div className="grid grid-cols-1 @md:grid-cols-12 gap-6 h-full">
            {collections.map((col, idx) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.05 }}
                onClick={() => onNavigate?.('category', col.id)}
                className={`relative group cursor-pointer overflow-hidden rounded-3xl ${
                  col.size === 'large' ? '@md:col-span-7' : '@md:col-span-5'
                }`}
              >
              <img 
                src={col.image} 
                alt={col.name} 
                className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              
              <div className="absolute inset-x-8 bottom-8 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/50 mb-2 block">
                    {col.subtitle}
                  </span>
                  <h3 className="font-['Syne'] text-3xl md:text-4xl font-black uppercase text-white">
                    {col.name}
                  </h3>
                </div>
                
                <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-500">
                  <ArrowUpRight size={24} />
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </div>

      <style>{`
        .text-stroke-white {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </section>
  );
};

export default CollectionShowcase;
