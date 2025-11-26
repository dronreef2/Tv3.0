const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Path to votes file
const votosPath = path.join(__dirname, 'votos.json');

// Initialize votes file if it doesn't exist
function initializeVotes() {
    if (!fs.existsSync(votosPath)) {
        const initialVotes = {
            pergunta: "Qual é o seu programa favorito na TV?",
            opcoes: [
                { id: 1, texto: "Documentários", votos: 0 },
                { id: 2, texto: "Filmes de Ação", votos: 0 },
                { id: 3, texto: "Séries de Drama", votos: 0 },
                { id: 4, texto: "Programas de Culinária", votos: 0 },
                { id: 5, texto: "Esportes", votos: 0 }
            ],
            totalVotos: 0
        };
        fs.writeFileSync(votosPath, JSON.stringify(initialVotes, null, 2));
    }
}

// Read votes from file
function readVotes() {
    try {
        const data = fs.readFileSync(votosPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler votos:', error);
        initializeVotes();
        return readVotes();
    }
}

// Write votes to file
function writeVotes(votes) {
    try {
        fs.writeFileSync(votosPath, JSON.stringify(votes, null, 2));
        return true;
    } catch (error) {
        console.error('Erro ao salvar votos:', error);
        return false;
    }
}

// API Routes

// GET /resultados - Retorna os resultados atuais da enquete
app.get('/resultados', (req, res) => {
    try {
        const votes = readVotes();
        res.json(votes);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar resultados' });
    }
});

// POST /votar - Registra um novo voto
app.post('/votar', (req, res) => {
    try {
        const { opcaoId } = req.body;
        
        if (!opcaoId || typeof opcaoId !== 'number') {
            return res.status(400).json({ erro: 'ID da opção é obrigatório e deve ser um número' });
        }

        const votes = readVotes();
        const opcao = votes.opcoes.find(op => op.id === opcaoId);
        
        if (!opcao) {
            return res.status(404).json({ erro: 'Opção não encontrada' });
        }

        // Incrementa o voto
        opcao.votos++;
        votes.totalVotos++;

        // Salva os votos atualizados
        if (writeVotes(votes)) {
            res.json({ 
                sucesso: true, 
                mensagem: `Voto registrado para: ${opcao.texto}`,
                resultados: votes
            });
        } else {
            res.status(500).json({ erro: 'Erro ao salvar voto' });
        }
    } catch (error) {
        console.error('Erro ao votar:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Initialize votes and start server
initializeVotes();

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Enquete interativa TV 3.0 iniciada!');
});