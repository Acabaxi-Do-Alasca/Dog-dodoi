// Painel: contadores, próximas consultas e pedidos vindos da landing page.
const usuario = Auth.usuarioAtual();
if (usuario) document.querySelector('#saudacao').textContent = `Olá, ${usuario.nome.split(' ')[0]}!`;
const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
document.querySelector('#data-hoje').textContent = hoje[0].toUpperCase() + hoje.slice(1);

const clientesPorId = new Map(Banco.listar('clientes').map(c => [c.id, c]));
const consultas = Banco.listar('consultas');
const agendadas = consultas.filter(c => Util.situacaoConsulta(c) === 'agendada');

document.querySelector('#total-clientes').textContent = clientesPorId.size;
document.querySelector('#total-usuarios').textContent = Banco.listar('usuarios').length;
document.querySelector('#total-agendadas').textContent = agendadas.length;
document.querySelector('#total-canceladas').textContent = consultas.filter(c => c.status === 'cancelada').length;

const corpoProximas = document.querySelector('#proximas-consultas');
const proximas = Util.ordenarConsultas(agendadas).slice(0, 5);
if (!proximas.length) {
    corpoProximas.append(Util.linhaVazia(3, 'Nenhuma consulta agendada',
        'As próximas consultas aparecem aqui.', { href: 'consultas.html', texto: 'Agendar consulta' }));
}
for (const consulta of proximas) {
    corpoProximas.append(Util.el('tr', {},
        Util.el('td', { 'data-rotulo': 'Quando' },
            Util.el('span', { class: 'principal' }, Util.formatarData(consulta.data)),
            Util.el('span', { class: 'secundario' }, consulta.hora)),
        Util.el('td', { 'data-rotulo': 'Cliente' }, clientesPorId.get(consulta.clienteId)?.nome ?? 'Cliente removido'),
        Util.el('td', { 'data-rotulo': 'Observações', class: 'texto-suave' }, consulta.observacoes || '-')
    ));
}

function mostrarAvaliacoes() {
    const corpo = document.querySelector('#avaliacoes');
    corpo.replaceChildren();
    const avaliacoes = Banco.listar('avaliacoes').reverse();
    document.querySelector('#total-pedidos').textContent = `${avaliacoes.length} ${avaliacoes.length === 1 ? 'pendente' : 'pendentes'}`;
    if (!avaliacoes.length) {
        corpo.append(Util.linhaVazia(3, 'Nenhum pedido no momento', 'Os pedidos feitos no site aparecem aqui.'));
    }
    for (const pedido of avaliacoes) {
        corpo.append(Util.el('tr', {},
            Util.el('td', { 'data-rotulo': 'Contato' },
                Util.el('span', { class: 'principal' }, pedido.nome),
                Util.el('a', { class: 'secundario', href: `mailto:${pedido.email}` }, pedido.email),
                Util.el('span', { class: 'secundario' }, pedido.telefone)),
            Util.el('td', { 'data-rotulo': 'Recebido' }, Util.formatarData(pedido.criadoEm)),
            Util.el('td', { class: 'acoes' }, Util.el('button', {
                type: 'button',
                class: 'botao botao-secundario botao-pequeno',
                'aria-label': `Marcar pedido de ${pedido.nome} como atendido`,
                'data-icone': 'check',
                onclick: () => {
                    Banco.remover('avaliacoes', pedido.id);
                    Util.notificar(`Pedido de ${pedido.nome} marcado como atendido.`);
                    mostrarAvaliacoes();
                }
            }, 'Atendido'))
        ));
    }
    Icones.aplicar(corpo);
}
mostrarAvaliacoes();
