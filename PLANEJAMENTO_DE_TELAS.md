# Planejamento de futuras telas — Dog Dodói

Estas telas **não existiam no projeto enviado**. São propostas de evolução. O projeto entregue contém a biblioteca de componentes e o arquivo `front/modelo-tela.html` para iniciar sua construção, mas não implementa a lógica dessas funções.

## Prioridade 1 — fluxo clínico

1. **Cadastro de pets**: nome, espécie, raça, idade, tutor, peso e observações. O projeto atual cadastra clientes/tutores mas não possui entidade pet própria.
2. **Ficha clínica / prontuário**: registros de atendimento, sintomas, diagnósticos e histórico. Depende de autenticação, permissões e proteção de dados adequadas.
3. **Agenda visual**: visualizar consultas por dia, semana, horário e profissional. Adicionar seleção de veterinário; hoje o bloqueio de horário é global.
4. **Detalhe da consulta**: ficha de agendamento, pet, responsável, observações e status, com ações contextualizadas.

## Prioridade 2 — gestão e relacionamento

5. **Cadastro e perfis de profissionais**: equipe, turnos, especialidades e disponibilidade.
6. **Solicitações de avaliação**: fila com etapas (nova, contato feito, concluída), responsáveis, observações e histórico.
7. **Painel de indicadores**: ocupação da agenda, cancelamentos, períodos e outros indicadores fundamentados em dados reais.
8. **Página pública de serviços**: serviços veterinários com descrições, requisitos e contatos verificados.

## Prioridade 3 — experiência e administração

9. **Perfil da conta e permissões**: preferências do usuário, cargos, níveis de acesso e auditoria.
10. **Notificações**: confirmações de consulta e lembretes (somente mediante integração e consentimento).
11. **Relatórios**: consultas por situação, clientes recentes, solicitações recebidas e atividades.
12. **Configurações do estabelecimento**: nome, endereço, contatos e horário, após confirmação de dados oficiais.

## Modelo visual para todas as telas

- **Navegação**: sidebar à esquerda, topbar e breadcrumb/contexto.
- **Título**: subtítulo de contexto, heading e descrição curta.
- **Ação principal**: um CTA destacado, no cabeçalho ou painel de ferramentas.
- **Conteúdo**: cards de estatísticas, painéis brancos e tabelas com filtros e estados vazios.
- **Formulários**: agrupados por assunto, com etiquetas acima, obrigatórios indicados e ações no rodapé.
- **Estados**: vazio, carregando, sucesso, erro, confirmação de exclusão e sem permissão.
- **Mobile**: menu lateral recolhível, layouts de uma coluna, tabelas com rolagem horizontal.
- **Acessibilidade**: foco visível, rótulos de inputs, contraste e suporte a menos movimento.

## Padrão para implementar uma nova página

1. Copie `front/modelo-tela.html` para a página nova.
2. Adicione a tela na lista `MENU` do `js/layout.js` (o menu lateral é montado a partir dela) e marque a página com `<body data-secao="...">`.
3. Utilize as classes de `styles/design/components.css` e tokens de `styles/design/tokens.css`.
4. Defina os dados, validações, mensagens e estados vazios antes de programar.
5. Escreva JS específico e testes por funcionalidade. Não use `localStorage` para dados clínicos reais.
6. Teste em desktop e celular, com teclado, zoom, erros e formulários incompletos.

## Princípios visuais

- Sofisticação discreta, acolhimento, clareza e confiança.
- O rosa é usado para ações e destaques, não para preencher todas as áreas.
- Títulos em Outfit e corpo em DM Sans, com fallback local.
- Borda fina + sombra suave para delimitar conteúdos sem excesso visual.
- Estados com texto explícito, não apenas cor.
- Componentes reutilizáveis antes de estilos únicos.
