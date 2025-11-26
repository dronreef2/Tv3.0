// TV 3.0 Interactive App JavaScript
class TV3App {
    constructor() {
        this.selectedOption = 0;
        this.options = [];
        this.hasVoted = false;
        this.refreshInterval = null;
        
        this.init();
    }

    init() {
        this.loadInitialData();
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    async loadInitialData() {
        try {
            const response = await fetch('/resultados');
            const data = await response.json();
            
            this.displayQuestion(data.question);
            this.displayOptions(data.options);
            this.displayResults(data);
            
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showError('Erro ao carregar dados iniciais');
        }
    }

    displayQuestion(question) {
        document.getElementById('question-text').textContent = question;
    }

    displayOptions(options) {
        this.options = options;
        const container = document.getElementById('options-container');
        
        container.innerHTML = '<h3>Escolha sua opção:</h3>';
        
        options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-item';
            optionElement.dataset.optionId = option.id;
            optionElement.dataset.index = index;
            
            optionElement.innerHTML = `
                <span class="option-number">${option.id}</span>
                ${option.text}
            `;
            
            container.appendChild(optionElement);
        });

        this.updateSelection();
    }

    displayResults(data) {
        const container = document.getElementById('results-container');
        const totalVotesElement = document.getElementById('total-votes');
        
        container.innerHTML = '';
        totalVotesElement.textContent = data.totalVotes;

        if (data.totalVotes === 0) {
            container.innerHTML = '<p style="text-align: center; opacity: 0.7;">Nenhum voto ainda. Seja o primeiro!</p>';
            return;
        }

        data.options.forEach(option => {
            const percentage = data.totalVotes > 0 ? (option.votes / data.totalVotes * 100) : 0;
            
            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';
            resultElement.innerHTML = `
                <div class="result-header">
                    <span class="result-text">${option.text}</span>
                    <span class="result-votes">${option.votes}</span>
                </div>
                <div class="result-bar">
                    <div class="result-progress" style="width: ${percentage}%"></div>
                </div>
            `;
            
            container.appendChild(resultElement);
        });
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });

        // Click handlers for mouse/touch interaction
        document.addEventListener('click', (e) => {
            if (e.target.closest('.option-item')) {
                const optionElement = e.target.closest('.option-item');
                const index = parseInt(optionElement.dataset.index);
                this.selectedOption = index;
                this.updateSelection();
                this.vote();
            }
        });
    }

    handleKeyPress(e) {
        if (this.hasVoted) return;

        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                this.moveSelection(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.moveSelection(1);
                break;
            case 'Enter':
                e.preventDefault();
                this.vote();
                break;
        }
    }

    moveSelection(direction) {
        this.selectedOption += direction;
        
        if (this.selectedOption < 0) {
            this.selectedOption = this.options.length - 1;
        } else if (this.selectedOption >= this.options.length) {
            this.selectedOption = 0;
        }
        
        this.updateSelection();
    }

    updateSelection() {
        const optionElements = document.querySelectorAll('.option-item');
        
        optionElements.forEach((element, index) => {
            element.classList.toggle('selected', index === this.selectedOption);
        });
    }

    async vote() {
        if (this.hasVoted) {
            this.showMessage('Você já votou!');
            return;
        }

        const selectedOptionData = this.options[this.selectedOption];
        if (!selectedOptionData) return;

        this.showLoading(true);

        try {
            const response = await fetch('/votar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    optionId: selectedOptionData.id
                })
            });

            const result = await response.json();

            if (response.ok) {
                this.hasVoted = true;
                this.markAsVoted();
                this.showVoteConfirmation();
                
                // Refresh results immediately after voting
                setTimeout(() => {
                    this.refreshResults();
                }, 1000);
                
            } else {
                throw new Error(result.error || 'Erro ao votar');
            }

        } catch (error) {
            console.error('Error voting:', error);
            this.showError('Erro ao registrar voto: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    markAsVoted() {
        const optionElements = document.querySelectorAll('.option-item');
        optionElements[this.selectedOption].classList.add('voted');
        
        // Disable further voting
        optionElements.forEach(element => {
            element.style.pointerEvents = 'none';
            element.style.opacity = '0.7';
        });
        
        optionElements[this.selectedOption].style.opacity = '1';
    }

    async refreshResults() {
        try {
            const response = await fetch('/resultados');
            const data = await response.json();
            
            this.displayResults(data);
            
            // Add animation to updated results
            const resultItems = document.querySelectorAll('.result-item');
            resultItems.forEach(item => {
                item.classList.add('updated');
                setTimeout(() => item.classList.remove('updated'), 500);
            });
            
        } catch (error) {
            console.error('Error refreshing results:', error);
        }
    }

    startAutoRefresh() {
        // Refresh results every 5 seconds
        this.refreshInterval = setInterval(() => {
            this.refreshResults();
        }, 5000);
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.toggle('show', show);
    }

    showVoteConfirmation() {
        const confirmation = document.getElementById('vote-confirmation');
        confirmation.classList.remove('hidden');
        
        setTimeout(() => {
            confirmation.classList.add('hidden');
        }, 3000);
    }

    showError(message) {
        alert('Erro: ' + message);
    }

    showMessage(message) {
        alert(message);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TV3App();
});

// Handle page visibility changes to pause/resume refresh
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, could pause refresh to save resources
        console.log('Page hidden - continuing refresh for real-time updates');
    } else {
        // Page is visible, ensure refresh is running
        console.log('Page visible - refresh active');
    }
});

// Handle connection errors gracefully
window.addEventListener('online', () => {
    console.log('Connection restored');
    // Could show a notification to user
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
    // Could show a notification to user
});
