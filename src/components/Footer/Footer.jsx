import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, Heart, Shield, ArrowUp, MessageCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import styles from './Footer.module.css';

export default function Footer() {
  const { ngos } = useApp();

  // Calcula o valor acumulado em tempo real somando a arrecadação de todas as ONGs parceiras
  const totalRaised = ngos.reduce((sum, ngo) => sum + parseFloat(ngo.amount_raised || 0), 0);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      {/* Seção Principal */}
      <div className={`${styles.mainFooter} container`}>
        
        {/* Coluna 1: Marca & Contador de Transparência */}
        <div className={styles.brandCol}>
          <div className={styles.brandHeader}>
            <span className={styles.logoText}>consolidar</span>
          </div>
          <p className={styles.brandDesc}>
            Transformando o consumo diário em impacto social real. Cada produto que você adquire destina fundos diretos para causas e ONGs que mudam vidas.
          </p>

          {/* Contador de Transparência Dinâmico */}
          <div className={styles.liveCounter}>
            <div className={styles.counterHeader}>
              <Heart size={14} className={styles.heartIcon} fill="currentColor" />
              <span>Transparência em Tempo Real</span>
            </div>
            <div className={styles.counterValue}>
              {formatCurrency(totalRaised || 113900.00)}
            </div>
            <p className={styles.counterLabel}>Arrecadados para causas sociais</p>
          </div>
        </div>

        {/* Coluna 2: Institucional */}
        <div className={styles.linksCol}>
          <h4 className={styles.colTitle}>Institucional</h4>
          <ul className={styles.linksList}>
            <li><Link to="/#sobre-nos" className={styles.footerLink}>Sobre Nós</Link></li>
            <li><a href="#como-funciona" className={styles.footerLink}>Como Funciona</a></li>
            <li><a href="#transparencia" className={styles.footerLink}>Transparência</a></li>
            <li><a href="#seguranca" className={styles.footerLink}><Shield size={12} style={{ marginRight: '4px', display: 'inline' }} /> Segurança</a></li>
          </ul>
        </div>

        {/* Coluna 3: Links Rápidos */}
        <div className={styles.linksCol}>
          <h4 className={styles.colTitle}>Links Rápidos</h4>
          <ul className={styles.linksList}>
            <li><Link to="/" className={styles.footerLink}>Início</Link></li>
            <li><Link to="/ongs" className={styles.footerLink}>ONGs Parceiras</Link></li>
            <li><Link to="/produtos" className={styles.footerLink}>Produtos Solidários</Link></li>
            <li><Link to="/perfil" className={styles.footerLink}>Meu Perfil</Link></li>
          </ul>
        </div>

        {/* Coluna 4: Contatos & Redes */}
        <div className={styles.contactCol}>
          <h4 className={styles.colTitle}>Contato</h4>
          <ul className={styles.contactList}>
            <li>
              <Mail size={14} />
              <a href="mailto:contato@consolidar.org.br">contato@consolidar.org.br</a>
            </li>
            <li>
              <Phone size={14} />
              <span>(11) 3254-9988</span>
            </li>
            <li>
              <MessageCircle size={14} className={styles.wpIcon} />
              <a href="https://wa.me/5511987654321" target="_blank" rel="noopener noreferrer">WhatsApp: (11) 98765-4321</a>
            </li>
          </ul>

          <div className={styles.socialWrapper}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Barra de Direitos e Rodapé Inferior */}
      <div className={styles.bottomFooter}>
        <div className={`${styles.bottomContainer} container`}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Consolidar S.A. Todos os direitos reservados. Feito com amor por causas sociais.
          </p>
          <button 
            onClick={handleScrollToTop} 
            className={styles.scrollTopBtn}
            aria-label="Voltar para o topo da página"
          >
            Voltar ao topo
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
