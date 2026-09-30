// Categorias e projetos do catálogo.
// As fotos ficam em assets/fotos/<categoria>/.
//
// Campos de cada projeto:
//   photos   lista de fotos (nome do arquivo com extensão); a primeira é a capa do card
//   title    título do projeto
//   details  acabamentos e detalhes, uma frase
//   cta      texto do botão (opcional, padrão "Solicitar Orçamento deste Modelo")
//   msg      mensagem pronta do WhatsApp (opcional, gerada a partir do título)
//   tag      etiqueta do card (opcional, padrão é a da categoria)
window.NART = (() => {
  const f = (cat, ...names) => names.map((n) => `assets/fotos/${cat}/${n}`);

  const WHATSAPP = '5543996998786';

  const CATS = [
    { slug: 'cozinhas', name: 'Cozinhas', tag: 'Cozinha Sob Medida', code: 'COZ',
      projects: [
        { photos: f('cozinhas', 'balcao-ripado-1.webp', 'balcao-ripado-2.webp', 'balcao-ripado-3.webp', 'balcao-ripado-4.webp'),
          title: 'Cozinha Amadeirada com Balcão Ripado',
          details: 'Balcão com frente ripada e tampo em granito preto, aéreos cinza com moldura amadeirada e LED sob os armários.' },
        { photos: f('cozinhas', 'cinza-led-1.webp', 'cinza-led-2.webp', 'cinza-led-3.webp', 'cinza-led-4.webp'),
          title: 'Cozinha Cinza com Iluminação em LED',
          details: 'Armários cinza do chão ao teto, nicho para micro-ondas, espaço para geladeira e LED sob os aéreos.' },
        { photos: f('cozinhas', 'grafite-marmore-1.jpg'),
          title: 'Cozinha Grafite com Revestimento Marmorizado',
          details: 'Armários em grafite com puxadores perfil, torre de forno e parede marmorizada preta.' },
      ] },
    { slug: 'closets-quartos', name: 'Closets & Quartos', tag: 'Closet & Quarto', code: 'CLQ', projects: [] },
    { slug: 'paineis-salas', name: 'Painéis & Salas', tag: 'Sala de Estar', code: 'SAL',
      projects: [
        { photos: f('paineis-salas', 'painel-tv-led-1.jpg'),
          title: 'Painel de TV com LED e Rack Suspenso',
          details: 'Painel com contorno iluminado em LED e rack suspenso com gavetas.',
          cta: 'Cotar Este Painel' },
        { photos: f('paineis-salas', 'expositor-facas-1.jpg'),
          title: 'Expositor de Parede com Portas de Vidro',
          details: 'Expositor amadeirado com portas de vidro e suportes internos para coleção.' },
      ] },
    { slug: 'banheiros', name: 'Banheiros', tag: 'Banheiro', code: 'BAN', projects: [] },
    { slug: 'corporativo', name: 'Corporativo', tag: 'Corporativo', code: 'COR',
      projects: [
        { photos: f('corporativo', 'sala-reuniao-1.webp', 'sala-reuniao-2.webp', 'sala-reuniao-3.webp', 'sala-reuniao-4.webp'),
          title: 'Sala de Reunião com Treliça Iluminada',
          details: 'Mesa de reunião com filete amadeirado, estante sob a janela com LED e treliça retroiluminada.',
          cta: 'Quero um Projeto neste Estilo' },
        { photos: f('corporativo', 'trelica-1.webp', 'trelica-2.webp', 'trelica-3.webp'),
          title: 'Painel Treliçado e Revestimento Amadeirado',
          details: 'Treliça de madeira do chão ao teto com luz por trás e paredes revestidas com LED no rodapé.',
          cta: 'Quero um Projeto neste Estilo' },
      ] },
  ].filter((c) => c.projects.length); // categoria sem projetos não aparece no site

  // Código de cada projeto (ex.: COZ-01), usado no link direto
  CATS.forEach((c) => c.projects.forEach((p, i) => {
    p.id = `${c.code}-${String(i + 1).padStart(2, '0')}`;
    p.cat = c;
    p.src = p.photos[0];
    p.alt = p.alt || p.title;
    p.tag = p.tag || c.tag;
    p.cta = p.cta || 'Solicitar Orçamento deste Modelo';
    p.msg = p.msg || `Olá! Vi o modelo '${p.title}' no catálogo da N.ART e gostaria de solicitar um orçamento.`;
  }));

  const MSG = {
    geral: 'Olá! Vi o catálogo da N.ART Móveis e gostaria de falar com um consultor.',
    projeto: 'Olá! Já tenho um projeto/referência própria e gostaria de enviar para vocês fazerem um orçamento.',
  };

  return { WHATSAPP, CATS, MSG };
})();
