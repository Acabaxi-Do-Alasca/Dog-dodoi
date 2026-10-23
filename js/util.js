// Funções de apoio usadas por todas as páginas.
const Util = {
    // Cria um elemento: Util.el('a', { href: 'x.html', class: 'botao' }, 'Texto')
    // Os filhos entram como texto (nunca como HTML), o que evita injeção de código.
    el(tag, atributos = {}, ...filhos) {
        const elemento = document.createElement(tag);
        for (const [nome, valor] of Object.entries(atributos)) {
            if (nome.startsWith('on')) elemento.addEventListener(nome.slice(2), valor);
            else if (valor === true) elemento.setAttribute(nome, '');
            else if (valor !== false && valor != null) elemento.setAttribute(nome, valor);
        }
        elemento.append(...filhos.filter(filho => filho != null));
        return elemento;
    },

    parametro(nome) {
        return new URLSearchParams(location.search).get(nome);
    },

    // Lê todos os campos com atributo name, já sem espaços nas pontas.
    lerFormulario(form) {
        const dados = {};
        for (const [nome, valor] of new FormData(form)) dados[nome] = String(valor).trim();
        return dados;
    },

    preencherFormulario(form, dados) {
        for (const campo of form.elements) {
            if (campo.name && dados[campo.name] != null) campo.value = dados[campo.name];
        }
    },

    // Mostra o erro no próprio campo, usando o balão de validação do navegador.
    erroNoCampo(campo, mensagem) {
        campo.setCustomValidity(mensagem);
        campo.reportValidity();
    },

    // Data de hoje no formato do <input type="date"> (AAAA-MM-DD), no fuso local.
    hoje() {
        const agora = new Date();
        agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
        return agora.toISOString().slice(0, 10);
    },

    formatarData(valor) {
        if (!valor) return '';
        const [ano, mes, dia] = valor.slice(0, 10).split('-');
        return `${dia}/${mes}/${ano}`;
    },

    // "agendada" no banco vira "realizada" na tela quando a data/hora já passou.
    situacaoConsulta(consulta) {
        if (consulta.status === 'cancelada') return 'cancelada';
        return new Date(`${consulta.data}T${consulta.hora}`) < new Date() ? 'realizada' : 'agendada';
    },

    ordenarConsultas(consultas, decrescente = false) {
        const ordem = decrescente ? -1 : 1;
        return [...consultas].sort((a, b) => `${a.data} ${a.hora}`.localeCompare(`${b.data} ${b.hora}`) * ordem);
    },

    // Linha de "estado vazio" para tabelas, com ação opcional { href, texto }.
    linhaVazia(colunas, titulo, texto, acao) {
        return Util.el('tr', {}, Util.el('td', { colspan: colunas, class: 'vazio' },
            Util.el('strong', {}, titulo),
            texto,
            acao ? Util.el('div', {}, Util.el('a', { href: acao.href, class: 'botao botao-primario botao-pequeno' }, acao.texto)) : null));
    },

    notificar(texto, tipo = 'sucesso') {
        const aviso = Util.el('div', { class: `toast toast-${tipo}`, role: tipo === 'erro' ? 'alert' : 'status' }, texto);
        document.body.append(aviso);
        setTimeout(() => aviso.remove(), 4500);
    },

    // Guarda um aviso para ser mostrado depois de um redirecionamento.
    avisarNaProximaPagina(texto, tipo = 'sucesso') {
        sessionStorage.setItem('dogdodoi:aviso', JSON.stringify({ texto, tipo }));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const pendente = sessionStorage.getItem('dogdodoi:aviso');
    if (!pendente) return;
    sessionStorage.removeItem('dogdodoi:aviso');
    const { texto, tipo } = JSON.parse(pendente);
    Util.notificar(texto, tipo);
});

// Ao editar um campo, limpa o erro personalizado que ele tinha.
document.addEventListener('input', evento => {
    if (evento.target.setCustomValidity) evento.target.setCustomValidity('');
});
