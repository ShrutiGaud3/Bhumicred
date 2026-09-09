import { api } from '../../../services/api.js';

export const marketplaceService = {
  /**
   * Fetch all products with query parameters (category, search, sort, minPrice, maxPrice)
   */
  async getProducts(params = {}) {
    const response = await api.get('/marketplace/products', { params });
    return response.data;
  },

  /**
   * Fetch product by ID or slug
   */
  async getProductById(id) {
    const response = await api.get(`/marketplace/products/${id}`);
    return response.data;
  },

  /**
   * Create product (Admin / Seller)
   */
  async createProduct(productData) {
    const response = await api.post('/marketplace/products', productData);
    return response.data;
  },

  /**
   * Update product (Admin / Seller)
   */
  async updateProduct(id, productData) {
    const response = await api.put(`/marketplace/products/${id}`, productData);
    return response.data;
  },

  /**
   * Place an order
   */
  async createOrder(orderData) {
    const response = await api.post('/marketplace/orders', orderData);
    return response.data;
  },

  /**
   * Fetch user orders
   */
  async getOrders(params = {}) {
    const response = await api.get('/marketplace/orders', { params });
    return response.data;
  },

  /**
   * Fetch single order details
   */
  async getOrderById(id) {
    const response = await api.get(`/marketplace/orders/${id}`);
    return response.data;
  },

  /**
   * Update order fulfillment status (Partner / Admin)
   */
  async updateOrderStatus(id, statusData) {
    const response = await api.patch(`/marketplace/orders/${id}/status`, statusData);
    return response.data;
  },

  /**
   * Fetch marketplace statistics (Admin / Partner)
   */
  async getStats() {
    const response = await api.get('/marketplace/stats');
    return response.data;
  },
};

export default marketplaceService;
