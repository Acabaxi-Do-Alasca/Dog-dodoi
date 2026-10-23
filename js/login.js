const formLogin = document.querySelector('#form-login');

if (Auth.usuarioAtual()) location.replace(Auth.destinoAposLogin());

formLogin.addEventListener('submit', async evento => {
    evento.preventDefault();
    const { login, senha } = Util.lerFormulario(formLogin);
    try {
        await Auth.entrar(login, senha);
        location.href = Auth.destinoAposLogin();
    } catch (erro) {
        Util.notificar(erro.message, 'erro');
        formLogin.senha.value = '';
        formLogin.senha.focus();
    }
});
