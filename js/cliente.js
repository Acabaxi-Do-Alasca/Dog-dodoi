// Cadastro e edição de cliente (cliente.html?id=... edita).
const formCliente = document.querySelector('#form-cliente');
const idCliente = Util.parametro('id');

Mascaras.aplicar();
formCliente.nascimento.max = Util.hoje();

if (idCliente) {
    const cliente = Banco.buscar('clientes', idCliente);
    if (cliente) {
        document.querySelector('#titulo').textContent = 'Editar cliente';
        document.querySelector('#trilha-atual').textContent = 'Editar';
        document.title = 'Editar cliente | Dog Dodói';
        Util.preencherFormulario(formCliente, cliente);
        formCliente.querySelector('[type=submit]').textContent = 'Salvar alterações';
    } else {
        Util.avisarNaProximaPagina('Cliente não encontrado.', 'erro');
        location.replace('listaClientes.html');
    }
}

formCliente.uf.addEventListener('input', () => {
    formCliente.uf.value = formCliente.uf.value.toUpperCase();
});

// Ao completar o CEP, preenche o endereço pelo ViaCEP.
formCliente.cep.addEventListener('input', async () => {
    if (Mascaras.digitos(formCliente.cep.value).length !== 8) return;
    try {
        const endereco = await Mascaras.buscarCep(formCliente.cep.value);
        if (!endereco) {
            Util.erroNoCampo(formCliente.cep, 'CEP não encontrado.');
            return;
        }
        formCliente.cidade.value = endereco.localidade;
        formCliente.uf.value = endereco.uf;
        if (endereco.logradouro) formCliente.rua.value = endereco.logradouro;
        if (endereco.bairro) formCliente.bairro.value = endereco.bairro;
        formCliente.numero.focus();
    } catch {
        Util.notificar('Não foi possível consultar o CEP agora. Preencha o endereço manualmente.', 'erro');
    }
});

document.querySelector('#cancelar').addEventListener('click', () => {
    location.href = 'listaClientes.html';
});

formCliente.addEventListener('submit', evento => {
    evento.preventDefault();
    const dados = Util.lerFormulario(formCliente);

    if (!Mascaras.cpfValido(dados.cpf)) {
        Util.erroNoCampo(formCliente.cpf, 'CPF inválido.');
        return;
    }
    const cpfRepetido = Banco.listar('clientes').some(c => c.id !== idCliente && Mascaras.digitos(c.cpf) === Mascaras.digitos(dados.cpf));
    if (cpfRepetido) {
        Util.erroNoCampo(formCliente.cpf, 'Já existe um cliente com esse CPF.');
        return;
    }

    if (idCliente) Banco.atualizar('clientes', idCliente, dados);
    else Banco.inserir('clientes', dados);

    Util.avisarNaProximaPagina(`Cliente ${dados.nome} salvo.`);
    location.href = 'listaClientes.html';
});
