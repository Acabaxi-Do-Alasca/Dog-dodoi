const corpoConsultas = document.querySelector('#consultas');
const grupoFiltro = document.querySelector('#filtro');
const resumo = document.querySelector('#resumo');
const ROTULOS = { agendada: 'Agendada', realizada: 'Realizada', cancelada: 'Cancelada' };
const VAZIOS = {
    agendadas: ['Nenhuma consulta agendada', 'Os próximos horários aparecem aqui.'],
    realizadas: ['Nenhuma consulta realizada', 'Consultas agendadas passam para cá depois do horário.'],
    canceladas: ['Nenhuma consulta cancelada', 'Que bom! Nenhum cancelamento até agora.'],
    todas: ['Nenhuma consulta ainda', 'Agende a primeira consulta da clínica.']
};

function filtroAtual() {
    return grupoFiltro.querySelector('input:checked').value;
}

const pedido = Util.parametro('filtro');
const opcaoPedida = pedido && grupoFiltro.querySelector(`input[value="${CSS.escape(pedido)}"]`);
if (opcaoPedida) opcaoPedida.checked = true;

function alterarStatus(consulta, status) {
    if (status === 'agendada') {
        const ocupado = Banco.listar('consultas').some(c =>
            c.id !== consulta.id && c.status !== 'cancelada' && c.data === consulta.data && c.hora === consulta.hora);
        if (ocupado) {
            Util.notificar('Esse horário já foi ocupado por outra consulta. Edite a data/hora antes de reativar.', 'erro');
            return;
        }
    } else if (!confirm(`Cancelar a consulta de ${Util.formatarData(consulta.data)} às ${consulta.hora}?`)) {
        return;
    }
    Banco.atualizar('consultas', consulta.id, { status });
    Util.notificar(status === 'cancelada' ? 'Consulta cancelada.' : 'Consulta reativada.');
    mostrarConsultas();
}

function excluirConsulta(consulta) {
    if (!confirm('Excluir esta consulta? Essa ação não pode ser desfeita.')) return;
    Banco.remover('consultas', consulta.id);
    Util.notificar('Consulta excluída.');
    mostrarConsultas();
}

function botoesDaConsulta(consulta, situacao) {
    const botoes = [];
    if (situacao === 'agendada') {
        botoes.push(Util.el('button', { type: 'button', class: 'botao botao-secundario botao-pequeno', onclick: () => alterarStatus(consulta, 'cancelada') }, 'Cancelar'));
    }
    if (situacao === 'cancelada') {
        botoes.push(Util.el('button', { type: 'button', class: 'botao botao-secundario botao-pequeno', onclick: () => alterarStatus(consulta, 'agendada') }, 'Reativar'));
    }
    botoes.push(Util.el('a', { href: `consultas.html?id=${consulta.id}`, class: 'botao botao-fantasma botao-pequeno' }, 'Editar'));
    botoes.push(Util.el('button', { type: 'button', class: 'botao botao-perigo botao-pequeno', onclick: () => excluirConsulta(consulta) }, 'Excluir'));
    return botoes;
}

function mostrarConsultas() {
    const clientesPorId = new Map(Banco.listar('clientes').map(c => [c.id, c]));
    const escolhido = filtroAtual();
    const filtradas = Banco.listar('consultas')
        .filter(c => escolhido === 'todas' || Util.situacaoConsulta(c) + 's' === escolhido);
    // Próximas em ordem crescente; histórico da mais recente para a mais antiga.
    const consultas = Util.ordenarConsultas(filtradas, escolhido !== 'agendadas');
    resumo.textContent = `${consultas.length} consulta(s)`;

    corpoConsultas.replaceChildren();
    if (!consultas.length) {
        const [titulo, texto] = VAZIOS[escolhido];
        corpoConsultas.append(Util.linhaVazia(5, titulo, texto,
            escolhido === 'canceladas' ? null : { href: 'consultas.html', texto: 'Agendar consulta' }));
        return;
    }

    for (const consulta of consultas) {
        const situacao = Util.situacaoConsulta(consulta);
        corpoConsultas.append(Util.el('tr', {},
            Util.el('td', { 'data-rotulo': 'Quando' },
                Util.el('span', { class: 'principal' }, Util.formatarData(consulta.data)),
                Util.el('span', { class: 'secundario' }, consulta.hora)),
            Util.el('td', { 'data-rotulo': 'Cliente' }, clientesPorId.get(consulta.clienteId)?.nome ?? 'Cliente removido'),
            Util.el('td', { 'data-rotulo': 'Observações', class: 'texto-suave' }, consulta.observacoes || '-'),
            Util.el('td', { 'data-rotulo': 'Situação' }, Util.el('span', { class: `selo selo-${situacao}` }, ROTULOS[situacao])),
            Util.el('td', { class: 'acoes' }, ...botoesDaConsulta(consulta, situacao))
        ));
    }
}

grupoFiltro.addEventListener('change', mostrarConsultas);
mostrarConsultas();
