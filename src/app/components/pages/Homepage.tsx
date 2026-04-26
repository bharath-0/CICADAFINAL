import { ArrowRight, Truck, RotateCcw, Award, Lock, Instagram } from 'lucide-react';
import ProductCard from '../ProductCard';
import { useEffect, useState } from 'react';

export default function Homepage({ products, onNavigate, wishlist, onWishlistToggle, onAddToCart }: any) {
  const newArrivals = products?.slice(0, 4) || [];
  const trendingProducts = products?.slice(0, 6) || [];
  const saleProducts = products?.filter((p: any) => p.salePrice).slice(0, 4) || [];

  return (
    <div className="min-h-screen">
      {/* HERO BANNER */}
      <section className="relative h-[600px] bg-gradient-to-br from-brand-primary via-[#252540] to-brand-accent overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
          <div className="relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1485230405346-71acb9518d9c?w=800&h=800&fit=crop"
              alt="Fashion"
              className="w-full h-full object-cover opacity-90"
            />
          </div>

          <div className="flex items-center justify-center p-8 md:p-12 bg-gradient-to-br from-brand-primary to-[#252540]">
            <div className="max-w-xl text-primary-foreground">
              <div className="inline-block px-4 py-2 bg-brand-accent rounded-full text-sm font-bold mb-6 animate-pulse">
                Up to 40% OFF
              </div>
              <h1 className="font-['Syne'] text-5xl md:text-6xl font-bold leading-tight mb-4">
                DRESS BOLD.<br />LIVE LOUD.
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Discover the latest trends in urban fashion. Bold designs for the fearless.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate?.('shop')}
                  className="px-8 py-4 bg-brand-accent text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  Shop New Arrivals
                  <ArrowRight size={20} />
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-white text-primary-foreground font-semibold rounded-lg hover:bg-surface-white hover:text-brand-primary transition-all">
                  View Lookbook
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-surface-white py-12 border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-surface-card flex items-center justify-center mb-3">
                <Truck size={24} className="text-brand-primary" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Free Shipping</h4>
              <p className="text-xs text-text-secondary">On orders above ₹999</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-surface-card flex items-center justify-center mb-3">
                <RotateCcw size={24} className="text-brand-primary" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Easy Returns</h4>
              <p className="text-xs text-text-secondary">15-day return policy</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-surface-card flex items-center justify-center mb-3">
                <Award size={24} className="text-brand-primary" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Premium Quality</h4>
              <p className="text-xs text-text-secondary">Handpicked fabrics</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-surface-card flex items-center justify-center mb-3">
                <Lock size={24} className="text-brand-primary" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Secure Payments</h4>
              <p className="text-xs text-text-secondary">100% protected checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-['Syne'] font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Tops', count: 124, image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=500&fit=crop' },
              { name: 'Bottoms', count: 89, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop' },
              { name: 'Outerwear', count: 67, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop' },
              { name: 'Dresses', count: 102, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop' },
              { name: 'Accessories', count: 156, image: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=400&h=500&fit=crop' },
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => onNavigate?.('category', category.name.toLowerCase())}
                className="relative h-64 rounded-lg overflow-hidden group"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-left text-primary-foreground">
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-300">{category.count} items</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-16 bg-surface-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-['Syne'] font-bold">New Arrivals</h2>
            <button
              onClick={() => onNavigate?.('shop')}
              className="text-sm font-medium text-brand-accent hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
                onWishlistToggle={onWishlistToggle}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist?.includes(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTION BANNER */}
      <section className="py-16 bg-brand-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Spring/Summer 2026</div>
              <h2 className="font-['Syne'] text-4xl font-bold mb-4">URBAN ARCHIVE SS25</h2>
              <p className="text-gray-300 mb-6">
                Minimalist silhouettes meet bold street aesthetics. Discover our latest collection featuring premium fabrics and timeless designs.
              </p>
              <button className="px-6 py-3 bg-brand-accent text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition-all">
                Explore Collection
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=300&h=400&fit=crop" alt="" className="rounded-lg h-64 object-cover" />
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=400&fit=crop" alt="" className="rounded-lg h-64 object-cover mt-8" />
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop" alt="" className="rounded-lg h-64 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING NOW */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-['Syne'] font-bold mb-8">Trending Now</h2>
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex gap-6 pb-4">
              {trendingProducts.map((product: any) => (
                <div key={product.id} className="min-w-[280px]">
                  <ProductCard
                    product={product}
                    onNavigate={onNavigate}
                    onWishlistToggle={onWishlistToggle}
                    onAddToCart={onAddToCart}
                    isWishlisted={wishlist?.includes(product.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-16 bg-surface-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1558769132-cb1aea661d6?w=400&h=500&fit=crop" alt="" className="rounded-lg h-80 object-cover" />
              <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop" alt="" className="rounded-lg h-80 object-cover mt-12" />
            </div>
            <div>
              <h2 className="font-['Syne'] text-4xl font-bold mb-6">Made for the Bold.</h2>
              <p className="text-text-secondary mb-4">
                CICADA was born from a simple belief: fashion should empower, not conform. We design for those who dare to stand out, who view clothing as self-expression rather than just fabric.
              </p>
              <p className="text-text-secondary mb-4">
                Every piece in our collection is crafted with premium materials and meticulous attention to detail. From the first sketch to the final stitch, we prioritize quality without compromise.
              </p>
              <p className="text-text-secondary mb-6">
                Our design philosophy blends minimalist aesthetics with urban edge, creating timeless pieces that transition seamlessly from day to night, work to weekend.
              </p>
              <button className="px-6 py-3 border-2 border-brand-primary text-brand-primary font-semibold rounded-lg hover:bg-brand-primary hover:text-primary-foreground transition-all">
                Our Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SALE SPOTLIGHT */}
      {saleProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-brand-accent to-[#c83752]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-primary-foreground">
            <h2 className="font-['Syne'] text-5xl md:text-6xl font-bold mb-4">UP TO 40% OFF</h2>
            <p className="text-xl mb-12 text-primary-foreground/90">Limited time sale on selected styles</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {saleProducts.map((product: any) => (
                <div key={product.id} className="bg-surface-white rounded-lg p-1">
                  <ProductCard
                    product={product}
                    onNavigate={onNavigate}
                    onWishlistToggle={onWishlistToggle}
                    isWishlisted={wishlist?.includes(product.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* UGC / INSTAGRAM GRID */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-['Syne'] font-bold mb-2">AS SEEN ON @CICADA</h2>
            <p className="text-text-secondary">Tag us for a chance to be featured</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1544957992-20514f595d6f?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&h=300&fit=crop',
            ].map((img, i) => (
              <div key={i} className="relative group overflow-hidden rounded-lg aspect-square">
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram className="text-primary-foreground" size={32} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16 bg-surface-card">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-['Syne'] text-3xl font-bold mb-3">GET 10% OFF YOUR FIRST ORDER</h2>
          <p className="text-text-secondary mb-6">Subscribe to our newsletter for exclusive offers and style tips</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-border-color rounded-lg outline-none focus:border-brand-primary"
            />
            <button className="px-8 py-3 bg-brand-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition-all">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-text-muted mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
