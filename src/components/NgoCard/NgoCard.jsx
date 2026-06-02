import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Target } from 'lucide-react';
import { formatCurrency, mapNgoCategory, mapNgoCategoryClass, calculatePercentage } from '../../utils/helpers';
import styles from './NgoCard.module.css';

export default function NgoCard({ ngo }) {
  const percentage = calculatePercentage(ngo.amount_raised, ngo.fundraising_goal);

  return (
    <div className={`${styles.card} animate-fade-in`}>
      <div className={styles.imageWrapper}>
        <img src={ngo.logo} alt={`Logo de ${ngo.name}`} className={styles.logo} />
        <span className={`category-badge ${mapNgoCategoryClass(ngo.category)} ${styles.badge}`}>
          {mapNgoCategory(ngo.category)}
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{ngo.name}</h3>
        <p className={styles.description}>{ngo.description}</p>

        <div className={styles.progressContainer}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>
              <Heart size={14} className={styles.progressIcon} />
              Arrecadado
            </span>
            <span className={styles.percentValue}>{percentage}%</span>
          </div>
          <div className={styles.progressBarBg}>
            <div 
              className={styles.progressBarFill} 
              style={{ width: `${percentage}%` }}
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div className={styles.progressFooter}>
            <span className={styles.raised}>{formatCurrency(ngo.amount_raised)}</span>
            <span className={styles.goal}>Meta: {formatCurrency(ngo.fundraising_goal)}</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <Link to={`/ong/${ngo.id}`} className={styles.btnLink}>
          Saiba Mais
        </Link>
      </div>
    </div>
  );
}
