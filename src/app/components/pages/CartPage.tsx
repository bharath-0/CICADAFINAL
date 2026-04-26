import { Minus, Plus, X, ArrowLeft, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CartPage({ cart, products, onUpdateQuantity, onRemoveFromCart, onNavigate }: any) {
  const cartItems = (cart || []).map((item: any) => {
    const product = products?.find((p: any) => p.id === item.productId);
    return { ...item, product };
  }).filter((item: any) => item.product);

  const subtotal = cartItems.reduce((sum: number, item: any) => {
    const price = item.product.salePrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal > 2999 ? 0 : 199;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <ShoppingBag size={48} strokeWidth={1} className="mb-6 md:mb-8 text-white/20" />
        <h1 className="font-['Syne'] text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-3 md:mb-4">EMPTY ARCHIVE</h1>
        <p className="text-white/40 text-sm md:text-base font-medium mb-8 md:mb-12 text-center">Your cart is currently empty. Explore the archive to find your next statement piece.</p>
        <button
          onClick={() => onNavigate?.('shop')}
          className="h-14 md:h-16 px-8 md:px-10 bg-white text-black rounded-full font-black text-xs tracking-widest flex items-center gap-3"
        >
          EXPLORE ARCHIVE
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-8 md:pt-12 pb-20 md:pb-32">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        {/* Header */}
        <button 
          onClick={() => onNavigate?.('shop')}
          className="flex items-center gap-2 md:gap-3 text-[10px] font-black tracking-[0.3em] uppercase mb-6 md:mb-12 hover:text-white/60 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          CONTINUE BROWSING
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-20 gap-4">
          <div>
            <h1 className="font-['Syne'] text-4xl md:text-6xl lg:text-7xl font-black uppercase italic tracking-tighter leading-[0.85]">
              YOUR<br />ARCHIVE
            </h1>
          </div>
          <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
            {cartItems.length} {cartItems.length === 1 ? 'PIECE' : 'PIECES'} SELECTED
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="border-t border-white/10">
              <AnimatePresence>
                {cartItems.map((item: any) => (
                  <motion.div
                    key={item.productId}
                    layout
                    exit={{ opacity: 0, x: -100 }}
                    className="border-b border-white/10 py-6 md:py-10"
                  >
                    <div className="flex gap-4 md:gap-8">
                      <div 
                        onClick={() => onNavigate?.('product', item.product)}
                        className="w-20 md:w-32 aspect-[3/4] bg-[#111] rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer group"
                      >
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <span className="text-[8px] md:text-[9px] font-bold text-white/30 tracking-[0.3em] uppercase block mb-1">{item.product.category}</span>
                              <h3 className="font-['Syne'] text-base md:text-xl font-black uppercase tracking-tight truncate">{item.product.name}</h3>
                            </div>
                            <button 
                              onClick={() => onRemoveFromCart?.(item.productId)}
                              className="text-white/20 hover:text-white transition-colors flex-shrink-0"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          {item.variant?.size && (
                            <span className="inline-block mt-2 text-[9px] md:text-[10px] font-black tracking-widest text-white/40 border border-white/10 px-2.5 md:px-3 py-1 rounded-lg">
                              SIZE: {item.variant.size}
                            </span>
                          )}
                        </div>
                        <div className="flex items-end justify-between mt-4 md:mt-0">
                          <div className="flex items-center border border-white/10 rounded-xl md:rounded-2xl">
                            <button 
                              onClick={() => onUpdateQuantity?.(item.productId, Math.max(1, item.quantity - 1))} 
                              className="h-9 md:h-12 w-9 md:w-12 flex items-center justify-center hover:bg-white/5 transition-colors rounded-l-xl md:rounded-l-2xl"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="h-9 md:h-12 w-10 md:w-14 flex items-center justify-center font-black text-xs md:text-sm border-x border-white/10">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity?.(item.productId, item.quantity + 1)}
                              className="h-9 md:h-12 w-9 md:w-12 flex items-center justify-center hover:bg-white/5 transition-colors rounded-r-xl md:rounded-r-2xl"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="font-['Syne'] text-lg md:text-2xl font-bold">
                              ₹{(item.product.salePrice || item.product.price) * item.quantity}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-[9px] md:text-[10px] text-white/30 font-bold">₹{item.product.salePrice || item.product.price} each</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-[#111] rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 sticky top-32">
              <h2 className="font-['Syne'] text-xl md:text-2xl font-black uppercase tracking-tight mb-8 md:mb-12 italic">Order Summary</h2>

              <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                <div className="flex justify-between">
                  <span className="text-[10px] md:text-[11px] font-bold text-white/40 tracking-widest uppercase">Subtotal</span>
                  <span className="font-bold text-sm md:text-base">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] md:text-[11px] font-bold text-white/40 tracking-widest uppercase">Shipping</span>
                  <span className="font-bold text-sm md:text-base">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] font-bold text-white/20">Free shipping on orders above ₹2,999</p>
                )}
                <div className="h-px bg-white/10" />
                <div className="flex justify-between items-end">
                  <span className="text-[10px] md:text-[11px] font-black tracking-widest uppercase">Total</span>
                  <span className="text-2xl md:text-3xl font-['Syne'] font-black">₹{total}</span>
                </div>
              </div>

              <button 
                onClick={() => onNavigate?.('checkout')}
                className="w-full h-14 md:h-16 bg-white text-black rounded-xl md:rounded-2xl font-black tracking-[0.15em] md:tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-white/90 transition-all text-sm"
              >
                PROCEED TO CHECKOUT
                <ArrowRight size={16} />
              </button>

              <div className="mt-6 md:mt-8 flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] text-white/30 font-bold justify-center">
                <span className="inline-block w-3 md:w-4 h-3 md:h-4 border border-white/20 rounded-full flex items-center justify-center">✓</span>
                <span>SECURE CHECKOUT · SSL ENCRYPTED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
