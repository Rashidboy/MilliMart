import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { User, Product, Review, CartItem, Order, Page, AdminTab } from '../types';

interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (phone: string, password: string) => { success: boolean; isAdmin: boolean };
  logout: () => void;
  register: (phone: string, password: string, name: string) => { success: boolean; message: string };

  // Navigation
  currentPage: Page;
  setCurrentPage: (p: Page) => void;
  selectedProductId: string | null;
  navigateToProduct: (id: string) => void;

  // Products
  products: Product[];
  productsLoading: boolean;
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Reviews
  reviews: Review[];
  reviewsLoading: boolean;
  addReview: (r: Omit<Review, 'id' | 'date' | 'status'>) => void;
  deleteReview: (id: string) => void;
  toggleReviewStatus: (id: string) => void;

  // Cart
  cartItems: CartItem[];
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Orders
  orders: Order[];
  addOrder: (o: Omit<Order, 'id' | 'date' | 'status'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;

  // Users
  users: User[];

  // Modals
  showLoginModal: boolean;
  setShowLoginModal: (v: boolean) => void;
  showReviewModal: boolean;
  setShowReviewModal: (v: boolean) => void;
  showCartSidebar: boolean;
  setShowCartSidebar: (v: boolean) => void;
  showQuickView: string | null;
  setShowQuickView: (v: string | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Admin
  adminTab: AdminTab;
  setAdminTab: (t: AdminTab) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

const initialUsers: User[] = [
  { id: 'u1', phone: '998901234567', password: 'admin', name: 'Admin Boshqaruvchi', role: 'admin', createdAt: '2024-01-01' },
];

const initialOrders: Order[] = [];
const API_BASE = 'http://localhost:5000/api';
const STORAGE_KEY = 'mm_current_user';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [showQuickView, setShowQuickView] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const restored = JSON.parse(raw) as User;
      setCurrentUser(restored);
      void loadCartForUser(restored.id);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error('products request failed');
      const data = await res.json();
      setProducts((data ?? []).map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: Number(row.price),
        discount: Number(row.discount ?? 0),
        images: row.images ?? [],
        category: row.category,
        rating: Number(row.rating_avg ?? 0),
        reviewCount: Number(row.review_count ?? 0),
        stock: Number(row.stock ?? 0),
      })));
    } catch {
      setProducts([]);
    }
    setProductsLoading(false);
  }, []);

  const loadReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      if (!res.ok) throw new Error('reviews request failed');
      const data = await res.json();
      setReviews((data ?? []).map((row: any) => ({
        id: row.id,
        productId: row.product_id,
        userName: row.user_name,
        rating: Number(row.rating),
        pros: row.pros ?? '',
        cons: row.cons ?? '',
        comment: row.comment,
        imageUrl: row.image_url ?? undefined,
        date: row.date,
        status: row.status,
      })));
    } catch {
      setReviews([]);
    }
    setReviewsLoading(false);
  }, []);

  const loadCartForUser = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE}/cart/${userId}`);
      if (!res.ok) throw new Error('cart request failed');
      const data = await res.json();
      setCartItems((data ?? []).map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        productId: item.product_id,
        quantity: item.quantity,
      })));
    } catch {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      await Promise.all([loadProducts(), loadReviews()]);
    };
    void bootstrap();
  }, [loadProducts, loadReviews]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void loadProducts();
      void loadReviews();
      if (currentUser) void loadCartForUser(currentUser.id);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [currentUser, loadCartForUser, loadProducts, loadReviews]);

  const navigateToProduct = useCallback((id: string) => {
    setSelectedProductId(id);
    setCurrentPage('product');
    window.scrollTo(0, 0);
  }, []);

  // Auth
  const login = useCallback((phone: string, password: string) => {
    const clean = phone.replace(/\D/g, '');
    const user = users.find(u => u.phone === clean && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      void loadCartForUser(user.id);
      setShowLoginModal(false);
      const isAdmin = user.role === 'admin';
      if (isAdmin) { setCurrentPage('admin'); setAdminTab('overview'); }
      return { success: true, isAdmin };
    }
    return { success: false, isAdmin: false };
  }, [loadCartForUser, users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setCartItems([]);
    setCurrentPage('home');
    setSelectedProductId(null);
  }, []);

  const register = useCallback((phone: string, password: string, name: string) => {
    const clean = phone.replace(/\D/g, '');
    if (users.find(u => u.phone === clean)) return { success: false, message: 'Bu raqam bilan allaqachon ro\'yxatdan o\'tilgan!' };
    const newUser: User = { id: Date.now().toString(), phone: clean, password, name, role: 'user', createdAt: new Date().toISOString().split('T')[0] };
    setUsers((p) => [...p, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setShowLoginModal(false);
    return { success: true, message: 'Muvaffaqiyatli!' };
  }, [users]);

  // Products CRUD
  const addProduct = useCallback((p: Omit<Product, 'id'>) => {
    void fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    }).then(() => void loadProducts());
  }, [loadProducts]);

  const updateProduct = useCallback((id: string, data: Partial<Product>) => {
    void fetch(`${API_BASE}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(() => void loadProducts());
  }, [loadProducts]);

  const deleteProduct = useCallback((id: string) => {
    void fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' }).then(() => void loadProducts());
  }, [loadProducts]);

  // Reviews
  const addReview = useCallback((r: Omit<Review, 'id' | 'date' | 'status'>) => {
    void fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(r),
    }).then(async () => {
      await loadReviews();
      await loadProducts();
    });
    setShowReviewModal(false);
  }, [loadProducts, loadReviews]);

  const deleteReview = useCallback((id: string) => {
    void fetch(`${API_BASE}/reviews/${id}`, { method: 'DELETE' }).then(async () => {
      await loadReviews();
      await loadProducts();
    });
  }, [loadProducts, loadReviews]);

  const toggleReviewStatus = useCallback((id: string) => {
    const review = reviews.find((item) => item.id === id);
    if (!review) return;
    void fetch(`${API_BASE}/reviews/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: review.status === 'approved' ? 'pending' : 'approved' }),
    }).then(async () => {
      await loadReviews();
      await loadProducts();
    });
  }, [loadProducts, loadReviews, reviews]);

  // Cart
  const addToCart = useCallback((productId: string, qty = 1) => {
    if (!currentUser) return;
    const existing = cartItems.find((item) => item.productId === productId);
    if (existing) {
      void fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, productId, quantity: existing.quantity + qty }),
      }).then(() => void loadCartForUser(currentUser.id));
      return;
    }
    void fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, productId, quantity: qty }),
    }).then(() => void loadCartForUser(currentUser.id));
  }, [cartItems, currentUser, loadCartForUser]);

  const removeFromCart = useCallback((productId: string) => {
    const item = cartItems.find((cartItem) => cartItem.productId === productId);
    if (!item) return;
    void fetch(`${API_BASE}/cart/${item.id}`, { method: 'DELETE' }).then(() => {
      if (currentUser) void loadCartForUser(currentUser.id);
    });
  }, [cartItems, currentUser, loadCartForUser]);

  const updateCartQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    const item = cartItems.find((cartItem) => cartItem.productId === productId);
    if (!item || !currentUser) return;
    void fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, productId, quantity: qty }),
    }).then(() => void loadCartForUser(currentUser.id));
  }, [cartItems, currentUser, loadCartForUser, removeFromCart]);

  const clearCart = useCallback(() => {
    if (!currentUser) return;
    void fetch(`${API_BASE}/cart/user/${currentUser.id}`, { method: 'DELETE' }).then(() => {
      void loadCartForUser(currentUser.id);
    });
  }, [currentUser, loadCartForUser]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }, [cartItems, products]);

  const cartCount = useMemo(() => cartItems.reduce((s, i) => s + i.quantity, 0), [cartItems]);

  // Orders
  const addOrder = useCallback((o: Omit<Order, 'id' | 'date' | 'status'>) => {
    setOrders(prev => [{ ...o, id: 'o' + Date.now(), date: new Date().toISOString().split('T')[0], status: 'pending' }, ...prev]);
  }, []);

  const updateOrderStatus = useCallback((id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }, []);

  const value = useMemo(() => ({
    currentUser, login, logout, register,
    currentPage, setCurrentPage, selectedProductId, navigateToProduct,
    products, addProduct, updateProduct, deleteProduct,
    productsLoading,
    reviews, reviewsLoading, addReview, deleteReview, toggleReviewStatus,
    cartItems, addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount,
    orders, addOrder, updateOrderStatus,
    users,
    showLoginModal, setShowLoginModal, showReviewModal, setShowReviewModal,
    showCartSidebar, setShowCartSidebar, showQuickView, setShowQuickView,
    searchQuery, setSearchQuery,
    adminTab, setAdminTab,
  }), [
    currentUser, login, logout, register,
    currentPage, selectedProductId, navigateToProduct,
    products, addProduct, updateProduct, deleteProduct, productsLoading,
    reviews, reviewsLoading, addReview, deleteReview, toggleReviewStatus,
    cartItems, addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount,
    orders, addOrder, updateOrderStatus,
    users,
    showLoginModal, showReviewModal, showCartSidebar, showQuickView,
    searchQuery, adminTab,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
