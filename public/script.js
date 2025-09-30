// ==================== CONFIGURAÇÃO E ESTADO GLOBAL ====================
const API_BASE_URL = '/api';

// Estado global da aplicação
let clientes = [];
let paginaAtual = 1;
let totalPaginas = 1;
let limitePorPagina = 10;
let filtros = {
    nome: '',
    ativo: ''
};

// ==================== FUNÇÕES DE API ====================
async function fazerRequisicao(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error('Erro na requisição:', error);
        mostrarToast('Erro: ' + error.message, 'error');
        throw error;
    }
}

// ==================== FUNÇÕES DE CLIENTES ====================
async function carregarClientes() {
    try {
        mostrarLoading(true);
        
        const params = new URLSearchParams({
            page: paginaAtual,
            limit: limitePorPagina
        });

        if (filtros.nome) params.append('nome', filtros.nome);
        if (filtros.ativo !== '') params.append('ativo', filtros.ativo);

        const response = await fazerRequisicao(`/clientes?${params}`);
        
        clientes = response.data.clientes;
        totalPaginas = response.data.pagination.totalPages;
        paginaAtual = response.data.pagination.currentPage;

        renderizarTabela();
        atualizarControlesPagina();
        
    } catch (error) {
        renderizarTabelaVazia('Erro ao carregar clientes');
    } finally {
        mostrarLoading(false);
    }
}

async function carregarEstatisticas() {
    try {
        const response = await fazerRequisicao('/clientes/estatisticas');
        const stats = response.data;

        document.getElementById('totalClientes').textContent = stats.total;
        document.getElementById('clientesAtivos').textContent = stats.ativos;
        document.getElementById('clientesInativos').textContent = stats.inativos;
        
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

async function adicionarCliente(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        const dadosCliente = Object.fromEntries(formData.entries());

        // Remover campos vazios
        Object.keys(dadosCliente).forEach(key => {
            if (dadosCliente[key] === '') {
                delete dadosCliente[key];
            }
        });

        await fazerRequisicao('/clientes', {
            method: 'POST',
            body: JSON.stringify(dadosCliente)
        });

        mostrarToast('Cliente adicionado com sucesso!', 'success');
        fecharModal('modalAdicionar');
        event.target.reset();
        carregarClientes();
        carregarEstatisticas();
        
    } catch (error) {
        // Erro já tratado na função fazerRequisicao
    }
}

async function editarCliente(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        const dadosCliente = Object.fromEntries(formData.entries());
        const id = dadosCliente.id;

        // Remover campos vazios e o ID
        delete dadosCliente.id;
        Object.keys(dadosCliente).forEach(key => {
            if (dadosCliente[key] === '') {
                delete dadosCliente[key];
            }
        });

        await fazerRequisicao(`/clientes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dadosCliente)
        });

        mostrarToast('Cliente atualizado com sucesso!', 'success');
        fecharModal('modalEditar');
        carregarClientes();
        carregarEstatisticas();
        
    } catch (error) {
        // Erro já tratado na função fazerRequisicao
    }
}

async function excluirCliente(id, nome) {
    if (!confirm(`Tem certeza que deseja excluir o cliente "${nome}"?`)) {
        return;
    }

    try {
        await fazerRequisicao(`/clientes/${id}`, {
            method: 'DELETE'
        });

        mostrarToast('Cliente excluído com sucesso!', 'success');
        carregarClientes();
        carregarEstatisticas();
        
    } catch (error) {
        // Erro já tratado na função fazerRequisicao
    }
}

async function restaurarCliente(id, nome) {
    if (!confirm(`Tem certeza que deseja restaurar o cliente "${nome}"?`)) {
        return;
    }

    try {
        await fazerRequisicao(`/clientes/${id}/restaurar`, {
            method: 'PATCH'
        });

        mostrarToast('Cliente restaurado com sucesso!', 'success');
        carregarClientes();
        carregarEstatisticas();
        
    } catch (error) {
        // Erro já tratado na função fazerRequisicao
    }
}

async function visualizarCliente(id) {
    try {
        const response = await fazerRequisicao(`/clientes/${id}`);
        const cliente = response.data;

        const detalhes = `
            <div class="detail-group">
                <div class="detail-label">Nome</div>
                <div class="detail-value">${cliente.nome}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Email</div>
                <div class="detail-value">${cliente.email}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Telefone</div>
                <div class="detail-value">${cliente.telefone}</div>
            </div>
            ${cliente.endereco ? `
            <div class="detail-group">
                <div class="detail-label">Endereço</div>
                <div class="detail-value">${cliente.endereco}</div>
            </div>
            ` : ''}
            ${cliente.cidade ? `
            <div class="detail-group">
                <div class="detail-label">Cidade</div>
                <div class="detail-value">${cliente.cidade}</div>
            </div>
            ` : ''}
            ${cliente.estado ? `
            <div class="detail-group">
                <div class="detail-label">Estado</div>
                <div class="detail-value">${cliente.estado}</div>
            </div>
            ` : ''}
            ${cliente.cep ? `
            <div class="detail-group">
                <div class="detail-label">CEP</div>
                <div class="detail-value">${cliente.cep}</div>
            </div>
            ` : ''}
            ${cliente.dataNascimento ? `
            <div class="detail-group">
                <div class="detail-label">Data de Nascimento</div>
                <div class="detail-value">${formatarData(cliente.dataNascimento)}</div>
            </div>
            ` : ''}
            <div class="detail-group">
                <div class="detail-label">Status</div>
                <div class="detail-value">
                    <span class="status-badge ${cliente.ativo ? 'status-ativo' : 'status-inativo'}">
                        ${cliente.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                </div>
            </div>
        `;

        document.getElementById('clienteDetalhes').innerHTML = detalhes;
        abrirModal('modalVisualizar');
        
    } catch (error) {
        // Erro já tratado na função fazerRequisicao
    }
}

// ==================== FUNÇÕES DE RENDERIZAÇÃO ====================
function renderizarTabela() {
    const tbody = document.getElementById('clientesTableBody');
    
    if (clientes.length === 0) {
        renderizarTabelaVazia('Nenhum cliente encontrado');
        return;
    }

    tbody.innerHTML = clientes.map(cliente => `
        <tr class="fade-in">
            <td>${cliente.id}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.cidade || '-'}</td>
            <td>
                <span class="status-badge ${cliente.ativo ? 'status-ativo' : 'status-inativo'}">
                    ${cliente.ativo ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="btn btn-sm btn-secondary" onclick="visualizarCliente(${cliente.id})" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="abrirModalEditar(${cliente.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${cliente.ativo ? 
                        `<button class="btn btn-sm btn-danger" onclick="excluirCliente(${cliente.id}, '${cliente.nome}')" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>` :
                        `<button class="btn btn-sm btn-success" onclick="restaurarCliente(${cliente.id}, '${cliente.nome}')" title="Restaurar">
                            <i class="fas fa-undo"></i>
                        </button>`
                    }
                </div>
            </td>
        </tr>
    `).join('');
}

function renderizarTabelaVazia(mensagem) {
    const tbody = document.getElementById('clientesTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="7" class="empty-state">
                <i class="fas fa-users"></i>
                <h3>${mensagem}</h3>
                <p>Não há clientes para exibir no momento.</p>
            </td>
        </tr>
    `;
}

function atualizarControlesPagina() {
    document.getElementById('infoPagina').textContent = `Página ${paginaAtual} de ${totalPaginas}`;
    
    const btnAnterior = document.getElementById('btnAnterior');
    const btnProximo = document.getElementById('btnProximo');
    
    btnAnterior.disabled = paginaAtual <= 1;
    btnProximo.disabled = paginaAtual >= totalPaginas;
}

// ==================== FUNÇÕES DE FILTROS E PAGINAÇÃO ====================
function filtrarClientes() {
    console.log('🔍 Filtrando clientes...');
    try {
        const filtroNome = document.getElementById('filtroNome');
        const filtroStatus = document.getElementById('filtroStatus');
        
        if (filtroNome) filtros.nome = filtroNome.value;
        if (filtroStatus) filtros.ativo = filtroStatus.value;
        
        paginaAtual = 1;
        console.log('Filtros aplicados:', filtros);
        carregarClientes();
    } catch (error) {
        console.error('❌ Erro ao filtrar clientes:', error);
    }
}

function proximaPagina() {
    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        carregarClientes();
    }
}

function anteriorPagina() {
    if (paginaAtual > 1) {
        paginaAtual--;
        carregarClientes();
    }
}

// ==================== FUNÇÕES DE MODAL ====================
function abrirModal(modalId) {
    console.log('📱 Abrindo modal:', modalId);
    try {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            console.log('✅ Modal aberto com sucesso');
        } else {
            console.error('❌ Modal não encontrado:', modalId);
        }
    } catch (error) {
        console.error('❌ Erro ao abrir modal:', error);
    }
}

function fecharModal(modalId) {
    console.log('📱 Fechando modal:', modalId);
    try {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            console.log('✅ Modal fechado com sucesso');
        }
    } catch (error) {
        console.error('❌ Erro ao fechar modal:', error);
    }
}

async function abrirModalEditar(id) {
    try {
        const response = await fazerRequisicao(`/clientes/${id}`);
        const cliente = response.data;

        // Preencher formulário
        document.getElementById('editId').value = cliente.id;
        document.getElementById('editNome').value = cliente.nome;
        document.getElementById('editEmail').value = cliente.email;
        document.getElementById('editTelefone').value = cliente.telefone;
        document.getElementById('editEndereco').value = cliente.endereco || '';
        document.getElementById('editCidade').value = cliente.cidade || '';
        document.getElementById('editEstado').value = cliente.estado || '';
        document.getElementById('editCep').value = cliente.cep || '';
        document.getElementById('editDataNascimento').value = cliente.dataNascimento || '';

        abrirModal('modalEditar');
        
    } catch (error) {
        // Erro já tratado na função fazerRequisicao
    }
}

// ==================== FUNÇÕES UTILITÁRIAS ====================
function mostrarLoading(mostrar) {
    const tbody = document.getElementById('clientesTableBody');
    if (mostrar) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="loading">
                    <i class="fas fa-spinner fa-spin"></i> Carregando clientes...
                </td>
            </tr>
        `;
    }
}

function mostrarToast(mensagem, tipo = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo} slide-up`;
    
    const icon = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    }[tipo] || 'fas fa-info-circle';
    
    toast.innerHTML = `
        <i class="toast-icon ${icon}"></i>
        <span>${mensagem}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remover toast após 5 segundos
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease reverse';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

function formatarData(data) {
    if (!data) return '-';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
}

// ==================== CONFIGURAÇÃO DE EVENT LISTENERS ====================
function configurarEventListeners() {
    console.log('🔧 Configurando event listeners...');
    
    // Botão Novo Cliente
    const btnNovoCliente = document.getElementById('btnNovoCliente');
    if (btnNovoCliente) {
        btnNovoCliente.addEventListener('click', function(e) {
            e.preventDefault();
            abrirModal('modalAdicionar');
        });
        console.log('✅ Event listener para botão Novo Cliente configurado');
    }
    
    // Filtro por nome
    const filtroNome = document.getElementById('filtroNome');
    if (filtroNome) {
        filtroNome.addEventListener('keyup', function() {
            filtrarClientes();
        });
        console.log('✅ Event listener para filtro por nome configurado');
    }
    
    // Filtro por status
    const filtroStatus = document.getElementById('filtroStatus');
    if (filtroStatus) {
        filtroStatus.addEventListener('change', function() {
            filtrarClientes();
        });
        console.log('✅ Event listener para filtro por status configurado');
    }
    
    // Botões de paginação
    const btnAnterior = document.getElementById('btnAnterior');
    if (btnAnterior) {
        btnAnterior.addEventListener('click', function() {
            anteriorPagina();
        });
        console.log('✅ Event listener para botão anterior configurado');
    }
    
    const btnProximo = document.getElementById('btnProximo');
    if (btnProximo) {
        btnProximo.addEventListener('click', function() {
            proximaPagina();
        });
        console.log('✅ Event listener para botão próximo configurado');
    }
    
    // Botões de fechar modal
    const botoesFechar = document.querySelectorAll('.close');
    botoesFechar.forEach(botao => {
        botao.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                fecharModal(modal.id);
            }
        });
    });
    console.log('✅ Event listeners para botões de fechar modal configurados');
    
    // Botões de cancelar modal
    const botoesCancelar = document.querySelectorAll('[data-modal]');
    botoesCancelar.forEach(botao => {
        botao.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            fecharModal(modalId);
        });
    });
    console.log('✅ Event listeners para botões de cancelar modal configurados');
    
    // Formulários
    const formAdicionar = document.getElementById('formAdicionar');
    if (formAdicionar) {
        formAdicionar.addEventListener('submit', adicionarCliente);
        console.log('✅ Event listener para formulário adicionar configurado');
    }
    
    const formEditar = document.getElementById('formEditar');
    if (formEditar) {
        formEditar.addEventListener('submit', editarCliente);
        console.log('✅ Event listener para formulário editar configurado');
    }
    
    console.log('✅ Todos os event listeners configurados com sucesso!');
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando aplicação...');
    
    try {
        console.log('📊 Carregando estatísticas...');
        carregarEstatisticas();
        
        console.log('👥 Carregando clientes...');
        carregarClientes();
        
        console.log('✅ Aplicação iniciada com sucesso!');
        
        // Configurar event listeners para elementos
        configurarEventListeners();
        
    } catch (error) {
        console.error('❌ Erro ao iniciar aplicação:', error);
    }
    
    // Formatação de telefone
    const telefoneInputs = document.querySelectorAll('input[name="telefone"]');
    telefoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 7) {
                value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            }
            e.target.value = value;
        });
    });

    // Formatação de CEP
    const cepInputs = document.querySelectorAll('input[name="cep"]');
    cepInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 5) {
                value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2');
            }
            e.target.value = value;
        });
    });
});

// ==================== EVENTOS GLOBAIS ====================
// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Atalhos de teclado
document.addEventListener('keydown', function(e) {
    // ESC para fechar modais
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Ctrl+N para novo cliente
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        abrirModal('modalAdicionar');
    }
});

// Tratamento de erros não capturados
window.addEventListener('unhandledrejection', function(event) {
    console.error('Erro não tratado:', event.reason);
    mostrarToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
});

// ==================== EXPORTAR FUNÇÕES PARA ESCOPO GLOBAL ====================
// Garantir que as funções estejam disponíveis globalmente
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.filtrarClientes = filtrarClientes;
window.proximaPagina = proximaPagina;
window.anteriorPagina = anteriorPagina;
window.adicionarCliente = adicionarCliente;
window.editarCliente = editarCliente;
window.excluirCliente = excluirCliente;
window.restaurarCliente = restaurarCliente;
window.visualizarCliente = visualizarCliente;
window.abrirModalEditar = abrirModalEditar;

console.log('🔧 Funções exportadas para escopo global');
console.log('abrirModal disponível:', typeof window.abrirModal === 'function');
console.log('filtrarClientes disponível:', typeof window.filtrarClientes === 'function');