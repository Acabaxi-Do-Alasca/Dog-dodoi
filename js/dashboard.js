// Painel: contadores, próximas consultas e pedidos vindos da landing page.
const usuario = Auth.usuarioAtual();
if (usuario) document.querySelector('#saudacao').textContent = `Olá, ${usuario.nome.split(' ')[0]}!`;

const clientesPorId = new Map(Banco.listar('clientes').map(c => [c.id, c]));
const consultas = Banco.listar('consultas');
const agendadas = consultas.filter(c => Util.situacaoConsulta(c) === 'agendada');

document.querySelector('#total-clientes').textContent = clientesPorId.size;
document.querySelector('#total-usuarios').textContent = Banco.listar('usuarios').length;
document.querySelector('#total-agendadas').textContent = agendadas.length;
document.querySelector('#total-canceladas').textContent = consultas.filter(c => c.status === 'cancelada').length;

function linhaVazia(colunas, texto) {
    return Util.el('tr', {}, Util.el('td', { colspan: colunas, class: 'vazio' }, texto));
}

const corpoProximas = document.querySelector('#proximas-consultas');
const proximas = Util.ordenarConsultas(agendadas).slice(0, 5);
if (!proximas.length) corpoProximas.append(linhaVazia(4, 'Nenhuma consulta agendada.'));
for (const consulta of proximas) {
    corpoProximas.append(Util.el('tr', {},
        Util.el('td', {}, Util.formatarData(consulta.data)),
        Util.el('td', {}, consulta.hora),
        Util.el('td', {}, clientesPorId.get(consulta.clienteId)?.nome ?? 'Cliente removido'),
        Util.el('td', {}, consulta.observacoes || '-')
    ));
}

function mostrarAvaliacoes() {
    const corpo = document.querySelector('#avaliacoes');
    corpo.replaceChildren();
    const avaliacoes = Banco.listar('avaliacoes').reverse();
    if (!avaliacoes.length) corpo.append(linhaVazia(5, 'Nenhum pedido no momento.'));
    for (const pedido of avaliacoes) {
        corpo.append(Util.el('tr', {},
            Util.el('td', {}, Util.formatarData(pedido.criadoEm)),
            Util.el('td', {}, pedido.nome),
            Util.el('td', {}, Util.el('a', { href: `mailto:${pedido.email}`, class: 'link' }, pedido.email)),
            Util.el('td', {}, pedido.telefone),
            Util.el('td', { class: 'acoes' }, Util.el('button', {
                type: 'button',
                class: 'botao-acao',
                onclick: () => { Banco.remover('avaliacoes', pedido.id); mostrarAvaliacoes(); }
            }, 'Marcar como atendido'))
        ));
    }
}
mostrarAvaliacoes();
