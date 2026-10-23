// Cadastro de usuário. Sem login, cria a conta e já entra no sistema.
// Logado (vindo de "Novo usuário" no painel), só cria outro usuário.
const formRegistro = document.querySelector('#form-registro');
const logado = Auth.usuarioAtual();

if (logado) {
    document.title = 'Novo usuário | Dog Dodói';
    document.querySelector('#titulo').textContent = 'Novo usuário';
    document.querySelector('#descricao').textContent = 'A pessoa poderá entrar no painel com o e-mail ou o nome de usuário.';
    document.querySelector('#botao-registrar').textContent = 'Cadastrar usuário';
    const voltar = document.querySelector('#link-voltar');
    voltar.href = 'listaUsuarios.html';
    voltar.lastChild.textContent = 'Voltar aos usuários';
    document.querySelector('#alternativa').hidden = true;
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
