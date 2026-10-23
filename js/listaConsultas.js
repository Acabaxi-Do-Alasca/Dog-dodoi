const corpoConsultas = document.querySelector('#consultas');
const filtro = document.querySelector('#filtro');
const ROTULOS = { agendada: 'Agendada', realizada: 'Realizada', cancelada: 'Cancelada' };

if (Util.parametro('filtro')) filtro.value = Util.parametro('filtro');

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
    const botoes = [Util.el('a', { href: `consultas.html?id=${consulta.id}`, class: 'botao-acao' }, 'Editar')];
    if (situacao === 'agendada') {
        botoes.push(Util.el('button', { type: 'button', class: 'botao-acao', onclick: () => alterarStatus(consulta, 'cancelada') }, 'Cancelar'));
    }
    if (situacao === 'cancelada') {
        botoes.push(Util.el('button', { type: 'button', class: 'botao-acao', onclick: () => alterarStatus(consulta, 'agendada') }, 'Reativar'));
    }
    botoes.push(Util.el('button', { type: 'button', class: 'botao-acao perigo', onclick: () => excluirConsulta(consulta) }, 'Excluir'));
    return botoes;
}

function mostrarConsultas() {
    const clientesPorId = new Map(Banco.listar('clientes').map(c => [c.id, c]));
    const escolhido = filtro.value;
    const filtradas = Banco.listar('consultas')
        .filter(c => escolhido === 'todas' || Util.situacaoConsulta(c) + 's' === escolhido);
    // Próximas em ordem crescente; histórico da mais recente para a mais antiga.
    const consultas = Util.ordenarConsultas(filtradas, escolhido !== 'agendadas');

    corpoConsultas.replaceChildren();
    if (!consultas.length) {
        corpoConsultas.append(Util.el('tr', {}, Util.el('td', { colspan: 6, class: 'vazio' }, 'Nenhuma consulta para mostrar.')));
        return;
    }

    for (const consulta of consultas) {
        const situacao = Util.situacaoConsulta(consulta);
        corpoConsultas.append(Util.el('tr', {},
            Util.el('td', { 'data-rotulo': 'Data' }, Util.formatarData(consulta.data)),
            Util.el('td', { 'data-rotulo': 'Hora' }, consulta.hora),
            Util.el('td', { 'data-rotulo': 'Cliente' }, clientesPorId.get(consulta.clienteId)?.nome ?? 'Cliente removido'),
            Util.el('td', { 'data-rotulo': 'Observações' }, consulta.observacoes || '-'),
            Util.el('td', { 'data-rotulo': 'Situação' }, Util.el('span', { class: `selo selo-${situacao}` }, ROTULOS[situacao])),
            Util.el('td', { class: 'acoes' }, ...botoesDaConsulta(consulta, situacao))
        ));
    }
}

filtro.addEventListener('change', mostrarConsultas);
mostrarConsultas();
