// Landing page: botão do banner e formulário de avaliação grátis.
const formAvaliacao = document.querySelector('#form-avaliacao');

Mascaras.aplicar();

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
