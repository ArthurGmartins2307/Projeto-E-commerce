// SHELL CENTRAL DO APLICATIVO CONSOLIDAR
// Configura Roteamento, Provedores Globais de Estado e Esqueleto Estrutural

import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Componentes Globais de Interface
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CartDrawer from './components/CartDrawer/CartDrawer';
import Toast from './components/Toast/Toast';

// Páginas do Marketplace
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import Ngos from './pages/Ngos/Ngos';
import NgoDetails from './pages/NgoDetails/NgoDetails';
import Auth from './pages/Auth/Auth';
import Profile from './pages/Profile/Profile';
import Admin from './pages/Admin/Admin';

export default function App() {
  return (
    <AppProvider>
      <Router>
        {/* Cabeçalho de Navegação Fixo */}
        <Header />

        {/* Notificações Flutuantes de Feedback (Toast) */}
        <Toast />

        {/* Drawer Lateral do Carrinho e Checkout Simulado */}
        <CartDrawer />

        {/* Corpo Principal das Páginas (flexível para empurrar o rodapé) */}
        <div style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            {/* Página Inicial */}
            <Route path="/" element={<Home />} />

            {/* Catálogo de Produtos Solidários */}
            <Route path="/produtos" element={<Products />} />

            {/* Diretório de ONGs Conveniadas */}
            <Route path="/ongs" element={<Ngos />} />

            {/* Detalhes de uma ONG específica */}
            <Route path="/ong/:id" element={<NgoDetails />} />

            {/* Autenticação (Login, Cadastro e Recuperação) */}
            <Route path="/auth" element={<Auth />} />

            {/* Painel do Cliente (Perfil, Compras, Favoritos e Avaliações) */}
            <Route path="/perfil" element={<Profile />} />

            {/* Painel Administrativo de Controle */}
            <Route path="/admin" element={<Admin />} />

            {/* Redirecionamento de Rotas Inexistentes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Rodapé Institucional com Contador de Transparência */}
        <Footer />
      </Router>
    </AppProvider>
  );
}
