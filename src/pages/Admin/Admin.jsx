import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  dbNgos,
  dbProducts,
  dbReviews,
  dbOrders,
  dbReports
} from '../../services/db';
import { formatCurrency, mapNgoCategory, mapProductCategory } from '../../utils/helpers';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  LayoutDashboard,
  HeartHandshake,
  ShoppingBag,
  MessageSquareStar,
  Plus,
  Edit2,
  Trash2,
  Check,
  Reply,
  Lock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Boxes,
  Users
} from 'lucide-react';
import styles from './Admin.module.css';

// Registra módulos do Chart.js para que funcionem corretamente
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Admin() {
  const { currentUser, ngos, products, reviews, refreshAllData, addToast } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | ongs | produtos | avaliacoes
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados dos Formulários / Modais CRUD
  const [ngoModalOpen, setNgoModalOpen] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [ngoForm, setNgoForm] = useState({
    name: '',
    logo: '',
    description: '',
    category: 'Social Causes',
    fundraising_goal: 10000,
    website: '',
    phone: '',
    email: ''
  });

  const [prodModalOpen, setProdModalOpen] = useState(false);
  const [selectedProd, setSelectedProd] = useState(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    category: 'Household',
    ngo_id: '',
    donation_percentage: 5,
    active: true
  });

  const [reviewReplyText, setReviewReplyText] = useState({});

  // 1. VERIFICAÇÃO DE PRIVILÉGIOS (ADMIN ONLY)
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    } else if (currentUser.user_type !== 'admin') {
      // Deixa carregado mas exibirá a tela de acesso negado
      setLoading(false);
    } else {
      loadReportsAndData();
    }
  }, [currentUser, navigate]);

  // Carrega relatórios e sincroniza
  async function loadReportsAndData() {
    setLoading(true);
    try {
      const data = await dbReports.getAdminReport();
      setReportData(data);
      
      // Auto-seleciona a primeira ONG no form de produtos caso esteja vazio
      if (ngos.length > 0 && !prodForm.ngo_id) {
        setProdForm(prev => ({ ...prev, ngo_id: ngos[0].id }));
      }
    } catch (error) {
      console.error(error);
      addToast('Erro ao carregar relatórios analíticos.', 'error');
    } finally {
      setLoading(false);
    }
  }

  // --- CONTROLES CRUD DE ONGS ---
  const handleOpenNgoModal = (ngo = null) => {
    if (ngo) {
      setSelectedNgo(ngo);
      setNgoForm({
        name: ngo.name,
        logo: ngo.logo || '',
        description: ngo.description || '',
        category: ngo.category || 'Social Causes',
        fundraising_goal: ngo.fundraising_goal || 10000,
        website: ngo.website || '',
        phone: ngo.phone || '',
        email: ngo.email || ''
      });
    } else {
      setSelectedNgo(null);
      setNgoForm({
        name: '',
        logo: '',
        description: '',
        category: 'Social Causes',
        fundraising_goal: 10000,
        website: '',
        phone: '',
        email: ''
      });
    }
    setNgoModalOpen(true);
  };

  const handleNgoFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedNgo) {
        await dbNgos.update(selectedNgo.id, ngoForm);
        addToast('ONG atualizada com sucesso!', 'success');
      } else {
        await dbNgos.create(ngoForm);
        addToast('Nova ONG cadastrada com sucesso!', 'success');
      }
      setNgoModalOpen(false);
      await refreshAllData();
      await loadReportsAndData();
    } catch (err) {
      addToast('Erro ao salvar ONG.', 'error');
    }
  };

  const handleDeleteNgo = async (id) => {
    if (window.confirm('Deseja realmente remover esta ONG parceira? Todos os produtos vinculados poderão ser impactados.')) {
      try {
        await dbNgos.delete(id);
        addToast('ONG excluída com sucesso.', 'success');
        await refreshAllData();
        await loadReportsAndData();
      } catch (err) {
        addToast('Erro ao excluir ONG.', 'error');
      }
    }
  };

  // --- CONTROLES CRUD DE PRODUTOS ---
  const handleOpenProdModal = (prod = null) => {
    if (prod) {
      setSelectedProd(prod);
      setProdForm({
        name: prod.name,
        description: prod.description || '',
        price: prod.price,
        stock: prod.stock,
        image: prod.image || '',
        category: prod.category || 'Household',
        ngo_id: prod.ngo_id || (ngos[0]?.id || ''),
        donation_percentage: prod.donation_percentage || 5,
        active: prod.active !== false
      });
    } else {
      setSelectedProd(null);
      setProdForm({
        name: '',
        description: '',
        price: 39.90,
        stock: 10,
        image: '',
        category: 'Household',
        ngo_id: ngos[0]?.id || '',
        donation_percentage: 5,
        active: true
      });
    }
    setProdModalOpen(true);
  };

  const handleProdFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProd) {
        await dbProducts.update(selectedProd.id, prodForm);
        addToast('Produto atualizado com sucesso!', 'success');
      } else {
        await dbProducts.create(prodForm);
        addToast('Produto criado com sucesso!', 'success');
      }
      setProdModalOpen(false);
      await refreshAllData();
      await loadReportsAndData();
    } catch (err) {
      addToast('Erro ao salvar produto.', 'error');
    }
  };

  const handleDeleteProd = async (id) => {
    if (window.confirm('Deseja excluir permanentemente este produto?')) {
      try {
        await dbProducts.delete(id);
        addToast('Produto excluído.', 'success');
        await refreshAllData();
        await loadReportsAndData();
      } catch (err) {
        addToast('Erro ao deletar produto.', 'error');
      }
    }
  };

  // --- CONTROLES DE AVALIAÇÕES ---
  const handleApproveReview = async (id) => {
    try {
      await dbReviews.approve(id);
      addToast('Avaliação aprovada com sucesso e visível no site.', 'success');
      await refreshAllData();
    } catch (err) {
      addToast('Erro ao aprovar avaliação.', 'error');
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Excluir esta avaliação de cliente?')) {
      try {
        await dbReviews.delete(id);
        addToast('Avaliação deletada.', 'success');
        await refreshAllData();
      } catch (err) {
        addToast('Erro ao excluir avaliação.', 'error');
      }
    }
  };

  const handleReplyReviewSubmit = async (id) => {
    const text = reviewReplyText[id];
    if (!text || !text.trim()) return;

    try {
      await dbReviews.reply(id, text);
      addToast('Resposta da administração enviada!', 'success');
      setReviewReplyText(prev => ({ ...prev, [id]: '' }));
      await refreshAllData();
    } catch (err) {
      addToast('Erro ao salvar resposta.', 'error');
    }
  };

  const handleReplyTextChange = (id, val) => {
    setReviewReplyText(prev => ({ ...prev, [id]: val }));
  };

  // --- TELA DE ACESSO NEGADO ---
  if (currentUser && currentUser.user_type !== 'admin') {
    return (
      <div className={`${styles.deniedContainer} container animate-fade-in`}>
        <Lock size={64} className={styles.deniedIcon} />
        <h1>Acesso Restrito</h1>
        <p>Esta área é exclusiva para administradores da plataforma Consolidar.</p>
        <Link to="/" className={styles.btnHomeDenied}>
          Voltar para a Página Inicial
        </Link>
      </div>
    );
  }

  if (loading || !reportData) {
    return (
      <div className={styles.loadingContainer}>
        <p>Carregando painel e relatórios analíticos...</p>
      </div>
    );
  }

  // --- DADOS PARA OS GRÁFICOS (CHART.JS CONFIGS) ---
  const salesChartData = {
    labels: reportData.monthlySales.labels,
    datasets: [
      {
        label: 'Vendas Totais (R$)',
        data: reportData.monthlySales.sales,
        borderColor: '#264653',
        backgroundColor: 'rgba(38, 70, 83, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Doações Geradas (R$)',
        data: reportData.monthlySales.donations,
        borderColor: '#2A9D8F',
        backgroundColor: 'rgba(42, 157, 143, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const productsChartData = {
    labels: reportData.topProducts.labels,
    datasets: [
      {
        label: 'Unidades Vendidas',
        data: reportData.topProducts.data,
        backgroundColor: [
          '#264653',
          '#2A9D8F',
          '#E9C46A',
          '#F4A261',
          '#E76F51'
        ],
        borderRadius: 6
      }
    ]
  };

  const ngosChartData = {
    labels: reportData.topNgos.labels,
    datasets: [
      {
        label: 'Doação Destinada (R$)',
        data: reportData.topNgos.data,
        backgroundColor: [
          '#2A9D8F',
          '#264653',
          '#E76F51',
          '#F4A261',
          '#E9C46A'
        ],
        borderWidth: 1
      }
    ]
  };

  const categoriesChartData = {
    labels: reportData.categories.labels.map(c => mapProductCategory(c)),
    datasets: [
      {
        data: reportData.categories.data,
        backgroundColor: [
          '#2A9D8F',
          '#264653',
          '#E76F51',
          '#F4A261',
          '#E9C46A',
          '#8a2be2',
          '#a0522d'
        ]
      }
    ]
  };

  return (
    <div className={`${styles.pageContainer} container animate-fade-in`}>
      {/* Header do Painel */}
      <div className={styles.dashboardHeader}>
        <div>
          <span className={styles.dashSub}>Administração Geral</span>
          <h1 className={styles.dashTitle}>Painel Consolidar</h1>
        </div>
        
        <div className={styles.tabsSelector}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`${styles.tabBtn} ${activeTab === 'dashboard' ? styles.tabActive : ''}`}
          >
            <LayoutDashboard size={16} />
            Relatórios e Gráficos
          </button>
          <button
            onClick={() => setActiveTab('ongs')}
            className={`${styles.tabBtn} ${activeTab === 'ongs' ? styles.tabActive : ''}`}
          >
            <HeartHandshake size={16} />
            Gerenciar ONGs
          </button>
          <button
            onClick={() => setActiveTab('produtos')}
            className={`${styles.tabBtn} ${activeTab === 'produtos' ? styles.tabActive : ''}`}
          >
            <ShoppingBag size={16} />
            Gerenciar Produtos
          </button>
          <button
            onClick={() => setActiveTab('avaliacoes')}
            className={`${styles.tabBtn} ${activeTab === 'avaliacoes' ? styles.tabActive : ''}`}
          >
            <MessageSquareStar size={16} />
            Gerenciar Avaliações
          </button>
        </div>
      </div>

      {/* =======================================================
          TAB 1: RELATÓRIOS E ANALYTICS (CHART.JS)
          ======================================================= */}
      {activeTab === 'dashboard' && (
        <div className={styles.tabPanel}>
          {/* Cartões de Estatísticas Gerais */}
          <div className={styles.totalsGrid}>
            <div className={styles.totalCard}>
              <div className={styles.totalIconWrapper} style={{ backgroundColor: 'rgba(42, 157, 143, 0.1)', color: '#2A9D8F' }}>
                <TrendingUp size={22} />
              </div>
              <div>
                <span>Arrecadação Geral ONGs</span>
                <h3>{formatCurrency(reportData.totals.donations)}</h3>
              </div>
            </div>

            <div className={styles.totalCard}>
              <div className={styles.totalIconWrapper} style={{ backgroundColor: 'rgba(38, 70, 83, 0.1)', color: '#264653' }}>
                <ShoppingBag size={22} />
              </div>
              <div>
                <span>Faturamento Total Loja</span>
                <h3>{formatCurrency(reportData.totals.sales)}</h3>
              </div>
            </div>

            <div className={styles.totalCard}>
              <div className={styles.totalIconWrapper} style={{ backgroundColor: 'rgba(231, 111, 81, 0.1)', color: '#E76F51' }}>
                <HeartHandshake size={22} />
              </div>
              <div>
                <span>ONGs Conveniadas</span>
                <h3>{reportData.totals.ngosCount}</h3>
              </div>
            </div>

            <div className={styles.totalCard}>
              <div className={styles.totalIconWrapper} style={{ backgroundColor: 'rgba(244, 162, 97, 0.1)', color: '#F4A261' }}>
                <Boxes size={22} />
              </div>
              <div>
                <span>Produtos no Catálogo</span>
                <h3>{reportData.totals.productsCount}</h3>
              </div>
            </div>
          </div>

          {/* Gráficos Chart.js */}
          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <h4>Faturamento Mensal vs Doações Acumuladas</h4>
              <div className={styles.chartBox}>
                <Line data={salesChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            <div className={styles.chartCard}>
              <h4>Produtos Mais Vendidos (Unidades)</h4>
              <div className={styles.chartBox}>
                <Bar data={productsChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            <div className={styles.chartCard}>
              <h4>ONGs Mais Apoiadas (Repasse Financeiro)</h4>
              <div className={styles.chartBox}>
                <Pie data={ngosChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>

            <div className={styles.chartCard}>
              <h4>Doações Geradas por Categoria de Produto</h4>
              <div className={styles.chartBox}>
                <Doughnut data={categoriesChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          TAB 2: GERENCIAMENTO DE ONGS (CRUD)
          ======================================================= */}
      {activeTab === 'ongs' && (
        <div className={styles.tabPanel}>
          <div className={styles.panelControls}>
            <h2>Lista de ONGs Conveniadas ({ngos.length})</h2>
            <button 
              onClick={() => handleOpenNgoModal()} 
              className={styles.btnAddItem}
            >
              <Plus size={16} />
              Adicionar Nova ONG
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Meta de Captação</th>
                  <th>Valor Captado</th>
                  <th>Contato</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {ngos.map(ngo => (
                  <tr key={ngo.id}>
                    <td>
                      <img src={ngo.logo} alt="" className={styles.tableThumb} />
                    </td>
                    <td>
                      <strong>{ngo.name}</strong>
                    </td>
                    <td>
                      <span className={`category-badge ${mapNgoCategoryClass(ngo.category)}`}>
                        {mapNgoCategory(ngo.category)}
                      </span>
                    </td>
                    <td>{formatCurrency(ngo.fundraising_goal)}</td>
                    <td>
                      <span className={styles.greenText}>{formatCurrency(ngo.amount_raised)}</span>
                    </td>
                    <td>
                      <div className={styles.tableContact}>
                        <span>{ngo.email}</span>
                        <span>{ngo.phone}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.tableActions}>
                        <button 
                          onClick={() => handleOpenNgoModal(ngo)}
                          className={styles.btnEdit} 
                          title="Editar ONG"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteNgo(ngo.id)}
                          className={styles.btnDelete} 
                          title="Excluir ONG"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =======================================================
          TAB 3: GERENCIAMENTO DE PRODUTOS (CRUD)
          ======================================================= */}
      {activeTab === 'produtos' && (
        <div className={styles.tabPanel}>
          <div className={styles.panelControls}>
            <h2>Catálogo de Produtos Solidários ({products.length})</h2>
            <button 
              onClick={() => handleOpenProdModal()} 
              className={styles.btnAddItem}
            >
              <Plus size={16} />
              Adicionar Novo Produto
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque Atual</th>
                  <th>ONG Destino</th>
                  <th>Doação (%)</th>
                  <th>Ativo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => {
                  const matchedNgo = ngos.find(n => n.id === prod.ngo_id);
                  return (
                    <tr key={prod.id}>
                      <td>
                        <img src={prod.image} alt="" className={styles.tableThumb} />
                      </td>
                      <td>
                        <strong className={styles.prodTableName}>{prod.name}</strong>
                      </td>
                      <td>{mapProductCategory(prod.category)}</td>
                      <td>
                        <strong>{formatCurrency(prod.price)}</strong>
                      </td>
                      <td>
                        <span className={prod.stock <= 3 ? styles.stockWarning : ''}>
                          {prod.stock <= 0 ? 'Esgotado' : `${prod.stock} un`}
                        </span>
                      </td>
                      <td>
                        <span className={styles.ngoTargetName}>{matchedNgo ? matchedNgo.name : 'Não vinculada'}</span>
                      </td>
                      <td>
                        <span className={styles.donationPercentage}>{prod.donation_percentage}%</span>
                      </td>
                      <td>
                        <span className={prod.active ? styles.badgeActive : styles.badgeInactive}>
                          {prod.active ? 'Ativo' : 'Pausado'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.tableActions}>
                          <button 
                            onClick={() => handleOpenProdModal(prod)}
                            className={styles.btnEdit} 
                            title="Editar Produto"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProd(prod.id)}
                            className={styles.btnDelete} 
                            title="Deletar Produto"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =======================================================
          TAB 4: GERENCIAMENTO DE AVALIAÇÕES MODERAÇÃO
          ======================================================= */}
      {activeTab === 'avaliacoes' && (
        <div className={styles.tabPanel}>
          <h2>Moderação de Avaliações de Clientes ({reviews.length})</h2>
          
          <div className={styles.reviewsList}>
            {reviews.map(rev => (
              <div key={rev.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewUserCard}>
                    <img src={rev.user_avatar} alt="" className={styles.revAvatar} />
                    <div>
                      <h4>{rev.user_name}</h4>
                      <span>comentou em <strong>{rev.product_name}</strong></span>
                    </div>
                  </div>
                  
                  <div className={styles.reviewHeaderActions}>
                    <span className={styles.revDate}>
                      {new Date(rev.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <span className={rev.approved !== false ? styles.badgeActive : styles.badgeInactive}>
                      {rev.approved !== false ? 'Aprovada' : 'Aguardando'}
                    </span>
                  </div>
                </div>

                <div className={styles.reviewStars}>
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`${styles.star} ${i < rev.rating ? styles.starFilled : styles.starEmpty}`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className={styles.reviewComment}>"{rev.comment}"</p>

                {/* Resposta do Admin cadastrada */}
                {rev.admin_reply && (
                  <div className={styles.replyBox}>
                    <strong>Resposta Cadastrada:</strong>
                    <p>"{rev.admin_reply}"</p>
                  </div>
                )}

                {/* Formulário de Resposta / Ações */}
                <div className={styles.reviewControls}>
                  <div className={styles.replyInputGroup}>
                    <input 
                      type="text" 
                      placeholder="Responder esta avaliação..." 
                      value={reviewReplyText[rev.id] || ''}
                      onChange={(e) => handleReplyTextChange(rev.id, e.target.value)}
                      className={styles.replyInput}
                      aria-label="Resposta do administrador"
                    />
                    <button 
                      onClick={() => handleReplyReviewSubmit(rev.id)}
                      className={styles.btnSubmitReply}
                      title="Enviar resposta"
                    >
                      <Reply size={14} />
                      Responder
                    </button>
                  </div>

                  <div className={styles.moderationButtons}>
                    {rev.approved === false && (
                      <button 
                        onClick={() => handleApproveReview(rev.id)}
                        className={styles.btnApprove}
                      >
                        <Check size={14} />
                        Aprovar
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteReview(rev.id)}
                      className={styles.btnDeleteReview}
                    >
                      <Trash2 size={14} />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =======================================================
          MODAIS CRUD (MODAL DE ONGS)
          ======================================================= */}
      {ngoModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setNgoModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{selectedNgo ? 'Editar ONG' : 'Adicionar Nova ONG'}</h3>
              <button onClick={() => setNgoModalOpen(false)} className={styles.closeModalBtn}>✕</button>
            </div>
            
            <form onSubmit={handleNgoFormSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Nome da ONG *</label>
                <input 
                  type="text" 
                  value={ngoForm.name}
                  onChange={(e) => setNgoForm({...ngoForm, name: e.target.value})}
                  placeholder="Ex: Amor Animal"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Categoria Causa *</label>
                  <select 
                    value={ngoForm.category}
                    onChange={(e) => setNgoForm({...ngoForm, category: e.target.value})}
                  >
                    <option value="Animal Welfare">Bem-Estar Animal</option>
                    <option value="Social Causes">Causas Sociais</option>
                    <option value="Education">Educação</option>
                    <option value="Health">Saúde</option>
                    <option value="Environment">Meio Ambiente</option>
                    <option value="Culture">Cultura</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Meta de Captação (R$) *</label>
                  <input 
                    type="number" 
                    value={ngoForm.fundraising_goal}
                    onChange={(e) => setNgoForm({...ngoForm, fundraising_goal: Number(e.target.value)})}
                    min="1000"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>URL Logotipo *</label>
                <input 
                  type="url" 
                  value={ngoForm.logo}
                  onChange={(e) => setNgoForm({...ngoForm, logo: e.target.value})}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Descrição Curta *</label>
                <input 
                  type="text" 
                  value={ngoForm.description}
                  onChange={(e) => setNgoForm({...ngoForm, description: e.target.value})}
                  placeholder="Resumo do impacto social"
                  maxLength="160"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>E-mail *</label>
                  <input 
                    type="email" 
                    value={ngoForm.email}
                    onChange={(e) => setNgoForm({...ngoForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Telefone *</label>
                  <input 
                    type="text" 
                    value={ngoForm.phone}
                    onChange={(e) => setNgoForm({...ngoForm, phone: e.target.value})}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Site Oficial *</label>
                <input 
                  type="text" 
                  value={ngoForm.website}
                  onChange={(e) => setNgoForm({...ngoForm, website: e.target.value})}
                  placeholder="www.ong.org.br"
                  required
                />
              </div>

              <button type="submit" className={styles.btnSaveModal}>
                Salvar Cadastro
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL DE PRODUTOS
          ======================================================= */}
      {prodModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setProdModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{selectedProd ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h3>
              <button onClick={() => setProdModalOpen(false)} className={styles.closeModalBtn}>✕</button>
            </div>
            
            <form onSubmit={handleProdFormSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Nome do Produto *</label>
                <input 
                  type="text" 
                  value={prodForm.name}
                  onChange={(e) => setProdForm({...prodForm, name: e.target.value})}
                  placeholder="Nome comercial do produto"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Categoria Produto *</label>
                  <select 
                    value={prodForm.category}
                    onChange={(e) => setProdForm({...prodForm, category: e.target.value})}
                  >
                    <option value="Household">Doméstico</option>
                    <option value="Clothing">Roupa</option>
                    <option value="Beauty">Beleza</option>
                    <option value="Cleaning">Limpeza</option>
                    <option value="Electronics">Eletroeletrônico</option>
                    <option value="Kids">Infantil</option>
                    <option value="Pets">Pet</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Preço (R$) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({...prodForm, price: Number(e.target.value)})}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Estoque Inicial *</label>
                  <input 
                    type="number" 
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({...prodForm, stock: Number(e.target.value)})}
                    min="0"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Doação (%) *</label>
                  <input 
                    type="number" 
                    value={prodForm.donation_percentage}
                    onChange={(e) => setProdForm({...prodForm, donation_percentage: Number(e.target.value)})}
                    min="1"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>ONG Beneficiada *</label>
                <select 
                  value={prodForm.ngo_id}
                  onChange={(e) => setProdForm({...prodForm, ngo_id: e.target.value})}
                  required
                >
                  <option value="" disabled>Selecione uma ONG parceira</option>
                  {ngos.map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>URL Imagem Produto *</label>
                <input 
                  type="url" 
                  value={prodForm.image}
                  onChange={(e) => setProdForm({...prodForm, image: e.target.value})}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Descrição do Produto *</label>
                <textarea 
                  value={prodForm.description}
                  onChange={(e) => setProdForm({...prodForm, description: e.target.value})}
                  placeholder="Descreva detalhes como dimensões, material e instruções."
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={prodForm.active}
                    onChange={(e) => setProdForm({...prodForm, active: e.target.checked})}
                    className={styles.chkInput}
                  />
                  <span>Disponibilizar produto para venda imediatamente</span>
                </label>
              </div>

              <button type="submit" className={styles.btnSaveModal}>
                Salvar Produto
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
