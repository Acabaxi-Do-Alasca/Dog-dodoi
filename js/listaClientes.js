const corpoClientes = document.querySelector('#clientes');
const campoBusca = document.querySelector('#busca');

function normalizar(texto) {
    return (texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function excluirCliente(cliente) {
    const consultasDoCliente = Banco.listar('consultas').filter(c => c.clienteId === cliente.id);
    const aviso = consultasDoCliente.length
        ? `Excluir ${cliente.nome}? As ${consultasDoCliente.length} consulta(s) dele também serão excluídas.`
        : `Excluir ${cliente.nome}?`;
    if (!confirm(aviso)) return;

    consultasDoCliente.forEach(c => Banco.remover('consultas', c.id));
    Banco.remover('clientes', cliente.id);
    Util.notificar('Cliente excluído.');
    mostrarClientes();
}

function mostrarClientes() {
    const termo = normalizar(campoBusca.value);
    const clientes = Banco.listar('clientes')
        .filter(c => !termo || [c.nome, c.cpf, c.email].some(v => normalizar(v).includes(termo)))
        .sort((a, b) => a.nome.localeCompare(b.nome));

    corpoClientes.replaceChildren();
    if (!clientes.length) {
        const texto = termo ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado ainda.';
        corpoClientes.append(Util.el('tr', {}, Util.el('td', { colspan: 6, class: 'vazio' }, texto)));
        return;
    }

    for (const cliente of clientes) {
        corpoClientes.append(Util.el('tr', {},
            Util.el('td', { 'data-rotulo': 'Nome' }, cliente.nome),
            Util.el('td', { 'data-rotulo': 'CPF' }, cliente.cpf),
            Util.el('td', { 'data-rotulo': 'WhatsApp' }, cliente.whatsapp),
            Util.el('td', { 'data-rotulo': 'E-mail' }, cliente.email),
            Util.el('td', { 'data-rotulo': 'Cidade' }, `${cliente.cidade}/${cliente.uf}`),
            Util.el('td', { class: 'acoes' },
                Util.el('a', { href: `cliente.html?id=${cliente.id}`, class: 'botao-acao' }, 'Editar'),
                Util.el('a', { href: `consultas.html?cliente=${cliente.id}`, class: 'botao-acao' }, 'Agendar'),
                Util.el('button', { type: 'button', class: 'botao-acao perigo', onclick: () => excluirCliente(cliente) }, 'Excluir')
            )
        ));
    }
}

campoBusca.addEventListener('input', mostrarClientes);
mostrarClientes();
