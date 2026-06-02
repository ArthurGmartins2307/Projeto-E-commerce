// DADOS SEMENTES (SEED DATA) - PLATAFORMA CONSOLIDAR
// Todos os textos em Português do Brasil (pt-BR)

export const INITIAL_NGOS = [
  {
    id: "ngo-1",
    name: "Amor Animal",
    logo: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150&auto=format&fit=crop&q=80",
    description: "Resgatamos, reabilitamos e promovemos a adoção responsável de cães e gatos abandonados em situação de risco.",
    category: "Animal Welfare", // Mapeado para 'Animal' nos filtros
    fundraising_goal: 25000,
    amount_raised: 18450,
    website: "www.amoranimal.org.br",
    phone: "(11) 98765-4321",
    email: "contato@amoranimal.org.br",
    story: "Fundada em 2018 por um grupo de voluntários independentes, a Amor Animal começou em um pequeno quintal emprestado e hoje conta com uma sede que abriga temporariamente mais de 80 animais. Nosso trabalho é incansável no combate aos maus-tratos e no fornecimento de cuidados veterinários, vacinas e muito amor até que esses animaizinhos encontrem um lar definitivo.",
    mission: "Garantir uma vida digna, saudável e livre de violência para animais domésticos abandonados, promovendo a harmonia entre seres humanos e animais por meio da conscientização.",
    photos: [
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1444212477490-ca407925329e?w=600&auto=format&fit=crop&q=80"
    ],
    created_at: "2026-01-10T10:00:00Z"
  },
  {
    id: "ngo-2",
    name: "SOS Mata Atlântica",
    logo: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=150&auto=format&fit=crop&q=80",
    description: "Atuamos na restauração da floresta nativa, valorização dos parques e reservas biológicas e proteção do ecossistema costeiro.",
    category: "Environment", // Mapeado para 'Meio Ambiente' nos filtros
    fundraising_goal: 50000,
    amount_raised: 32900,
    website: "www.sosmataatlantica.org.br",
    phone: "(11) 3254-9988",
    email: "contato@sosmataatlantica.org.br",
    story: "A SOS Mata Atlântica nasceu da necessidade urgente de preservar o bioma mais ameaçado do Brasil. Ao longo de décadas, engajamos milhares de cidadãos, empresas e governos no plantio de árvores nativas e na defesa de políticas públicas de preservação florestal e hídrica.",
    mission: "Inspirar a sociedade na defesa, conservação e restauração da Mata Atlântica, em busca de um futuro sustentável para as próximas gerações.",
    photos: [
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80"
    ],
    created_at: "2026-01-12T09:00:00Z"
  },
  {
    id: "ngo-3",
    name: "Educar para o Futuro",
    logo: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=150&auto=format&fit=crop&q=80",
    description: "Promovemos a inclusão social de crianças e jovens através de reforço escolar, oficinas de tecnologia e incentivo à leitura.",
    category: "Education", // Mapeado para 'Educação' nos filtros
    fundraising_goal: 30000,
    amount_raised: 15200,
    website: "www.educarfuturo.org.br",
    phone: "(21) 2501-1234",
    email: "contato@educarfuturo.org.br",
    story: "Em comunidades periféricas, a falta de acesso a materiais pedagógicos e computadores limita as oportunidades das crianças. A ONG surgiu como uma modesta biblioteca comunitária e hoje oferece laboratórios de robótica e aulas de programação para mais de 200 alunos no contra-turno escolar.",
    mission: "Transformar a vida de crianças e adolescentes em situação de vulnerabilidade através da educação integral, inovação tecnológica e literatura de qualidade.",
    photos: [
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80"
    ],
    created_at: "2026-01-15T08:00:00Z"
  },
  {
    id: "ngo-4",
    name: "Sorrisos Saudáveis",
    logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=150&auto=format&fit=crop&q=80",
    description: "Levamos atendimento médico, odontológico e suporte psicológico preventivo gratuito para comunidades isoladas e de baixa renda.",
    category: "Health", // Mapeado para 'Saúde' nos filtros
    fundraising_goal: 40000,
    amount_raised: 28350,
    website: "www.sorrisossaudaveis.org",
    phone: "(31) 3456-7890",
    email: "apoio@sorrisossaudaveis.org",
    story: "Tudo começou com caravanas de médicos e dentistas recém-formados que queriam fazer a diferença em regiões remotas do interior. Com o tempo, expandimos para a criação de clínicas móveis (ônibus adaptados) que viajam oferecendo triagem de saúde básica e sorrisos novinhos em folha.",
    mission: "Levar dignidade, saúde preventiva e atendimento humanizado para populações vulneráveis geograficamente e economicamente.",
    photos: [
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504817342555-d57cf2a537f7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&auto=format&fit=crop&q=80"
    ],
    created_at: "2026-01-20T11:00:00Z"
  },
  {
    id: "ngo-5",
    name: "Coletivo Viver Melhor",
    logo: "https://images.unsplash.com/photo-1508847154043-be12a62861c1?w=150&auto=format&fit=crop&q=80",
    description: "Capacitamos famílias de abrigos temporários, auxiliando na inserção no mercado de trabalho e fornecimento de cestas básicas.",
    category: "Social Causes", // Mapeado para 'Social' nos filtros
    fundraising_goal: 35000,
    amount_raised: 21900,
    website: "www.coletivovivermelhor.org.br",
    phone: "(11) 4002-8922",
    email: "contato@vivermelhor.org",
    story: "Formado durante a pandemia para amenizar os efeitos do desemprego e da fome, o Coletivo Viver Melhor desenvolveu cooperativas de costura, artesanato e gastronomia, gerando renda sustentável direta e resgatando a autoestima de chefes de família.",
    mission: "Combater a fome, apoiar a empregabilidade local e promover o empoderamento socioeconômico de famílias em extrema vulnerabilidade social.",
    photos: [
      "https://images.unsplash.com/photo-1469571486040-7a9b1373d77d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80"
    ],
    created_at: "2026-01-25T14:00:00Z"
  },
  {
    id: "ngo-6",
    name: "Ritmos e Artes",
    logo: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=150&auto=format&fit=crop&q=80",
    description: "Promovemos a inclusão cultural de jovens carentes com oficinas gratuitas de música clássica, teatro, grafite e capoeira.",
    category: "Culture", // Mapeado para 'Cultura' nos filtros
    fundraising_goal: 20000,
    amount_raised: 12400,
    website: "www.ritmoseartes.org",
    phone: "(71) 3221-5432",
    email: "ritmoseartes@gmail.com",
    story: "Iniciado no pelourinho na Bahia, o projeto usa a arte urbana e a música tradicional como ferramentas de escape da violência urbana. Nossos jovens se apresentam em festivais pelo país e descobrem caminhos artísticos cheios de esperança.",
    mission: "Fomentar a diversidade cultural e artística de jovens periféricos como meio de expressão, educação social e cidadania ativa.",
    photos: [
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80"
    ],
    created_at: "2026-01-28T16:30:00Z"
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Cama Pet Aconchego",
    description: "Cama acolchoada super macia, ideal para cães e gatos de pequeno e médio porte. Tecido lavável e fundo impermeável.",
    price: 129.90,
    stock: 15,
    image: "https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?w=500&auto=format&fit=crop&q=80",
    category: "Pets", // Pets
    ngo_id: "ngo-1", // Amor Animal
    donation_percentage: 10, // 10%
    active: true,
    created_at: "2026-02-01T10:00:00Z"
  },
  {
    id: "prod-2",
    name: "Comedouro Ecológico de Bambu",
    description: "Comedouro duplo feito com fibra de bambu 100% biodegradável e tigelas de inox removíveis. Antiderrapante e durável.",
    price: 79.90,
    stock: 22,
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop&q=80",
    category: "Pets",
    ngo_id: "ngo-1", // Amor Animal
    donation_percentage: 8,
    active: true,
    created_at: "2026-02-02T11:00:00Z"
  },
  {
    id: "prod-3",
    name: "Sacolas Ecológicas de Algodão (Kit com 3)",
    description: "Ecobags de algodão cru orgânico de alta resistência. Perfeitas para compras de supermercado e feiras livres, ajudando a eliminar o uso de plástico.",
    price: 49.95,
    stock: 50,
    image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=500&auto=format&fit=crop&q=80",
    category: "Household", // Doméstico
    ngo_id: "ngo-2", // SOS Mata Atlântica
    donation_percentage: 15,
    active: true,
    created_at: "2026-02-05T09:00:00Z"
  },
  {
    id: "prod-4",
    name: "Caneca de Cerâmica Artesanal Horeb",
    description: "Caneca modelada manualmente em cerâmica com esmaltação ecológica. Design minimalista rústico, comporta 350ml.",
    price: 38.00,
    stock: 30,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80",
    category: "Household",
    ngo_id: "ngo-2", // SOS Mata Atlântica
    donation_percentage: 12,
    active: true,
    created_at: "2026-02-06T12:00:00Z"
  },
  {
    id: "prod-5",
    name: "Jogo Educativo Alfabetização Divertida",
    description: "Brinquedo de madeira reflorestada com peças magnéticas ilustradas para ensinar letras, sílabas e palavras simples de forma lúdica.",
    price: 89.90,
    stock: 18,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=80",
    category: "Kids", // Infantil
    ngo_id: "ngo-3", // Educar para o Futuro
    donation_percentage: 10,
    active: true,
    created_at: "2026-02-08T14:00:00Z"
  },
  {
    id: "prod-6",
    name: "Estojo de Aquarela Escolar Ecológico",
    description: "Estojo contendo 12 pastilhas de aquarela atóxica feitas com pigmentos vegetais e 1 pincel de madeira certificada FSC.",
    price: 54.90,
    stock: 40,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=80",
    category: "Kids",
    ngo_id: "ngo-3", // Educar para o Futuro
    donation_percentage: 10,
    active: true,
    created_at: "2026-02-09T15:00:00Z"
  },
  {
    id: "prod-7",
    name: "Sabonete Líquido Vegano de Camomila 500ml",
    description: "Formulado com extrato natural de camomila orgânica. Limpa suavemente, acalma peles sensíveis e não agride o meio ambiente. Cruelty-free.",
    price: 32.50,
    stock: 60,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80",
    category: "Beauty", // Beleza
    ngo_id: "ngo-4", // Sorrisos Saudáveis
    donation_percentage: 7,
    active: true,
    created_at: "2026-02-12T10:00:00Z"
  },
  {
    id: "prod-8",
    name: "Creme Hidratante Facial de Copaíba e Aloe Vera",
    description: "Com óleos da Amazônia e gel de babosa. Hidrata profundamente, atua no controle da oleosidade e previne linhas de expressão.",
    price: 68.90,
    stock: 25,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=80",
    category: "Beauty",
    ngo_id: "ngo-4", // Sorrisos Saudáveis
    donation_percentage: 8,
    active: true,
    created_at: "2026-02-13T11:00:00Z"
  },
  {
    id: "prod-9",
    name: "Camiseta de Algodão Sustentável Consolidar",
    description: "Feita com malha premium de algodão orgânico 100% sustentável. Gola redonda, unissex, estampa exclusiva impressa com tinta à base de água.",
    price: 69.90,
    stock: 35,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
    category: "Clothing", // Roupa
    ngo_id: "ngo-5", // Coletivo Viver Melhor
    donation_percentage: 20, // 20% doados!
    active: true,
    created_at: "2026-02-15T13:00:00Z"
  },
  {
    id: "prod-10",
    name: "Bolsa Porta Notebook de Lona Reciclada",
    description: "Produzida por artesãos do Coletivo com retalhos de lona e tecidos jeans recuperados. Compartimento acolchoado para laptops até 15.6 polegadas.",
    price: 145.00,
    stock: 12,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80",
    category: "Clothing",
    ngo_id: "ngo-5", // Coletivo Viver Melhor
    donation_percentage: 15,
    active: true,
    created_at: "2026-02-16T14:30:00Z"
  },
  {
    id: "prod-11",
    name: "Kit de Limpeza Concentrado Biodegradável",
    description: "Contém 3 frascos recarregáveis de vidro e 3 ampolas concentradas (Multiuso, Banheiro, Vidros). Dilua em água e limpe sem poluentes agressivos.",
    price: 94.90,
    stock: 20,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80",
    category: "Cleaning", // Limpeza
    ngo_id: "ngo-2", // SOS Mata Atlântica
    donation_percentage: 10,
    active: true,
    created_at: "2026-02-20T10:00:00Z"
  },
  {
    id: "prod-12",
    name: "Lâmpada Inteligente Eco-LED 9W",
    description: "Bocal E27, compatível com redes Wi-Fi de 2.4GHz. Controle por aplicativo móvel ou comandos de voz. Reduz o consumo elétrico em até 80%.",
    price: 59.90,
    stock: 45,
    image: "https://images.unsplash.com/photo-1550537687-c91072c4792d?w=500&auto=format&fit=crop&q=80",
    category: "Electronics", // Eletroeletrônico
    ngo_id: "ngo-6", // Ritmos e Artes
    donation_percentage: 5,
    active: true,
    created_at: "2026-02-25T11:00:00Z"
  }
];

export const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    user_id: "user-cust-1",
    user_name: "Mariana Silva",
    user_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    product_id: "prod-1", // Cama Pet Aconchego
    product_name: "Cama Pet Aconchego",
    rating: 5,
    comment: "Cama maravilhosa! Meu gatinho adorou de primeira, dorme nela toda noite. O acabamento é excelente e é super fofinha. Além disso, fico feliz que 10% da compra apoia os animais da Amor Animal!",
    created_at: "2026-03-01T14:32:00Z",
    approved: true
  },
  {
    id: "rev-2",
    user_id: "user-cust-2",
    user_name: "Carlos Eduardo",
    user_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    product_id: "prod-3", // Sacolas Ecológicas
    product_name: "Sacolas Ecológicas de Algodão (Kit com 3)",
    rating: 5,
    comment: "Muito resistentes e práticas. O tamanho é perfeito para as compras semanais de feira. O tecido é grosso e lavável. Excelente iniciativa e entrega muito rápida!",
    created_at: "2026-03-05T09:15:00Z",
    approved: true
  },
  {
    id: "rev-3",
    user_id: "user-cust-3",
    user_name: "Juliana Mendes",
    user_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    product_id: "prod-9", // Camiseta Sustentável
    product_name: "Camiseta de Algodão Sustentável Consolidar",
    rating: 4,
    comment: "Gostei muito do caimento e a malha é extremamente confortável. Super macia e fresquinha. Só achei a forma um pouquinho pequena, mas serviu bem. Comprar e apoiar o Coletivo Viver Melhor vale muito a pena!",
    created_at: "2026-03-10T18:40:00Z",
    approved: true
  },
  {
    id: "rev-4",
    user_id: "user-cust-4",
    user_name: "Pedro Henrique",
    user_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    product_id: "prod-5", // Jogo Alfabetização
    product_name: "Jogo Educativo Alfabetização Divertida",
    rating: 5,
    comment: "Meu filho de 5 anos está amando montar as palavras com as letras magnéticas. É muito resistente e educativo. Parabéns aos desenvolvedores!",
    created_at: "2026-03-12T11:20:00Z",
    approved: true
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ord-1",
    user_id: "user-cust-1",
    total_amount: 179.85,
    donation_amount: 19.98,
    status: "Pago",
    address: "Rua das Palmeiras, 123, Apto 42 - Pinheiros, São Paulo - SP",
    zip_code: "05402-000",
    installments: 1,
    created_at: "2026-04-10T14:30:00Z",
    items: [
      { product_id: "prod-3", name: "Sacolas Ecológicas de Algodão (Kit com 3)", price: 49.95, quantity: 1, ngo_id: "ngo-2", donation_percentage: 15 },
      { product_id: "prod-1", name: "Cama Pet Aconchego", price: 129.90, quantity: 1, ngo_id: "ngo-1", donation_percentage: 10 }
    ]
  },
  {
    id: "ord-2",
    user_id: "user-cust-2",
    total_amount: 159.80,
    donation_amount: 15.98,
    status: "Pago",
    address: "Av. Atlântica, 1500 - Copacabana, Rio de Janeiro - RJ",
    zip_code: "22021-001",
    installments: 3,
    created_at: "2026-05-02T10:00:00Z",
    items: [
      { product_id: "prod-2", name: "Comedouro Ecológico de Bambu", price: 79.90, quantity: 2, ngo_id: "ngo-1", donation_percentage: 8 }
    ]
  },
  {
    id: "ord-3",
    user_id: "user-cust-1",
    total_amount: 139.80,
    donation_amount: 10.98,
    status: "Pago",
    address: "Rua das Palmeiras, 123, Apto 42 - Pinheiros, São Paulo - SP",
    zip_code: "05402-000",
    installments: 2,
    created_at: "2026-05-18T16:15:00Z",
    items: [
      { product_id: "prod-9", name: "Camiseta de Algodão Sustentável Consolidar", price: 69.90, quantity: 2, ngo_id: "ngo-5", donation_percentage: 20 }
    ]
  }
];

export const CONTRIB_LEVELS = [
  { level: 1, minPoints: 0, title: "Apoador Iniciante", color: "#e76f51" },
  { level: 2, minPoints: 100, title: "Protetor Sustentável", color: "#f4a261" },
  { level: 3, minPoints: 300, title: "Transformador Social", color: "#e9c46a" },
  { level: 4, minPoints: 600, title: "Guardião da Natureza", color: "#2a9d8f" },
  { level: 5, minPoints: 1000, title: "Embaixador Consolidar", color: "#264653" }
];

export const ACHIEVEMENTS = [
  { id: "badge-first", name: "Primeiro Impacto", description: "Realizou a primeira compra e gerou doação.", icon: "01" },
  { id: "badge-animal", name: "Amigo dos Animais", description: "Apoiou a causa Animal com mais de 3 produtos comprados.", icon: "02" },
  { id: "badge-nature", name: "Protetor do Bioma", description: "Comprou produtos que apoiam a causa do Meio Ambiente.", icon: "03" },
  { id: "badge-social", name: "Coração Solidário", description: "Apoiou causas de desenvolvimento e inserção social.", icon: "04" },
  { id: "badge-education", name: "Mestre do Saber", description: "Ajudou a causa de Educação infantil.", icon: "05" },
  { id: "badge-health", name: "Doador de Sorrisos", description: "Gerou fundos para campanhas preventivas de saúde.", icon: "06" },
  { id: "badge-heavy", name: "Super Doador", description: "Acumulou mais de 500 pontos em doações na plataforma.", icon: "07" }
];
