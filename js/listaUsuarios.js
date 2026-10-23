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
            Util.el('td', { 'data-rotulo': 'Nome' }, ehVoce ? `${usuario.nome} (você)` : usuario.nome),
            Util.el('td', { 'data-rotulo': 'Usuário' }, usuario.usuario),
            Util.el('td', { 'data-rotulo': 'E-mail' }, usuario.email),
            Util.el('td', { 'data-rotulo': 'Cadastrado em' }, Util.formatarData(usuario.criadoEm)),
            Util.el('td', { class: 'acoes' }, Util.el('button', {
                type: 'button',
                class: 'botao-acao perigo',
                disabled: ehVoce,
                title: ehVoce ? 'Você não pode excluir o próprio usuário' : null,
                onclick: () => excluirUsuario(usuario)
            }, 'Excluir'))
        ));
    }
}

mostrarUsuarios();
