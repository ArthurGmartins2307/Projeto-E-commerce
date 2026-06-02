import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, ShoppingBag, User, LogOut, Settings, Award, History, Heart, Star, LayoutDashboard, Menu, X, Moon, Sun } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import styles from './Header.module.css';

export default function Header() {
  const {
    currentUser,
    logout,
    cart,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    theme,
    toggleTheme
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Fecha o dropdown de perfil ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fecha menus móveis nas mudanças de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
    setIsSearchFocused(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/produtos?busca=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (type, id) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    if (type === 'product') {
      navigate(`/produtos?id=${id}`);
    } else if (type === 'ngo') {
      navigate(`/ong/${id}`);
    }
  };

  const handleSmoothScroll = (selector) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      // Aguarda navegação e faz scroll
      setTimeout(() => {
        const el = document.querySelector(selector);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProfileOptionClick = (hash) => {
    setIsProfileOpen(false);
    navigate(`/perfil${hash}`);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className={styles.header}>
      <div className={`${styles.container} container`}>
        {/* Lado Esquerdo - Logo Consolidar */}
        <Link to="/" className={styles.logoLink} aria-label="Ir para a Página Inicial Consolidar">
          <svg viewBox="0 0 160 40" className={styles.logoSvg}>
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2A9D8F" />
                <stop offset="100%" stopColor="#264653" />
              </linearGradient>
            </defs>
            {/* Ícone de Mão com Coração/Folha */}
            <path 
              d="M15,22 C20,13 32,13 32,22 C32,28 25,33 23.5,35 L23.5,35 C23.5,35 15,28 15,22 Z" 
              fill="url(#logoGrad)" 
            />
            <circle cx="23.5" cy="22" r="4.5" fill="#E9C46A" />
            
            {/* Texto da Logo */}
            <text 
              x="42" 
              y="28" 
              fontFamily="Nunito" 
              fontWeight="900" 
              fontSize="22" 
              fill="var(--turquoise-green)"
            >
              consolidar
            </text>
          </svg>
        </Link>

        {/* Centro - Navegação Principal (Desktop) */}
        <nav className={styles.desktopNav}>
          <Link to="/" className={styles.navLink}>Início</Link>
          <button 
            type="button" 
            onClick={() => handleSmoothScroll('#sobre-nos')} 
            className={styles.navLinkBtn}
          >
            Sobre Nós
          </button>
          <Link to="/ongs" className={styles.navLink}>ONGs</Link>
          <Link to="/produtos" className={styles.navLink}>Produtos</Link>
        </nav>

        {/* Lado Direito - Busca Global, Carrinho, Usuário */}
        <div className={styles.actions}>
          
          {/* Busca Global Inteligente (Desktop) */}
          <div ref={searchRef} className={styles.searchWrapper}>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Pesquisar ONGs ou produtos..."
                className={styles.searchInput}
                aria-label="Pesquisa global por produtos ou causas"
              />
              <button type="submit" className={styles.searchBtn} aria-label="Pesquisar">
                <Search size={18} />
              </button>
            </form>

            {/* Dropdown de Sugestões de Busca */}
            {isSearchFocused && (searchQuery.trim().length > 0) && (
              <div className={styles.searchDropdown}>
                {searchResults.ngos.length === 0 && searchResults.products.length === 0 ? (
                  <div className={styles.noResults}>Nenhum resultado encontrado</div>
                ) : (
                  <>
                    {searchResults.ngos.length > 0 && (
                      <div className={styles.searchSection}>
                        <span className={styles.sectionTitle}>ONGs Parceiras</span>
                        {searchResults.ngos.map(ngo => (
                          <button
                            key={ngo.id}
                            onClick={() => handleSuggestionClick('ngo', ngo.id)}
                            className={styles.suggestionItem}
                            type="button"
                          >
                            <img src={ngo.logo} alt="" className={styles.suggestionThumb} />
                            <div className={styles.suggestionInfo}>
                              <span className={styles.suggestionName}>{ngo.name}</span>
                              <span className={styles.suggestionMeta}>ONG • {ngo.category}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchResults.products.length > 0 && (
                      <div className={styles.searchSection}>
                        <span className={styles.sectionTitle}>Produtos Solidários</span>
                        {searchResults.products.map(prod => (
                          <button
                            key={prod.id}
                            onClick={() => handleSuggestionClick('product', prod.id)}
                            className={styles.suggestionItem}
                            type="button"
                          >
                            <img src={prod.image} alt="" className={styles.suggestionThumb} />
                            <div className={styles.suggestionInfo}>
                              <span className={styles.suggestionName}>{prod.name}</span>
                              <span className={styles.suggestionMeta}>Produto • {formatCurrency(prod.price)}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className={styles.themeToggleBtn}
            aria-label={`Mudar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Carrinho de Compras */}
          <button 
            onClick={() => setIsCartOpen(true)} 
            className={styles.cartIconBtn}
            aria-label="Abrir sacola de compras"
          >
            <ShoppingBag size={20} />
            {cartItemsCount > 0 && (
              <span className={styles.cartBadge}>{cartItemsCount}</span>
            )}
          </button>

          {/* Perfil do Usuário */}
          <div ref={dropdownRef} className={styles.profileWrapper}>
            {currentUser ? (
              <>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={styles.avatarBtn}
                  aria-label="Abrir menu de perfil"
                >
                  <img 
                    src={currentUser.profile_image} 
                    alt={currentUser.name} 
                    className={styles.userAvatar} 
                  />
                </button>

                {isProfileOpen && (
                  <div className={styles.profileDropdown}>
                    <div className={styles.dropdownHeader}>
                      <span className={styles.userName}>{currentUser.name}</span>
                      <span className={styles.userEmail}>{currentUser.email}</span>
                      <span className={styles.pointsBadge}>{currentUser.points || 0} pts</span>
                    </div>

                    <div className={styles.dropdownDivider}></div>

                    {/* Rotas Administrativas */}
                    {currentUser.user_type === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsProfileOpen(false)}
                        className={`${styles.dropdownItem} ${styles.adminItem}`}
                      >
                        <LayoutDashboard size={16} />
                        <span>Painel Admin</span>
                      </Link>
                    )}

                    <button 
                      onClick={() => handleProfileOptionClick('')} 
                      className={styles.dropdownItem}
                    >
                      <User size={16} />
                      <span>Meu Perfil</span>
                    </button>

                    <button 
                      onClick={() => handleProfileOptionClick('#pontos')} 
                      className={styles.dropdownItem}
                    >
                      <Award size={16} />
                      <span>Meus Pontos</span>
                    </button>

                    <button 
                      onClick={() => handleProfileOptionClick('#compras')} 
                      className={styles.dropdownItem}
                    >
                      <History size={16} />
                      <span>Minhas Compras</span>
                    </button>

                    <button 
                      onClick={() => handleProfileOptionClick('#favoritos')} 
                      className={styles.dropdownItem}
                    >
                      <Heart size={16} />
                      <span>Favoritos</span>
                    </button>

                    <button 
                      onClick={() => handleProfileOptionClick('#avaliacoes')} 
                      className={styles.dropdownItem}
                    >
                      <Star size={16} />
                      <span>Avaliações</span>
                    </button>

                    <button 
                      onClick={() => handleProfileOptionClick('#configuracoes')} 
                      className={styles.dropdownItem}
                    >
                      <Settings size={16} />
                      <span>Configurações</span>
                    </button>

                    <div className={styles.dropdownDivider}></div>

                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }} 
                      className={`${styles.dropdownItem} ${styles.logoutItem}`}
                    >
                      <LogOut size={16} />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link 
                to="/auth" 
                className={styles.loginBtn}
                aria-label="Entrar ou Cadastrar-se na Consolidar"
              >
                <User size={16} />
                <span className={styles.loginBtnText}>Entrar</span>
              </Link>
            )}
          </div>

          {/* Hamburguer (Dispositivos Móveis) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className={styles.mobileHamburger}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Lateral Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className={styles.mobileDrawerBg} onClick={() => setIsMobileMenuOpen(false)}>
          <div className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileDrawerHeader}>
              <span className={styles.drawerTitle}>Navegação</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            {/* Pesquisa no Mobile */}
            <div className={styles.mobileSearchContainer}>
              <form onSubmit={handleSearchSubmit} className={styles.mobileSearchForm}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar..."
                  className={styles.mobileSearchInput}
                />
                <button type="submit" className={styles.mobileSearchBtn}>
                  <Search size={16} />
                </button>
              </form>
            </div>

            <nav className={styles.mobileDrawerNav}>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileNavLink}>Início</Link>
              <button 
                type="button" 
                onClick={() => handleSmoothScroll('#sobre-nos')} 
                className={styles.mobileNavLink}
              >
                Sobre Nós
              </button>
              <Link to="/ongs" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileNavLink}>ONGs</Link>
              <Link to="/produtos" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileNavLink}>Produtos</Link>
              
              {!currentUser && (
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className={`${styles.mobileNavLink} ${styles.mobileAuthLink}`}>
                  Entrar / Cadastrar
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
