// CONTEXTO GLOBAL DO APLICATIVO - PLATAFORMA CONSOLIDAR
// Gerencia Usuários, Carrinho, Favoritos, Pesquisas e Notificações (Toast)

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { dbAuth, dbNgos, dbProducts, dbOrders, dbReviews } from '../services/db';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ products: [], ngos: [] });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. CARREGAMENTO INICIAL E SINCRONIZAÇÃO DE DADOS
  const refreshAllData = useCallback(async () => {
    try {
      const fetchedNgos = await dbNgos.getAll();
      const fetchedProducts = await dbProducts.getAll();
      const fetchedReviews = await dbReviews.getAll();
      
      setNgos(fetchedNgos);
      // Mantém apenas produtos ativos para exibição geral (admin vê tudo)
      setProducts(fetchedProducts);
      setReviews(fetchedReviews);
      
      // Carrega usuário atual
      const loggedUser = await dbAuth.getCurrentUser();
      if (loggedUser) {
        setCurrentUser(loggedUser);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do banco:", error);
    } finally {
      setGlobalLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();

    // Carrega carrinho e favoritos salvos localmente
    const savedCart = localStorage.getItem('consolidar_cart_items');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }

    const savedFavs = localStorage.getItem('consolidar_favs');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error(e);
      }
    }
  }, [refreshAllData]);

  // Persiste carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('consolidar_cart_items', JSON.stringify(cart));
  }, [cart]);

  // Persiste favoritos no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('consolidar_favs', JSON.stringify(favorites));
  }, [favorites]);

  // 2. SISTEMA DE TOAST NOTIFICATIONS (MENSAGENS FLUTUANTES)
  const showToast = useCallback((message, type = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove em 4 segundos
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 3. SISTEMA DE AUTENTICAÇÃO
  const login = async (email, password) => {
    setGlobalLoading(true);
    try {
      const user = await dbAuth.login(email, password);
      setCurrentUser(user);
      showToast(`Bem-vindo(a) de volta, ${user.name}!`, 'success');
      return user;
    } catch (error) {
      showToast(error.message || 'Erro ao efetuar login.', 'error');
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  const register = async (name, email, password, profileImage, userType) => {
    setGlobalLoading(true);
    try {
      const user = await dbAuth.register(name, email, password, profileImage, userType);
      setCurrentUser(user);
      showToast('Cadastro realizado com sucesso!', 'success');
      return user;
    } catch (error) {
      showToast(error.message || 'Erro ao efetuar cadastro.', 'error');
      throw error;
    } finally {
      setGlobalLoading(false);
    }
  };

  const logout = async () => {
    try {
      await dbAuth.logout();
      setCurrentUser(null);
      setCart([]);
      setFavorites([]);
      showToast('Sessão encerrada com sucesso.', 'info');
    } catch (error) {
      showToast('Erro ao sair.', 'error');
    }
  };

  const recoverPassword = async (email) => {
    try {
      const message = await dbAuth.recoverPassword(email);
      showToast(message, 'success');
      return true;
    } catch (error) {
      showToast(error.message || 'Erro ao processar solicitação.', 'error');
      throw error;
    }
  };

  const updateProfile = async (updateData) => {
    if (!currentUser) return;
    try {
      const updatedUser = await dbAuth.updateProfile(currentUser.id, updateData);
      setCurrentUser(updatedUser);
      showToast('Perfil atualizado com sucesso!', 'success');
      return updatedUser;
    } catch (error) {
      showToast(error.message || 'Erro ao atualizar perfil.', 'error');
      throw error;
    }
  };

  // 4. SISTEMA DE PESQUISA GLOBAL (REAL-TIME AUTOCOMPLETE & SUGGESTIONS)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ products: [], ngos: [] });
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Busca nos produtos ativos
    const matchedProducts = products.filter(p => 
      p.active && (p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query))
    );

    // Busca nas ONGs
    const matchedNgos = ngos.filter(n => 
      n.name.toLowerCase().includes(query) || n.description.toLowerCase().includes(query)
    );

    setSearchResults({
      products: matchedProducts.slice(0, 5), // Limita sugestões
      ngos: matchedNgos.slice(0, 5)
    });
  }, [searchQuery, products, ngos]);

  // 5. CARRINHO DE COMPRAS
  const addToCart = (product, quantityToAdd = 1) => {
    if (product.stock <= 0) {
      showToast('Este produto está esgotado.', 'error');
      return;
    }

    // Busca quantidade atual já adicionada ao carrinho
    const existingCartItem = cart.find(item => item.product.id === product.id);
    const currentQtyInCart = existingCartItem ? existingCartItem.quantity : 0;
    const targetQty = currentQtyInCart + quantityToAdd;

    // Garante que não ultrapassa o estoque
    if (targetQty > product.stock) {
      showToast(`Desculpe, temos apenas ${product.stock} unidades em estoque.`, 'error');
      return;
    }

    if (existingCartItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: targetQty }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: quantityToAdd }]);
    }

    const ngoName = ngos.find(n => n.id === product.ngo_id)?.name || 'ONG parceira';
    showToast(`${product.name} adicionado ao carrinho!`, 'success');
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product.id !== productId));
    showToast('Produto removido do carrinho.', 'info');
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = cart.find(i => i.product.id === productId);
    if (!item) return;

    if (newQuantity > item.product.stock) {
      showToast(`Estoque insuficiente. Temos apenas ${item.product.stock} unidades.`, 'error');
      return;
    }

    setCart(cart.map(i =>
      i.product.id === productId
        ? { ...i, quantity: newQuantity }
        : i
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  // 6. FAVORITOS
  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
      showToast('Removido dos favoritos.', 'info');
    } else {
      setFavorites([...favorites, productId]);
      showToast('Adicionado aos favoritos!', 'success');
    }
  };

  // 7. FINALIZAÇÃO DA COMPRA (CHECKOUT SIMULADO COM CÁLCULO DE DOAÇÃO)
  const checkout = async (addressDetails, paymentDetails) => {
    if (!currentUser) {
      showToast('Faça login para finalizar a compra.', 'error');
      return false;
    }

    if (cart.length === 0) {
      showToast('Seu carrinho está vazio.', 'error');
      return false;
    }

    // Calcula totais
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const donationTotal = cart.reduce((sum, item) => {
      const itemPrice = item.product.price * item.quantity;
      return sum + (itemPrice * (item.product.donation_percentage / 100));
    }, 0);

    const orderData = {
      user_id: currentUser.id,
      total_amount: subtotal,
      donation_amount: donationTotal,
      address: `${addressDetails.address}, nº ${addressDetails.number} ${addressDetails.complement ? '- ' + addressDetails.complement : ''} - ${addressDetails.city}/${addressDetails.state}`,
      zip_code: addressDetails.zip_code,
      installments: paymentDetails.installments || 1,
      items: cart.map(item => ({
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        ngo_id: item.product.ngo_id,
        donation_percentage: item.product.donation_percentage
      }))
    };

    try {
      const order = await dbOrders.create(orderData);
      
      // Sincroniza dados localmente de forma assíncrona para atualizar estoques e ONGs
      await refreshAllData();
      
      // Limpa o carrinho
      clearCart();
      
      // Executa micro-animação festiva de confete
      if (typeof window !== 'undefined' && window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      showToast('Compra finalizada com sucesso! Obrigado por apoiar nossas ONGs!', 'success');
      return order;
    } catch (error) {
      showToast('Erro ao processar a compra. Tente novamente.', 'error');
      console.error(error);
      return false;
    }
  };

  // 8. ENVIO DE AVALIAÇÃO COM ATUALIZAÇÃO DENTRO DA APLICAÇÃO
  const submitReview = async (productId, rating, comment) => {
    if (!currentUser) {
      showToast('Faça login para avaliar este produto.', 'error');
      return false;
    }

    const reviewData = {
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_avatar: currentUser.profile_image,
      product_id: productId,
      product_name: products.find(p => p.id === productId)?.name || 'Produto',
      rating,
      comment
    };

    try {
      await dbReviews.create(reviewData);
      showToast('Avaliação enviada com sucesso! Obrigado pelo feedback.', 'success');
      await refreshAllData();
      return true;
    } catch (error) {
      showToast('Erro ao enviar avaliação.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        ngos,
        products,
        reviews,
        cart,
        favorites,
        toasts,
        globalLoading,
        searchQuery,
        searchResults,
        setSearchQuery,
        isCartOpen,
        setIsCartOpen,
        refreshAllData,
        login,
        register,
        logout,
        recoverPassword,
        updateProfile,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleFavorite,
        checkout,
        submitReview,
        addToast: showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};
