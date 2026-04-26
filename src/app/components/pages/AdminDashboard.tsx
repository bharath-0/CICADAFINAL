import { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  DollarSign,
  Search,
  Plus,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  X,
  LogOut,
  Lock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

interface AdminDashboardProps {
  products: any[];
  onNavigate: (page: string) => void;
  apiUrl: string;
  publicAnonKey: string;
  onProductsChanged: () => void;
}

const adminHeaders = (token: string, anonKey: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${anonKey}`,
  'X-Admin-Token': token,
});

const ADMIN_TOKEN_KEY = 'cicada_admin_token';

const revenueData = [
  { month: 'Nov', revenue: 42000, orders: 124 },
  { month: 'Dec', revenue: 58000, orders: 186 },
  { month: 'Jan', revenue: 51000, orders: 152 },
  { month: 'Feb', revenue: 67000, orders: 203 },
  { month: 'Mar', revenue: 72000, orders: 228 },
  { month: 'Apr', revenue: 84000, orders: 261 },
];

const categoryData = [
  { name: 'Women', value: 42, color: '#E94560' },
  { name: 'Men', value: 31, color: '#1A1A2E' },
  { name: 'Accessories', value: 18, color: '#F59E0B' },
  { name: 'Kids', value: 9, color: '#10B981' },
];

const mockOrders = [
  { id: 'ORD-10234', customer: 'Aarav Sharma', total: 4899, status: 'Delivered', date: '2026-04-22' },
  { id: 'ORD-10235', customer: 'Priya Patel', total: 2499, status: 'Shipped', date: '2026-04-23' },
  { id: 'ORD-10236', customer: 'Rohan Gupta', total: 7299, status: 'Processing', date: '2026-04-23' },
  { id: 'ORD-10237', customer: 'Ananya Singh', total: 1899, status: 'Pending', date: '2026-04-24' },
  { id: 'ORD-10238', customer: 'Vikram Joshi', total: 9499, status: 'Delivered', date: '2026-04-24' },
];

const mockCustomers = [
  { id: 'U-001', name: 'Aarav Sharma', email: 'aarav@example.com', orders: 12, spent: 48990 },
  { id: 'U-002', name: 'Priya Patel', email: 'priya@example.com', orders: 8, spent: 22490 },
  { id: 'U-003', name: 'Rohan Gupta', email: 'rohan@example.com', orders: 15, spent: 72990 },
  { id: 'U-004', name: 'Ananya Singh', email: 'ananya@example.com', orders: 4, spent: 8990 },
];

type TabKey = 'overview' | 'products' | 'orders' | 'customers';

export default function AdminDashboard({
  products,
  onNavigate,
  apiUrl,
  publicAnonKey,
  onProductsChanged,
}: AdminDashboardProps) {
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  if (!adminToken) {
    return (
      <AdminLogin
        apiUrl={apiUrl}
        publicAnonKey={publicAnonKey}
        onSuccess={(token) => {
          try {
            localStorage.setItem(ADMIN_TOKEN_KEY, token);
          } catch {}
          setAdminToken(token);
        }}
        onCancel={() => onNavigate('home')}
      />
    );
  }

  return (
    <AdminDashboardAuthed
      products={products}
      onNavigate={onNavigate}
      apiUrl={apiUrl}
      publicAnonKey={publicAnonKey}
      adminToken={adminToken}
      onLogout={() => {
        try {
          localStorage.removeItem(ADMIN_TOKEN_KEY);
        } catch {}
        setAdminToken(null);
      }}
      onProductsChanged={onProductsChanged}
    />
  );
}

function AdminLogin({
  apiUrl,
  publicAnonKey,
  onSuccess,
  onCancel,
}: {
  apiUrl: string;
  publicAnonKey: string;
  onSuccess: (token: string) => void;
  onCancel: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resp = await fetch(`${apiUrl}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.token) {
        setError(data.error || 'Login failed');
        return;
      }
      onSuccess(data.token);
    } catch (err: any) {
      setError(err?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-surface-white rounded-2xl shadow-sm border border-brand-primary/5 p-8">
        <div className="w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="text-brand-accent" size={20} />
        </div>
        <h1 className="text-2xl font-['Syne'] font-bold text-center text-brand-primary">
          Admin Login
        </h1>
        <p className="text-center text-sm text-text-secondary mt-1 mb-6">
          Restricted area. Admin credentials required.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="block text-xs font-semibold text-text-secondary mb-1">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cicada.com"
              className="admin-input"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-text-secondary mb-1">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="admin-input"
            />
          </label>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In to Admin'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2 text-sm text-text-secondary hover:text-brand-primary"
          >
            ← Back to Store
          </button>
        </form>

        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
          <strong>Demo credentials:</strong><br />
          Email: admin@cicada.com<br />
          Password: cicada2026
        </div>

        <style>{`
          .admin-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid rgba(26,26,46,0.1);
            border-radius: 0.5rem;
            font-size: 0.875rem;
            outline: none;
          }
          .admin-input:focus { border-color: #E94560; }
        `}</style>
      </div>
    </div>
  );
}

function AdminDashboardAuthed({
  products,
  onNavigate,
  apiUrl,
  publicAnonKey,
  adminToken,
  onLogout,
  onProductsChanged,
}: {
  products: any[];
  onNavigate: (page: string) => void;
  apiUrl: string;
  publicAnonKey: string;
  adminToken: string;
  onLogout: () => void;
  onProductsChanged: () => void;
}) {
  const [tab, setTab] = useState<TabKey>('products');
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [localProducts, setLocalProducts] = useState<any[]>(products);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const stats = useMemo(() => {
    const totalProducts = localProducts?.length || 0;
    const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
    const totalOrders = revenueData.reduce((s, d) => s + d.orders, 0);
    return { totalProducts, totalRevenue, totalOrders };
  }, [localProducts]);

  const filteredProducts = (localProducts || []).filter(
    (p) => p?.name?.toLowerCase().includes(search.toLowerCase()) ?? false,
  );

  const navItems: { key: TabKey; label: string; icon: any }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'orders', label: 'Orders', icon: ShoppingBag },
    { key: 'customers', label: 'Customers', icon: Users },
  ];

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const prev = localProducts;
    setLocalProducts((list) => list.filter((p) => p.id !== id));
    try {
      const resp = await fetch(`${apiUrl}/admin/products/${id}`, {
        method: 'DELETE',
        headers: adminHeaders(adminToken, publicAnonKey),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data.error || `Delete failed (${resp.status})`);
      onProductsChanged();
    } catch (err: any) {
      console.error('Delete product error:', err);
      setLocalProducts(prev);
      alert(err?.message || 'Failed to delete product');
    }
  };

  const handleSave = async (product: any, isNew: boolean) => {
    try {
      const url = isNew
        ? `${apiUrl}/admin/products`
        : `${apiUrl}/admin/products/${product.id}`;
      const resp = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: adminHeaders(adminToken, publicAnonKey),
        body: JSON.stringify(product),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data.error || `Save failed (${resp.status})`);

      const saved = data.product;
      if (saved) {
        setLocalProducts((list) => {
          if (isNew) return [saved, ...list];
          return list.map((p) => (p.id === saved.id ? saved : p));
        });
      }

      setEditingProduct(null);
      setShowAddModal(false);
      onProductsChanged();
    } catch (err: any) {
      console.error('Save product error:', err);
      alert(err?.message || 'Failed to save product');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-['Syne'] font-bold text-brand-primary">
              Admin Dashboard
            </h1>
            <p className="text-text-secondary mt-1">
              Manage your store, track orders, and analyze performance
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 text-sm border border-brand-primary/20 rounded-lg hover:bg-brand-primary hover:text-primary-foreground transition-all"
            >
              ← Store
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm border border-brand-accent text-brand-accent rounded-lg hover:bg-brand-accent hover:text-primary-foreground transition-all flex items-center gap-2"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 border-b border-brand-primary/10">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
                tab === key
                  ? 'border-brand-accent text-brand-accent'
                  : 'border-transparent text-text-secondary hover:text-brand-primary'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {tab === 'overview' && <Overview stats={stats} />}

        {tab === 'products' && (
          <ProductsTab
            products={filteredProducts}
            search={search}
            setSearch={setSearch}
            onAdd={() => setShowAddModal(true)}
            onEdit={(p) => setEditingProduct(p)}
            onDelete={handleDelete}
          />
        )}

        {tab === 'orders' && <OrdersTab />}
        {tab === 'customers' && <CustomersTab />}
      </div>

      {(editingProduct || showAddModal) && (
        <ProductFormModal
          product={editingProduct}
          isNew={!editingProduct}
          onClose={() => {
            setEditingProduct(null);
            setShowAddModal(false);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  positive = true,
}: {
  label: string;
  value: string;
  delta: string;
  icon: any;
  positive?: boolean;
}) {
  return (
    <div className="bg-surface-white rounded-xl p-6 shadow-sm border border-brand-primary/5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent">
          <Icon size={20} />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-semibold ${
            positive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {delta}
        </div>
      </div>
      <p className="text-text-secondary text-sm mb-1">{label}</p>
      <p className="text-2xl font-['Syne'] font-bold text-brand-primary">{value}</p>
    </div>
  );
}

function Overview({ stats }: { stats: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={`₹${(stats.totalRevenue / 1000).toFixed(1)}k`}
          delta="+12.4%"
          icon={DollarSign}
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders.toString()}
          delta="+8.2%"
          icon={ShoppingBag}
        />
        <StatCard
          label="Products"
          value={stats.totalProducts.toString()}
          delta="+3.1%"
          icon={Package}
        />
        <StatCard
          label="Conversion"
          value="3.24%"
          delta="-0.4%"
          icon={TrendingUp}
          positive={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-white rounded-xl p-6 shadow-sm border border-brand-primary/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Syne'] font-bold text-brand-primary">Revenue</h3>
            <span className="text-xs text-text-secondary">Last 6 months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart key="revenue-line" data={revenueData.map((d) => ({ ...d }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#E94560"
                  strokeWidth={3}
                  dot={{ fill: '#E94560', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-white rounded-xl p-6 shadow-sm border border-brand-primary/5">
          <h3 className="font-['Syne'] font-bold text-brand-primary mb-4">By Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ background: c.color }} />
                  <span className="text-text-secondary">{c.name}</span>
                </div>
                <span className="font-semibold">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface-white rounded-xl p-6 shadow-sm border border-brand-primary/5">
        <h3 className="font-['Syne'] font-bold text-brand-primary mb-4">Orders Volume</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart key="orders-bar" data={revenueData.map((d) => ({ ...d }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip />
              <Bar dataKey="orders" fill="#1A1A2E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ProductsTab({
  products,
  search,
  setSearch,
  onAdd,
  onEdit,
  onDelete,
}: {
  products: any[];
  search: string;
  setSearch: (s: string) => void;
  onAdd: () => void;
  onEdit: (p: any) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-surface-white rounded-xl shadow-sm border border-brand-primary/5 overflow-hidden">
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-3 justify-between border-b border-brand-primary/5">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 border border-brand-primary/10 rounded-lg text-sm focus:outline-none focus:border-brand-accent"
          />
        </div>
        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-accent text-primary-foreground rounded-lg text-sm font-bold hover:bg-opacity-90 shadow-md whitespace-nowrap"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-primary/5 text-left">
            <tr>
              <th className="px-4 sm:px-6 py-3 font-semibold text-text-secondary">Product</th>
              <th className="px-4 py-3 font-semibold text-text-secondary hidden md:table-cell">
                Category
              </th>
              <th className="px-4 py-3 font-semibold text-text-secondary">Price</th>
              <th className="px-4 py-3 font-semibold text-text-secondary hidden sm:table-cell">
                Stock
              </th>
              <th className="px-4 py-3 font-semibold text-text-secondary text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-text-secondary">
                  No products found
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-t border-brand-primary/5 hover:bg-brand-primary/[0.02]"
              >
                <td className="px-4 sm:px-6 py-3">
                  <div className="flex items-center gap-3">
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <span className="font-semibold text-brand-primary line-clamp-1">
                      {p.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary hidden md:table-cell">
                  {p.category || '—'}
                </td>
                <td className="px-4 py-3 font-['JetBrains_Mono']">
                  ₹{p.salePrice || p.price}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      (p.stock ?? 10) > 5
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {p.stock ?? 10} in stock
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-opacity-90"
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-primary-foreground rounded-lg text-xs font-semibold hover:bg-red-600"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductFormModal({
  product,
  isNew,
  onClose,
  onSave,
}: {
  product: any | null;
  isNew: boolean;
  onClose: () => void;
  onSave: (p: any, isNew: boolean) => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    category: product?.category || 'Tops',
    price: product?.price || 0,
    salePrice: product?.salePrice || '',
    image: product?.image || '',
    stock: product?.stock ?? 10,
    badge: product?.badge || '',
    rating: product?.rating ?? 4.5,
    reviews: product?.reviews ?? 0,
    sizes: (product?.sizes || ['S', 'M', 'L', 'XL']).join(','),
    colors: (product?.colors || ['Black', 'White']).join(','),
    id: product?.id,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: any = {
      ...form,
      price: Number(form.price) || 0,
      salePrice: form.salePrice === '' ? null : Number(form.salePrice),
      stock: Number(form.stock) || 0,
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      sizes: form.sizes.split(',').map((s: string) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((s: string) => s.trim()).filter(Boolean),
    };
    if (isNew) delete payload.id;
    await onSave(payload, isNew);
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-white rounded-2xl w-full max-w-2xl my-8 p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-brand-primary p-1"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-['Syne'] font-bold text-brand-primary mb-6">
          {isNew ? 'Add Product' : 'Edit Product'}
        </h2>

        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Name" full>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="prod-input"
            />
          </FormField>
          <FormField label="Brand">
            <input
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="prod-input"
            />
          </FormField>
          <FormField label="Category">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="prod-input"
            >
              {['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Price (₹)">
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value as any })}
              className="prod-input"
            />
          </FormField>
          <FormField label="Sale Price (₹)">
            <input
              type="number"
              value={form.salePrice}
              onChange={(e) => setForm({ ...form, salePrice: e.target.value as any })}
              className="prod-input"
            />
          </FormField>
          <FormField label="Stock">
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value as any })}
              className="prod-input"
            />
          </FormField>
          <FormField label="Badge">
            <select
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              className="prod-input"
            >
              <option value="">None</option>
              <option value="NEW">NEW</option>
              <option value="SALE">SALE</option>
              <option value="BESTSELLER">BESTSELLER</option>
            </select>
          </FormField>
          <FormField label="Image URL" full>
            <input
              required
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
              className="prod-input"
            />
          </FormField>
          <FormField label="Sizes (comma-separated)" full>
            <input
              value={form.sizes}
              onChange={(e) => setForm({ ...form, sizes: e.target.value })}
              placeholder="S,M,L,XL"
              className="prod-input"
            />
          </FormField>
          <FormField label="Colors (comma-separated)" full>
            <input
              value={form.colors}
              onChange={(e) => setForm({ ...form, colors: e.target.value })}
              placeholder="Black,White,Red"
              className="prod-input"
            />
          </FormField>

          <div className="sm:col-span-2 flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-brand-primary/20 rounded-lg text-sm font-semibold hover:bg-brand-primary/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-brand-accent text-primary-foreground rounded-lg text-sm font-semibold hover:bg-opacity-90 disabled:opacity-60"
            >
              {saving ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
            </button>
          </div>
        </form>

        <style>{`
          .prod-input {
            width: 100%;
            padding: 0.6rem 0.75rem;
            border: 1px solid rgba(26,26,46,0.1);
            border-radius: 0.5rem;
            font-size: 0.875rem;
            outline: none;
          }
          .prod-input:focus { border-color: #E94560; }
        `}</style>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
  full = false,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="block text-xs font-semibold text-text-secondary mb-1">{label}</span>
      {children}
    </label>
  );
}

function statusClasses(status: string) {
  switch (status) {
    case 'Delivered':
      return 'bg-green-100 text-green-700';
    case 'Shipped':
      return 'bg-blue-100 text-blue-700';
    case 'Processing':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function OrdersTab() {
  return (
    <div className="bg-surface-white rounded-xl shadow-sm border border-brand-primary/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-primary/5 text-left">
            <tr>
              <th className="px-4 sm:px-6 py-3 font-semibold text-text-secondary">Order ID</th>
              <th className="px-4 py-3 font-semibold text-text-secondary">Customer</th>
              <th className="px-4 py-3 font-semibold text-text-secondary">Total</th>
              <th className="px-4 py-3 font-semibold text-text-secondary hidden sm:table-cell">
                Date
              </th>
              <th className="px-4 py-3 font-semibold text-text-secondary">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((o) => (
              <tr key={o.id} className="border-t border-brand-primary/5">
                <td className="px-4 sm:px-6 py-3 font-['JetBrains_Mono'] text-brand-primary">
                  {o.id}
                </td>
                <td className="px-4 py-3">{o.customer}</td>
                <td className="px-4 py-3 font-['JetBrains_Mono']">₹{o.total}</td>
                <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">{o.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses(
                      o.status,
                    )}`}
                  >
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomersTab() {
  return (
    <div className="bg-surface-white rounded-xl shadow-sm border border-brand-primary/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-primary/5 text-left">
            <tr>
              <th className="px-4 sm:px-6 py-3 font-semibold text-text-secondary">Customer</th>
              <th className="px-4 py-3 font-semibold text-text-secondary hidden sm:table-cell">
                Email
              </th>
              <th className="px-4 py-3 font-semibold text-text-secondary">Orders</th>
              <th className="px-4 py-3 font-semibold text-text-secondary">Spent</th>
            </tr>
          </thead>
          <tbody>
            {mockCustomers.map((c) => (
              <tr key={c.id} className="border-t border-brand-primary/5">
                <td className="px-4 sm:px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-accent/10 flex items-center justify-center font-semibold text-brand-accent">
                      {c.name.charAt(0)}
                    </div>
                    <span className="font-semibold">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">{c.email}</td>
                <td className="px-4 py-3">{c.orders}</td>
                <td className="px-4 py-3 font-['JetBrains_Mono']">₹{c.spent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
