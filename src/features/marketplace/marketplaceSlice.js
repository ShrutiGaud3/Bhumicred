import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { marketplaceService } from './services/marketplaceService.js';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('bhumicred_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('bhumicred_cart', JSON.stringify(cart));
  } catch (e) {
    console.warn('Could not persist cart:', e);
  }
};

export const fetchProducts = createAsyncThunk(
  'marketplace/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await marketplaceService.getProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'marketplace/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await marketplaceService.getProductById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product details');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'marketplace/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await marketplaceService.getOrders(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'marketplace/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await marketplaceService.getOrderById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const placeOrder = createAsyncThunk(
  'marketplace/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await marketplaceService.createOrder(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to place order');
    }
  }
);

export const fetchMarketplaceStats = createAsyncThunk(
  'marketplace/fetchMarketplaceStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await marketplaceService.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const initialState = {
  products: [],
  currentProduct: null,
  orders: [],
  currentOrder: null,
  cart: loadCartFromStorage(),
  appliedCoupon: null,
  stats: null,
  loading: false,
  orderPlacing: false,
  error: null,
};

export const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const prodId = product._id || product.id;
      const qtyToAdd = product.quantity || 1;

      const existingIndex = state.cart.findIndex((item) => (item._id || item.id) === prodId);
      if (existingIndex >= 0) {
        state.cart[existingIndex].quantity += qtyToAdd;
      } else {
        state.cart.push({
          ...product,
          _id: prodId,
          id: prodId,
          quantity: qtyToAdd,
        });
      }
      saveCartToStorage(state.cart);
    },
    removeFromCart: (state, action) => {
      const prodId = action.payload;
      state.cart = state.cart.filter((item) => (item._id || item.id) !== prodId);
      saveCartToStorage(state.cart);
    },
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find((i) => (i._id || i.id) === id);
      if (item) {
        if (quantity <= 0) {
          state.cart = state.cart.filter((i) => (i._id || i.id) !== id);
        } else {
          item.quantity = quantity;
        }
      }
      saveCartToStorage(state.cart);
    },
    clearCart: (state) => {
      state.cart = [];
      state.appliedCoupon = null;
      saveCartToStorage([]);
    },
    applyCoupon: (state, action) => {
      const code = (action.payload || '').trim().toUpperCase();
      if (
        code === 'BHUMI10' ||
        code === 'KISAN100' ||
        code === 'HARVEST15' ||
        code.startsWith('BHUMI-') ||
        code.includes('REWARD') ||
        code.includes('REFERRAL')
      ) {
        state.appliedCoupon = code;
      }
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchProductById
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchOrders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchOrderById
    builder
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      });

    // placeOrder
    builder
      .addCase(placeOrder.pending, (state) => {
        state.orderPlacing = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderPlacing = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
        state.cart = [];
        state.appliedCoupon = null;
        saveCartToStorage([]);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderPlacing = false;
        state.error = action.payload;
      });

    // fetchMarketplaceStats
    builder
      .addCase(fetchMarketplaceStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  clearCurrentProduct,
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;
