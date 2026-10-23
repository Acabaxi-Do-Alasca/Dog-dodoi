const corpoClientes = document.querySelector('#clientes');
const campoBusca = document.querySelector('#busca');
const resumo = document.querySelector('#resumo');

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
    const todos = Banco.listar('clientes');
    const clientes = todos
        .filter(c => !termo || [c.nome, c.cpf, c.email].some(v => normalizar(v).includes(termo)))
        .sort((a, b) => a.nome.localeCompare(b.nome));

    resumo.textContent = termo
        ? `${clientes.length} de ${todos.length} cliente(s)`
        : `${todos.length} cliente(s)`;

    corpoClientes.replaceChildren();
    if (!clientes.length) {
        corpoClientes.append(termo
            ? Util.linhaVazia(5, 'Nenhum cliente encontrado', 'Tente buscar por outro nome, CPF ou e-mail.')
            : Util.linhaVazia(5, 'Nenhum cliente cadastrado ainda', 'Cadastre o primeiro tutor para agendar consultas.',
                { href: 'cliente.html', texto: 'Cadastrar cliente' }));
        return;
    }

    for (const cliente of clientes) {
        corpoClientes.append(Util.el('tr', {},
            Util.el('td', { 'data-rotulo': 'Cliente' },
                Util.el('span', { class: 'principal' }, cliente.nome),
                Util.el('span', { class: 'secundario' }, cliente.email)),
            Util.el('td', { 'data-rotulo': 'CPF' }, cliente.cpf),
            Util.el('td', { 'data-rotulo': 'WhatsApp' }, cliente.whatsapp),
            Util.el('td', { 'data-rotulo': 'Cidade' }, `${cliente.cidade}/${cliente.uf}`),
            Util.el('td', { class: 'acoes' },
                Util.el('a', { href: `consultas.html?cliente=${cliente.id}`, class: 'botao botao-secundario botao-pequeno' }, 'Agendar'),
                Util.el('a', { href: `cliente.html?id=${cliente.id}`, class: 'botao botao-fantasma botao-pequeno' }, 'Editar'),
                Util.el('button', { type: 'button', class: 'botao botao-perigo botao-pequeno', onclick: () => excluirCliente(cliente) }, 'Excluir')
            )
        ));
    }
}

campoBusca.addEventListener('input', mostrarClientes);
mostrarClientes();
