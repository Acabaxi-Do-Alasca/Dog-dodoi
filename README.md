# Dog Dodói

Site e sistema de agendamento de um hospital veterinário 24h, feito com HTML, CSS e JavaScript puro, sem frameworks e sem servidor.

- **Landing page** com o formulário "Marque uma avaliação gratuita"
- **Login e cadastro** de usuários
- **Painel** com contadores, próximas consultas e pedidos de avaliação vindos da landing
- **Clientes**: cadastro, edição, busca e exclusão; CPF validado, máscaras de CPF/telefone/CEP e endereço preenchido pelo CEP ([ViaCEP](https://viacep.com.br))
- **Consultas**: agendamento, edição, cancelamento/reativação, filtro por situação (próximas, realizadas, canceladas) e bloqueio de horário duplicado

## Como rodar

Abra `front/index.html` no navegador. Ou sirva a pasta (mais parecido com o GitHub Pages):

```bash
python -m http.server 8000
```

e acesse <http://localhost:8000>. Para entrar no painel, crie uma conta em **Entrar → Cadastre-se**.

## Onde ficam os dados

Não há back-end: tudo fica no `localStorage` do navegador (chaves `dogdodoi:*`). Cada navegador tem seus próprios dados, e limpar os dados do site apaga tudo.

O login é **apenas demonstrativo**: as senhas são guardadas como hash SHA-256 com sal, mas qualquer pessoa com acesso ao navegador consegue ler e alterar os dados. Num sistema real, autenticação e dados ficam num servidor.

## Estrutura

```
front/     páginas HTML
styles/    CSS de cada página + componentes.css (avisos, tabelas, cards) e lista.css (listagens)
js/        storage.js (dados), auth.js (login), util.js, mascaras.js e um script por página
img/       imagens
index.html redireciona para front/index.html (útil no GitHub Pages)
```

As páginas internas têm `<html data-protegida>`: sem login, o `auth.js` manda para o login e depois volta para a página pedida.
