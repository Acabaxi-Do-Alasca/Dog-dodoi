// Ícones em linha (24x24, cor = currentColor). No HTML basta escrever
// <span data-icone="consultas"></span> que o SVG é inserido ali.
const Icones = {
    caminhos: {
        painel: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
        clientes: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
        consultas: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
        usuarios: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
        cancelada: '<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>',
        pedidos: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
        sair: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
        mais: '<path d="M12 5v14M5 12h14"/>',
        menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
        fechar: '<path d="M18 6L6 18M6 6l12 12"/>',
        site: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
        busca: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
        coracao: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
        relogio: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
        cruz: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
        check: '<path d="M20 6L9 17l-5-5"/>',
        voltar: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
        telefone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>'
    },

    svg(nome) {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${this.caminhos[nome] || ''}</svg>`;
    },

    aplicar(raiz = document) {
        raiz.querySelectorAll('[data-icone]').forEach(elemento => {
            elemento.insertAdjacentHTML('afterbegin', Icones.svg(elemento.dataset.icone));
            elemento.removeAttribute('data-icone');
        });
    }
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => Icones.aplicar());
else Icones.aplicar();
