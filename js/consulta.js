// Agendamento e edição de consulta.
// consultas.html?id=... edita; consultas.html?cliente=... já seleciona o cliente.
const formConsulta = document.querySelector('#form-consulta');
const idConsulta = Util.parametro('id');
const seletorCliente = formConsulta.clienteId;
const consultaOriginal = idConsulta ? Banco.buscar('consultas', idConsulta) : null;
const clientes = Banco.listar('clientes').sort((a, b) => a.nome.localeCompare(b.nome));

if (clientes.length) {
    seletorCliente.append(Util.el('option', { value: '' }, 'Selecione o cliente'));
    for (const cliente of clientes) {
        seletorCliente.append(Util.el('option', { value: cliente.id }, `${cliente.nome} (CPF ${cliente.cpf})`));
    }
} else {
    seletorCliente.append(Util.el('option', { value: '' }, 'Nenhum cliente cadastrado'));
    seletorCliente.disabled = true;
    formConsulta.querySelector('#button1').disabled = true;
    Util.notificar('Cadastre um cliente antes de agendar uma consulta.', 'erro');
}

if (idConsulta) {
    if (consultaOriginal) {
        document.querySelector('#registro').textContent = 'Editar consulta';
        document.title = 'Editar consulta | Dog Dodói';
        Util.preencherFormulario(formConsulta, consultaOriginal);
    } else {
        Util.avisarNaProximaPagina('Consulta não encontrada.', 'erro');
        location.replace('listaConsultas.html');
    }
} else {
    formConsulta.data.min = Util.hoje();
    const clientePedido = Util.parametro('cliente');
    if (clientePedido) seletorCliente.value = clientePedido;
}

document.querySelector('#button2').addEventListener('click', () => {
    location.href = 'listaConsultas.html';
});

formConsulta.addEventListener('submit', evento => {
    evento.preventDefault();
    const dados = Util.lerFormulario(formConsulta);

    const mudouHorario = !consultaOriginal || consultaOriginal.data !== dados.data || consultaOriginal.hora !== dados.hora;
    if (mudouHorario && new Date(`${dados.data}T${dados.hora}`) < new Date()) {
        Util.erroNoCampo(formConsulta.hora, 'Escolha uma data e hora no futuro.');
        return;
    }
    const horarioOcupado = Banco.listar('consultas').some(c =>
        c.id !== idConsulta && c.status !== 'cancelada' && c.data === dados.data && c.hora === dados.hora);
    if (horarioOcupado) {
        Util.erroNoCampo(formConsulta.hora, 'Já existe uma consulta agendada nesse horário.');
        return;
    }

    if (idConsulta) Banco.atualizar('consultas', idConsulta, dados);
    else Banco.inserir('consultas', { ...dados, status: 'agendada' });

    Util.avisarNaProximaPagina(`Consulta salva para ${Util.formatarData(dados.data)} às ${dados.hora}.`);
    location.href = 'listaConsultas.html';
});
