export const FLOWS = [
  {
    id: 'etiquetas',
    tag: 'Pedido 1',
    title: 'Etiquetagem com código de barras',
    text: 'Uma etiqueta da OS e uma por volume. Cada volume é lido em toda passagem de mão; volume no destino errado dispara o alerta PARE.',
    links: [
      { slug: 'etiquetas', label: 'Imprimir etiquetas', where: 'Painel' },
      { slug: 'mot-leitura', label: 'Ler volumes no carregamento', where: 'App' },
      { slug: 'mot-leitura-erro', label: 'Alerta de destino errado', where: 'App' },
      { slug: 'dossie', label: 'Dossiê de entrega', where: 'Painel' },
    ],
  },
  {
    id: 'rotas',
    tag: 'Pedido 2',
    title: 'Roteirização por tamanho e peso',
    text: 'Rotas montadas com a capacidade de peso e volume de cada veículo, as janelas de entrega e as paradas travadas pelo operador.',
    links: [
      { slug: 'rotas', label: 'Montagem de rotas', where: 'Painel' },
      { slug: 'rotas-ao-vivo', label: 'Rotas em andamento', where: 'Painel' },
      { slug: 'frota', label: 'Frota e pessoas', where: 'Painel' },
      { slug: 'mot-rota', label: 'Rota do dia', where: 'App' },
    ],
  },
  {
    id: 'avisos',
    tag: 'Pedido 3',
    title: 'Avisos ao cliente final',
    text: 'Coleta, viagem, entrega e concluído, por WhatsApp, com link de rastreio, reagendamento e comprovante.',
    links: [
      { slug: 'rastreio', label: 'Rastreio do pedido', where: 'Cliente' },
      { slug: 'comprovante', label: 'Entregue e comprovante', where: 'Cliente' },
      { slug: 'reagendar', label: 'Reagendar entrega', where: 'Cliente' },
      { slug: 'templates', label: 'Templates de aviso', where: 'Painel' },
    ],
  },
];

export const GROUPS: { title: string; note?: string; slugs: string[] }[] = [
  { title: 'Etiquetagem e conferência', note: 'Novo', slugs: ['etiquetas', 'mot-leitura', 'mot-leitura-erro'] },
  { title: 'Painel — operação', slugs: ['painel', 'nova-os', 'os-detalhe', 'rotas', 'rotas-ao-vivo', 'conversas', 'assistente'] },
  { title: 'Painel — cadastros e gestão', slugs: ['clientes', 'importacao', 'frota', 'despesas'] },
  { title: 'Painel — dashboards e administração', slugs: ['dash-operacao', 'dash-qualidade', 'templates', 'usuarios', 'auditoria'] },
  { title: 'Relatórios', slugs: ['relatorios', 'rel-automacao', 'dossie', 'rel-rentabilidade', 'rel-falhas', 'rel-sla', 'rel-eta', 'rel-etapas', 'rel-frota', 'rel-conformidade'] },
  { title: 'App do motorista', slugs: ['mot-login', 'mot-rota', 'motorista', 'mot-falha', 'mot-despesa', 'mot-leitura', 'mot-leitura-erro'] },
  { title: 'Páginas do cliente final', slugs: ['rastreio', 'orcamento', 'comprovante', 'reagendar'] },
  { title: 'Acesso, empresa e console', slugs: ['login', 'onboarding', 'empresa', 'console'] },
  { title: 'Design system', slugs: ['main', 'cores', 'tipografia', 'status', 'componentes'] },
];
