import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Globe, Phone, Mail, Heart, Calendar, Target, ChevronLeft, ArrowRight } from 'lucide-react';
import { formatCurrency, mapNgoCategory, mapNgoCategoryClass, calculatePercentage } from '../../utils/helpers';
import styles from './NgoDetails.module.css';

export default function NgoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ngos, products } = useApp();
  
  const [ngo, setNgo] = useState(null);
  const [activePhoto, setActivePhoto] = useState('');

  // Encontra a ONG selecionada
  useEffect(() => {
    const matchedNgo = ngos.find(n => n.id === id);
    if (matchedNgo) {
      setNgo(matchedNgo);
      if (matchedNgo.photos && matchedNgo.photos.length > 0) {
        setActivePhoto(matchedNgo.photos[0]);
      }
    }
  }, [id, ngos]);

  // Filtra produtos relacionados a esta ONG
  const relatedProducts = useMemo(() => {
    return products.filter(p => p.ngo_id === id && p.active);
  }, [id, products]);

  if (!ngo) {
    return (
      <div className={`${styles.loaderContainer} container`}>
        <p>Carregando detalhes da ONG...</p>
        <Link to="/" className={styles.btnBackHome}>Voltar ao Início</Link>
      </div>
    );
  }

  const percentage = calculatePercentage(ngo.amount_raised, ngo.fundraising_goal);

  return (
    <div className={`${styles.pageContainer} container animate-fade-in`}>
      {/* Botão Voltar */}
      <button 
        type="button" 
        onClick={() => navigate(-1)} 
        className={styles.backBtn}
      >
        <ChevronLeft size={16} />
        Voltar para a página anterior
      </button>

      {/* Cabeçalho da ONG com Logo e Nome */}
      <div className={styles.ngoHeader}>
        <div className={styles.headerInfo}>
          <img src={ngo.logo} alt={`Logo de ${ngo.name}`} className={styles.ngoLogo} />
          
          <div className={styles.headerText}>
            <span className={`category-badge ${mapNgoCategoryClass(ngo.category)}`}>
              {mapNgoCategory(ngo.category)}
            </span>
            <h1 className={styles.ngoName}>{ngo.name}</h1>
            <p className={styles.ngoShortDesc}>{ngo.description}</p>
          </div>
        </div>

        {/* Caixa de Doações / Metas */}
        <div className={styles.donationWidget}>
          <div className={styles.widgetHeader}>
            <span className={styles.widgetTitle}>
              <Heart size={16} fill="currentColor" />
              Impacto Gerado
            </span>
            <span className={styles.widgetPercent}>{percentage}%</span>
          </div>

          <div className={styles.progressBarBg}>
            <div 
              className={styles.progressBarFill} 
              style={{ width: `${percentage}%` }}
              role="progressbar"
              aria-valuenow={percentage}
            ></div>
          </div>

          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <span>Já Arrecadado:</span>
              <strong>{formatCurrency(ngo.amount_raised)}</strong>
            </div>
            <div className={styles.valueItem}>
              <span>Meta Atual:</span>
              <strong>{formatCurrency(ngo.fundraising_goal)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Informações: História, Missão, Mídias */}
      <div className={styles.detailsGrid}>
        
        {/* Lado Esquerdo - Detalhes da Causa */}
        <div className={styles.leftCol}>
          <section className={styles.sectionCard}>
            <h2>Nossa História</h2>
            <p className={styles.storyText}>{ngo.story || "Esta ONG ainda não cadastrou sua história detalhada."}</p>
          </section>

          <section className={styles.sectionCard}>
            <h2>Nossa Missão</h2>
            <div className={styles.missionBox}>
              <p className={styles.missionText}>"{ngo.mission || "Garantir assistência e conscientização social."}"</p>
            </div>
          </section>

          {/* Galeria de Fotos */}
          {ngo.photos && ngo.photos.length > 0 && (
            <section className={styles.sectionCard}>
              <h2>Imagens de Nossas Ações</h2>
              <div className={styles.galleryWrapper}>
                <div className={styles.activePhotoWrapper}>
                  <img src={activePhoto} alt="Ação da ONG" className={styles.bigPhoto} />
                </div>
                <div className={styles.thumbnailsGrid}>
                  {ngo.photos.map((photo, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActivePhoto(photo)}
                      className={`${styles.thumbBtn} ${activePhoto === photo ? styles.thumbActive : ''}`}
                    >
                      <img src={photo} alt={`Miniatura ${index + 1}`} className={styles.thumbImage} />
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Lado Direito - Contatos & Redes */}
        <div className={styles.rightCol}>
          <div className={styles.contactsCard}>
            <h3>Contatos e Informações</h3>
            
            <div className={styles.contactItem}>
              <Globe size={16} className={styles.contactIcon} />
              <div>
                <span>Website</span>
                <a href={`https://${ngo.website}`} target="_blank" rel="noopener noreferrer">
                  {ngo.website || 'Não cadastrado'}
                </a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <Phone size={16} className={styles.contactIcon} />
              <div>
                <span>Telefone</span>
                <a href={`tel:${ngo.phone}`}>{ngo.phone || 'Não cadastrado'}</a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <Mail size={16} className={styles.contactIcon} />
              <div>
                <span>E-mail</span>
                <a href={`mailto:${ngo.email}`}>{ngo.email || 'Não cadastrado'}</a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <Calendar size={16} className={styles.contactIcon} />
              <div>
                <span>Parceira Desde</span>
                <span>{ngo.created_at ? new Date(ngo.created_at).toLocaleDateString('pt-BR') : '2026'}</span>
              </div>
            </div>

            <div className={styles.ctaBox}>
              <p>Quer doar diretamente para a {ngo.name}?</p>
              <a 
                href={`https://${ngo.website}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.btnDonateDirect}
              >
                Acessar Site Oficial
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Seção de Produtos Parceiros */}
      <section className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <h2>Produtos Associados à ONG</h2>
          <p>Adquira qualquer um desses produtos e destine uma porcentagem do valor diretamente para a <strong>{ngo.name}</strong>.</p>
        </div>

        {relatedProducts.length === 0 ? (
          <div className={styles.noProductsBox}>
            <p>Nenhum produto cadastrado para esta ONG no momento.</p>
            <Link to="/produtos" className={styles.btnExploreAll}>
              Explorar Outros Produtos
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
