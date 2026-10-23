// Máscaras de digitação, validação de CPF e consulta de CEP (ViaCEP).
const Mascaras = {
    digitos(valor) {
        return valor.replace(/\D/g, '');
    },

    cpf(valor) {
        return Mascaras.digitos(valor).slice(0, 11)
            .replace(/^(\d{3})(\d)/, '$1.$2')
            .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1-$2');
    },

    // (18) 3636-3636 ou (18) 99123-1234
    telefone(valor) {
        const d = Mascaras.digitos(valor).slice(0, 11);
        if (d.length <= 2) return d.length ? `(${d}` : '';
        const resto = d.slice(2);
        const corte = d.length === 11 ? 5 : 4;
        return resto.length > corte
            ? `(${d.slice(0, 2)}) ${resto.slice(0, corte)}-${resto.slice(corte)}`
            : `(${d.slice(0, 2)}) ${resto}`;
    },

    cep(valor) {
        const d = Mascaras.digitos(valor).slice(0, 8);
        return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
    },

    // Liga a máscara em todo campo com data-mascara="cpf|telefone|cep".
    aplicar(raiz = document) {
        raiz.querySelectorAll('[data-mascara]').forEach(campo => {
            campo.addEventListener('input', evento => {
                // Ao apagar, não reformata: senão o hífen/ponto voltaria na hora.
                if (evento.inputType && evento.inputType.startsWith('delete')) return;
                campo.value = Mascaras[campo.dataset.mascara](campo.value);
            });
        });
    },

    cpfValido(valor) {
        const d = Mascaras.digitos(valor);
        if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
        const digitoVerificador = tamanho => {
            let soma = 0;
            for (let i = 0; i < tamanho; i++) soma += Number(d[i]) * (tamanho + 1 - i);
            const resto = (soma * 10) % 11;
            return resto === 10 ? 0 : resto;
        };
        return digitoVerificador(9) === Number(d[9]) && digitoVerificador(10) === Number(d[10]);
    },

    // Retorna { logradouro, bairro, localidade, uf } ou null se o CEP não existir.
    async buscarCep(cep) {
        const resposta = await fetch(`https://viacep.com.br/ws/${Mascaras.digitos(cep)}/json/`);
        if (!resposta.ok) throw new Error('Falha ao consultar o CEP.');
        const dados = await resposta.json();
        return dados.erro ? null : dados;
    }
};
