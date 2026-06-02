import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Trash2, Heart, ShieldCheck, CreditCard, DollarSign, FileText } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    checkout,
    currentUser,
    ngos
  } = useApp();

  // Estados do Formulário de Checkout
  const [address, setAddress] = useState({
    name: '',
    zip_code: '',
    address: '',
    number: '',
    complement: '',
    city: '',
    state: ''
  });

  const [payment, setPayment] = useState({
    method: 'Cartão', // Cartão | PIX | Boleto
    installments: '1'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preenche o nome do usuário atual no formulário se estiver logado
  useEffect(() => {
    if (currentUser) {
      setAddress(prev => ({ ...prev, name: currentUser.name }));
    }
  }, [currentUser]);

  if (!isCartOpen) return null;

  // Cálculos de Valores
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalDonation = cart.reduce((sum, item) => {
    const itemPrice = item.product.price * item.quantity;
    return sum + (itemPrice * (item.product.donation_percentage / 100));
  }, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment(prev => ({ ...prev, [name]: value }));
  };

  // Simular CEP para agilizar testes e melhorar a UX
  const handleSimulateZip = () => {
    setAddress(prev => ({
      ...prev,
      zip_code: '01310-200',
      address: 'Avenida Paulista',
      city: 'São Paulo',
      state: 'SP',
      number: '1000'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    // Validações Básicas
    if (!address.name || !address.zip_code || !address.address || !address.number || !address.city || !address.state) {
      alert("Por favor, preencha todos os campos obrigatórios do endereço.");
      return;
    }

    setIsSubmitting(true);
    const success = await checkout(address, payment);
    setIsSubmitting(false);

    if (success) {
      // Fecha o drawer
      setIsCartOpen(false);
      // Limpa dados de endereço
      setAddress({
        name: currentUser ? currentUser.name : '',
        zip_code: '',
        address: '',
        number: '',
        complement: '',
        city: '',
        state: ''
      });
    }
  };

  return (
    <div className={styles.overlay} onClick={() => setIsCartOpen(false)}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header do Drawer */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h2>Seu Carrinho</h2>
            <span className={styles.cartCount}>{cart.length} {cart.length === 1 ? 'item' : 'itens'}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setIsCartOpen(false)} 
            className={styles.closeBtn}
            aria-label="Fechar carrinho"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className={styles.body}>
          {cart.length === 0 ? (
            <div className={styles.emptyContainer}>
              <div className={styles.emptyIcon}>🛒</div>
              <h3>Carrinho vazio</h3>
              <p>Sua sacola está vazia. Que tal apoiar uma causa hoje mesmo comprando um de nossos produtos?</p>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className={styles.btnEmptyProducts}
              >
                Explorar Produtos
              </button>
            </div>
          ) : (
            <>
              {/* Lista de Itens */}
              <div className={styles.itemsList}>
                {cart.map((item) => {
                  const matchedNgo = ngos.find(n => n.id === item.product.ngo_id);
                  const ngoName = matchedNgo ? matchedNgo.name : 'ONG parceira';
                  
                  return (
                    <div key={item.product.id} className={styles.cartItem}>
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className={styles.itemImage} 
                      />
                      
                      <div className={styles.itemDetails}>
                        <h4 className={styles.itemName}>{item.product.name}</h4>
                        <span className={styles.itemNgo}>Apoia: {ngoName}</span>
                        
                        <div className={styles.itemRow}>
                          <div className={styles.qtyContainer}>
                            <button
                              type="button"
                              className={styles.qtyBtn}
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className={styles.qtyValue}>{item.quantity}</span>
                            <button
                              type="button"
                              className={styles.qtyBtn}
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          <span className={styles.itemPrice}>
                            {formatCurrency(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className={styles.itemRemoveBtn}
                        aria-label={`Remover ${item.product.name} do carrinho`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Caixa de Impacto e Resumo Financeiro */}
              <div className={styles.summaryBox}>
                <div className={styles.impactBox}>
                  <div className={styles.impactTitle}>
                    <Heart size={16} fill="currentColor" className={styles.heartIcon} />
                    <span>Seu Impacto nesta compra</span>
                  </div>
                  <div className={styles.impactValue}>
                    <span>Doação destinada às ONGs:</span>
                    <strong>{formatCurrency(totalDonation)}</strong>
                  </div>
                  <p className={styles.impactDisclaimer}>
                    Essa doação é paga pelo lojista, sem custo extra para você!
                  </p>
                </div>

                <div className={styles.financeRow}>
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className={`${styles.financeRow} ${styles.financeTotal}`}>
                  <span>Total Geral:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>

              {/* Formulário de Checkout */}
              <div className={styles.checkoutSection}>
                {currentUser ? (
                  <form onSubmit={handleSubmit} className={styles.checkoutForm}>
                    <div className={styles.sectionHeader}>
                      <h3>Endereço de Entrega</h3>
                      <button 
                        type="button" 
                        onClick={handleSimulateZip} 
                        className={styles.btnSimulate}
                        title="Preencher com endereço de teste"
                      >
                        Preencher CEP de Teste
                      </button>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="chk_name">Nome Completo *</label>
                      <input 
                        id="chk_name"
                        type="text" 
                        name="name" 
                        value={address.name} 
                        onChange={handleInputChange} 
                        placeholder="Nome completo do destinatário"
                        required 
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={`${styles.formGroup} ${styles.colZip}`}>
                        <label htmlFor="chk_zip">CEP *</label>
                        <input 
                          id="chk_zip"
                          type="text" 
                          name="zip_code" 
                          value={address.zip_code} 
                          onChange={handleInputChange} 
                          placeholder="00000-000"
                          maxLength="9"
                          required 
                        />
                      </div>
                      <div className={`${styles.formGroup} ${styles.colState}`}>
                        <label htmlFor="chk_state">Estado *</label>
                        <input 
                          id="chk_state"
                          type="text" 
                          name="state" 
                          value={address.state} 
                          onChange={handleInputChange} 
                          placeholder="UF"
                          maxLength="2"
                          required 
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="chk_address">Endereço *</label>
                      <input 
                        id="chk_address"
                        type="text" 
                        name="address" 
                        value={address.address} 
                        onChange={handleInputChange} 
                        placeholder="Rua, Avenida, etc."
                        required 
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={`${styles.formGroup} ${styles.colNumber}`}>
                        <label htmlFor="chk_number">Número *</label>
                        <input 
                          id="chk_number"
                          type="text" 
                          name="number" 
                          value={address.number} 
                          onChange={handleInputChange} 
                          placeholder="Nº"
                          required 
                        />
                      </div>
                      <div className={`${styles.formGroup} ${styles.colComp}`}>
                        <label htmlFor="chk_comp">Complemento</label>
                        <input 
                          id="chk_comp"
                          type="text" 
                          name="complement" 
                          value={address.complement} 
                          onChange={handleInputChange} 
                          placeholder="Apto, Sala, Bloco..." 
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="chk_city">Cidade *</label>
                      <input 
                        id="chk_city"
                        type="text" 
                        name="city" 
                        value={address.city} 
                        onChange={handleInputChange} 
                        placeholder="Cidade"
                        required 
                      />
                    </div>

                    {/* Método de Pagamento */}
                    <div className={styles.sectionHeader} style={{ marginTop: '20px' }}>
                      <h3>Método de Pagamento</h3>
                    </div>

                    <div className={styles.paymentSelector}>
                      <label className={`${styles.paymentOption} ${payment.method === 'Cartão' ? styles.paymentSelected : ''}`}>
                        <input 
                          type="radio" 
                          name="method" 
                          value="Cartão"
                          checked={payment.method === 'Cartão'}
                          onChange={handlePaymentChange}
                        />
                        <CreditCard size={18} />
                        <span>Cartão</span>
                      </label>

                      <label className={`${styles.paymentOption} ${payment.method === 'PIX' ? styles.paymentSelected : ''}`}>
                        <input 
                          type="radio" 
                          name="method" 
                          value="PIX"
                          checked={payment.method === 'PIX'}
                          onChange={handlePaymentChange}
                        />
                        <DollarSign size={18} />
                        <span>PIX</span>
                      </label>

                      <label className={`${styles.paymentOption} ${payment.method === 'Boleto' ? styles.paymentSelected : ''}`}>
                        <input 
                          type="radio" 
                          name="method" 
                          value="Boleto"
                          checked={payment.method === 'Boleto'}
                          onChange={handlePaymentChange}
                        />
                        <FileText size={18} />
                        <span>Boleto</span>
                      </label>
                    </div>

                    {payment.method === 'Cartão' && (
                      <div className={styles.formGroup} style={{ marginTop: '10px' }}>
                        <label htmlFor="chk_installments">Parcelamento *</label>
                        <select 
                          id="chk_installments"
                          name="installments" 
                          value={payment.installments} 
                          onChange={handlePaymentChange}
                          className={styles.selectInstallments}
                        >
                          {[...Array(12)].map((_, i) => {
                            const months = i + 1;
                            const installmentVal = subtotal / months;
                            return (
                              <option key={months} value={months}>
                                {months}x de {formatCurrency(installmentVal)} sem juros
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )}

                    <button 
                      type="submit" 
                      className={styles.btnCheckout}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>Processando...</span>
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          Finalizar Compra
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className={styles.loginCallout}>
                    <p>Faça login ou cadastre-se para preencher os dados de entrega e finalizar sua compra.</p>
                    <button 
                      onClick={() => {
                        setIsCartOpen(false);
                        // Navega para página de Auth (trataremos as rotas logo mais)
                        window.location.hash = '#/auth';
                      }}
                      className={styles.btnLoginGo}
                    >
                      Acessar minha Conta
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
