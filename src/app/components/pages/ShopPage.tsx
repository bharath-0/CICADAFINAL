import { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, Grid3x3, Grid2x2, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '../ProductCard';

export default function ShopPage({ products, onNavigate, wishlist, onWishlistToggle, onAddToCart }: any) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  let filteredProducts = (products || []).filter((p: any) => p);

  if (selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter((p: any) =>
      p?.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  if (selectedSizes.length > 0) {
    filteredProducts = filteredProducts.filter((p: any) =>
      p?.sizes?.some((s: string) => selectedSizes.includes(s))
    );
  }

  filteredProducts = filteredProducts.filter((p: any) => {
    const price = p.salePrice || p.price;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  if (inStockOnly) {
    filteredProducts = filteredProducts.filter((p: any) => (p.stock || 0) > 0);
  }

  if (sortBy === 'price-asc') {
    filteredProducts.sort((a: any, b: any) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a: any, b: any) => (b.salePrice || b.price) - (a.salePrice || a.price));
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'new') {
    filteredProducts = [...filteredProducts].reverse();
  }

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedSizes([]);
    setPriceRange([0, 10000]);
    setInStockOnly(false);
  };

  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) + selectedSizes.length + (inStockOnly ? 1 : 0) + (priceRange[1] < 10000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-8 md:pt-12 pb-20 md:pb-32">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-10 md:mb-20">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            className="w-16 md:w-24 h-1 bg-white mb-6 md:mb-8 origin-left"
          />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="font-['Syne'] text-4xl md:text-6xl lg:text-7xl font-black uppercase italic tracking-tighter leading-[0.85]">
                THE<br /><span className="text-white/20">ARCHIVE</span>
              </h1>
              <p className="text-white/40 font-bold tracking-tight text-sm md:text-base mt-3 md:mt-4">
                Browse the complete collection. Each piece tells a story.
              </p>
            </div>
            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">
              {filteredProducts.length} PIECES
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 md:gap-3 mb-8 md:mb-12 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat.toLowerCase())}
              className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black tracking-widest uppercase whitespace-nowrap transition-all flex-shrink-0 ${
                selectedCategory === cat.toLowerCase()
                  ? 'bg-white text-black'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 md:mb-10 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 border border-white/10 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black tracking-widest uppercase hover:bg-white/5 transition-all relative"
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">FILTERS</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-white text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">{activeFilterCount}</span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-bold text-white outline-none appearance-none cursor-pointer"
            >
              <option value="featured" className="bg-black">FEATURED</option>
              <option value="new" className="bg-black">NEWEST</option>
              <option value="price-asc" className="bg-black">PRICE: LOW → HIGH</option>
              <option value="price-desc" className="bg-black">PRICE: HIGH → LOW</option>
              <option value="rating" className="bg-black">HIGHEST RATED</option>
            </select>

            <div className="hidden md:flex items-center gap-1 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setGridColumns(2)}
                className={`p-2 rounded-lg transition-all ${gridColumns === 2 ? 'bg-white text-black' : 'hover:bg-white/5'}`}
              >
                <Grid2x2 size={16} />
              </button>
              <button
                onClick={() => setGridColumns(3)}
                className={`p-2 rounded-lg transition-all ${gridColumns === 3 ? 'bg-white text-black' : 'hover:bg-white/5'}`}
              >
                <Grid3x3 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className={`grid grid-cols-2 ${gridColumns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} lg:${gridColumns === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-4 md:gap-8`}
          >
            {filteredProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
                onWishlistToggle={onWishlistToggle}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist?.includes(product.id)}
              />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 md:py-32">
            <p className="text-white/30 text-sm md:text-base font-bold mb-6 md:mb-8">No pieces found matching your filters.</p>
            <button
              onClick={clearFilters}
              className="h-12 md:h-14 px-8 md:px-10 bg-white text-black rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase"
            >
              CLEAR FILTERS
            </button>
          </div>
        )}
      </div>

      {/* MOBILE FILTERS DRAWER */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200]"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-[#111] rounded-t-[2rem] md:rounded-t-[3rem] max-h-[85vh] overflow-y-auto p-6 md:p-10"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6 md:mb-8" />
              <div className="flex items-center justify-between mb-8 md:mb-10">
                <h3 className="font-['Syne'] text-xl md:text-2xl font-black uppercase italic tracking-tight">Filters</h3>
                <button onClick={() => setFiltersOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8 md:space-y-10">
                {/* Category */}
                <div>
                  <h4 className="text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase mb-3 md:mb-4 text-white/40">Category</h4>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat.toLowerCase())}
                        className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black tracking-widest transition-all ${
                          selectedCategory === cat.toLowerCase()
                            ? 'bg-white text-black'
                            : 'border border-white/10 hover:bg-white/5'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="border-t border-white/10 pt-8 md:pt-10">
                  <h4 className="text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase mb-3 md:mb-4 text-white/40">Size</h4>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          if (selectedSizes.includes(size)) {
                            setSelectedSizes(selectedSizes.filter(s => s !== size));
                          } else {
                            setSelectedSizes([...selectedSizes, size]);
                          }
                        }}
                        className={`h-10 md:h-12 px-5 md:px-7 rounded-xl md:rounded-2xl text-xs md:text-sm font-black tracking-widest border transition-all ${
                          selectedSizes.includes(size)
                            ? 'bg-white text-black border-white'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="border-t border-white/10 pt-8 md:pt-10">
                  <h4 className="text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase mb-3 md:mb-4 text-white/40">Price Range</h4>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-white mb-3"
                  />
                  <div className="flex justify-between text-[10px] md:text-[11px] font-bold text-white/40">
                    <span>₹0</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                {/* In Stock */}
                <div className="border-t border-white/10 pt-8 md:pt-10">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="accent-white w-4 h-4"
                    />
                    <span className="text-xs md:text-sm font-bold">In Stock Only</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 md:gap-4 pt-6 md:pt-8">
                  <button
                    onClick={clearFilters}
                    className="flex-1 h-12 md:h-14 border border-white/10 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs tracking-widest uppercase hover:bg-white/5 transition-all"
                  >
                    CLEAR ALL
                  </button>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="flex-1 h-12 md:h-14 bg-white text-black rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs tracking-widest uppercase hover:bg-white/90 transition-all"
                  >
                    APPLY
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
