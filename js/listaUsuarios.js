const corpoUsuarios = document.querySelector('#usuarios');

function excluirUsuario(usuario) {
    if (!confirm(`Excluir o usuário ${usuario.nome}?`)) return;
    Banco.remover('usuarios', usuario.id);
    Util.notificar('Usuário excluído.');
    mostrarUsuarios();
}

function mostrarUsuarios() {
    const atual = Auth.usuarioAtual();
    corpoUsuarios.replaceChildren();
    for (const usuario of Banco.listar('usuarios').sort((a, b) => a.nome.localeCompare(b.nome))) {
        const ehVoce = usuario.id === atual?.id;
        corpoUsuarios.append(Util.el('tr', {},
            Util.el('td', { 'data-rotulo': 'Nome' },
                Util.el('span', { class: 'principal' }, usuario.nome, ehVoce ? Util.el('span', { class: 'selo selo-agendada' }, 'Você') : null),
                Util.el('span', { class: 'secundario' }, usuario.email)),
            Util.el('td', { 'data-rotulo': 'Usuário' }, usuario.usuario),
            Util.el('td', { 'data-rotulo': 'Cadastrado em' }, Util.formatarData(usuario.criadoEm)),
            Util.el('td', { class: 'acoes' }, Util.el('button', {
                type: 'button',
                class: 'botao botao-perigo botao-pequeno',
                disabled: ehVoce,
                title: ehVoce ? 'Você não pode excluir o próprio usuário' : null,
                onclick: () => excluirUsuario(usuario)
            }, 'Excluir'))
        ));
    }
}

mostrarUsuarios();
