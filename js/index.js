// Landing page: menu do celular, botão do banner e formulário de avaliação grátis.
const formAvaliacao = document.querySelector('#form-avaliacao');
const botaoMenu = document.querySelector('#botao-menu');
const navegacao = document.querySelector('#site-nav');

Mascaras.aplicar();

function alternarMenu(aberto) {
    navegacao.classList.toggle('aberto', aberto);
    botaoMenu.setAttribute('aria-expanded', String(aberto));
}

botaoMenu.addEventListener('click', () => alternarMenu(!navegacao.classList.contains('aberto')));
navegacao.addEventListener('click', evento => {
    if (evento.target.closest('a')) alternarMenu(false);
});

document.querySelector('#botao-avaliacao').addEventListener('click', () => {
    document.querySelector('#form').scrollIntoView({ behavior: 'smooth' });
    formAvaliacao.querySelector('#nome').focus({ preventScroll: true });
});

formAvaliacao.addEventListener('submit', evento => {
    evento.preventDefault();
    Banco.inserir('avaliacoes', Util.lerFormulario(formAvaliacao));
    formAvaliacao.reset();
    Util.notificar('Recebemos seu pedido! Entraremos em contato em breve.');
});
