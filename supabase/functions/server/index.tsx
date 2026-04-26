import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Admin-Token", "x-admin-token", "X-Client-Info", "apikey"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.options("/*", (c) => c.text("ok"));

// Helper: Get user from access token
const getAuthUser = async (authHeader: string | null) => {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);
  return error ? null : user;
};

// Health check
app.get("/make-server-9ede8e2f/health", (c) => {
  return c.json({ status: "ok" });
});

// AUTH ROUTES
app.post("/make-server-9ede8e2f/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true,
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup exception: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// PRODUCTS ROUTES
app.get("/make-server-9ede8e2f/products", async (c) => {
  try {
    const category = c.req.query('category');
    const search = c.req.query('search');

    const allProducts = await kv.getByPrefix('product:');
    let products = allProducts
      .map((item: any) => (item && typeof item === 'object' && 'value' in item ? item.value : item))
      .filter(Boolean);

    if (category && category !== 'all') {
      products = products.filter((p: any) => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter((p: any) =>
        p.name?.toLowerCase().includes(searchLower) ||
        p.brand?.toLowerCase().includes(searchLower)
      );
    }

    return c.json({ products });
  } catch (error) {
    console.log(`Error fetching products: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

app.get("/make-server-9ede8e2f/products/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const product = await kv.get(`product:${id}`);

    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    return c.json({ product });
  } catch (error) {
    console.log(`Error fetching product ${c.req.param('id')}: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// CART ROUTES (requires auth)
app.get("/make-server-9ede8e2f/cart", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized - please sign in to view cart' }, 401);
    }

    const cart = await kv.get(`cart:${user.id}`) || { items: [] };
    return c.json({ cart });
  } catch (error) {
    console.log(`Error fetching cart: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

app.post("/make-server-9ede8e2f/cart", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized - please sign in to add items to cart' }, 401);
    }

    const { productId, quantity, variant } = await c.req.json();

    const cart = await kv.get(`cart:${user.id}`) || { items: [] };
    const existingIndex = cart.items.findIndex((item: any) =>
      item.productId === productId &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, variant, addedAt: new Date().toISOString() });
    }

    await kv.set(`cart:${user.id}`, cart);

    return c.json({ cart });
  } catch (error) {
    console.log(`Error adding to cart: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

app.delete("/make-server-9ede8e2f/cart/:productId", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const productId = c.req.param('productId');
    const cart = await kv.get(`cart:${user.id}`) || { items: [] };

    cart.items = cart.items.filter((item: any) => item.productId !== productId);
    await kv.set(`cart:${user.id}`, cart);

    return c.json({ cart });
  } catch (error) {
    console.log(`Error removing from cart: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// ORDERS ROUTES (requires auth)
app.post("/make-server-9ede8e2f/orders", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized - please sign in to place order' }, 401);
    }

    const orderData = await c.req.json();
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = {
      ...orderData,
      id: orderId,
      userId: user.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`order:${orderId}`, order);

    const userOrders = await kv.get(`user:${user.id}:orders`) || [];
    userOrders.push(orderId);
    await kv.set(`user:${user.id}:orders`, userOrders);

    const cart = await kv.get(`cart:${user.id}`);
    if (cart) {
      await kv.del(`cart:${user.id}`);
    }

    return c.json({ order });
  } catch (error) {
    console.log(`Error creating order: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

app.get("/make-server-9ede8e2f/orders", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const orderIds = await kv.get(`user:${user.id}:orders`) || [];
    const orders = await kv.mget(orderIds.map((id: string) => `order:${id}`));

    return c.json({ orders: orders.filter(Boolean) });
  } catch (error) {
    console.log(`Error fetching orders: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// WISHLIST ROUTES (requires auth)
app.get("/make-server-9ede8e2f/wishlist", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const wishlist = await kv.get(`wishlist:${user.id}`) || [];
    return c.json({ wishlist });
  } catch (error) {
    console.log(`Error fetching wishlist: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

app.post("/make-server-9ede8e2f/wishlist/:productId", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const productId = c.req.param('productId');
    const wishlist = await kv.get(`wishlist:${user.id}`) || [];

    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      await kv.set(`wishlist:${user.id}`, wishlist);
    }

    return c.json({ wishlist });
  } catch (error) {
    console.log(`Error adding to wishlist: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

app.delete("/make-server-9ede8e2f/wishlist/:productId", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const productId = c.req.param('productId');
    let wishlist = await kv.get(`wishlist:${user.id}`) || [];

    wishlist = wishlist.filter((id: string) => id !== productId);
    await kv.set(`wishlist:${user.id}`, wishlist);

    return c.json({ wishlist });
  } catch (error) {
    console.log(`Error removing from wishlist: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// ADMIN AUTH (simple shared-credential gate for prototype)
const ADMIN_EMAIL = 'admin@cicada.com';
const ADMIN_PASSWORD = 'cicada2026';
const ADMIN_TOKEN = 'admin-cicada-secret-token-9ede8e2f';

app.post("/make-server-9ede8e2f/admin/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return c.json({ token: ADMIN_TOKEN });
    }
    return c.json({ error: 'Invalid admin credentials' }, 401);
  } catch (error) {
    console.log(`Admin login error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

const isAdmin = (c: any) => {
  const auth = c.req.header('X-Admin-Token');
  return auth === ADMIN_TOKEN;
};

// ADMIN PRODUCT CRUD
app.post("/make-server-9ede8e2f/admin/products", async (c) => {
  try {
    if (!isAdmin(c)) return c.json({ error: 'Unauthorized admin' }, 401);
    const body = await c.req.json();
    const id = body.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const product = { ...body, id };
    await kv.set(`product:${id}`, product);
    return c.json({ product });
  } catch (error) {
    console.log(`Error creating product: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

app.put("/make-server-9ede8e2f/admin/products/:id", async (c) => {
  try {
    if (!isAdmin(c)) return c.json({ error: 'Unauthorized admin' }, 401);
    const id = c.req.param('id');
    const existing = await kv.get(`product:${id}`);
    if (!existing) return c.json({ error: 'Product not found' }, 404);
    const updates = await c.req.json();
    const product = { ...existing, ...updates, id };
    await kv.set(`product:${id}`, product);
    return c.json({ product });
  } catch (error) {
    console.log(`Error updating product: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

app.delete("/make-server-9ede8e2f/admin/products/:id", async (c) => {
  try {
    if (!isAdmin(c)) return c.json({ error: 'Unauthorized admin' }, 401);
    const id = c.req.param('id');
    await kv.del(`product:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting product: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// RAZORPAY INTEGRATION
app.get("/make-server-9ede8e2f/razorpay/key", (c) => {
  const keyId = Deno.env.get('RAZORPAY_KEY_ID');
  if (!keyId) return c.json({ error: 'Razorpay not configured' }, 500);
  return c.json({ keyId });
});

app.post("/make-server-9ede8e2f/razorpay/order", async (c) => {
  try {
    const keyId = Deno.env.get('RAZORPAY_KEY_ID');
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!keyId || !keySecret) {
      return c.json({ error: 'Razorpay credentials not configured on server' }, 500);
    }
    const { amount, currency = 'INR', receipt } = await c.req.json();
    if (!amount || amount <= 0) return c.json({ error: 'Invalid amount' }, 400);

    const auth = btoa(`${keyId}:${keySecret}`);
    const resp = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
      }),
    });
    const data = await resp.json();
    if (!resp.ok) {
      console.log(`Razorpay order error: ${JSON.stringify(data)}`);
      return c.json({ error: data.error?.description || 'Razorpay order failed' }, 500);
    }
    return c.json({ order: data, keyId });
  } catch (error) {
    console.log(`Razorpay order exception: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

app.post("/make-server-9ede8e2f/razorpay/verify", async (c) => {
  try {
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!keySecret) return c.json({ error: 'Razorpay not configured' }, 500);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await c.req.json();
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(keySecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const expected = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    if (expected !== razorpay_signature) {
      return c.json({ verified: false, error: 'Signature mismatch' }, 400);
    }
    return c.json({ verified: true });
  } catch (error) {
    console.log(`Razorpay verify error: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// SEED initial products
app.post("/make-server-9ede8e2f/seed", async (c) => {
  try {
    const sampleProducts = [
      {
        id: 'gradient-tee-01',
        name: 'Gradient Graphic T-shirt',
        brand: 'URBAN ARCHIVE',
        price: 242,
        salePrice: 145,
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
        badge: 'SALE',
        rating: 4.5,
        reviews: 128,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Navy'],
        stock: 45,
      },
      {
        id: 'checkered-shirt-01',
        name: 'Checkered Shirt',
        brand: 'CLASSIC FIT',
        price: 180,
        salePrice: null,
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop',
        badge: 'NEW',
        rating: 4.0,
        reviews: 64,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Red', 'Blue', 'Green'],
        stock: 28,
      },
      {
        id: 'skinny-jeans-01',
        name: 'Skinny Fit Jeans',
        brand: 'DENIM CO',
        price: 260,
        salePrice: 240,
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
        badge: 'BESTSELLER',
        rating: 4.8,
        reviews: 256,
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Blue', 'Black', 'Grey'],
        stock: 67,
      },
      {
        id: 'polo-tee-01',
        name: 'Polo with Tipping Details',
        brand: 'PREMIUM',
        price: 242,
        salePrice: 180,
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&h=500&fit=crop',
        badge: 'SALE',
        rating: 4.3,
        reviews: 89,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Mauve', 'Navy', 'White'],
        stock: 34,
      },
      {
        id: 'striped-tee-01',
        name: 'Black Striped T-shirt',
        brand: 'URBAN ARCHIVE',
        price: 150,
        salePrice: 120,
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&h=500&fit=crop',
        badge: 'SALE',
        rating: 4.7,
        reviews: 142,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black/White', 'Navy/White'],
        stock: 52,
      },
      {
        id: 'orange-tee-01',
        name: 'Sleeve Striped T-shirt',
        brand: 'BOLD BASICS',
        price: 160,
        salePrice: 130,
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=500&fit=crop',
        badge: 'NEW',
        rating: 4.2,
        reviews: 76,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Orange', 'Green', 'Blue'],
        stock: 41,
      },
    ];

    for (const product of sampleProducts) {
      await kv.set(`product:${product.id}`, product);
    }

    return c.json({ message: `${sampleProducts.length} products seeded successfully` });
  } catch (error) {
    console.log(`Error seeding products: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);