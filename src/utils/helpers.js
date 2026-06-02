// FUNÇÕES AUXILIARES DE FORMATAÇÃO E TRADUÇÃO - PLATAFORMA CONSOLIDAR

// Formatar valores monetários para Real (R$)
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);
};

// Mapeia categorias do banco de dados (Inglês) para exibição no front (Português)
export const mapNgoCategory = (category) => {
  const mapping = {
    'Animal Welfare': 'Animal',
    'Social Causes': 'Social',
    'Education': 'Educação',
    'Health': 'Saúde',
    'Environment': 'Meio Ambiente',
    'Culture': 'Cultura'
  };
  return mapping[category] || category;
};

// Mapeia classes de CSS para cores dos badges das ONGs
export const mapNgoCategoryClass = (category) => {
  const mapping = {
    'Animal Welfare': 'cat-animal',
    'Social Causes': 'cat-social',
    'Education': 'cat-education',
    'Health': 'cat-health',
    'Environment': 'cat-environment',
    'Culture': 'cat-culture'
  };
  return mapping[category] || '';
};

// Mapeia categorias de produtos para exibição amigável
export const mapProductCategory = (category) => {
  const mapping = {
    'Household': 'Doméstico',
    'Clothing': 'Roupa',
    'Beauty': 'Beleza',
    'Cleaning': 'Limpeza',
    'Electronics': 'Eletroeletrônico',
    'Kids': 'Infantil',
    'Pets': 'Pet'
  };
  return mapping[category] || category;
};

// Mapeia classes de CSS para as categorias de produtos
export const mapProductCategoryClass = (category) => {
  const mapping = {
    'Household': 'cat-prod-domestic',
    'Clothing': 'cat-prod-clothing',
    'Beauty': 'cat-prod-beauty',
    'Cleaning': 'cat-prod-cleaning',
    'Electronics': 'cat-prod-electronics',
    'Kids': 'cat-prod-kids',
    'Pets': 'cat-prod-pets'
  };
  return mapping[category] || '';
};

// Calcula porcentagem com limite máximo e de forma segura contra divisões por zero
export const calculatePercentage = (value, total) => {
  if (!total || total <= 0) return 0;
  const percent = (value / total) * 100;
  return Math.min(100, Math.round(percent));
};
