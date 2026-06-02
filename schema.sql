-- SCRIPT DE BANCO DE DADOS - PLATAFORMA CONSOLIDAR
-- Você pode executar este script diretamente no SQL Editor do Supabase.

-- Habilitar extensões necessárias se preciso
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    profile_image TEXT,
    user_type TEXT NOT NULL DEFAULT 'customer' CHECK (user_type IN ('customer', 'admin')),
    points INTEGER DEFAULT 0,
    supported_ngos INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABELA DE ONGS
CREATE TABLE IF NOT EXISTS ngos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo TEXT,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('Animal Welfare', 'Social Causes', 'Education', 'Health', 'Environment', 'Culture')),
    fundraising_goal NUMERIC NOT NULL DEFAULT 10000.00,
    amount_raised NUMERIC NOT NULL DEFAULT 0.00,
    website TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE PRODUTOS
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image TEXT,
    category TEXT NOT NULL CHECK (category IN ('Household', 'Clothing', 'Beauty', 'Cleaning', 'Electronics', 'Kids', 'Pets')),
    ngo_id UUID REFERENCES ngos(id) ON DELETE SET NULL,
    donation_percentage NUMERIC(5, 2) NOT NULL DEFAULT 5.00 CHECK (donation_percentage >= 0 AND donation_percentage <= 100),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE PEDIDOS (ORDERS)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    donation_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (donation_amount >= 0),
    status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Pago', 'Cancelado')),
    address TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    installments INTEGER NOT NULL DEFAULT 1 CHECK (installments >= 1 AND installments <= 12),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA DE AVALIAÇÕES (REVIEWS)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurações e Comentários para Auxílio
COMMENT ON TABLE users IS 'Armazena informações cadastrais dos clientes e administradores.';
COMMENT ON TABLE ngos IS 'Armazena as ONGs parceiras do ecossistema Consolidar.';
COMMENT ON TABLE products IS 'Produtos do marketplace associados a uma ONG com percentual de doação.';
COMMENT ON TABLE orders IS 'Registro das compras realizadas e valores destinados às ONGs.';
COMMENT ON TABLE reviews IS 'Avaliações e comentários enviados por usuários sobre os produtos.';
