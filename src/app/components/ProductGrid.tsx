import React from 'react';
import { motion } from 'motion/react';
import ProductCard from './ProductCard';
import { ArrowRight } from 'lucide-react';

interface ProductGridProps {
  products: any[];
  title?: string;
  onNavigate?: (page: string, params?: any) => void;
  onWishlistToggle?: (id: string) => void;
  onAddToCart?: (item: any) => void;
  wishlist?: string[];
  limit?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  title = "THE URBAN EDIT", 
  onNavigate, 
  onWishlistToggle, 
  onAddToCart,
  wishlist,
  limit = 8
}) => {
  const displayProducts = products?.slice(0, limit) || [];

  return (
    <section className="py-24 bg-neutral-950 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black tracking-[0.5em] uppercase text-white/30">
              NEW DROPS AVAILABLE
            </span>
            <h2 className="font-['Syne'] text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-white leading-none">
              {title}
            </h2>
          </div>
          
          <button 
            onClick={() => onNavigate?.('shop')}
            className="flex items-center gap-4 group text-[10px] font-black tracking-[0.4em] uppercase text-white/60 hover:text-white transition-colors"
          >
            <span>View Full Archive</span>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white transition-all">
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        <div className="@container w-full">
          <div className="grid grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 gap-x-8 gap-y-16">
            {displayProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
              >
                <ProductCard
                  product={product}
                  onNavigate={onNavigate}
                  onWishlistToggle={onWishlistToggle}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlist?.includes(product.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {products.length > limit && (
          <div className="mt-24 flex justify-center">
             <button 
              onClick={() => onNavigate?.('shop')}
              className="px-14 py-5 bg-transparent border border-white/20 text-white rounded-full font-black text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-500"
             >
                Load More Pieces
             </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
