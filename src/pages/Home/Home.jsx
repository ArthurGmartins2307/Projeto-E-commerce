import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import NgoCard from '../../components/NgoCard/NgoCard';
import StarRating from '../../components/StarRating/StarRating';
import { Heart, Users, ShoppingBag, Target, ArrowLeft, ArrowRight, Award, Eye, Handshake, Sprout } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { dbReports } from '../../services/db';
import styles from './Home.module.css';

// Componente para contador animado em React
function AnimatedCounter({ targetValue, duration = 1500, isCurrency = false }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(targetValue);
    if (end === 0) return;
    
    const totalMiliseconds = duration;
    const incrementTime = 30;
    const totalSteps = totalMiliseconds / incrementTime;
    const stepValue = end / totalSteps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [targetValue, duration]);

  if (isCurrency) {
    return <span>{formatCurrency(count)}</span>;
  }
  return <span>{Math.floor(count).toLocaleString('pt-BR')}</span>;
}

export default function Home() {
  const { ngos, reviews } = useApp();
  const [stats, setStats] = useState({ donations: 113900, salesCount: 380, usersCount: 220 });
  const carouselRef = useRef(null);

  // Carrega estatísticas consolidadas
  useEffect(() => {
    async function loadStats() {
      try {
        const report = await dbReports.getAdminReport();
        setStats({
          donations: report.totals.donations,
          // Simula vendas totais e usuários
          salesCount: report.totals.sales * 1.5 + 140, 
          usersCount: report.totals.usersCount * 45 + 98
        });
      } catch (error) {
        console.error(error);
      }
    }
    loadStats();
  }, [ngos]);

  // Navegação do Carrossel Customizado
  const handleScrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320; // Tamanho aproximado do card + gap
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleContribuaClick = () => {
    const el = document.getElementById('ongs-parceiras');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Pega apenas as avaliações aprovadas
  const approvedReviews = reviews.filter(r => r.approved !== false).slice(0, 4);

  return (
    <div className={styles.homeContainer}>
      
      {/* 1. SEÇÃO HERO - BANNER DE ALTO IMPACTO */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={`${styles.heroContent} container`}>
          <span className={styles.heroSub}>Consumir com Propósito</span>
          <h1 className={styles.heroTitle}>
            Transforme suas compras em <span className={styles.highlight}>impacto social.</span>
          </h1>
          <p className={styles.heroText}>
            Apoie ONGs e contribua para causas importantes através de cada compra realizada. Na Consolidar, parte de toda transação é doada sem custar nada a mais para você.
          </p>
          <button 
            type="button" 
            onClick={handleContribuaClick} 
            className={styles.heroBtn}
          >
            Contribua Agora
          </button>
        </div>
      </section>

      {/* 2. SEÇÃO DE ESTATÍSTICAS DE IMPACTO ANIMADAS */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            
            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.color1}`}>
                <Heart size={24} fill="currentColor" />
              </div>
              <div className={styles.statInfo}>
                <h3 className={styles.statValue}>
                  <AnimatedCounter targetValue={stats.donations} isCurrency={true} />
                </h3>
                <p className={styles.statLabel}>Valor Arrecadado</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.color2}`}>
                <Target size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3 className={styles.statValue}>
                  <AnimatedCounter targetValue={ngos.length || 6} />
                </h3>
                <p className={styles.statLabel}>ONGs Apoiadas</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.color3}`}>
                <ShoppingBag size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3 className={styles.statValue}>
                  <AnimatedCounter targetValue={stats.salesCount} />
                </h3>
                <p className={styles.statLabel}>Produtos Vendidos</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.color4}`}>
                <Users size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3 className={styles.statValue}>
                  <AnimatedCounter targetValue={stats.usersCount} />
                </h3>
                <p className={styles.statLabel}>Usuários Cadastrados</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CARROSSEL DE ONGS PARCEIRAS */}
      <section id="ongs-parceiras" className={styles.ngosSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionSub}>Quem nos ajuda a transformar</span>
              <h2 className={styles.sectionTitle}>Nossas ONGs Parceiras</h2>
            </div>
            <div className={styles.carouselArrows}>
              <button 
                onClick={() => handleScrollCarousel('left')} 
                className={styles.arrowBtn}
                aria-label="ONG anterior"
              >
                <ArrowLeft size={18} />
              </button>
              <button 
                onClick={() => handleScrollCarousel('right')} 
                className={styles.arrowBtn}
                aria-label="Próxima ONG"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div ref={carouselRef} className={styles.ngoCarouselTrack}>
            {ngos.map(ngo => (
              <div key={ngo.id} className={styles.ngoCarouselItem}>
                <NgoCard ngo={ngo} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SEÇÃO QUEM SOMOS (DUAS COLUNAS) */}
      <section id="sobre-nos" className={styles.aboutSection}>
        <div className={`${styles.aboutContainer} container`}>
          <div className={styles.aboutLeft}>
            <img 
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80" 
              alt="Voluntários da Consolidar reunidos em ação comunitária" 
              className={styles.aboutImg} 
            />
            <div className={styles.aboutBadge}>
              <Award size={32} className={styles.aboutBadgeIcon} />
              <div>
                <h4>Impacto 100%</h4>
                <p>Transparência auditada</p>
              </div>
            </div>
          </div>

          <div className={styles.aboutRight}>
            <span className={styles.aboutSub}>Por trás da Consolidar</span>
            <h2 className={styles.aboutTitle}>Quem Somos</h2>
            <p className={styles.aboutText}>
              A <strong>Consolidar</strong> é um ecossistema digital que nasceu com a missão de redefinir o comércio eletrônico. Acreditamos que cada transação financeira pode ser um veículo de transformação positiva para o planeta e a sociedade.
            </p>

            <div className={styles.pillarsGrid}>
              <div className={styles.pillar}>
                <div className={styles.pillarIcon}><Target size={18} /> Missão</div>
                <p>Conectar lojistas conscientes, consumidores engajados e causas sociais legítimas em uma única rede de impacto transparente.</p>
              </div>
              <div className={styles.pillar}>
                <div className={styles.pillarIcon}><Eye size={18} /> Visão</div>
                <p>Tornar-se a principal plataforma de marketplace solidário do país, inspirando marcas e pessoas a consumirem com propósito de vida.</p>
              </div>
              <div className={styles.pillar}>
                <div className={styles.pillarIcon}><Handshake size={18} /> Valores</div>
                <p>Transparência total, responsabilidade social, empatia animal, preservação ambiental e integridade profissional em cada atitude.</p>
              </div>
              <div className={styles.pillar}>
                <div className={styles.pillarIcon}><Sprout size={18} /> Impacto</div>
                <p>Garantir que cada centavo destinado às ONGs parceiras seja monitorado e devidamente auditado, fortalecendo a confiança dos doadores.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEÇÃO DE AVALIAÇÕES (REVIEWS) */}
      <section className={styles.reviewsSection}>
        <div className="container">
          <div className={styles.reviewsHeader}>
            <span className={styles.reviewsSub}>O que dizem sobre nós</span>
            <h2 className={styles.reviewsTitle}>Depoimentos de Impacto</h2>
            <p className={styles.reviewsDesc}>Veja a opinião de quem compra e ajuda a construir um mundo melhor diariamente.</p>
          </div>

          <div className={styles.reviewsGrid}>
            {approvedReviews.map((rev) => (
              <div key={rev.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <img src={rev.user_avatar} alt={rev.user_name} className={styles.reviewAvatar} />
                  <div>
                    <h4 className={styles.reviewUser}>{rev.user_name}</h4>
                    <span className={styles.reviewDate}>
                      {new Date(rev.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <div className={styles.reviewStars}>
                  <StarRating rating={rev.rating} size={16} readOnly={true} />
                </div>
                
                <p className={styles.reviewText}>"{rev.comment}"</p>
                <div className={styles.productBadge}>
                  Comprado: <strong>{rev.product_name}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
