import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, ShoppingBag, TrendingUp, AlertCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Product, Size } from '../types';
import { products as frontendProducts } from '../data/products';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    lowStock: 0,
    outOfStock: 0
  });

  useEffect(() => {
    checkAuth();
    if (frontendProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(frontendProducts[0].id);
    }
  }, []);

  const checkAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      navigate('/login');
      return;
    }
    fetchData();
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch inventory
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select('*');

      if (inventoryError) throw inventoryError;

      setInventory(inventoryData || []);

      // Fetch stats
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_amount');

      const totalOrders = ordersData?.length || 0;
      const totalRevenue = ordersData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      const lowStockItems = inventoryData?.filter(item => item.available_quantity < 5).length || 0;
      const outOfStockItems = inventoryData?.filter(item => item.available_quantity === 0).length || 0;

      setStats({
        totalOrders,
        totalRevenue,
        lowStock: lowStockItems,
        outOfStock: outOfStockItems
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const updateInventory = async (productId: string, size: Size, quantity: number | string, price: number | string) => {
    try {
      // Validate product exists
      const productExists = frontendProducts.some(p => p.id === productId);
      if (!productExists) {
        throw new Error('Produto inválido selecionado');
      }

      // Ensure quantity is a valid number and not null
      const validQuantity = Math.max(0, parseInt(quantity.toString()) || 0);
      
      // Ensure price is a valid number
      const validPrice = parseFloat(price.toString()) || 0;

      const { error } = await supabase
        .from('inventory')
        .upsert({
          product_id: productId,
          size,
          available_quantity: validQuantity,
          price: validPrice
        }, {
          onConflict: 'product_id,size'
        });

      if (error) throw error;
      
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-heading text-3xl font-bold">Painel Administrativo</h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-warm-gray-100 hover:bg-warm-gray-200 rounded-lg transition-colors"
            >
              <LogOut size={20} className="mr-2" />
              Sair
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
              {error}
            </div>
          )}

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-warm-gray-500">Total de Pedidos</p>
                  <h3 className="text-2xl font-semibold">{stats.totalOrders}</h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <ShoppingBag className="text-primary" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-warm-gray-500">Receita Total</p>
                  <h3 className="text-2xl font-semibold">
                    R$ {stats.totalRevenue.toFixed(2)}
                  </h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-warm-gray-500">Estoque Baixo</p>
                  <h3 className="text-2xl font-semibold">{stats.lowStock}</h3>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <AlertCircle className="text-amber-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-warm-gray-500">Fora de Estoque</p>
                  <h3 className="text-2xl font-semibold">{stats.outOfStock}</h3>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <Package className="text-red-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Gerenciar Estoque</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-warm-gray-700 mb-2">
                Selecione o Produto
              </label>
              <select
                value={selectedProduct || ''}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full p-2 border border-warm-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione um produto...</option>
                {frontendProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div className="space-y-6">
                {['80ml', '120ml', '250ml', '500ml', '1000ml'].map((size) => {
                  const inventoryItem = inventory.find(
                    item => item.product_id === selectedProduct && item.size === size
                  );
                  const product = frontendProducts.find(p => p.id === selectedProduct);
                  const defaultPrice = product ? product.prices[size as Size] : 0;

                  return (
                    <div key={size} className="flex items-center gap-4 p-4 bg-warm-gray-50 rounded-lg">
                      <div className="w-24">
                        <span className="font-medium">{size}</span>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-warm-gray-600 mb-1">
                            Quantidade
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={inventoryItem?.available_quantity || 0}
                            onChange={(e) => updateInventory(
                              selectedProduct,
                              size as Size,
                              e.target.value,
                              inventoryItem?.price || defaultPrice
                            )}
                            className="w-full p-2 border border-warm-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-warm-gray-600 mb-1">
                            Preço (R$)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={inventoryItem?.price || defaultPrice}
                            onChange={(e) => updateInventory(
                              selectedProduct,
                              size as Size,
                              inventoryItem?.available_quantity || 0,
                              e.target.value
                            )}
                            className="w-full p-2 border border-warm-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;