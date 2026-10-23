// Cadastro de usuário. Sem login, cria a conta e já entra no sistema.
// Logado (vindo de "Cadastrar usuários" do painel), só cria outro usuário.
const formRegistro = document.querySelector('#form-registro');
const logado = Auth.usuarioAtual();

if (logado) {
    document.querySelector('#titulo').textContent = 'Cadastrar usuário';
    document.querySelector('#link-logo').href = 'dashBoard.html';
    const linkRodape = document.querySelector('#link-rodape a');
    linkRodape.href = 'listaUsuarios.html';
    linkRodape.textContent = 'Voltar para a lista de usuários';
}

formRegistro.addEventListener('submit', async evento => {
    evento.preventDefault();
    const dados = Util.lerFormulario(formRegistro);

    if (dados.senha !== dados.confirmarSenha) {
        Util.erroNoCampo(formRegistro.confirmarSenha, 'As senhas não conferem.');
        return;
    }

    try {
        await Auth.registrar(dados);
    } catch (erro) {
        Util.notificar(erro.message, 'erro');
        return;
    }

    if (logado) {
        Util.avisarNaProximaPagina(`Usuário ${dados.nome} cadastrado.`);
        location.href = 'listaUsuarios.html';
    } else {
        await Auth.entrar(dados.email, dados.senha);
        Util.avisarNaProximaPagina(`Bem-vindo, ${dados.nome}!`);
        location.href = 'dashBoard.html';
    }
});
