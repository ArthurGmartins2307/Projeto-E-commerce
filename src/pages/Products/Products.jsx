import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { formatCurrency, mapProductCategory, mapNgoCategory } from '../../utils/helpers';
import styles from './Products.module.css';

export default function Products() {
  const { products, ngos } = useApp();
  const location = useLocation();

  // Estados dos Filtros
  const [selectedProdCategories, setSelectedProdCategories] = useState([]);
  const [selectedNgoCategories, setSelectedNgoCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(250); // Slider interativo de R$0 a R$300
  const [sortBy, setSortBy] = useState('relevant'); // relevant | priceAsc | priceDesc | donationDesc | nameAsc
  const [localSearch, setLocalSearch] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sincroniza busca vinda da URL (ex: ?busca=sabonete ou ?id=prod-1)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('busca');
    const id = params.get('id');

    if (query) {
      setLocalSearch(query);
    } else if (id) {
      // Busca produto pelo ID e preenche a pesquisa local
      const matched = products.find(p => p.id === id);
      if (matched) {
        setLocalSearch(matched.name);
      }
    } else {
      setLocalSearch('');
    }
  }, [location.search, products]);

  // Lista de categorias de produtos disponíveis
  const productCategoriesList = [
    { key: 'Household', display: 'Doméstico' },
    { key: 'Clothing', display: 'Roupa' },
    { key: 'Beauty', display: 'Beleza' },
    { key: 'Cleaning', display: 'Limpeza' },
    { key: 'Electronics', display: 'Eletroeletrônico' },
    { key: 'Kids', display: 'Infantil' },
    { key: 'Pets', display: 'Pet' }
  ];

  // Lista de categorias de ONGs disponíveis
  const ngoCategoriesList = [
    { key: 'Animal Welfare', display: 'Animal' },
    { key: 'Social Causes', display: 'Social' },
    { key: 'Education', display: 'Educação' },
    { key: 'Health', display: 'Saúde' },
    { key: 'Environment', display: 'Meio Ambiente' }
  ];

  // Alterna filtros de categorias de produtos
  const handleProdCatChange = (category) => {
    setSelectedProdCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Alterna filtros de causas das ONGs
  const handleNgoCatChange = (category) => {
    setSelectedNgoCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Limpa todos os filtros
  const handleClearFilters = () => {
    setSelectedProdCategories([]);
    setSelectedNgoCategories([]);
    setPriceRange(250);
    setLocalSearch('');
    setSortBy('relevant');
  };

  // Lógica de Filtragem e Ordenação em tempo real (Memoizada para excelente performance)
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.active);

    // 1. Filtro de Pesquisa Local (Nome ou descrição)
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    // 2. Filtro de Categorias do Produto
    if (selectedProdCategories.length > 0) {
      result = result.filter(p => selectedProdCategories.includes(p.category));
    }

    // 3. Filtro de Categorias de ONGs Apoiadas pelo Produto
    if (selectedNgoCategories.length > 0) {
      result = result.filter(p => {
        const productNgo = ngos.find(n => n.id === p.ngo_id);
        return productNgo && selectedNgoCategories.includes(productNgo.category);
      });
    }

    // 4. Filtro de Preço (Slider)
    result = result.filter(p => p.price <= priceRange);

    // 5. Ordenação
    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'donationDesc') {
      result.sort((a, b) => b.donation_percentage - a.donation_percentage);
    } else if (sortBy === 'nameAsc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, ngos, localSearch, selectedProdCategories, selectedNgoCategories, priceRange, sortBy]);

  return (
    <div className={`${styles.pageContainer} container animate-fade-in`}>
      {/* Topo da página: Título e Barra de Pesquisa */}
      <div className={styles.pageHeader}>
        <div className={styles.titleSection}>
          <span className={styles.subTitle}>Catálogo de Impacto</span>
          <h1 className={styles.title}>Nossos Produtos Solidários</h1>
          <p className={styles.desc}>
            Cada produto comprado destina um percentual para uma causa. Filtre por categorias de produtos ou causas de ONGs parceiras!
          </p>
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Pesquisar nos produtos..." 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className={styles.searchInput}
            />
            {localSearch && (
              <button 
                type="button" 
                onClick={() => setLocalSearch('')}
                className={styles.clearSearchBtn}
                aria-label="Limpar pesquisa"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid de Conteúdo */}
      <div className={styles.contentGrid}>
        
        {/* Barra Lateral de Filtros (Desktop) */}
        <aside className={`${styles.sidebar} ${isMobileFiltersOpen ? styles.sidebarMobileOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <h3>Filtrar por</h3>
            <button onClick={handleClearFilters} className={styles.btnClearFilters}>
              Limpar tudo
            </button>
            <button 
              onClick={() => setIsMobileFiltersOpen(false)} 
              className={styles.closeFiltersBtn}
              aria-label="Fechar filtros"
            >
              <X size={18} />
            </button>
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Categorias de Produtos</h4>
            <div className={styles.optionsList}>
              {productCategoriesList.map(cat => (
                <label key={cat.key} className={styles.optionLabel}>
                  <input
                    type="checkbox"
                    checked={selectedProdCategories.includes(cat.key)}
                    onChange={() => handleProdCatChange(cat.key)}
                    className={styles.checkboxInput}
                  />
                  <span>{cat.display}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Causas das ONGs</h4>
            <div className={styles.optionsList}>
              {ngoCategoriesList.map(cat => (
                <label key={cat.key} className={styles.optionLabel}>
                  <input
                    type="checkbox"
                    checked={selectedNgoCategories.includes(cat.key)}
                    onChange={() => handleNgoCatChange(cat.key)}
                    className={styles.checkboxInput}
                  />
                  <span>{cat.display}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.priceHeader}>
              <h4 className={styles.filterTitle}>Preço Máximo</h4>
              <span className={styles.priceValue}>{formatCurrency(priceRange)}</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="300" 
              step="5"
              value={priceRange} 
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className={styles.priceSlider}
            />
            <div className={styles.sliderLimits}>
              <span>R$ 20</span>
              <span>R$ 300</span>
            </div>
          </div>
        </aside>

        {/* Listagem de Produtos */}
        <main className={styles.mainContent}>
          
          {/* Controles de Ordenação e Filtros Mobile */}
          <div className={styles.controlsBar}>
            <div className={styles.resultsCount}>
              Exibindo <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'produto' : 'produtos'}
            </div>

            <div className={styles.controlsActions}>
              <button 
                onClick={() => setIsMobileFiltersOpen(true)} 
                className={styles.mobileFiltersBtn}
              >
                <SlidersHorizontal size={16} />
                Filtros
              </button>

              <div className={styles.sortSelector}>
                <ArrowUpDown size={14} className={styles.sortIcon} />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                  aria-label="Ordenar produtos"
                >
                  <option value="relevant">Mais Relevantes</option>
                  <option value="priceAsc">Menor Preço</option>
                  <option value="priceDesc">Maior Preço</option>
                  <option value="donationDesc">Maior Doação (%)</option>
                  <option value="nameAsc">Nome (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid de Cartões de Produtos */}
          {filteredProducts.length === 0 ? (
            <div className={styles.noProducts}>
              <div className={styles.noProductsIcon}>🔍</div>
              <h3>Nenhum produto encontrado</h3>
              <p>Tente alterar seus termos de pesquisa ou remover alguns dos filtros selecionados.</p>
              <button onClick={handleClearFilters} className={styles.btnResetSearch}>
                Redefinir Filtros
              </button>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {filteredProducts.map(product => (
                <div key={product.id} className={styles.gridItem}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
