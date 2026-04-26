import { useState, useEffect } from 'react';
import { CreditCard, Lock, Check, Wallet, Landmark, Smartphone, Zap } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface PaymentPageProps {
  cart: any;
  products: any[];
  onNavigate: (page: string) => void;
  onPaymentSuccess?: () => void;
  apiUrl?: string;
  accessToken?: string | null;
}

type PaymentMethod = 'razorpay' | 'card' | 'upi' | 'wallet' | 'netbanking' | 'cod';

export default function PaymentPage({ cart, products, onNavigate, onPaymentSuccess, apiUrl, accessToken }: PaymentPageProps) {
  const [method, setMethod] = useState<PaymentMethod>('razorpay');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upi, setUpi] = useState('');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum: number, item: any) => {
    const product = products?.find((p) => p?.id === item?.productId);
    const price = product?.salePrice || product?.price || 0;
    return sum + price * (item?.quantity || 0);
  }, 0);
  const shipping = subtotal > 2000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const buildOrderItems = () =>
    items.map((item: any) => {
      const product = products?.find((p) => p?.id === item?.productId);
      return {
        productId: item.productId,
        name: product?.name,
        quantity: item.quantity,
        variant: item.variant,
        price: product?.salePrice || product?.price || 0,
      };
    });

  const persistOrder = async (extra: Record<string, any> = {}) => {
    const response = await fetch(`${apiUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items: buildOrderItems(),
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: method,
        ...extra,
      }),
    });
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || 'Failed to place order');
    return data.order;
  };

  const handleRazorpay = async () => {
    setProcessing(true);
    setErrorMsg('');
    try {
      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) throw new Error('Failed to load Razorpay checkout');

      const orderResp = await fetch(`${apiUrl}/razorpay/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ amount: total, currency: 'INR' }),
      });
      const orderData = await orderResp.json();
      if (!orderResp.ok || orderData.error) {
        throw new Error(orderData.error || 'Unable to create Razorpay order');
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        order_id: orderData.order.id,
        name: 'CICADA',
        description: `Order of ${items.length} item(s)`,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: { color: '#E94560' },
        handler: async (response: any) => {
          try {
            const verifyResp = await fetch(`${apiUrl}/razorpay/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyResp.json();
            if (!verifyResp.ok || !verifyData.verified) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
            const order = await persistOrder({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              status: 'paid',
            });
            setOrderId(order?.id || '');
            setSuccess(true);
            setProcessing(false);
            if (onPaymentSuccess) onPaymentSuccess();
          } catch (err: any) {
            console.error('Razorpay verify/persist error:', err);
            setErrorMsg(err.message || 'Verification failed');
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        console.error('Razorpay payment failed:', resp);
        setErrorMsg(resp?.error?.description || 'Payment failed');
        setProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay error:', err);
      setErrorMsg(err?.message || 'Razorpay checkout failed');
      setProcessing(false);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!apiUrl || !accessToken) {
      setErrorMsg('You must be signed in to place an order.');
      return;
    }
    if (items.length === 0) {
      setErrorMsg('Your cart is empty.');
      return;
    }

    if (method === 'razorpay') {
      await handleRazorpay();
      return;
    }

    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));

    try {
      const order = await persistOrder({ status: 'pending' });
      setOrderId(order?.id || '');
      setProcessing(false);
      setSuccess(true);
      if (onPaymentSuccess) onPaymentSuccess();
    } catch (err: any) {
      console.error('Payment/order error:', err);
      setProcessing(false);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-surface-white rounded-2xl p-8 shadow-sm border border-brand-primary/5 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-['Syne'] font-bold text-brand-primary mb-2">
            Payment Successful
          </h2>
          <p className="text-text-secondary mb-6">
            Your order of ₹{total.toLocaleString('en-IN')} has been placed successfully.
          </p>
          <div className="bg-brand-primary/5 rounded-lg p-4 mb-6 text-left space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Order ID</span>
              <span className="font-['JetBrains_Mono'] text-xs">
                {orderId || '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Payment Method</span>
              <span className="font-semibold capitalize">{method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Estimated Delivery</span>
              <span className="font-semibold">3-5 days</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="w-full px-6 py-3 bg-brand-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const methods: { key: PaymentMethod; label: string; icon: any; desc: string }[] = [
    { key: 'razorpay', label: 'Razorpay Checkout', icon: Zap, desc: 'Cards, UPI, Wallets, NetBanking' },
    { key: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
    { key: 'upi', label: 'UPI', icon: Smartphone, desc: 'GPay, PhonePe, Paytm' },
    { key: 'wallet', label: 'Wallet', icon: Wallet, desc: 'Paytm, Amazon Pay' },
    { key: 'netbanking', label: 'Net Banking', icon: Landmark, desc: 'All major banks' },
    { key: 'cod', label: 'Cash on Delivery', icon: Wallet, desc: 'Pay when you receive' },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-['Syne'] font-bold text-brand-primary">
            Payment
          </h1>
          <p className="text-text-secondary mt-1 flex items-center gap-2">
            <Lock size={14} /> Secure checkout powered by CICADA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-white rounded-xl p-4 sm:p-6 shadow-sm border border-brand-primary/5">
              <h3 className="font-['Syne'] font-bold mb-4 text-brand-primary">Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {methods.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMethod(m.key)}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all ${
                      method === m.key
                        ? 'border-brand-accent bg-brand-accent/5'
                        : 'border-brand-primary/10 hover:border-brand-primary/30'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        method === m.key
                          ? 'bg-brand-accent text-primary-foreground'
                          : 'bg-brand-primary/5 text-brand-primary'
                      }`}
                    >
                      <m.icon size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{m.label}</p>
                      <p className="text-xs text-text-secondary">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={handlePay}
              className="bg-surface-white rounded-xl p-4 sm:p-6 shadow-sm border border-brand-primary/5"
            >
              <h3 className="font-['Syne'] font-bold mb-4 text-brand-primary">
                {method === 'razorpay' && 'Billing Details'}
                {method === 'card' && 'Card Details'}
                {method === 'upi' && 'UPI Details'}
                {method === 'wallet' && 'Wallet'}
                {method === 'netbanking' && 'Net Banking'}
                {method === 'cod' && 'Cash on Delivery'}
              </h3>

              {method === 'razorpay' && (
                <div className="space-y-4">
                  <div className="p-4 bg-brand-accent/5 border border-brand-accent/20 rounded-lg text-sm text-brand-primary">
                    You'll be redirected to Razorpay's secure checkout where you can pay using any card, UPI, wallet, or net banking.
                  </div>
                  <Field label="Full Name">
                    <input
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="input-base"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      required
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="you@example.com"
                      className="input-base"
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      required
                      value={customer.phone}
                      onChange={(e) =>
                        setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                      }
                      placeholder="10-digit mobile"
                      className="input-base"
                    />
                  </Field>
                </div>
              )}

              {method === 'card' && (
                <div className="space-y-4">
                  <Field label="Card Number">
                    <input
                      required
                      value={card.number}
                      onChange={(e) =>
                        setCard({
                          ...card,
                          number: e.target.value
                            .replace(/\D/g, '')
                            .replace(/(.{4})/g, '$1 ')
                            .trim()
                            .slice(0, 19),
                        })
                      }
                      placeholder="1234 5678 9012 3456"
                      className="input-base"
                    />
                  </Field>
                  <Field label="Cardholder Name">
                    <input
                      required
                      value={card.name}
                      onChange={(e) => setCard({ ...card, name: e.target.value })}
                      placeholder="John Doe"
                      className="input-base"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry (MM/YY)">
                      <input
                        required
                        value={card.expiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                          setCard({ ...card, expiry: v });
                        }}
                        placeholder="12/28"
                        className="input-base"
                      />
                    </Field>
                    <Field label="CVV">
                      <input
                        required
                        type="password"
                        value={card.cvv}
                        onChange={(e) =>
                          setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })
                        }
                        placeholder="123"
                        className="input-base"
                      />
                    </Field>
                  </div>
                </div>
              )}

              {method === 'upi' && (
                <Field label="UPI ID">
                  <input
                    required
                    value={upi}
                    onChange={(e) => setUpi(e.target.value)}
                    placeholder="yourname@upi"
                    className="input-base"
                  />
                </Field>
              )}

              {method === 'wallet' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Paytm', 'Amazon Pay', 'Mobikwik', 'Freecharge', 'Jio Money', 'Ola Money'].map(
                    (w) => (
                      <button
                        type="button"
                        key={w}
                        className="py-3 border border-brand-primary/10 rounded-lg text-sm font-semibold hover:border-brand-accent"
                      >
                        {w}
                      </button>
                    ),
                  )}
                </div>
              )}

              {method === 'netbanking' && (
                <Field label="Select Bank">
                  <select required className="input-base">
                    <option value="">Choose a bank</option>
                    {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak', 'Yes Bank'].map(
                      (b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ),
                    )}
                  </select>
                </Field>
              )}

              {method === 'cod' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                  Pay in cash at the time of delivery. An additional ₹49 handling fee applies.
                </div>
              )}

              {errorMsg && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full mt-6 py-3 bg-brand-accent text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={16} /> Pay ₹{total.toLocaleString('en-IN')}
                  </>
                )}
              </button>

              <style>{`
                .input-base {
                  width: 100%;
                  padding: 0.75rem 1rem;
                  border: 1px solid rgba(26,26,46,0.1);
                  border-radius: 0.5rem;
                  font-size: 0.875rem;
                  outline: none;
                  transition: border-color 0.2s;
                }
                .input-base:focus {
                  border-color: #E94560;
                }
              `}</style>
            </form>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-surface-white rounded-xl p-6 shadow-sm border border-brand-primary/5 sticky top-24">
              <h3 className="font-['Syne'] font-bold mb-4 text-brand-primary">Order Summary</h3>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.length === 0 && (
                  <p className="text-text-secondary text-sm">Your cart is empty.</p>
                )}
                {items.map((item: any, i: number) => {
                  const product = products?.find((p) => p?.id === item?.productId);
                  if (!product) return null;
                  const variantKey = item?.variant ? JSON.stringify(item.variant) : '';
                  return (
                    <div key={`${item.productId}-${variantKey}-${i}`} className="flex gap-3 items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold line-clamp-1">{product.name}</p>
                        <p className="text-xs text-text-secondary">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-['JetBrains_Mono']">
                        ₹{(product.salePrice || product.price) * item.quantity}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-brand-primary/10 pt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={`₹${subtotal.toLocaleString('en-IN')}`} />
                <Row
                  label="Shipping"
                  value={shipping === 0 ? 'Free' : `₹${shipping}`}
                />
                <Row label="Tax (GST 18%)" value={`₹${tax.toLocaleString('en-IN')}`} />
                <div className="border-t border-brand-primary/10 pt-2 flex justify-between font-['Syne'] font-bold text-lg">
                  <span>Total</span>
                  <span className="text-brand-accent">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('cart')}
                className="w-full mt-4 py-2 text-sm text-text-secondary hover:text-brand-primary"
              >
                ← Back to cart
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-text-secondary mb-1">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-secondary">{label}</span>
      <span className="font-['JetBrains_Mono']">{value}</span>
    </div>
  );
}
