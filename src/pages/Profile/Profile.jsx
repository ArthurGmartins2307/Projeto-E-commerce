import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import StarRating from '../../components/StarRating/StarRating';
import { dbOrders, dbReviews } from '../../services/db';
import { formatCurrency } from '../../utils/helpers';
import { CONTRIB_LEVELS, ACHIEVEMENTS } from '../../utils/seedData';
import { User, Award, History, Heart, Star, Settings, ShieldCheck, HelpCircle } from 'lucide-react';
import styles from './Profile.module.css';

export default function Profile() {
  const { currentUser, logout, updateProfile, favorites, products, refreshAllData } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('pontos'); // pontos | compras | favoritos | avaliacoes | configuracoes
  const [orders, setOrders] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    profile_image: '',
    password: ''
  });

  // Proteção de rota
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    } else {
      setProfileForm({
        name: currentUser.name,
        email: currentUser.email,
        profile_image: currentUser.profile_image || '',
        password: ''
      });
    }
  }, [currentUser, navigate]);

  // Carrega compras e avaliações do usuário
  useEffect(() => {
    if (!currentUser) return;

    async function loadUserData() {
      try {
        const fetchedOrders = await dbOrders.getByUserId(currentUser.id);
        setOrders(fetchedOrders);

        const allReviews = await dbReviews.getAll();
        const filteredReviews = allReviews.filter(r => r.user_id === currentUser.id);
        setUserReviews(filteredReviews);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }

    loadUserData();
  }, [currentUser]);

  // Escuta hashs da URL (#pontos, #compras, #favoritos, #avaliacoes, #configuracoes) vindos do header
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#pontos') setActiveTab('pontos');
    else if (hash === '#compras') setActiveTab('compras');
    else if (hash === '#favoritos') setActiveTab('favoritos');
    else if (hash === '#avaliacoes') setActiveTab('avaliacoes');
    else if (hash === '#configuracoes') setActiveTab('configuracoes');
  }, [window.location.hash]);

  // --- LÓGICA DO SISTEMA DE PONTOS E NÍVEIS ---
  const currentPoints = currentUser?.points || 0;

  // Encontra o nível atual
  const currentLevelInfo = useMemo(() => {
    let current = CONTRIB_LEVELS[0];
    for (let i = 0; i < CONTRIB_LEVELS.length; i++) {
      if (currentPoints >= CONTRIB_LEVELS[i].minPoints) {
        current = CONTRIB_LEVELS[i];
      }
    }
    return current;
  }, [currentPoints]);

  // Encontra o próximo nível e calcula progresso
  const nextLevelInfo = useMemo(() => {
    const currentIndex = CONTRIB_LEVELS.findIndex(l => l.level === currentLevelInfo.level);
    if (currentIndex < CONTRIB_LEVELS.length - 1) {
      return CONTRIB_LEVELS[currentIndex + 1];
    }
    return null; // Nível Máximo
  }, [currentLevelInfo]);

  const levelProgress = useMemo(() => {
    if (!nextLevelInfo) return 100;
    const currentMin = currentLevelInfo.minPoints;
    const nextMin = nextLevelInfo.minPoints;
    const range = nextMin - currentMin;
    const progressPoints = currentPoints - currentMin;
    return Math.min(100, Math.round((progressPoints / range) * 100));
  }, [currentPoints, currentLevelInfo, nextLevelInfo]);

  // --- CONQUISTAS DINÂMICAS (DESBLOQUEADAS EM TEMPO REAL) ---
  const unlockedBadges = useMemo(() => {
    const badges = [];
    const orderItems = orders.flatMap(o => o.items || []);

    // 1. Badge Primeira Compra
    if (orders.length > 0) badges.push('badge-first');

    // 2. Badge Animais (Comprou mais de 2 itens de ONGs de bem-estar animal)
    const animalItemsCount = orderItems.filter(item => item.ngo_id === 'ngo-1').reduce((sum, i) => sum + i.quantity, 0);
    if (animalItemsCount >= 2) badges.push('badge-animal');

    // 3. Badge Meio Ambiente (Apoiou SOS Mata Atlântica)
    const hasSupportedForest = orderItems.some(item => item.ngo_id === 'ngo-2');
    if (hasSupportedForest) badges.push('badge-nature');

    // 4. Badge Social
    const hasSupportedSocial = orderItems.some(item => item.ngo_id === 'ngo-5');
    if (hasSupportedSocial) badges.push('badge-social');

    // 5. Badge Educação
    const hasSupportedEdu = orderItems.some(item => item.ngo_id === 'ngo-3');
    if (hasSupportedEdu) badges.push('badge-education');

    // 6. Badge Saúde
    const hasSupportedHealth = orderItems.some(item => item.ngo_id === 'ngo-4');
    if (hasSupportedHealth) badges.push('badge-health');

    // 7. Badge Super Doador (Acumulou mais de 300 pontos)
    if (currentPoints >= 300) badges.push('badge-heavy');

    return badges;
  }, [orders, currentPoints]);

  // --- LISTA DE FAVORITOS ---
  const favoriteProductsList = useMemo(() => {
    return products.filter(p => favorites.includes(p.id));
  }, [favorites, products]);

  // --- TRATAMENTOS DE FORMULÁRIO ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: profileForm.name,
        email: profileForm.email
      };
      if (profileForm.profile_image) {
        updateData.profile_image = profileForm.profile_image;
      }
      if (profileForm.password) {
        updateData.password = profileForm.password;
      }

      await updateProfile(updateData);
      setProfileForm(prev => ({ ...prev, password: '' })); // Limpa senha
      refreshAllData();
    } catch (error) {
      console.error(error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className={`${styles.pageContainer} container animate-fade-in`}>
      
      {/* Lateral / Esquerda: Resumo do Usuário */}
      <div className={styles.profileGrid}>
        
        <aside className={styles.sidebar}>
          <div className={styles.userSummary}>
            <img 
              src={currentUser.profile_image} 
              alt={currentUser.name} 
              className={styles.userAvatar} 
            />
            <h2 className={styles.userName}>{currentUser.name}</h2>
            <span className={styles.userBadge}>
              {currentUser.user_type === 'admin' ? 'Administrador' : 'Apoiador Consolidar'}
            </span>
            <p className={styles.userJoined}>
              Membro desde: {new Date(currentUser.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>

          <nav className={styles.sidebarNav}>
            <button
              onClick={() => setActiveTab('pontos')}
              className={`${styles.navBtn} ${activeTab === 'pontos' ? styles.navActive : ''}`}
            >
              <Award size={18} />
              Meus Pontos
            </button>
            
            <button
              onClick={() => setActiveTab('compras')}
              className={`${styles.navBtn} ${activeTab === 'compras' ? styles.navActive : ''}`}
            >
              <History size={18} />
              Minhas Compras
            </button>

            <button
              onClick={() => setActiveTab('favoritos')}
              className={`${styles.navBtn} ${activeTab === 'favoritos' ? styles.navActive : ''}`}
            >
              <Heart size={18} />
              Favoritos
            </button>

            <button
              onClick={() => setActiveTab('avaliacoes')}
              className={`${styles.navBtn} ${activeTab === 'avaliacoes' ? styles.navActive : ''}`}
            >
              <Star size={18} />
              Minhas Avaliações
            </button>

            <button
              onClick={() => setActiveTab('configuracoes')}
              className={`${styles.navBtn} ${activeTab === 'configuracoes' ? styles.navActive : ''}`}
            >
              <Settings size={18} />
              Configurações
            </button>
          </nav>

          <button onClick={logout} className={styles.btnLogout}>
            Encerrar Sessão
          </button>
        </aside>

        {/* Principal / Direita: Conteúdo das Abas */}
        <main className={styles.mainContent}>
          
          {/* TAB 1: MEUS PONTOS E RECOMPENSAS */}
          {activeTab === 'pontos' && (
            <div className={styles.tabContent}>
              <div className={styles.tabHeader}>
                <h2>Sistema de Pontos e Recompensas</h2>
                <p>Suas compras geram doações automáticas e geram pontos na plataforma para coroar seu engajamento.</p>
              </div>

              {/* Caixa Destaque de Pontuação */}
              <div className={styles.pointsDashboard}>
                <div className={styles.pointsHighlight}>
                  <span className={styles.pointsSub}>Saldo Atual</span>
                  <span className={styles.pointsTotalValue}>{currentUser.points || 0}</span>
                  <span className={styles.pointsLabel}>Pontos Acumulados</span>
                </div>

                <div className={styles.levelProgressBox}>
                  <div className={styles.levelHeader}>
                    <span>Nível de Apoiador</span>
                    <strong style={{ color: currentLevelInfo.color }}>
                      Nível {currentLevelInfo.level} - {currentLevelInfo.title}
                    </strong>
                  </div>

                  <div className={styles.progressBarBg}>
                    <div 
                      className={styles.progressBarFill} 
                      style={{ 
                        width: `${levelProgress}%`,
                        backgroundColor: currentLevelInfo.color 
                      }}
                    ></div>
                  </div>

                  {nextLevelInfo ? (
                    <p className={styles.nextLevelLabel}>
                      Faltam <strong>{nextLevelInfo.minPoints - currentPoints} pontos</strong> para subir para o nível {nextLevelInfo.title}!
                    </p>
                  ) : (
                    <p className={styles.nextLevelLabel}>
                      Parabéns! Você atingiu o <strong>Nível Máximo</strong> de solidariedade!
                    </p>
                  )}
                </div>
              </div>

              {/* Estatísticas de Impacto */}
              <div className={styles.impactStatsGrid}>
                <div className={styles.impactStatCard}>
                  <h3>{currentUser.supported_ngos || 1}</h3>
                  <p>ONGs Apoiadas</p>
                </div>
                <div className={styles.impactStatCard}>
                  <h3>{orders.length}</h3>
                  <p>Compras Solidárias</p>
                </div>
                <div className={styles.impactStatCard}>
                  <h3>{formatCurrency(orders.reduce((sum, o) => sum + parseFloat(o.donation_amount || 0), 0))}</h3>
                  <p>Total doado em suas compras</p>
                </div>
              </div>

              {/* Badges de Conquista */}
              <div className={styles.achievementsSection}>
                <h3>Medalhas e Conquistas</h3>
                <div className={styles.badgesGrid}>
                  {ACHIEVEMENTS.map((badge) => {
                    const isUnlocked = unlockedBadges.includes(badge.id);
                    return (
                      <div 
                        key={badge.id} 
                        className={`${styles.badgeCard} ${isUnlocked ? styles.badgeUnlocked : styles.badgeLocked}`}
                        title={isUnlocked ? 'Conquista Desbloqueada!' : 'Conquista Bloqueada'}
                      >
                        <div className={styles.badgeIcon}>{badge.icon}</div>
                        <h4>{badge.name}</h4>
                        <p>{badge.description}</p>
                        <span className={styles.badgeStatus}>
                          {isUnlocked ? 'Desbloqueada' : 'Bloqueada'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MINHAS COMPRAS */}
          {activeTab === 'compras' && (
            <div className={styles.tabContent}>
              <div className={styles.tabHeader}>
                <h2>Histórico de Compras</h2>
                <p>Revise suas transações e veja o valor destinado para as ONGs em cada pedido.</p>
              </div>

              {orders.length === 0 ? (
                <div className={styles.noData}>
                  <History size={40} className={styles.noDataIcon} />
                  <h3>Nenhuma compra realizada</h3>
                  <p>Você ainda não fez compras. Que tal ir às compras e apoiar uma causa agora?</p>
                  <button onClick={() => navigate('/produtos')} className={styles.btnExplore}>
                    Ir para Loja
                  </button>
                </div>
              ) : (
                <div className={styles.ordersList}>
                  {orders.map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.orderCardHeader}>
                        <div>
                          <span className={styles.orderMeta}>ID do Pedido: <strong>{order.id}</strong></span>
                          <span className={styles.orderMeta}>Data: {new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <span className={styles.orderStatusBadge}>Pago</span>
                      </div>

                      <div className={styles.orderItems}>
                        {order.items && order.items.map((item, idx) => (
                          <div key={idx} className={styles.orderItemRow}>
                            <div>
                              <span className={styles.orderItemName}>{item.name}</span>
                              <span className={styles.orderItemQty}>Qtd: {item.quantity} x {formatCurrency(item.price)}</span>
                            </div>
                            <span className={styles.orderItemSubtotal}>
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className={styles.orderSummary}>
                        <div className={styles.orderDonationRow}>
                          <Heart size={14} fill="currentColor" />
                          <span>Doação Gerada nesta compra: <strong>{formatCurrency(order.donation_amount)}</strong></span>
                        </div>
                        <div className={styles.orderTotalRow}>
                          <span>Total Pago:</span>
                          <strong>{formatCurrency(order.total_amount)} ({order.installments}x)</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAVORITOS */}
          {activeTab === 'favoritos' && (
            <div className={styles.tabContent}>
              <div className={styles.tabHeader}>
                <h2>Produtos Favoritos</h2>
                <p>Lista dos produtos que você marcou com um coração.</p>
              </div>

              {favoriteProductsList.length === 0 ? (
                <div className={styles.noData}>
                  <Heart size={40} className={styles.noDataIcon} />
                  <h3>Nenhum favorito salvo</h3>
                  <p>Seus produtos favoritos aparecerão aqui. Clique no ícone de coração nos produtos para salvá-los.</p>
                  <button onClick={() => navigate('/produtos')} className={styles.btnExplore}>
                    Explorar Produtos
                  </button>
                </div>
              ) : (
                <div className={styles.favoritesGrid}>
                  {favoriteProductsList.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MINHAS AVALIAÇÕES */}
          {activeTab === 'avaliacoes' && (
            <div className={styles.tabContent}>
              <div className={styles.tabHeader}>
                <h2>Minhas Avaliações</h2>
                <p>Opiniões que você enviou sobre os produtos adquiridos.</p>
              </div>

              {userReviews.length === 0 ? (
                <div className={styles.noData}>
                  <Star size={40} className={styles.noDataIcon} />
                  <h3>Nenhuma avaliação enviada</h3>
                  <p>Você ainda não avaliou nenhum produto comprado na Consolidar.</p>
                </div>
              ) : (
                <div className={styles.reviewsList}>
                  {userReviews.map((rev) => (
                    <div key={rev.id} className={styles.reviewCard}>
                      <div className={styles.reviewCardHeader}>
                        <h4>{rev.product_name}</h4>
                        <span className={styles.reviewDate}>
                          {new Date(rev.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      
                      <div className={styles.reviewStars}>
                        <StarRating rating={rev.rating} size={14} readOnly={true} />
                      </div>

                      <p className={styles.reviewComment}>"{rev.comment}"</p>

                      {rev.admin_reply && (
                        <div className={styles.adminReplyBox}>
                          <h5>Resposta da Consolidar:</h5>
                          <p>"{rev.admin_reply}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CONFIGURAÇÕES / MEU PERFIL */}
          {activeTab === 'configuracoes' && (
            <div className={styles.tabContent}>
              <div className={styles.tabHeader}>
                <h2>Configurações do Perfil</h2>
                <p>Atualize seus dados cadastrais e foto de perfil a qualquer momento.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className={styles.settingsForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="set_name">Nome Completo *</label>
                  <input
                    id="set_name"
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="set_email">E-mail Cadastrado *</label>
                  <input
                    id="set_email"
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="set_image">URL da Foto de Perfil</label>
                  <input
                    id="set_image"
                    type="url"
                    name="profile_image"
                    value={profileForm.profile_image}
                    onChange={handleInputChange}
                    placeholder="https://sua-imagem.com/avatar.jpg"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="set_password">Nova Senha (deixe em branco para não alterar)</label>
                  <input
                    id="set_password"
                    type="password"
                    name="password"
                    value={profileForm.password}
                    onChange={handleInputChange}
                    placeholder="Digite a nova senha"
                    minLength="6"
                  />
                </div>

                <button type="submit" className={styles.btnSaveProfile}>
                  <ShieldCheck size={16} />
                  Salvar Alterações
                </button>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
