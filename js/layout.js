// Menu lateral do painel. Para incluir uma tela nova no menu, adicione-a
// em MENU e marque a página com <body data-secao="...">.
const MENU = [
    { titulo: 'Visão geral', itens: [
        { secao: 'painel', rotulo: 'Painel', href: 'dashBoard.html', icone: 'painel' }
    ] },
    { titulo: 'Atendimento', itens: [
        { secao: 'clientes', rotulo: 'Clientes', href: 'listaClientes.html', icone: 'clientes' },
        { secao: 'consultas', rotulo: 'Consultas', href: 'listaConsultas.html', icone: 'consultas' }
    ] },
    { titulo: 'Administração', itens: [
        { secao: 'usuarios', rotulo: 'Usuários', href: 'listaUsuarios.html', icone: 'usuarios' }
    ] }
];

function montarMenuLateral() {
    const lateral = document.querySelector('#menu-lateral');
    if (!lateral) return;
    const secaoAtual = document.body.dataset.secao;

    const marca = Util.el('a', { class: 'marca marca-clara', href: 'dashBoard.html' },
        Util.el('img', { class: 'marca-simbolo', src: '../img/marca.svg', alt: '' }),
        Util.el('span', { class: 'marca-texto' },
            Util.el('span', { class: 'marca-nome' }, 'dog', Util.el('b', {}, 'dodói')),
            Util.el('span', { class: 'marca-sub' }, 'Painel da clínica')));

    const navegacao = Util.el('nav', { 'aria-label': 'Menu do painel' });
    for (const grupo of MENU) {
        const lista = Util.el('ul');
        for (const item of grupo.itens) {
            const link = Util.el('a', {
                class: 'menu-link',
                href: item.href,
                'aria-current': item.secao === secaoAtual ? 'page' : null,
                'data-icone': item.icone
            }, item.rotulo);
            lista.append(Util.el('li', {}, link));
        }
        navegacao.append(Util.el('div', { class: 'menu-grupo' },
            Util.el('p', { class: 'menu-grupo-titulo' }, grupo.titulo), lista));
    }

    const usuario = Auth.usuarioAtual();
    const iniciais = (usuario?.nome || '?').split(/\s+/).map(parte => parte[0]).slice(0, 2).join('').toUpperCase();
    const blocoUsuario = Util.el('div', { class: 'menu-usuario' },
        Util.el('span', { class: 'avatar', 'aria-hidden': 'true' }, iniciais),
        Util.el('span', { class: 'menu-usuario-dados' },
            Util.el('strong', {}, usuario?.nome || ''),
            Util.el('span', {}, usuario?.email || '')),
        Util.el('a', { class: 'menu-sair', href: 'index.html', 'data-sair': true, title: 'Sair', 'data-icone': 'sair' },
            Util.el('span', { class: 'oculto' }, 'Sair')));

    lateral.replaceChildren(marca, navegacao, blocoUsuario);
    Icones.aplicar(lateral);
}

// No celular/tablet o menu vira uma gaveta aberta pelo botão "Menu".
function ligarGavetaDoMenu() {
    const botao = document.querySelector('[data-abrir-menu]');
    if (!botao) return;
    const fundo = Util.el('div', { class: 'app-fundo-menu' });
    document.body.append(fundo);

    const alternar = aberto => {
        document.body.classList.toggle('menu-aberto', aberto);
        botao.setAttribute('aria-expanded', String(aberto));
        if (aberto) document.querySelector('#menu-lateral .menu-link')?.focus();
    };

    botao.addEventListener('click', () => alternar(!document.body.classList.contains('menu-aberto')));
    fundo.addEventListener('click', () => alternar(false));
    document.addEventListener('keydown', evento => {
        if (evento.key === 'Escape' && document.body.classList.contains('menu-aberto')) {
            alternar(false);
            botao.focus();
        }
    });
}

montarMenuLateral();
ligarGavetaDoMenu();
