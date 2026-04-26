import { useEffect, useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { Heart, ArrowUpRight } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { initSupabase } from '/utils/supabase/client';
import { getShopifyProducts } from '../utils/shopify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

// Route-level lazy splits — each page is its own async chunk
const Homepage        = lazy(() => import('./components/pages/HomepageV2'));
const ShopPage        = lazy(() => import('./components/pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./components/pages/ProductDetailPage'));
const CartPage        = lazy(() => import('./components/pages/CartPage'));
const PaymentPage     = lazy(() => import('./components/pages/PaymentPage'));
const AdminDashboard  = lazy(() => import('./components/pages/AdminDashboard'));
// Three.js viewer is the heaviest — defer until after first paint
const ModelViewer     = lazy(() => import('./components/ModelViewer'));

// Skeleton shown while any lazy chunk loads
function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md px-6 flex flex-col gap-4">
        <div className="h-64 w-full skeleton rounded-[2rem] bg-white/5" />
        <div className="h-8 w-3/4 skeleton rounded-lg bg-white/5" />
        <div className="h-4 w-1/2 skeleton rounded-lg bg-white/5" />
        <div className="flex gap-4 mt-4">
          <div className="h-12 w-1/2 skeleton rounded-xl bg-white/5" />
          <div className="h-12 w-1/2 skeleton rounded-xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9ede8e2f`;

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any>({ items: [] });
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);
  const [authModal, setAuthModal] = useState<'signin' | 'signup' | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const client = initSupabase();
      setSupabase(client);
      await checkSession(client);
      await fetchProducts();
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async (client: any) => {
    if (!client) return;
    try {
      const { data: { session } } = await client.auth.getSession();
      if (session?.access_token) {
        setAccessToken(session.access_token);
        setUser(session.user);
        await fetchCart(session.access_token);
        await fetchWishlist(session.access_token);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const shopifyProducts = await getShopifyProducts();
      if (shopifyProducts && shopifyProducts.length > 0) {
        setProducts(shopifyProducts);
      } else {
        const response = await fetch(`${API_URL}/products`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        });
        const data = await response.json();
        if (data.products) setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCart = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.cart) setCart(data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const fetchWishlist = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.wishlist) setWishlist(data.wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleNavigate = (page: string, param?: string) => {
    setCurrentPage(page);
    if (page === 'product' && param) {
      setSelectedProductId(param);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (item: any) => {
    if (!accessToken) {
      setAuthModal('signin');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(item),
      });

      const data = await response.json();
      if (data.cart) {
        setCart(data.cart);
        toast.success('Item added to archive', { description: 'Go to your cart to checkout.' });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleUpdateCart = async (productId: string, quantity: number, variant: any) => {
    if (!accessToken) return;
    const updatedItems = (cart?.items || []).map((item: any) => {
      if (item.productId === productId && JSON.stringify(item.variant) === JSON.stringify(variant)) {
        return { ...item, quantity };
      }
      return item;
    });
    setCart({ ...cart, items: updatedItems });
  };

  const handleRemoveFromCart = async (productId: string) => {
    if (!accessToken) return;
    try {
      const response = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (data.cart) setCart(data.cart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleWishlistToggle = async (productId: string) => {
    if (!accessToken) {
      setAuthModal('signin');
      return;
    }
    const isWishlisted = wishlist.includes(productId);
    try {
      const response = await fetch(`${API_URL}/wishlist/${productId}`, {
        method: isWishlisted ? 'DELETE' : 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (data.wishlist) setWishlist(data.wishlist);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleSignIn = async (email: string, password: string): Promise<string | null> => {
    if (!supabase) return 'Supabase connection failed.';
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    if (data.session) {
      setAccessToken(data.session.access_token);
      setUser(data.user);
      await fetchCart(data.session.access_token);
      await fetchWishlist(data.session.access_token);
    }
    return null;
  };

  const handleSignUp = async (name: string, email: string, password: string): Promise<string | null> => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (data.error) return data.error;
    return await handleSignIn(email, password);
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setAccessToken(null);
    setCart({ items: [] });
    setWishlist([]);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-soft-grid">
        <div className="w-full max-w-md px-6 flex flex-col gap-4">
          <div className="h-64 w-full skeleton rounded-[2rem] bg-white/5" />
          <div className="h-8 w-3/4 skeleton rounded-lg bg-white/5" />
          <div className="h-4 w-1/2 skeleton rounded-lg bg-white/5" />
          <div className="flex gap-4 mt-4">
            <div className="h-12 w-1/2 skeleton rounded-xl bg-white/5" />
            <div className="h-12 w-1/2 skeleton rounded-xl bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  const selectedProduct = products?.find(p => p?.id === selectedProductId);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white selection:bg-white selection:text-black">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#111', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' },
        }}
      />
      <Navbar
        cartCount={cart.items?.length || 0}
        wishlistCount={wishlist.length}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (selectedProductId || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          >
            <Suspense fallback={<PageSkeleton />}>
            {currentPage === 'home' && (
              <Homepage
                products={products}
                onNavigate={handleNavigate}
                wishlist={wishlist}
                onWishlistToggle={handleWishlistToggle}
                onAddToCart={handleAddToCart}
              />
            )}

            {currentPage === 'shop' && (
              <ShopPage
                products={products}
                onNavigate={handleNavigate}
                wishlist={wishlist}
                onWishlistToggle={handleWishlistToggle}
                onAddToCart={handleAddToCart}
              />
            )}

            {currentPage === 'product' && (
              <ProductDetailPage
                product={selectedProduct}
                products={products}
                onNavigate={handleNavigate}
                wishlist={wishlist}
                onWishlistToggle={handleWishlistToggle}
                onAddToCart={handleAddToCart}
              />
            )}

            {currentPage === 'cart' && (
              <CartPage
                cart={cart}
                products={products}
                onNavigate={handleNavigate}
                onUpdateCart={handleUpdateCart}
                onRemoveFromCart={handleRemoveFromCart}
              />
            )}

            {currentPage === 'wishlist' && (
              <div className="min-h-screen bg-black pt-24 pb-32">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                  <div className="mb-16">
                    <span className="text-[10px] font-black tracking-[0.5em] uppercase text-white/30">YOUR COLLECTION</span>
                    <h1 className="font-['Syne'] text-5xl md:text-7xl font-black tracking-tighter uppercase italic mt-2 leading-none">WISHLIST</h1>
                  </div>
                  {wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
                      <Heart size={48} className="text-white/20" />
                      <p className="font-['Syne'] text-2xl font-black uppercase text-white/30">Your archive is empty</p>
                      <button onClick={() => handleNavigate('shop')} className="mt-4 h-14 px-10 bg-white text-black rounded-full font-black text-xs tracking-widest uppercase hover:bg-white/90">
                        BROWSE THE VAULT
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                      {products.filter((p: any) => wishlist.includes(p.id)).map((product: any) => (
                        <div key={product.id} className="group relative flex flex-col">
                          <div onClick={() => handleNavigate('product', product.id)} className="relative aspect-[3/4] overflow-hidden bg-[#111] rounded-[1.25rem] cursor-pointer">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <button onClick={(e) => { e.stopPropagation(); handleWishlistToggle(product.id); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center" aria-label="Remove from wishlist">
                              <Heart size={14} fill="black" />
                            </button>
                          </div>
                          <div className="mt-3 flex justify-between items-start px-1">
                            <div onClick={() => handleNavigate('product', product.id)} className="flex flex-col cursor-pointer">
                              <span className="text-[8px] font-black tracking-widest opacity-40 uppercase mb-0.5">{product.category || 'Apparel'}</span>
                              <h3 className="font-['Syne'] text-base font-bold tracking-tight uppercase">{product.name}</h3>
                              <span className="font-['Syne'] font-black text-sm mt-1">₹{product.salePrice || product.price}</span>
                            </div>
                            <button onClick={() => handleAddToCart({ productId: product.id, quantity: 1, variant: {} })} className="w-8 h-8 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-all" aria-label="Add to cart">
                              <ArrowUpRight size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentPage === 'account' && (
               <div className="min-h-screen flex items-center justify-center pt-24 pb-32">
                 <div className="max-w-md w-full px-6 text-center">
                    <h2 className="font-['Syne'] text-4xl font-black uppercase italic mb-8">Access Level</h2>
                    {user ? (
                      <div className="flex flex-col gap-6">
                        <div className="p-8 border border-white/10 rounded-[2rem] bg-white/[0.02]">
                          <p className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-2">Verified Identity</p>
                          <p className="text-xl font-bold">{user.email}</p>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="h-16 bg-white text-black rounded-2xl font-black tracking-widest uppercase hover:bg-white/90 transition-all"
                        >
                          Terminate Session
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <button onClick={() => setAuthModal('signin')} className="h-16 bg-white text-black rounded-2xl font-black tracking-widest uppercase hover:bg-white/90">Sign In</button>
                        <button onClick={() => setAuthModal('signup')} className="h-16 border border-white/10 rounded-2xl font-black tracking-widest uppercase hover:bg-white/5">Create Account</button>
                      </div>
                    )}
                 </div>
               </div>
            )}

            {(currentPage === 'checkout' || currentPage === 'payment') && (
              <PaymentPage
                cart={cart}
                products={products}
                onNavigate={handleNavigate}
                apiUrl={API_URL}
                accessToken={accessToken}
                onPaymentSuccess={() => setCart({ items: [] })}
              />
            )}

            {currentPage === 'admin' && (
              <AdminDashboard
                products={products}
                onNavigate={handleNavigate}
                apiUrl={API_URL}
                publicAnonKey={publicAnonKey}
                onProductsChanged={fetchProducts}
              />
            )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <Suspense fallback={null}>
        <ModelViewer />
      </Suspense>
      <Footer onNavigate={handleNavigate} />

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitchMode={(m) => setAuthModal(m)}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
        />
      )}
    </div>
  );
}