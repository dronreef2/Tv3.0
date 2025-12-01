const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const VOTOS_FILE = path.join(__dirname, 'votos.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize votes file if it doesn't exist
function initializeVotesFile() {
    if (!fs.existsSync(VOTOS_FILE)) {
        const initialData = {
            pergunta: "Qual é o seu gênero de filme favorito para TV?",
            opcoes: {
                "Ação": 0,
                "Comédia": 0,
                "Drama": 0,
                "Ficção Científica": 0,
                "Terror": 0
            },
            totalVotos: 0,
            ultimaAtualizacao: new Date().toISOString()
        };
        fs.writeFileSync(VOTOS_FILE, JSON.stringify(initialData, null, 2));
    }
}

// Read votes from file
function lerVotos() {
    try {
        const data = fs.readFileSync(VOTOS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler votos:', error);
        return null;
    }
}

// Write votes to file
function salvarVotos(votos) {
    try {
        votos.ultimaAtualizacao = new Date().toISOString();
        fs.writeFileSync(VOTOS_FILE, JSON.stringify(votos, null, 2));
        return true;
    } catch (error) {
        console.error('Erro ao salvar votos:', error);
        return false;
    }
}

// API endpoint to vote (POST /votar)
app.post('/votar', (req, res) => {
    const { opcao } = req.body;
    
    if (!opcao) {
        return res.status(400).json({ erro: 'Opção de voto é obrigatória' });
    }
    
    const votos = lerVotos();
    if (!votos) {
        return res.status(500).json({ erro: 'Erro ao ler dados de votação' });
    }
    
    if (!Object.prototype.hasOwnProperty.call(votos.opcoes, opcao)) {
        return res.status(400).json({ erro: 'Opção de voto inválida' });
    }
    
    // Increment vote count
    votos.opcoes[opcao]++;
    votos.totalVotos++;
    
    if (salvarVotos(votos)) {
        res.json({ 
            sucesso: true, 
            mensagem: 'Voto registrado com sucesso!',
            opcaoVotada: opcao,
            novoTotal: votos.opcoes[opcao]
        });
    } else {
        res.status(500).json({ erro: 'Erro ao salvar voto' });
    }
});

// API endpoint to get results (GET /resultados)
app.get('/resultados', (req, res) => {
    const votos = lerVotos();
    if (!votos) {
        return res.status(500).json({ erro: 'Erro ao ler dados de votação' });
    }
    
    // Calculate percentages
    const resultados = {
        pergunta: votos.pergunta,
        opcoes: {},
        totalVotos: votos.totalVotos,
        ultimaAtualizacao: votos.ultimaAtualizacao
    };
    
    Object.keys(votos.opcoes).forEach(opcao => {
        const numeroVotos = votos.opcoes[opcao];
        const porcentagem = votos.totalVotos > 0 ? 
            Math.round((numeroVotos / votos.totalVotos) * 100) : 0;
        
        resultados.opcoes[opcao] = {
            votos: numeroVotos,
            porcentagem: porcentagem
        };
    });
    
    res.json(resultados);
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize and start server
initializeVotesFile();

app.listen(PORT, () => {
    console.log(`🚀 Servidor TV 3.0 rodando em http://localhost:${PORT}`);
    console.log(`📊 API de votação disponível em:`);
    console.log(`   POST /votar - Para enviar votos`);
    console.log(`   GET /resultados - Para obter resultados`);
    console.log(`📱 Interface web disponível em http://localhost:${PORT}`);
});

module.exports = app;
