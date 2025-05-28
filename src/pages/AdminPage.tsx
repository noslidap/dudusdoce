import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, ShoppingBag, AlertCircle, LogOut, Home, Save } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Product, Size } from '../types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [localInventory, setLocalInventory] = useState<any[]>([]);
  const [stats, setStats] = useState({
    stock: 0,
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
      setLocalInventory(inventoryData || []);

      const outOfStockItems = inventoryData?.filter(item => item.available_quantity === 0).length || 0;
      const totalStockItems = inventoryData?.reduce((sum, item) => sum + (item.available_quantity || 0), 0) || 0;

      setStats({
        stock: totalStockItems,
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

  // Função para formatar valor para moeda brasileira
  const formatToBRL = (value: number | string) => {
    if (value === '' || value === null || value === undefined) return '';
    let num = typeof value === 'string' ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : value;
    if (isNaN(num)) num = 0;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleInventoryChange = (productId: string, size: Size, field: 'quantity' | 'price', value: string) => {
    setLocalInventory(prev => {
      const newInventory = [...prev];
      const index = newInventory.findIndex(item => item.product_id === productId && item.size === size);
      if (field === 'price') {
        // Máscara de moeda: só números, monta centavos, formata BRL
        let onlyNumbers = value.replace(/\D/g, '');
        let cents = parseInt(onlyNumbers || '0', 10);
        value = (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (value === 'NaN') value = '';
      }
      if (field === 'quantity') {
        value = value.replace(/[^0-9]/g, '');
      }
      if (index === -1) {
        newInventory.push({
          product_id: productId,
          size,
          available_quantity: field === 'quantity' ? (value === '' ? '' : parseInt(value)) : 0,
          price: field === 'price' ? value : 0
        });
      } else {
        newInventory[index] = {
          ...newInventory[index],
          [field === 'quantity' ? 'available_quantity' : 'price']:
            value === '' ? '' : (field === 'quantity' ? parseInt(value) : value)
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
        const available_quantity = item.available_quantity === '' ? 0 : item.available_quantity;
        // Converter preço para float
        let price = item.price === '' ? 0 : item.price;
        if (typeof price === 'string') {
          price = parseFloat(price.replace(/\./g, '').replace(',', '.'));
        }
        const { error } = await supabase
          .from('inventory')
          .upsert({
            product_id: item.product_id,
            size: item.size,
            available_quantity,
            price
          }, {
            onConflict: 'product_id,size'
          });
        if (error) throw error;
      }
      await fetchData();
      setTimeout(() => {
        toast.success('Estoque atualizado com sucesso!', {
          position: 'top-center',
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }, 300); // Pequeno delay para garantir que o loading sumiu
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  const getInventoryItem = (productId: string, size: Size) => {
    const item = localInventory.find(item => item.product_id === productId && item.size === size);
    return item ? {
      ...item,
      price: item.price === '' ? '' : formatToBRL(item.price)
    } : {
      available_quantity: 0,
      price: formatToBRL(0)
    };
  };

  const handleProductLabelChange = async (productId: string, label: 'featured' | 'is_new', value: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ [label]: value })
        .eq('id', productId);

      if (error) throw error;

      // Atualizar o estado local
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, [label]: value } : p
      ));

      toast.success('Produto atualizado com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao atualizar produto');
      console.error(err);
    }
  };

  const handleBulkStockUpdate = async (productId: string, action: 'zero' | 'set', value?: number) => {
    try {
      setIsSaving(true);
      const sizes = ['80ml', '120ml', '250ml', '500ml', '1000ml'];
      
      // Primeiro, buscar os preços atuais
      const { data: currentInventory, error: fetchError } = await supabase
        .from('inventory')
        .select('size, price')
        .eq('product_id', productId);

      if (fetchError) throw fetchError;

      // Criar mapa de preços por tamanho
      const priceMap = new Map(
        currentInventory?.map(item => [item.size, item.price]) || []
      );

      // Preparar atualizações mantendo os preços existentes
      const updates = sizes.map(size => ({
        product_id: productId,
        size,
        available_quantity: action === 'zero' ? 0 : (value || 0),
        price: priceMap.get(size) || 0 // Manter preço existente ou usar 0 como fallback
      }));

      const { error } = await supabase
        .from('inventory')
        .upsert(updates, {
          onConflict: 'product_id,size'
        });

      if (error) throw error;

      // Atualizar o estado local
      setLocalInventory(prev => 
        prev.map(item => 
          item.product_id === productId 
            ? { ...item, available_quantity: action === 'zero' ? 0 : (value || 0) }
            : item
        )
      );

      // Mensagens personalizadas para cada ação
      const productName = products.find(p => p.id === productId)?.name || 'Produto';
      let message = '';
      
      if (action === 'zero') {
        message = `Estoque de ${productName} zerado com sucesso!`;
      } else {
        message = `Estoque de ${productName} atualizado para ${value} unidades!`;
      }

      // Primeiro atualizar os dados
      await fetchData();

      // Depois mostrar o toast
      setTimeout(() => {
        toast.success(message, {
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }, 300); // Pequeno delay para garantir que o loading sumiu

    } catch (err: any) {
      toast.error('Erro ao atualizar estoque. Tente novamente.', {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.error(err);
    } finally {
      setIsSaving(false);
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

  // Esconder menu global se estiver na página admin
  if (location.pathname.startsWith('/admin')) {
    const menu = document.getElementById('main-menu');
    if (menu) menu.style.display = 'none';
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
            <h1 className="font-heading text-3xl font-bold text-left">Painel Administrativo</h1>
            <div className="flex gap-2">
              <Link 
                to="/"
                className="flex items-center gap-2 text-warm-gray-600 hover:text-primary transition-colors bg-warm-gray-100 px-4 py-2 rounded-lg"
              >
                <Home size={20} />
                Voltar ao site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-warm-gray-100 hover:bg-warm-gray-200 rounded-lg transition-colors"
              >
                <LogOut size={20} className="mr-2" />
                Sair
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-warm-gray-500">Estoque</p>
                  <h3 className="text-2xl font-semibold">{stats.stock}</h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Package className="text-primary" size={24} />
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
                  <AlertCircle className="text-red-600" size={24} />
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
              <>
                <div className="mb-6 p-4 bg-warm-gray-50 rounded-lg">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div>
                      <h3 className="font-medium mb-3">Labels do Produto</h3>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={products.find(p => p.id === selectedProduct)?.featured || false}
                            onChange={(e) => handleProductLabelChange(selectedProduct, 'featured', e.target.checked)}
                            className="rounded border-warm-gray-300 text-primary focus:ring-primary"
                          />
                          <span>Destaque</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={products.find(p => p.id === selectedProduct)?.is_new || false}
                            onChange={(e) => handleProductLabelChange(selectedProduct, 'is_new', e.target.checked)}
                            className="rounded border-warm-gray-300 text-primary focus:ring-primary"
                          />
                          <span>Novidade</span>
                        </label>
                      </div>
                    </div>

                    <div className="border-l border-warm-gray-200 pl-6">
                      <h3 className="font-medium mb-3">Gerenciar Estoque em Massa</h3>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleBulkStockUpdate(selectedProduct, 'zero')}
                          disabled={isSaving}
                          className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          Zerar Todo Estoque
                        </button>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            placeholder="Quantidade"
                            className="w-24 px-2 py-1.5 border border-warm-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const value = parseInt((e.target as HTMLInputElement).value);
                                handleBulkStockUpdate(selectedProduct, 'set', isNaN(value) ? 0 : value);
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                              const value = parseInt(input.value);
                              handleBulkStockUpdate(selectedProduct, 'set', isNaN(value) ? 0 : value);
                            }}
                            disabled={isSaving}
                            className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                          >
                            Definir Estoque
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={inventoryItem.available_quantity === 0 ? (inventoryItem.available_quantity === '' ? '' : 0) : inventoryItem.available_quantity}
                              onChange={(e) => handleInventoryChange(
                                selectedProduct,
                                size as Size,
                                'quantity',
                                e.target.value
                              )}
                              onBlur={(e) => {
                                if (e.target.value === '') {
                                  handleInventoryChange(selectedProduct, size as Size, 'quantity', '0');
                                }
                              }}
                              className="w-full p-2 border border-warm-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-warm-gray-600 mb-1">
                              Preço (R$)
                            </label>
                            <input
                              type="text"
                              inputMode="decimal"
                              pattern="^\d{1,3}(\.\d{3})*,\d{2}$"
                              value={inventoryItem.price === 0 ? (inventoryItem.price === '' ? '' : 0) : inventoryItem.price}
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
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;