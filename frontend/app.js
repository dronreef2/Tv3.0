class TVPollApp {
    constructor() {
        this.currentOptionIndex = 0;
        this.pollData = null;
        this.options = [];
        this.isVoting = false;
        this.updateInterval = null;
        
        this.init();
    }
    
    init() {
        console.log('🚀 Iniciando TV 3.0 Poll App');
        this.setupEventListeners();
        this.loadPollData();
        this.startAutoUpdate();
        this.updateStatus('connected', '✅ Conectado ao servidor');
    }
    
    setupEventListeners() {
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        // Prevenir scroll da página com setas
        document.addEventListener('keydown', (e) => {
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        // Focus no documento para capturar teclas
        document.addEventListener('DOMContentLoaded', () => {
            document.body.focus();
        });
        
        // Detectar se a janela perdeu o foco e reconectar
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.loadPollData();
            }
        });
    }
    
    handleKeyPress(e) {
        if (this.isVoting) return; // Previne múltiplos votos simultâneos
        
        switch(e.code) {
            case 'ArrowUp':
                this.navigateUp();
                break;
            case 'ArrowDown':
                this.navigateDown();
                break;
            case 'Enter':
            case 'Space':
                this.vote();
                break;
            case 'Escape':
                this.closeModal();
                break;
            default:
                // Navegação por números (1-5)
                const num = parseInt(e.key);
                if (num >= 1 && num <= this.options.length) {
                    this.currentOptionIndex = num - 1;
                    this.updateActiveOption();
                }
        }
    }
    
    navigateUp() {
        this.currentOptionIndex = this.currentOptionIndex > 0 
            ? this.currentOptionIndex - 1 
            : this.options.length - 1;
        this.updateActiveOption();
        this.playNavigationSound();
    }
    
    navigateDown() {
        this.currentOptionIndex = this.currentOptionIndex < this.options.length - 1 
            ? this.currentOptionIndex + 1 
            : 0;
        this.updateActiveOption();
        this.playNavigationSound();
    }
    
    updateActiveOption() {
        // Remove active class de todas as opções
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('active');
        });
        
        // Adiciona active class na opção atual
        const currentOption = document.querySelector(`[data-option-id="${this.options[this.currentOptionIndex].id}"]`);
        if (currentOption) {
            currentOption.classList.add('active');
            // Scroll suave para a opção ativa se necessário
            currentOption.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    async vote() {
        if (this.isVoting || !this.options[this.currentOptionIndex]) return;
        
        this.isVoting = true;
        const selectedOption = this.options[this.currentOptionIndex];
        
        try {
            this.updateStatus('voting', '🗳️ Enviando voto...');
            
            const response = await fetch('/votar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    opcaoId: selectedOption.id
                })
            });
            
            const result = await response.json();
            
            if (result.sucesso) {
                this.showVoteConfirmation(selectedOption.texto);
                this.pollData = result.resultados;
                this.updateResults();
                this.updateStatus('connected', '✅ Voto registrado com sucesso!');
                this.playVoteSound();
            } else {
                throw new Error(result.erro || 'Erro ao votar');
            }
            
        } catch (error) {
            console.error('Erro ao votar:', error);
            this.updateStatus('error', '❌ Erro ao enviar voto');
            alert('Erro ao enviar voto. Tente novamente.');
        } finally {
            this.isVoting = false;
        }
    }
    
    async loadPollData() {
        try {
            this.updateStatus('loading', '🔄 Carregando dados...');
            
            const response = await fetch('/resultados');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            this.pollData = await response.json();
            this.options = this.pollData.opcoes;
            
            this.renderPoll();
            this.updateResults();
            this.updateStatus('connected', '✅ Conectado');
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.updateStatus('error', '❌ Erro de conexão');
            
            // Retry após 5 segundos em caso de erro
            setTimeout(() => {
                this.loadPollData();
            }, 5000);
        }
    }
    
    renderPoll() {
        const questionElement = document.getElementById('question');
        const optionsContainer = document.getElementById('options-container');
        
        if (questionElement && this.pollData) {
            questionElement.textContent = this.pollData.pergunta;
        }
        
        if (optionsContainer && this.options.length > 0) {
            optionsContainer.innerHTML = '';
            
            this.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option';
                optionElement.setAttribute('data-option-id', option.id);
                optionElement.textContent = option.texto;
                
                // Adiciona event listener para clique (suporte a mouse/touch)
                optionElement.addEventListener('click', () => {
                    this.currentOptionIndex = index;
                    this.updateActiveOption();
                    this.vote();
                });
                
                optionsContainer.appendChild(optionElement);
            });
            
            // Define a primeira opção como ativa por padrão
            if (this.currentOptionIndex >= this.options.length) {
                this.currentOptionIndex = 0;
            }
            this.updateActiveOption();
        }
    }
    
    updateResults() {
        const resultsContainer = document.getElementById('results-container');
        const totalVotesElement = document.getElementById('total-votes');
        
        if (!this.pollData || !resultsContainer) return;
        
        resultsContainer.innerHTML = '';
        
        this.pollData.opcoes.forEach(option => {
            const percentage = this.pollData.totalVotos > 0 
                ? ((option.votos / this.pollData.totalVotos) * 100).toFixed(1)
                : 0;
            
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <div class="result-header">
                    <span class="result-text">${option.texto}</span>
                    <span class="result-votes">${option.votos} voto${option.votos !== 1 ? 's' : ''}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="result-percentage">${percentage}%</div>
            `;
            
            resultsContainer.appendChild(resultItem);
        });
        
        if (totalVotesElement) {
            totalVotesElement.textContent = `Total de votos: ${this.pollData.totalVotos}`;
        }
    }
    
    startAutoUpdate() {
        // Atualiza resultados a cada 5 segundos
        this.updateInterval = setInterval(() => {
            if (!this.isVoting) {
                this.loadPollData();
            }
        }, 5000);
    }
    
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    updateStatus(type, message) {
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = statusIndicator.querySelector('.status-text');
        
        if (statusIndicator && statusText) {
            statusIndicator.className = `status-indicator ${type}`;
            statusText.textContent = message;
            
            // Remove a classe após 3 segundos para o status normal
            if (type !== 'connected') {
                setTimeout(() => {
                    if (statusIndicator.classList.contains(type)) {
                        statusIndicator.className = 'status-indicator connected';
                        statusText.textContent = '✅ Conectado';
                    }
                }, 3000);
            }
        }
    }
    
    showVoteConfirmation(optionText) {
        const modal = document.getElementById('vote-modal');
        const message = document.getElementById('vote-message');
        
        if (modal && message) {
            message.textContent = `Seu voto foi registrado para: "${optionText}"`;
            modal.style.display = 'block';
            
            // Fecha automaticamente após 3 segundos
            setTimeout(() => {
                this.closeModal();
            }, 3000);
        }
    }
    
    closeModal() {
        const modal = document.getElementById('vote-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    playNavigationSound() {
        // Simula som de navegação (pode ser substituído por áudio real)
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const audioContext = new AudioContext();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            } catch (e) {
                // Ignora erros de áudio
            }
        }
    }
    
    playVoteSound() {
        // Simula som de confirmação de voto
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const audioContext = new AudioContext();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (e) {
                // Ignora erros de áudio
            }
        }
    }
    
    // Método para cleanup quando a aplicação for fechada
    destroy() {
        this.stopAutoUpdate();
        document.removeEventListener('keydown', this.handleKeyPress);
    }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.tvPollApp = new TVPollApp();
});

// Cleanup quando a página for descarregada
window.addEventListener('beforeunload', () => {
    if (window.tvPollApp) {
        window.tvPollApp.destroy();
    }
});

// Global functions para modal
function closeModal() {
    if (window.tvPollApp) {
        window.tvPollApp.closeModal();
    }
}