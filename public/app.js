// TV 3.0 - Interactive Polling App JavaScript

// Configuration constants
const REFRESH_DELAY_MS = 500;
const SUCCESS_MESSAGE_DURATION_MS = 2000;
const AUTO_UPDATE_INTERVAL_MS = 5000;

class TV3PollingApp {
    constructor() {
        this.currentSelectedIndex = 0;
        this.opcoes = [];
        this.isLoading = false;
        this.updateInterval = null;
        this.apiBaseUrl = window.location.origin;
        
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando TV 3.0 Polling App...');
        
        // Setup event listeners
        this.setupKeyboardNavigation();
        this.setupUpdateInterval();
        
        // Initial load
        await this.loadInitialData();
        
        // Hide loading overlay
        this.hideLoading();
        
        console.log('✅ App inicializado com sucesso!');
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            switch(event.key) {
                case 'ArrowUp':
                    event.preventDefault();
                    this.navigateUp();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    this.navigateDown();
                    break;
                case 'Enter':
                    event.preventDefault();
                    this.vote();
                    break;
                case 'r':
                case 'R':
                    event.preventDefault();
                    this.refreshResults();
                    break;
            }
        });
    }

    setupUpdateInterval() {
        // Update results automatically
        this.updateInterval = setInterval(() => {
            this.loadResults();
        }, AUTO_UPDATE_INTERVAL_MS);
    }

    async loadInitialData() {
        this.showLoading();
        
        try {
            await this.loadResults();
            this.renderVotingOptions();
            this.updateConnectionStatus(true);
        } catch (error) {
            console.error('❌ Erro ao carregar dados iniciais:', error);
            this.updateConnectionStatus(false);
        }
    }

    async loadResults() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/resultados`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.updateQuestion(data.pergunta);
            this.updateResults(data);
            this.updateTotalVotes(data.totalVotos);
            this.updateLastUpdate(data.ultimaAtualizacao);
            this.updateConnectionStatus(true);
            
            // Update options list for navigation
            this.opcoes = Object.keys(data.opcoes);
            
        } catch (error) {
            console.error('❌ Erro ao carregar resultados:', error);
            this.updateConnectionStatus(false);
        }
    }

    renderVotingOptions() {
        const container = document.getElementById('opcoes-container');
        if (!container) return;

        // Clear existing options
        container.innerHTML = '';

        this.opcoes.forEach((opcao, index) => {
            const opcaoElement = document.createElement('div');
            opcaoElement.className = 'opcao-item';
            opcaoElement.dataset.index = index;
            opcaoElement.dataset.opcao = opcao;
            
            if (index === this.currentSelectedIndex) {
                opcaoElement.classList.add('selected');
            }

            opcaoElement.innerHTML = `
                <div class="opcao-numero">${index + 1}</div>
                <div class="opcao-texto">${opcao}</div>
            `;

            // Add click handler for mouse/touch support
            opcaoElement.addEventListener('click', () => {
                this.currentSelectedIndex = index;
                this.updateSelection();
                setTimeout(() => this.vote(), 300);
            });

            container.appendChild(opcaoElement);
        });
    }

    navigateUp() {
        if (this.opcoes.length === 0) return;
        
        this.currentSelectedIndex = this.currentSelectedIndex > 0 
            ? this.currentSelectedIndex - 1 
            : this.opcoes.length - 1;
        
        this.updateSelection();
    }

    navigateDown() {
        if (this.opcoes.length === 0) return;
        
        this.currentSelectedIndex = this.currentSelectedIndex < this.opcoes.length - 1 
            ? this.currentSelectedIndex + 1 
            : 0;
        
        this.updateSelection();
    }

    updateSelection() {
        const opcaoItems = document.querySelectorAll('.opcao-item');
        opcaoItems.forEach((item, index) => {
            if (index === this.currentSelectedIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    async vote() {
        if (this.isLoading || this.opcoes.length === 0) return;
        
        const selectedOption = this.opcoes[this.currentSelectedIndex];
        if (!selectedOption) return;

        this.isLoading = true;
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/votar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ opcao: selectedOption })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.sucesso) {
                this.showSuccessMessage(selectedOption);
                // Refresh results immediately after voting
                setTimeout(() => this.loadResults(), REFRESH_DELAY_MS);
            } else {
                throw new Error(result.erro || 'Erro desconhecido');
            }

        } catch (error) {
            console.error('❌ Erro ao votar:', error);
            this.showErrorMessage('Erro ao registrar voto. Tente novamente.');
        } finally {
            this.isLoading = false;
        }
    }

    async refreshResults() {
        await this.loadResults();
        this.showSuccessMessage('Resultados atualizados!');
    }

    updateQuestion(pergunta) {
        const perguntaTitulo = document.getElementById('pergunta-titulo');
        if (perguntaTitulo) {
            perguntaTitulo.textContent = pergunta;
        }
    }

    updateResults(data) {
        const container = document.getElementById('resultados-container');
        if (!container) return;

        container.innerHTML = '';

        Object.entries(data.opcoes).forEach(([opcao, stats]) => {
            const resultadoElement = document.createElement('div');
            resultadoElement.className = 'resultado-item';
            
            resultadoElement.innerHTML = `
                <div class="resultado-header">
                    <div class="resultado-opcao">${opcao}</div>
                    <div class="resultado-stats">${stats.votos} votos (${stats.porcentagem}%)</div>
                </div>
                <div class="resultado-barra-container">
                    <div class="resultado-barra" style="width: ${stats.porcentagem}%"></div>
                </div>
            `;

            container.appendChild(resultadoElement);
        });
    }

    updateTotalVotes(total) {
        const totalVotosElement = document.getElementById('total-votos');
        if (totalVotosElement) {
            totalVotosElement.textContent = `Total: ${total} votos`;
        }
    }

    updateLastUpdate(timestamp) {
        const ultimaAtualizacaoElement = document.getElementById('ultima-atualizacao');
        if (ultimaAtualizacaoElement && timestamp) {
            const date = new Date(timestamp);
            ultimaAtualizacaoElement.textContent = date.toLocaleString('pt-BR');
        }
    }

    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('status-conexao');
        if (statusElement) {
            statusElement.textContent = connected ? '🟢 Conectado' : '🔴 Desconectado';
        }
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    showSuccessMessage(message) {
        const successElement = document.getElementById('voto-sucesso');
        const successText = successElement?.querySelector('.sucesso-text');
        
        if (successElement && successText) {
            successText.textContent = message;
            successElement.classList.remove('hidden');
            
            // Hide after configured duration
            setTimeout(() => {
                successElement.classList.add('hidden');
            }, SUCCESS_MESSAGE_DURATION_MS);
        }
    }

    showErrorMessage(message) {
        // Display error using the same visual style as success messages
        const successElement = document.getElementById('voto-sucesso');
        const successText = successElement?.querySelector('.sucesso-text');
        const successIcon = successElement?.querySelector('.sucesso-icon');
        
        if (successElement && successText && successIcon) {
            const originalIcon = successIcon.textContent;
            successIcon.textContent = '❌';
            successText.textContent = message;
            successElement.style.background = 'rgba(255, 99, 71, 0.95)';
            successElement.classList.remove('hidden');
            
            setTimeout(() => {
                successElement.classList.add('hidden');
                successElement.style.background = '';
                successIcon.textContent = originalIcon;
            }, SUCCESS_MESSAGE_DURATION_MS);
        } else {
            console.error('❌', message);
        }
    }

    // Cleanup method for when the page is unloaded
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tv3App = new TV3PollingApp();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.tv3App) {
        window.tv3App.destroy();
    }
});

// Handle visibility change to pause/resume updates when tab is not active
document.addEventListener('visibilitychange', () => {
    if (window.tv3App) {
        if (document.hidden) {
            clearInterval(window.tv3App.updateInterval);
        } else {
            window.tv3App.setupUpdateInterval();
            window.tv3App.loadResults(); // Refresh immediately when tab becomes active
        }
    }
});
