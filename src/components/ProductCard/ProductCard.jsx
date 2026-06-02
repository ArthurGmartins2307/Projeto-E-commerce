import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, ShoppingBag, Info } from 'lucide-react';
import { formatCurrency, mapProductCategory, mapProductCategoryClass } from '../../utils/helpers';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { addToCart, toggleFavorite, favorites, ngos } = useApp();
  const [quantity, setQuantity] = useState(1);

  const isFavorited = favorites.includes(product.id);
  const matchedNgo = ngos.find(n => n.id === product.ngo_id);
  const ngoName = matchedNgo ? matchedNgo.name : 'ONG Parceira';

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1); // Reset
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className={`${styles.card} animate-fade-in`}>
      <div className={styles.imageWrapper}>
        <img src={product.image} alt={product.name} className={styles.productImage} />
        
        <span className={`category-badge ${mapProductCategoryClass(product.category)} ${styles.categoryBadge}`}>
          {mapProductCategory(product.category)}
        </span>

        <button
          onClick={() => toggleFavorite(product.id)}
          className={`${styles.favoriteBtn} ${isFavorited ? styles.favorited : ''}`}
          aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
        </button>

        {isOutOfStock && (
          <div className={styles.outOfStockOverlay}>
            <span>Esgotado</span>
          </div>
        )}
      </div>

      <div className={styles.body}>
        <h4 className={styles.name}>{product.name}</h4>
        <div className={styles.priceContainer}>
          <span className={styles.price}>{formatCurrency(product.price)}</span>
          <span className={styles.stock}>
            {isOutOfStock ? (
              <span className={styles.stockNone}>Sem estoque</span>
            ) : (
              <span>Estoque: {product.stock}</span>
            )}
          </span>
        </div>

        {/* Badge de Impacto Social / ONG Apoiada */}
        <div className={styles.impactBadge} title={`${product.donation_percentage}% desta compra vai para a ONG ${ngoName}`}>
          <div className={styles.impactBadgeHeader}>
            <span className={styles.percentageText}>{product.donation_percentage}%</span>
            <span className={styles.donationLabel}>de Doação</span>
          </div>
          <p className={styles.ngoLabel}>
            destinados à <strong>ONG {ngoName}</strong>
          </p>
        </div>
      </div>

      <div className={styles.footer}>
        {!isOutOfStock ? (
          <>
            <div className={styles.qtyContainer}>
              <button 
                type="button" 
                className={styles.qtyBtn} 
                onClick={handleDecrement}
                disabled={quantity <= 1}
                aria-label="Diminuir quantidade"
              >
                -
              </button>
              <span className={styles.qtyValue}>{quantity}</span>
              <button 
                type="button" 
                className={styles.qtyBtn} 
                onClick={handleIncrement}
                disabled={quantity >= product.stock}
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              className={styles.buyBtn}
              aria-label={`Adicionar ${product.name} ao carrinho`}
            >
              <ShoppingBag size={16} />
              Comprar
            </button>
          </>
        ) : (
          <button
            className={styles.buyBtnDisabled}
            disabled
          >
            Produto Indisponível
          </button>
        )}
      </div>
    </div>
  );
}
