import { Heart, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProductCard({ product, onNavigate, onWishlistToggle, onAddToCart, isWishlisted }: any) {
  if (!product) return null;

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      className="group relative flex flex-col"
    >
      {/* Image Container */}
      <div 
        onClick={() => onNavigate('product', product.id)}
        className="relative aspect-[3/4] overflow-hidden bg-[#111] rounded-[1.25rem] cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        
        {/* Overlay Badges */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-white text-black text-[8px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase">
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
           <button 
            className="w-full h-11 bg-white text-black rounded-xl font-black text-[9px] tracking-widest uppercase flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hover:bg-white/90"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('product', product.id);
            }}
           >
             EXPLORE ARCHIVE
             <ArrowUpRight size={14} />
           </button>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle?.(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted ? 'bg-white text-black' : 'bg-black/30 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 hover:bg-white hover:text-black'
          }`}
        >
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={2.5} />
        </button>
      </div>

      {/* Info */}
      <div className="mt-3 flex justify-between items-start px-1">
        <div 
           className="flex flex-col cursor-pointer"
           onClick={() => onNavigate('product', product.id)}
        >
          <span className="text-[8px] font-black tracking-widest opacity-40 uppercase mb-0.5">{product.category || 'Apparel'}</span>
          <h3 className="font-['Syne'] text-base font-bold tracking-tight uppercase group-hover:text-white transition-colors">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-['Syne'] font-black text-sm">₹{product.salePrice || product.price}</span>
            {product.salePrice && (
              <span className="text-xs text-white/30 line-through">₹{product.price}</span>
            )}
          </div>
        </div>
        
        <button 
          aria-label="Add to cart"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.({ productId: product.id, quantity: 1, variant: {} });
          }}
          className="w-8 h-8 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
          title="Add to Cart"
        >
          <ShoppingBag size={14} strokeWidth={2} />
        </button>
      </div>
    </motion.div>
  );
}
