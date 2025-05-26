import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, ShoppingBag, TrendingUp, AlertCircle, LogOut, Home, Save } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Product, Size } from '../types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [localInventory, setLocalInventory] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    lowStock: 0,
    outOfStock: 0
  });

  useEffect(() => {
    checkAuth();
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
      
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;
      setProducts(productsData || []);

      if (productsData && productsData.length > 0 && !selectedProduct) {
        setSelectedProduct(productsData[0].id);
      }

      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select('*');

      if (inventoryError) throw inventoryError;
      setInventory(inventoryData || []);
      setLocalInventory(inventoryData || []);

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
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const formatCurrency = (value: string) => {
    // Remove any non-digit characters
    const numbers = value.replace(/\D/g, '');
    
    // Convert to cents, then to reais
    const amount = parseFloat(numbers) / 100;
    
    // Format as currency
    return new Intl.NumberFormat('pt-BR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleInventoryChange = (productId: string, size: Size, field: 'quantity' | 'price', value: string) => {
    setLocalInventory(prev => {
      const newInventory = [...prev];
      const index = newInventory.findIndex(item => item.product_id === productId && item.size === size);
      
      let processedValue = value;
      if (field === 'price') {
        processedValue = formatCurrency(value);
      }
      
      if (index === -1) {
        newInventory.push({
          product_id: productId,
          size,
          available_quantity: field === 'quantity' ? parseInt(value) || 0 : 0,
          price: field === 'price' ? parseFloat(processedValue.replace(/\./g, '').replace(',', '.')) || 0 : 0
        });
      } else {
        newInventory[index] = {
          ...newInventory[index],
          [field === 'quantity' ? 'available_quantity' : 'price']: 
            field === 'quantity' 
              ? parseInt(value) || 0 
              : parseFloat(processedValue.replace(/\./g, '').replace(',', '.')) || 0
        };
      }
      
      return newInventory;
    });
  };

  const saveInventory = async () => {
    try {
      setIsSaving(true);
      setError(null);

      for (const item of localInventory) {
        const { error } = await supabase
          .from('inventory')
          .upsert({
            product_id: item.product_id,
            size: item.size,
            available_quantity: item.available_quantity,
            price: item.price
          }, {
            onConflict: 'product_id,size'
          });

        if (error) throw error;
      }

      await fetchData();
      toast.success('Estoque atualizado com sucesso!');
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  const getInventoryItem = (productId: string, size: Size) => {
    return localInventory.find(item => item.product_id === productId && item.size === size) || {
      available_quantity: 0,
      price: 0
    };
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
        <ToastContainer position="top-right" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="flex items-center gap-2 text-warm-gray-600 hover:text-primary transition-colors"
              >
                <Home size={20} />
                <span>Voltar ao site</span>
              </Link>
              <h1 className="font-heading text-3xl font-bold">Painel Administrativo</h1>
            </div>
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

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gerenciar Estoque</h2>
              <button
                onClick={saveInventory}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} className="mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>

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
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div className="space-y-6">
                {['80ml', '120ml', '250ml', '500ml', '1000ml'].map((size) => {
                  const inventoryItem = getInventoryItem(selectedProduct, size as Size);

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
                            value={inventoryItem.available_quantity}
                            onChange={(e) => handleInventoryChange(
                              selectedProduct,
                              size as Size,
                              'quantity',
                              e.target.value
                            )}
                            className="w-full p-2 border border-warm-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-warm-gray-600 mb-1">
                            Preço (R$)
                          </label>
                          <input
                            type="text"
                            value={formatCurrency(String(inventoryItem.price * 100))}
                            onChange={(e) => handleInventoryChange(
                              selectedProduct,
                              size as Size,
                              'price',
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