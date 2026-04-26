import { useState } from 'react';
import { toast } from 'sonner';
import { Heart, Star, Minus, Plus, Truck, RotateCcw, ShieldCheck, Share2, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '../ProductCard';

export default function ProductDetailPage({
  product,
  products,
  onNavigate,
  wishlist,
  onWishlistToggle,
  onAddToCart,
}: any) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('Product Details');

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 font-['Syne'] uppercase tracking-widest text-sm">Archive entry not found</p>
      </div>
    );
  }

  // Use all available images, or just the primary if no gallery images exist
  const images = [product?.image, product?.image2, product?.image3, product?.image4].filter(Boolean);
  const relatedProducts = products?.filter((p: any) => p?.id !== product?.id && p?.category === product?.category).slice(0, 4) || [];

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size first.');
      return;
    }
    onAddToCart?.({
      productId: product.id,
      quantity,
      variant: { size: selectedSize },
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-8 md:pt-12 pb-20 md:pb-32">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        {/* Header / Back */}
        <button 
          onClick={() => onNavigate?.('shop')}
          className="flex items-center gap-2 md:gap-3 text-[10px] font-black tracking-[0.3em] uppercase mb-6 md:mb-12 hover:text-white/60 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          RETURN TO COLLECTION
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          {/* Images Gallery */}
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Main Image */}
              <div className="relative aspect-[3/4] md:aspect-[3/4] bg-[#111] rounded-2xl md:rounded-[3rem] overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage]}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                {product.badge && (
                  <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-white text-black px-3 md:px-4 py-1 md:py-1.5 text-[9px] md:text-[10px] font-black tracking-widest rounded-full uppercase">
                    {product.badge}
                  </div>
                )}
              </div>
              {/* Thumbnails */}
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 md:w-20 aspect-[3/4] border transition-all duration-500 overflow-hidden rounded-lg md:rounded-xl flex-shrink-0 ${
                      selectedImage === i ? 'border-white' : 'border-white/10 opacity-40 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-8 md:mb-12">
               <span className="text-[9px] md:text-[10px] font-black tracking-[0.5em] text-white/40 uppercase mb-2 md:mb-4 block">
                 {product.category || 'Archive Item'} / {product.sku || 'CIC-0042'}
               </span>
               <h1 className="font-['Syne'] text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.9] mb-4 md:mb-8 italic">
                 {product.name}
               </h1>
               
               <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-8">
                 <div className="text-2xl md:text-3xl font-['Syne'] font-bold">
                    ₹{product.salePrice || product.price}
                 </div>
                 {product.salePrice && (
                    <div className="text-lg md:text-xl text-white/30 line-through">₹{product.price}</div>
                 )}
               </div>

               <p className="text-white/60 leading-relaxed font-medium text-base md:text-lg">
                 Part of the exclusive {product.collection || 'Chaos'} drop. Engineered with high-density technical fabrics for maximum durability and effortless silhouette.
               </p>
            </div>

            {/* Size Selector */}
            <div className="mb-8 md:mb-12">
               <div className="flex justify-between items-end mb-3 md:mb-4">
                 <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-white/40">SELECT ARCHIVE SIZE</span>
                 <button className="text-[9px] md:text-[10px] font-bold border-b border-white/20 pb-0.5 hover:border-white transition-all">SIZE CALCULATOR</button>
               </div>
               <div className="flex flex-wrap gap-2 md:gap-3">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 md:h-14 px-5 md:px-8 border-[1.5px] rounded-xl md:rounded-2xl text-xs md:text-sm font-black tracking-widest transition-all duration-300 ${
                        selectedSize === size 
                        ? 'bg-white text-black border-white' 
                        : 'border-white/10 hover:border-white/40'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
               </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 md:gap-4 mb-12 md:mb-20">
               <button 
                onClick={handleAddToCart}
                className="h-16 md:h-20 bg-white text-black rounded-2xl md:rounded-[2rem] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase group flex items-center justify-center gap-3 md:gap-4 hover:bg-white/90 transition-all text-sm md:text-base"
               >
                 DEPOSIT IN CART
                 <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-2 transition-transform" />
               </button>
               <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <button 
                    onClick={() => onWishlistToggle?.(product.id)}
                    className={`h-12 md:h-16 border rounded-xl md:rounded-[1.5rem] flex items-center justify-center gap-2 md:gap-3 font-black text-[9px] md:text-[10px] tracking-widest uppercase transition-all ${
                      wishlist?.includes(product.id) ? 'bg-white/10 border-white/40' : 'border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <Heart size={14} fill={wishlist?.includes(product.id) ? 'white' : 'none'} />
                    {wishlist?.includes(product.id) ? 'ARCHIVED' : 'WISHLIST'}
                  </button>
                  <button className="h-12 md:h-16 border border-white/10 rounded-xl md:rounded-[1.5rem] flex items-center justify-center gap-2 md:gap-3 font-black text-[9px] md:text-[10px] tracking-widest uppercase hover:bg-white/5 transition-all">
                    <Share2 size={14} />
                    SHARE
                  </button>
               </div>
            </div>

            {/* Information Accordion */}
            <div className="border-t border-white/10">
               {[
                 { title: 'Product Details', content: 'Crafted from 450GSM heavy-weight cotton. Pre-shrunk and garment-dyed for a vintage feel. Featuring distressed edges and reinforced side-seams for structural integrity.' },
                 { title: 'Shipment & Logistics', content: 'Each piece is hand-inspected before dispatch. Free express shipping on all orders. Securely packaged in our signature carbon-neutral archive box.' },
                 { title: 'Sustainability', content: '100% recycled fibers. Low-impact dyes. Locally sourced materials to minimize carbon footprint.' }
               ].map((item) => (
                 <div key={item.title} className="border-b border-white/10">
                    <button 
                      onClick={() => setActiveAccordion(activeAccordion === item.title ? null : item.title)}
                      className="w-full py-4 md:py-6 flex justify-between items-center text-left"
                    >
                      <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase">{item.title}</span>
                      <Plus size={14} className={`transition-transform duration-500 ${activeAccordion === item.title ? 'rotate-45' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeAccordion === item.title && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-6 md:pb-8 text-white/40 text-xs md:text-sm leading-relaxed font-medium">
                            {item.content}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* RELATED SECTION */}
        <div className="mt-20 md:mt-40">
           <div className="flex justify-between items-end mb-8 md:mb-12">
              <h2 className="font-['Syne'] text-2xl md:text-4xl font-black uppercase italic">COMPLETE<br />THE VIBE</h2>
              <button className="text-[9px] md:text-[10px] font-black tracking-widest uppercase border-b border-white pb-1">VIEW ALL</button>
           </div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
              {relatedProducts.map((p: any) => (
                 <ProductCard 
                    key={p.id}
                    product={p}
                    onNavigate={onNavigate}
                    onWishlistToggle={onWishlistToggle}
                    onAddToCart={onAddToCart}
                    isWishlisted={wishlist?.includes(p.id)}
                 />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
