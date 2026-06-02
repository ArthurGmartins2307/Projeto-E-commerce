import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import NgoCard from '../../components/NgoCard/NgoCard';
import { Search } from 'lucide-react';
import { mapNgoCategory } from '../../utils/helpers';
import styles from './Ngos.module.css';

export default function Ngos() {
  const { ngos } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // all | Animal Welfare | Social Causes | ...

  const categories = [
    { key: 'all', display: 'Todas as Causas' },
    { key: 'Animal Welfare', display: 'Causa Animal' },
    { key: 'Social Causes', display: 'Social' },
    { key: 'Education', display: 'Educação' },
    { key: 'Health', display: 'Saúde' },
    { key: 'Environment', display: 'Meio Ambiente' },
    { key: 'Culture', display: 'Cultura' }
  ];

  const filteredNgos = useMemo(() => {
    let result = ngos;

    // Filtro por categoria
    if (activeCategory !== 'all') {
      result = result.filter(n => n.category === activeCategory);
    }

    // Filtro de pesquisa
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(n => 
        n.name.toLowerCase().includes(q) || 
        n.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [ngos, activeCategory, search]);

  return (
    <div className={`${styles.pageContainer} container animate-fade-in`}>
      <div className={styles.header}>
        <span className={styles.sub}>Nossas Parceiras</span>
        <h1 className={styles.title}>ONGs e Causas Apoiadas</h1>
        <p className={styles.desc}>
          Conheça as organizações parceiras da Consolidar. Ao adquirir produtos com selo social, você destina repasses diretos para impulsionar essas causas transformadoras.
        </p>

        {/* Barra de Pesquisa Local */}
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou história da ONG..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Pílulas de Filtro de Categoria */}
        <div className={styles.filterPills}>
          {categories.map(cat => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`${styles.pillBtn} ${activeCategory === cat.key ? styles.pillActive : ''}`}
            >
              {cat.display}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de ONGs */}
      {filteredNgos.length === 0 ? (
        <div className={styles.noResults}>
          <h3>Nenhuma ONG encontrada</h3>
          <p>Tente alterar sua pesquisa ou escolher outra categoria de causa.</p>
        </div>
      ) : (
        <div className={styles.ngosGrid}>
          {filteredNgos.map(ngo => (
            <div key={ngo.id} className={styles.gridItem}>
              <NgoCard ngo={ngo} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
