// Camada de dados. Não há servidor: cada coleção (usuarios, clientes,
// consultas, avaliacoes) é um array salvo no localStorage do navegador.
const Banco = {
    PREFIXO: 'dogdodoi:',

    listar(colecao) {
        try {
            return JSON.parse(localStorage.getItem(this.PREFIXO + colecao)) || [];
        } catch {
            return [];
        }
    },

    gravar(colecao, itens) {
        localStorage.setItem(this.PREFIXO + colecao, JSON.stringify(itens));
    },

    buscar(colecao, id) {
        return this.listar(colecao).find(item => item.id === id) || null;
    },

    inserir(colecao, dados) {
        const itens = this.listar(colecao);
        const novo = { ...dados, id: this.gerarId(), criadoEm: new Date().toISOString() };
        itens.push(novo);
        this.gravar(colecao, itens);
        return novo;
    },

    atualizar(colecao, id, dados) {
        const itens = this.listar(colecao);
        const indice = itens.findIndex(item => item.id === id);
        if (indice === -1) return null;
        itens[indice] = { ...itens[indice], ...dados, id };
        this.gravar(colecao, itens);
        return itens[indice];
    },

    remover(colecao, id) {
        this.gravar(colecao, this.listar(colecao).filter(item => item.id !== id));
    },

    gerarId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }
};
