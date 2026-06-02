// ADAPTADOR CENTRAL DE BANCO DE DADOS - PLATAFORMA CONSOLIDAR
// Gerencia a alternância entre o Supabase real e o banco local (localStorage)

import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  INITIAL_NGOS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS
} from '../utils/seedData';

// Chaves do LocalStorage
const LS_KEYS = {
  NGOS: 'consolidar_ngos',
  PRODUCTS: 'consolidar_products',
  REVIEWS: 'consolidar_reviews',
  ORDERS: 'consolidar_orders',
  USERS: 'consolidar_users',
  CURRENT_USER: 'consolidar_current_user'
};

// Inicializa o banco de dados simulado no LocalStorage caso esteja vazio
export const initializeMockDb = () => {
  if (!localStorage.getItem(LS_KEYS.NGOS)) {
    localStorage.setItem(LS_KEYS.NGOS, JSON.stringify(INITIAL_NGOS));
  }
  if (!localStorage.getItem(LS_KEYS.PRODUCTS)) {
    localStorage.setItem(LS_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(LS_KEYS.REVIEWS)) {
    localStorage.setItem(LS_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  }
  if (!localStorage.getItem(LS_KEYS.ORDERS)) {
    localStorage.setItem(LS_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(LS_KEYS.USERS)) {
    // Semeia usuários padrão (Mariana como cliente, Admin como administrador)
    const seedUsers = [
      {
        id: "user-cust-1",
        name: "Mariana Silva",
        email: "mariana@consolidar.org.br",
        password: "password123",
        profile_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        user_type: "customer",
        points: 250,
        supported_ngos: 3,
        created_at: new Date().toISOString()
      },
      {
        id: "user-admin-1",
        name: "Admin Consolidar",
        email: "admin@consolidar.org.br",
        password: "adminpassword",
        profile_image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        user_type: "admin",
        points: 0,
        supported_ngos: 0,
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(LS_KEYS.USERS, JSON.stringify(seedUsers));
  }
};

// Executa a inicialização imediatamente
initializeMockDb();

// --- FUNÇÕES AUXILIARES MOCK ---
const getMockData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setMockData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const formatSupabaseAuthError = (error) => {
  console.error('Erro de autenticação do Supabase:', {
    status: error.status,
    code: error.code,
    message: error.message
  });

  if (error.status === 429) {
    return new Error('Limite de cadastros/e-mails do Supabase atingido. Aguarde alguns minutos ou tente novamente mais tarde.');
  }

  const message = (error.message || '').toLowerCase();
  const code = error.code || '';

  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return new Error('E-mail ou senha incorretos, ou esta conta ainda nÃ£o existe no Auth do Supabase.');
  }

  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
    return new Error('Esta conta existe, mas ainda esta marcada como nao confirmada no Supabase. Confirme o usuario no painel Auth ou rode o SQL de confirmacao.');
  }

  if (code === 'email_exists' || message.includes('already registered') || message.includes('already exists')) {
    return new Error('Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.');
  }

  if (code === 'email_provider_disabled' || code === 'signup_disabled' || message.includes('signups are disabled')) {
    return new Error('Cadastro por e-mail está desativado no Supabase. Ative em Authentication > Providers > Email.');
  }

  if (code === 'email_address_invalid' || message.includes('invalid email')) {
    return new Error('E-mail inválido para o Supabase. Use um e-mail real, não domínio de exemplo/teste.');
  }

  if (message.includes('password')) {
    return new Error('Senha inválida para as regras do Supabase. Use uma senha mais forte e tente novamente.');
  }

  return new Error(error.message || 'Erro ao autenticar no Supabase.');
};

const buildProfileFromAuthUser = (user, fallback = {}) => ({
  id: user.id,
  name: fallback.name || user.user_metadata?.name || fallback.email || user.email,
  email: fallback.email || user.email,
  profile_image: fallback.profile_image || user.user_metadata?.profile_image || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fallback.name || user.email || user.id)}`,
  user_type: fallback.user_type || user.user_metadata?.user_type || 'customer',
  points: fallback.points || 0,
  supported_ngos: fallback.supported_ngos || 0,
  created_at: user.created_at || new Date().toISOString()
});

// ============================================
// 1. SISTEMA DE AUTENTICAÇÃO E USUÁRIOS
// ============================================

export const dbAuth = {
  // Login de usuário
  async login(email, password) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw formatSupabaseAuthError(error);
      
      // Busca dados estendidos da tabela de users
      const { data: profile, error: pError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
      
      if (pError) throw new Error(pError.message || 'Erro ao buscar perfil do usuÃ¡rio.');
      if (profile) return profile;

      const profileData = buildProfileFromAuthUser(data.user, { email });
      const { data: createdProfile, error: createProfileError } = await supabase
        .from('users')
        .upsert(profileData, { onConflict: 'id' })
        .select()
        .single();

      if (createProfileError) {
        throw new Error('Login autenticado, mas o perfil nÃ£o foi encontrado/criado na tabela users. Rode o schema atualizado no Supabase e confira as policies de RLS.');
      }

      return createdProfile;
    } else {
      // Offline/Local
      const users = getMockData(LS_KEYS.USERS);
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error("E-mail ou senha incorretos.");
      }
      setMockData(LS_KEYS.CURRENT_USER, user);
      return user;
    }
  },

  // Cadastro de usuário
  async register(name, email, password, profileImage = '', userType = 'customer') {
    if (isSupabaseConfigured) {
      const profileImageUrl = profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            profile_image: profileImageUrl,
            user_type: userType
          }
        }
      });
      if (error) {
        throw formatSupabaseAuthError(error);
      }

      if (!data.user) {
        throw new Error('Cadastro criado, mas o Supabase nÃ£o retornou o usuÃ¡rio. Tente fazer login ou confirme seu e-mail.');
      }

      let activeUser = data.user;

      if (!data.session) {
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) {
          throw formatSupabaseAuthError(loginError);
        }
        activeUser = loginData.user;
      }
      
      // Cria registro na tabela users correspondente
      const profileData = buildProfileFromAuthUser(activeUser, {
        name,
        email,
        profile_image: profileImageUrl,
        user_type: userType
      });

      const { data: profile, error: pError } = await supabase
        .from('users')
        .upsert(profileData, { onConflict: 'id' })
        .select()
        .single();
      
      if (pError) {
        throw new Error('Conta criada no Auth, mas o perfil nÃ£o foi salvo na tabela users. Rode o schema atualizado no Supabase e confira as policies de RLS.');
      }
      return profile;
    } else {
      // Offline/Local
      const users = getMockData(LS_KEYS.USERS);
      if (users.some(u => u.email === email)) {
        throw new Error("Este e-mail já está cadastrado.");
      }
      
      const newUser = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
        profile_image: profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        user_type: userType,
        points: 0,
        supported_ngos: 0,
        created_at: new Date().toISOString()
      };
      
      users.push(newUser);
      setMockData(LS_KEYS.USERS, users);
      setMockData(LS_KEYS.CURRENT_USER, newUser);
      return newUser;
    }
  },

  // Recuperação de Senha
  async recoverPassword(email) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return "Um e-mail de recuperação foi enviado se o endereço estiver correto.";
    } else {
      // Offline
      const users = getMockData(LS_KEYS.USERS);
      const exists = users.some(u => u.email === email);
      if (!exists) {
        throw new Error("E-mail não cadastrado na plataforma.");
      }
      return "Simulação: Link de recuperação enviado com sucesso para " + email;
    }
  },

  // Atualizar perfil do usuário
  async updateProfile(userId, updateData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      // Offline
      const users = getMockData(LS_KEYS.USERS);
      const userIdx = users.findIndex(u => u.id === userId);
      if (userIdx === -1) throw new Error("Usuário não encontrado.");
      
      const updatedUser = { ...users[userIdx], ...updateData };
      users[userIdx] = updatedUser;
      setMockData(LS_KEYS.USERS, users);
      
      // Atualiza o current user se for o logado
      const curUser = getMockData(LS_KEYS.CURRENT_USER);
      if (curUser && curUser.id === userId) {
        setMockData(LS_KEYS.CURRENT_USER, updatedUser);
      }
      return updatedUser;
    }
  },

  // Logout
  async logout() {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } else {
      localStorage.removeItem(LS_KEYS.CURRENT_USER);
    }
  },

  // Obter usuário atual logado
  async getCurrentUser() {
    if (isSupabaseConfigured) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) return null;
      return data;
    } else {
      return getMockData(LS_KEYS.CURRENT_USER) || null;
    }
  }
};

// ============================================
// 2. CONTROLE DE ONGS
// ============================================

export const dbNgos = {
  async getAll() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('ngos').select('*').order('name');
      if (error) throw error;
      return data;
    } else {
      return getMockData(LS_KEYS.NGOS);
    }
  },

  async getById(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('ngos').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    } else {
      const ngos = getMockData(LS_KEYS.NGOS);
      const ngo = ngos.find(n => n.id === id);
      if (!ngo) throw new Error("ONG não encontrada.");
      return ngo;
    }
  },

  async create(ngoData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('ngos').insert([ngoData]).select().single();
      if (error) throw error;
      return data;
    } else {
      const ngos = getMockData(LS_KEYS.NGOS);
      const newNgo = {
        id: 'ngo-' + Math.random().toString(36).substr(2, 9),
        amount_raised: 0,
        created_at: new Date().toISOString(),
        ...ngoData
      };
      ngos.push(newNgo);
      setMockData(LS_KEYS.NGOS, ngos);
      return newNgo;
    }
  },

  async update(id, ngoData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('ngos').update(ngoData).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } else {
      const ngos = getMockData(LS_KEYS.NGOS);
      const idx = ngos.findIndex(n => n.id === id);
      if (idx === -1) throw new Error("ONG não encontrada.");
      
      const updated = { ...ngos[idx], ...ngoData };
      ngos[idx] = updated;
      setMockData(LS_KEYS.NGOS, ngos);
      return updated;
    }
  },

  async delete(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('ngos').delete().eq('id', id);
      if (error) throw error;
      return true;
    } else {
      let ngos = getMockData(LS_KEYS.NGOS);
      ngos = ngos.filter(n => n.id !== id);
      setMockData(LS_KEYS.NGOS, ngos);
      return true;
    }
  }
};

// ============================================
// 3. CONTROLE DE PRODUTOS
// ============================================

export const dbProducts = {
  async getAll() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      return data;
    } else {
      return getMockData(LS_KEYS.PRODUCTS);
    }
  },

  async getById(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    } else {
      const products = getMockData(LS_KEYS.PRODUCTS);
      const prod = products.find(p => p.id === id);
      if (!prod) throw new Error("Produto não encontrado.");
      return prod;
    }
  },

  async create(prodData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('products').insert([prodData]).select().single();
      if (error) throw error;
      return data;
    } else {
      const products = getMockData(LS_KEYS.PRODUCTS);
      const newProd = {
        id: 'prod-' + Math.random().toString(36).substr(2, 9),
        active: true,
        created_at: new Date().toISOString(),
        ...prodData,
        price: parseFloat(prodData.price),
        stock: parseInt(prodData.stock),
        donation_percentage: parseFloat(prodData.donation_percentage)
      };
      products.push(newProd);
      setMockData(LS_KEYS.PRODUCTS, products);
      return newProd;
    }
  },

  async update(id, prodData) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('products').update(prodData).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } else {
      const products = getMockData(LS_KEYS.PRODUCTS);
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) throw new Error("Produto não encontrado.");
      
      const updated = {
        ...products[idx],
        ...prodData,
        price: parseFloat(prodData.price),
        stock: parseInt(prodData.stock),
        donation_percentage: parseFloat(prodData.donation_percentage)
      };
      products[idx] = updated;
      setMockData(LS_KEYS.PRODUCTS, products);
      return updated;
    }
  },

  async delete(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return true;
    } else {
      let products = getMockData(LS_KEYS.PRODUCTS);
      products = products.filter(p => p.id !== id);
      setMockData(LS_KEYS.PRODUCTS, products);
      return true;
    }
  }
};

// ============================================
// 4. SISTEMA DE COMPRA E PEDIDOS (ORDERS)
// ============================================

export const dbOrders = {
  async getAll() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      return getMockData(LS_KEYS.ORDERS);
    }
  },

  async getByUserId(userId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const orders = getMockData(LS_KEYS.ORDERS);
      return orders.filter(o => o.user_id === userId);
    }
  },

  // Finalizar uma compra (Checkout)
  async create(orderData) {
    // orderData: { user_id, total_amount, donation_amount, address, zip_code, installments, items: [{product_id, quantity, ngo_id, price, donation_percentage}] }
    if (isSupabaseConfigured) {
      const { data: newOrder, error } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.user_id,
          total_amount: orderData.total_amount,
          donation_amount: orderData.donation_amount,
          status: 'Pago',
          address: orderData.address,
          zip_code: orderData.zip_code,
          installments: orderData.installments
        })
        .select()
        .single();
      if (error) throw error;

      // Executa estoque e doações via transação ou updates manuais
      for (const item of orderData.items) {
        // Reduz estoque do produto
        await supabase.rpc('decrement_product_stock', { prod_id: item.product_id, qty: item.quantity });
        
        // Aumenta captação da ONG
        await supabase.rpc('increment_ngo_raised', { ngo_id: item.ngo_id, amount: (item.price * item.quantity * (item.donation_percentage / 100)) });
      }

      // Adiciona pontos ao usuário (1 ponto por R$ 1)
      const pointsEarned = Math.floor(orderData.total_amount);
      await supabase.rpc('add_user_points', { user_id: orderData.user_id, pts: pointsEarned });

      return newOrder;
    } else {
      // Offline/Local
      const orders = getMockData(LS_KEYS.ORDERS);
      const products = getMockData(LS_KEYS.PRODUCTS);
      const ngos = getMockData(LS_KEYS.NGOS);
      const users = getMockData(LS_KEYS.USERS);

      // 1. Criar o pedido
      const newOrder = {
        id: 'ord-' + Math.random().toString(36).substr(2, 9),
        user_id: orderData.user_id,
        total_amount: parseFloat(orderData.total_amount),
        donation_amount: parseFloat(orderData.donation_amount),
        status: 'Pago',
        address: orderData.address,
        zip_code: orderData.zip_code,
        installments: parseInt(orderData.installments),
        created_at: new Date().toISOString(),
        items: orderData.items
      };
      
      orders.unshift(newOrder); // Adiciona no início
      setMockData(LS_KEYS.ORDERS, orders);

      // 2. Atualizar estoques dos produtos e doações das ONGs parceiras
      const updatedProducts = products.map(prod => {
        const boughtItem = orderData.items.find(item => item.product_id === prod.id);
        if (boughtItem) {
          const newStock = Math.max(0, prod.stock - boughtItem.quantity);
          return { ...prod, stock: newStock };
        }
        return prod;
      });
      setMockData(LS_KEYS.PRODUCTS, updatedProducts);

      // 3. Atualizar arrecadações das ONGs
      const updatedNgos = ngos.map(ngo => {
        let raisedFromThisOrder = 0;
        orderData.items.forEach(item => {
          if (item.ngo_id === ngo.id) {
            raisedFromThisOrder += parseFloat(item.price) * parseInt(item.quantity) * (parseFloat(item.donation_percentage) / 100);
          }
        });
        if (raisedFromThisOrder > 0) {
          return { ...ngo, amount_raised: parseFloat(ngo.amount_raised) + raisedFromThisOrder };
        }
        return ngo;
      });
      setMockData(LS_KEYS.NGOS, updatedNgos);

      // 4. Atualizar pontos do usuário atual
      const pointsEarned = Math.floor(orderData.total_amount);
      const uniqueNgosBoughtFrom = [...new Set(orderData.items.map(item => item.ngo_id))];

      const updatedUsers = users.map(user => {
        if (user.id === orderData.user_id) {
          const newPoints = (user.points || 0) + pointsEarned;
          // Contagem de ONGs apoiadas distintas
          const newSupportedNgos = Math.max(user.supported_ngos || 1, uniqueNgosBoughtFrom.length + 1);
          return {
            ...user,
            points: newPoints,
            supported_ngos: newSupportedNgos
          };
        }
        return user;
      });
      setMockData(LS_KEYS.USERS, updatedUsers);

      // Atualiza o current user logado
      const curUser = getMockData(LS_KEYS.CURRENT_USER);
      if (curUser && curUser.id === orderData.user_id) {
        const u = updatedUsers.find(x => x.id === orderData.user_id);
        setMockData(LS_KEYS.CURRENT_USER, u);
      }

      return newOrder;
    }
  }
};

// ============================================
// 5. SISTEMA DE AVALIAÇÕES (REVIEWS)
// ============================================

export const dbReviews = {
  async getAll() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      return getMockData(LS_KEYS.REVIEWS);
    }
  },

  async getByProductId(productId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('approved', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      const reviews = getMockData(LS_KEYS.REVIEWS);
      return reviews.filter(r => r.product_id === productId && r.approved !== false);
    }
  },

  async create(reviewData) {
    // reviewData: { user_id, user_name, user_avatar, product_id, product_name, rating, comment }
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('reviews').insert([reviewData]).select().single();
      if (error) throw error;
      return data;
    } else {
      const reviews = getMockData(LS_KEYS.REVIEWS);
      const newReview = {
        id: 'rev-' + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        approved: true, // Auto-aprova por padrão localmente para testes fluidos
        ...reviewData,
        rating: parseInt(reviewData.rating)
      };
      reviews.unshift(newReview);
      setMockData(LS_KEYS.REVIEWS, reviews);
      return newReview;
    }
  },

  async approve(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('reviews').update({ approved: true }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } else {
      const reviews = getMockData(LS_KEYS.REVIEWS);
      const idx = reviews.findIndex(r => r.id === id);
      if (idx === -1) throw new Error("Avaliação não encontrada.");
      reviews[idx].approved = true;
      setMockData(LS_KEYS.REVIEWS, reviews);
      return reviews[idx];
    }
  },

  async delete(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      return true;
    } else {
      let reviews = getMockData(LS_KEYS.REVIEWS);
      reviews = reviews.filter(r => r.id !== id);
      setMockData(LS_KEYS.REVIEWS, reviews);
      return true;
    }
  },

  async reply(id, replyText) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('reviews').update({ admin_reply: replyText }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } else {
      const reviews = getMockData(LS_KEYS.REVIEWS);
      const idx = reviews.findIndex(r => r.id === id);
      if (idx === -1) throw new Error("Avaliação não encontrada.");
      reviews[idx].admin_reply = replyText;
      setMockData(LS_KEYS.REVIEWS, reviews);
      return reviews[idx];
    }
  }
};

// ============================================
// 6. DASHBOARD ANALÍTICO (CHART.JS DATA)
// ============================================

export const dbReports = {
  async getAdminReport() {
    // Busca dados consolidados de faturamento, ONGs, categorias e notas
    const ngos = await dbNgos.getAll();
    const products = await dbProducts.getAll();
    const reviews = await dbReviews.getAll();
    const orders = await dbOrders.getAll();

    // 1. Faturamento e Doações Mensais (Últimos 6 meses)
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const salesByMonth = {};
    const donationsByMonth = {};

    orders.forEach(ord => {
      const date = new Date(ord.created_at);
      const monthStr = monthNames[date.getMonth()];
      salesByMonth[monthStr] = (salesByMonth[monthStr] || 0) + parseFloat(ord.total_amount);
      donationsByMonth[monthStr] = (donationsByMonth[monthStr] || 0) + parseFloat(ord.donation_amount);
    });

    const monthlySalesLabels = Object.keys(salesByMonth).reverse().slice(0, 6).reverse();
    if (monthlySalesLabels.length === 0) monthlySalesLabels.push("Fev", "Mar", "Abr", "Mai", "Jun");
    
    const monthlySalesData = monthlySalesLabels.map(m => salesByMonth[m] || 0);
    const monthlyDonationsData = monthlySalesLabels.map(m => donationsByMonth[m] || 0);

    // Se estiver muito zerado, insere mocks bonitos para o gráfico de demonstração inicial
    const hasActiveOrders = orders.length > 0;
    const finalSalesData = hasActiveOrders ? monthlySalesData : [1200, 2400, 3100, 4800, 6200];
    const finalDonationsData = hasActiveOrders ? monthlyDonationsData : [120, 240, 310, 480, 620];
    const finalMonthlyLabels = hasActiveOrders ? monthlySalesLabels : ["Fev", "Mar", "Abr", "Mai", "Jun"];

    // 2. Produtos mais vendidos
    const productSales = {};
    orders.forEach(ord => {
      if (ord.items) {
        ord.items.forEach(item => {
          productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
        });
      }
    });
    const sortedProds = Object.keys(productSales).sort((a, b) => productSales[b] - productSales[a]);
    const topProductsLabels = sortedProds.slice(0, 5);
    const topProductsData = topProductsLabels.map(name => productSales[name]);

    // Mocks de produtos mais vendidos
    const defaultTopProdsLabels = ["Cama Pet Aconchego", "Ecobags Algodão", "Comedouro Ecológico", "Camiseta Consolidar", "Sabonete Vegano"];
    const defaultTopProdsData = [18, 15, 12, 10, 8];

    // 3. ONGs mais apoiadas
    const ngoSupport = {};
    orders.forEach(ord => {
      if (ord.items) {
        ord.items.forEach(item => {
          const ngoName = ngos.find(n => n.id === item.ngo_id)?.name || "Outros";
          ngoSupport[ngoName] = (ngoSupport[ngoName] || 0) + (item.price * item.quantity * (item.donation_percentage / 100));
        });
      }
    });
    const sortedNgos = Object.keys(ngoSupport).sort((a, b) => ngoSupport[b] - ngoSupport[a]);
    const topNgosLabels = sortedNgos.slice(0, 5);
    const topNgosData = topNgosLabels.map(name => ngoSupport[name]);

    const defaultTopNgosLabels = ["Amor Animal", "SOS Mata Atlântica", "Sorrisos Saudáveis", "Coletivo Viver Melhor", "Educar para o Futuro"];
    const defaultTopNgosData = [350, 280, 210, 180, 140];

    // 4. Doações Totais e Arrecadações
    const totalDonated = orders.reduce((sum, ord) => sum + parseFloat(ord.donation_amount), 0) + ngos.reduce((sum, n) => sum + parseFloat(n.amount_raised), 0);
    const totalSales = orders.reduce((sum, ord) => sum + parseFloat(ord.total_amount), 0);

    // 5. Categorias mais apoiadas (Produtos)
    const categorySupport = {};
    products.forEach(p => {
      categorySupport[p.category] = 0;
    });
    orders.forEach(ord => {
      if (ord.items) {
        ord.items.forEach(item => {
          const prod = products.find(p => p.id === item.product_id);
          const cat = prod?.category || "Outros";
          categorySupport[cat] = (categorySupport[cat] || 0) + (item.price * item.quantity);
        });
      }
    });

    const categoryLabels = Object.keys(categorySupport);
    const categoryData = categoryLabels.map(c => categorySupport[c]);

    // 6. Resumo das notas das Avaliações (1 a 5 estrelas)
    const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => {
      ratingsCount[r.rating] = (ratingsCount[r.rating] || 0) + 1;
    });

    return {
      monthlySales: {
        labels: finalMonthlyLabels,
        sales: finalSalesData,
        donations: finalDonationsData
      },
      topProducts: {
        labels: topProductsLabels.length ? topProductsLabels : defaultTopProdsLabels,
        data: topProductsData.length ? topProductsData : defaultTopProdsData
      },
      topNgos: {
        labels: topNgosLabels.length ? topNgosLabels : defaultTopNgosLabels,
        data: topNgosData.length ? topNgosData : defaultTopNgosData
      },
      totals: {
        donations: totalDonated || 113900.00,
        sales: totalSales || 24590.00,
        ngosCount: ngos.length,
        productsCount: products.length,
        usersCount: getMockData(LS_KEYS.USERS).length || 2
      },
      categories: {
        labels: categoryLabels.length ? categoryLabels : ["Pets", "Doméstico", "Kids", "Beleza", "Roupa", "Limpeza", "Eletroeletrônico"],
        data: categoryData.some(v => v > 0) ? categoryData : [450, 380, 220, 190, 150, 94, 60]
      },
      ratings: {
        labels: ["1 estrela", "2 estrelas", "3 estrelas", "4 estrelas", "5 estrelas"],
        data: [ratingsCount[1], ratingsCount[2], ratingsCount[3], ratingsCount[4], ratingsCount[5]]
      }
    };
  }
};
