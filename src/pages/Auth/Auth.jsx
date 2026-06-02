import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Mail, Lock, User, Image, ShieldAlert, KeyRound } from 'lucide-react';
import styles from './Auth.jsx.module.css'; // Mapeado para Auth.module.css na criação do arquivo

export default function Auth() {
  const { login, register, recoverPassword, currentUser } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('login'); // login | register | recover
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile_image: '',
    user_type: 'customer' // customer | admin
  });

  const [loading, setLoading] = useState(false);

  // Redireciona se o usuário já estiver logado
  React.useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({
      name: '',
      email: '',
      password: '',
      profile_image: '',
      user_type: 'customer'
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/perfil');
    } catch (err) {
      // O AppContext já lida com o Toast de erro
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.profile_image,
        formData.user_type
      );
      navigate('/perfil');
    } catch (err) {
      // O AppContext lida com o Toast
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await recoverPassword(formData.email);
      setActiveTab('login');
    } catch (err) {
      // Lojista lida com o Toast
    } finally {
      setLoading(false);
    }
  };

  // Preenche dados rápidos para facilitar os testes do usuário
  const handlePrefillUser = (type) => {
    if (type === 'admin') {
      setFormData({
        name: 'Administrador Demo',
        email: 'admin@consolidar.org.br',
        password: 'adminpassword',
        profile_image: '',
        user_type: 'admin'
      });
    } else {
      setFormData({
        name: 'Mariana Silva',
        email: 'mariana@consolidar.org.br',
        password: 'password123',
        profile_image: '',
        user_type: 'customer'
      });
    }
  };

  return (
    <div className={`${styles.pageContainer} container animate-fade-in`}>
      <div className={styles.authBox}>
        {/* Cabeçalho da Caixa */}
        <div className={styles.logoTitle}>
          <h2>consolidar</h2>
          <p>Marketplace de Impacto Social</p>
        </div>

        {/* Abas */}
        {activeTab !== 'recover' && (
          <div className={styles.tabsContainer}>
            <button
              onClick={() => handleTabChange('login')}
              className={`${styles.tabBtn} ${activeTab === 'login' ? styles.tabActive : ''}`}
            >
              Entrar
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className={`${styles.tabBtn} ${activeTab === 'register' ? styles.tabActive : ''}`}
            >
              Criar Conta
            </button>
          </div>
        )}

        {/* 1. ABA DE LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="login_email">E-mail *</label>
              <div className={styles.inputWrapper}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  id="login_email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seuemail@exemplo.com.br"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="login_password">Senha *</label>
                <button
                  type="button"
                  onClick={() => setActiveTab('recover')}
                  className={styles.forgotBtn}
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className={styles.inputWrapper}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  id="login_password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.btnSubmit}>
              {loading ? 'Acessando...' : 'Acessar minha Conta'}
            </button>

            {/* Credenciais de Teste Rápido */}
            <div className={styles.testCredentials}>
              <h4>Contas de Demonstração Rápida:</h4>
              <div className={styles.demoButtons}>
                <button
                  type="button"
                  onClick={() => handlePrefillUser('customer')}
                  className={styles.demoBtn}
                >
                  Preencher Cliente Demo
                </button>
                <button
                  type="button"
                  onClick={() => handlePrefillUser('admin')}
                  className={`${styles.demoBtn} ${styles.demoAdmin}`}
                >
                  Preencher Admin Demo
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 2. ABA DE CADASTRO */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="reg_name">Nome Completo *</label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.inputIcon} />
                <input
                  id="reg_name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome completo"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg_email">E-mail *</label>
              <div className={styles.inputWrapper}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  id="reg_email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seuemail@exemplo.com.br"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg_password">Senha *</label>
              <div className={styles.inputWrapper}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  id="reg_password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="No mínimo 6 caracteres"
                  minLength="6"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg_image">URL da Foto de Perfil (Opcional)</label>
              <div className={styles.inputWrapper}>
                <Image size={16} className={styles.inputIcon} />
                <input
                  id="reg_image"
                  type="url"
                  name="profile_image"
                  value={formData.profile_image}
                  onChange={handleInputChange}
                  placeholder="https://sua-imagem.com/avatar.jpg"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reg_type">Tipo de Conta para Simulação</label>
              <div className={styles.inputWrapper}>
                <ShieldAlert size={16} className={styles.inputIcon} />
                <select
                  id="reg_type"
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleInputChange}
                  className={styles.selectInput}
                >
                  <option value="customer">Cliente Consumidor (Apoia ONGs)</option>
                  <option value="admin">Administrador do Painel (CRUDs e Gráficos)</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.btnSubmit}>
              {loading ? 'Cadastrando...' : 'Criar minha Conta Solidária'}
            </button>
          </form>
        )}

        {/* 3. FLUXO DE RECUPERAÇÃO DE SENHA */}
        {activeTab === 'recover' && (
          <form onSubmit={handleRecoverSubmit} className={styles.authForm}>
            <div className={styles.recoverHeader}>
              <KeyRound size={32} className={styles.recoverIcon} />
              <h3>Recuperar Senha</h3>
              <p>Insira seu e-mail cadastrado e enviaremos um link para redefinir sua senha.</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rec_email">E-mail Cadastrado *</label>
              <div className={styles.inputWrapper}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  id="rec_email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seuemail@exemplo.com.br"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.btnSubmit}>
              {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={styles.btnBackToLogin}
            >
              Voltar ao Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
