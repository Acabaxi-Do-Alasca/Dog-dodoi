# Dog Dodói

Site e sistema de agendamento de um hospital veterinário 24h, feito com HTML, CSS e JavaScript puro, sem frameworks e sem servidor.

- **Site público** com o formulário "Marque uma avaliação gratuita"
- **Login e cadastro** de usuários da equipe
- **Painel** com indicadores, próximas consultas e pedidos de avaliação vindos do site
- **Clientes**: cadastro, edição, busca e exclusão; CPF validado, máscaras de CPF/telefone/CEP e endereço preenchido pelo CEP ([ViaCEP](https://viacep.com.br))
- **Consultas**: agendamento, edição, cancelamento/reativação, filtro por situação (próximas, realizadas, canceladas) e bloqueio de horário duplicado

## Como rodar

Abra `front/index.html` no navegador. Ou sirva a pasta (mais parecido com o GitHub Pages):

```bash
python -m http.server 8000
```

e acesse <http://localhost:8000>. Para entrar no painel, crie uma conta em **Entrar → Criar conta**.

O catálogo de cores e componentes fica em `front/guia-visual.html`.

## Onde ficam os dados

Não há back-end: tudo fica no `localStorage` do navegador (chaves `dogdodoi:*`). Cada navegador tem seus próprios dados, e limpar os dados do site apaga tudo.

O login é **apenas demonstrativo**: as senhas são guardadas como hash SHA-256 com sal, mas qualquer pessoa com acesso ao navegador consegue ler e alterar os dados. Para dados reais de clientes e pacientes, autenticação e dados precisam ficar num servidor.

## Estrutura

```
front/                páginas HTML
  guia-visual.html    catálogo de cores, tipografia e componentes
  modelo-tela.html    ponto de partida para uma tela nova do painel
styles/design/
  tokens.css          cores, fontes, espaços e sombras (mude o tema aqui)
  base.css            reset, tipografia e acessibilidade
  components.css      botões, campos, painéis, tabelas, selos, indicadores, avisos
  public.css          site público e telas de login/cadastro
  admin.css           painel: menu lateral, barra superior e grades
js/
  storage.js          dados no localStorage
  auth.js             login e proteção das páginas internas
  util.js, mascaras.js, icones.js
  layout.js           monta o menu lateral do painel
  <página>.js         um script por página
img/                  imagens (marca.svg é o símbolo da marca)
index.html            redireciona para front/index.html (útil no GitHub Pages)
PLANEJAMENTO_DE_TELAS.md  ideias de telas futuras (ainda não implementadas)
```

Cada página carrega `tokens.css`, `base.css` e `components.css`, mais `public.css` (site) ou `admin.css` (painel).

## Criando uma tela nova no painel

1. Copie `front/modelo-tela.html`.
2. Marque a seção do menu em `<body data-secao="...">` ou adicione um item em `MENU`, no `js/layout.js`.
3. Use os componentes do guia visual e crie um `js/<tela>.js` para a lógica.

As páginas internas têm `<html data-protegida>`: sem login, o `auth.js` manda para o login e depois volta para a página pedida.
