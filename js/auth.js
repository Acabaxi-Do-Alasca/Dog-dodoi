// Login simulado no navegador. As senhas são guardadas como hash SHA-256
// com sal, mas tudo continua no localStorage: isto é uma demonstração, não
// um sistema seguro. Num sistema real a autenticação fica no servidor.
const Auth = {
    CHAVE_SESSAO: 'dogdodoi:sessao',

    async gerarHash(senha, sal) {
        const bytes = new TextEncoder().encode(sal + senha);
        const resumo = await crypto.subtle.digest('SHA-256', bytes);
        return [...new Uint8Array(resumo)].map(b => b.toString(16).padStart(2, '0')).join('');
    },

    async registrar({ nome, email, usuario, senha }) {
        email = email.toLowerCase();
        usuario = usuario.toLowerCase();
        const usuarios = Banco.listar('usuarios');
        if (usuarios.some(u => u.email === email)) throw new Error('Já existe uma conta com esse e-mail.');
        if (usuarios.some(u => u.usuario === usuario)) throw new Error('Esse nome de usuário já está em uso.');

        const sal = [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join('');
        const senhaHash = await this.gerarHash(senha, sal);
        return Banco.inserir('usuarios', { nome, email, usuario, sal, senhaHash });
    },

    // Aceita e-mail ou nome de usuário.
    async entrar(login, senha) {
        login = login.toLowerCase();
        const usuario = Banco.listar('usuarios').find(u => u.email === login || u.usuario === login);
        if (!usuario || await this.gerarHash(senha, usuario.sal) !== usuario.senhaHash) {
            throw new Error('E-mail/usuário ou senha incorretos.');
        }
        localStorage.setItem(this.CHAVE_SESSAO, usuario.id);
        return usuario;
    },

    sair() {
        localStorage.removeItem(this.CHAVE_SESSAO);
        location.href = 'index.html';
    },

    usuarioAtual() {
        const id = localStorage.getItem(this.CHAVE_SESSAO);
        return id ? Banco.buscar('usuarios', id) : null;
    },

    exigirLogin() {
        if (this.usuarioAtual()) return;
        const pagina = location.pathname.split('/').pop() + location.search;
        location.replace('login.html?voltar=' + encodeURIComponent(pagina));
    },

    // Só aceita voltar para uma página local, nunca para outro site.
    destinoAposLogin() {
        const voltar = Util.parametro('voltar');
        return voltar && /^[\w-]+\.html(\?[\w=&%-]*)?$/.test(voltar) ? voltar : 'dashBoard.html';
    }
};

// Páginas internas marcam <html data-protegida>; sem login, vão para o login.
if (document.documentElement.hasAttribute('data-protegida')) Auth.exigirLogin();

// Qualquer link com data-sair encerra a sessão.
document.addEventListener('click', evento => {
    if (!evento.target.closest('[data-sair]')) return;
    evento.preventDefault();
    Auth.sair();
});
