// Debug script para testar as funções
console.log('🔧 Script de debug carregado');

// Testar se as funções existem
window.testarFuncoes = function() {
    console.log('🧪 Testando funções...');
    
    // Verificar se as funções estão definidas
    console.log('abrirModal existe:', typeof abrirModal === 'function');
    console.log('filtrarClientes existe:', typeof filtrarClientes === 'function');
    console.log('carregarClientes existe:', typeof carregarClientes === 'function');
    
    // Verificar se os elementos existem
    const filtroNome = document.getElementById('filtroNome');
    const filtroStatus = document.getElementById('filtroStatus');
    const modalAdicionar = document.getElementById('modalAdicionar');
    
    console.log('Elemento filtroNome existe:', !!filtroNome);
    console.log('Elemento filtroStatus existe:', !!filtroStatus);
    console.log('Elemento modalAdicionar existe:', !!modalAdicionar);
    
    // Testar abrir modal
    if (typeof abrirModal === 'function') {
        console.log('🎯 Testando abrirModal...');
        try {
            abrirModal('modalAdicionar');
            console.log('✅ abrirModal executado sem erro');
        } catch (error) {
            console.error('❌ Erro ao executar abrirModal:', error);
        }
    }
    
    // Testar filtrar clientes
    if (typeof filtrarClientes === 'function') {
        console.log('🎯 Testando filtrarClientes...');
        try {
            filtrarClientes();
            console.log('✅ filtrarClientes executado sem erro');
        } catch (error) {
            console.error('❌ Erro ao executar filtrarClientes:', error);
        }
    }
};

// Executar teste automaticamente quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM carregado, executando teste...');
    setTimeout(() => {
        testarFuncoes();
    }, 1000);
});
