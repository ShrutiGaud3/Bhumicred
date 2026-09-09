import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  CheckCircle2,
  Trash2,
  Star,
  DollarSign,
  Package,
  RefreshCw,
  Layers,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { marketplaceService } from '../../marketplace/services/marketplaceService.js';

export const AdminMarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'BIO_FERTILIZERS',
    categoryLabel: 'Bio-Fertilizers & Nutrients',
    sellerName: 'Gujarat State Agro Nursery',
    mrp: '',
    price: '',
    stock: '100',
    description: '',
    certification: 'ICFRE Certified',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, statsRes] = await Promise.all([
        marketplaceService.getProducts({ status: 'ALL' }),
        marketplaceService.getStats(),
      ]);
      if (prodRes.data) setProducts(prodRes.data);
      if (statsRes.data) setStats(statsRes.data);
    } catch (e) {
      console.warn('Failed to load admin marketplace data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: newProduct.name,
        category: newProduct.category,
        categoryLabel: newProduct.categoryLabel,
        seller: {
          name: newProduct.sellerName,
          organization: newProduct.sellerName,
          rating: 4.9,
          isVerified: true,
        },
        pricing: {
          mrp: Number(newProduct.mrp),
          price: Number(newProduct.price),
          discountPercent: Math.round(((Number(newProduct.mrp) - Number(newProduct.price)) / Number(newProduct.mrp)) * 100),
          taxPercent: 5,
        },
        inventory: {
          stock: Number(newProduct.stock),
          unit: 'UNIT',
          lowStockThreshold: 10,
          inStock: true,
        },
        specs: {
          certification: newProduct.certification,
        },
        description: newProduct.description,
        status: 'ACTIVE',
      };

      await marketplaceService.createProduct(payload);
      setIsAddModalOpen(false);
      setNewProduct({
        name: '',
        category: 'BIO_FERTILIZERS',
        categoryLabel: 'Bio-Fertilizers & Nutrients',
        sellerName: 'Gujarat State Agro Nursery',
        mrp: '',
        price: '',
        stock: '100',
        description: '',
        certification: 'ICFRE Certified',
      });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (prod) => {
    const nextStatus = prod.status === 'ACTIVE' ? 'OUT_OF_STOCK' : 'ACTIVE';
    try {
      await marketplaceService.updateProduct(prod._id || prod.id, {
        status: nextStatus,
        'inventory.inStock': nextStatus === 'ACTIVE',
      });
      await loadData();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Marketplace & Vendor Catalog Management"
        subtitle="Catalog approvals, vendor commissions, inventory tracking, and quality assurance standards."
        backTo="/admin/dashboard"
        breadcrumbs={[
          { label: 'Admin Portal', path: '/admin/dashboard' },
          { label: 'Marketplace Master' },
        ]}
        actions={
          <Button
            variant="primary"
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4" /> Add Certified Input / Product
          </Button>
        }
      />

      {/* KPI Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Total Catalog Items</span>
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-gray-900">{stats.totalProducts}</div>
            <span className="text-xs text-emerald-700 mt-1 block">{stats.activeProducts} Active in Catalog</span>
          </Card>

          <Card className="p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Gross Merchandise (GMV)</span>
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-gray-900">
              ₹{(stats.grossMerchandiseValue || 0).toLocaleString()}
            </div>
            <span className="text-xs text-gray-400 mt-1 block">Across {stats.totalOrders} total orders</span>
          </Card>

          <Card className="p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Platform Commission (5%)</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-800">
              ₹{(stats.commissionEarned || 0).toLocaleString()}
            </div>
            <span className="text-xs text-emerald-600 mt-1 block">Retained sovereign treasury</span>
          </Card>

          <Card className="p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Fulfilled Orders</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-gray-900">{stats.completedOrders}</div>
            <span className="text-xs text-amber-600 mt-1 block">{stats.pendingOrders} in fulfillment pipeline</span>
          </Card>
        </div>
      )}

      {/* Catalog Table / Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">
          Live Marketplace Catalog ({products.length} Products)
        </h3>

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
            <p className="text-xs">Loading marketplace catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-gray-200">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">No products found in catalog</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => {
              const prodId = prod._id || prod.id;
              const price = prod.pricing?.price ?? prod.price ?? 0;
              const stock = prod.inventory?.stock ?? 100;
              const sellerName = prod.seller?.name || prod.seller || 'Verified Vendor';

              return (
                <Card
                  key={prodId}
                  className="p-6 border border-gray-200 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={prod.status === 'ACTIVE' ? 'success' : 'warning'}>
                        {prod.status}
                      </Badge>
                      <span className="text-[11px] text-gray-400 font-mono">SKU: {prod.sku || prodId.slice(-6)}</span>
                    </div>
                    <h4 className="font-bold text-base text-gray-900 line-clamp-1">{prod.name}</h4>
                    <p className="text-xs text-emerald-700 font-medium">{sellerName}</p>

                    <div className="my-4 p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-gray-100">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Farmer Price:</span>
                        <span className="font-bold text-gray-900">₹{price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Platform Commission (5%):</span>
                        <span className="font-semibold text-emerald-700">₹{Math.round(price * 0.05)}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-gray-200">
                        <span className="text-gray-500">Stock Count:</span>
                        <span className="font-bold text-gray-800">{stock} Units</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                    <span className="text-gray-500 font-medium">
                      {prod.status === 'ACTIVE' ? '● Live on Store' : '○ Out of Stock'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(prod)}
                    >
                      {prod.status === 'ACTIVE' ? 'Set Out of Stock' : 'Activate Product'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Certified Agricultural Input / Asset"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4 py-2">
          <FormInput
            label="Product / Asset Name"
            placeholder="e.g. Organic Bio-Potash Granules (50 Kg)"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <FormSelect
              label="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              options={[
                { value: 'SAPLINGS', label: 'Agroforestry Saplings' },
                { value: 'BIO_FERTILIZERS', label: 'Bio-Fertilizers & Nutrients' },
                { value: 'SOLAR_IRRIGATION', label: 'Smart Drip & Solar Pumps' },
                { value: 'ORGANIC_PESTICIDES', label: 'Organic Pest Control' },
                { value: 'SEEDS', label: 'Certified Seeds' },
                { value: 'SOIL_AMENDMENTS', label: 'Soil Amendments' },
              ]}
            />
            <FormInput
              label="Seller / Nursery Name"
              value={newProduct.sellerName}
              onChange={(e) => setNewProduct({ ...newProduct, sellerName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormInput
              label="MRP (₹)"
              type="number"
              placeholder="1200"
              value={newProduct.mrp}
              onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
              required
            />
            <FormInput
              label="Selling Price (₹)"
              type="number"
              placeholder="950"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              required
            />
            <FormInput
              label="Initial Stock"
              type="number"
              placeholder="100"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              required
            />
          </div>

          <FormInput
            label="Certification / Quality Grade"
            placeholder="e.g. ICFRE Sovereign Certified Grade A"
            value={newProduct.certification}
            onChange={(e) => setNewProduct({ ...newProduct, certification: e.target.value })}
          />

          <FormTextarea
            label="Product Description"
            placeholder="Key agronomic benefits, application instructions, dosage..."
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            required
          />

          <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              {submitting ? 'Publishing...' : 'Publish to Catalog'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMarketplacePage;
