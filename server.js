const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Path to votes JSON file
const votesFilePath = path.join(__dirname, 'votes.json');

// Initialize votes file if it doesn't exist
function initializeVotes() {
  if (!fs.existsSync(votesFilePath)) {
    const initialData = {
      question: "Qual é sua opção favorita para programação de TV interativa?",
      options: [
        { id: 1, text: "Jogos interativos", votes: 0 },
        { id: 2, text: "Enquetes em tempo real", votes: 0 },
        { id: 3, text: "Compras durante o programa", votes: 0 },
        { id: 4, text: "Escolha de ângulos de câmera", votes: 0 }
      ],
      totalVotes: 0
    };
    fs.writeFileSync(votesFilePath, JSON.stringify(initialData, null, 2));
  }
}

// Read votes from JSON file
function readVotes() {
  try {
    const data = fs.readFileSync(votesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading votes:', error);
    initializeVotes();
    return readVotes();
  }
}

// Write votes to JSON file
function writeVotes(data) {
  try {
    fs.writeFileSync(votesFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing votes:', error);
  }
}

// API Routes

// GET /resultados - Return current voting results
app.get('/resultados', (req, res) => {
  const votes = readVotes();
  res.json(votes);
});

// POST /votar - Register a vote
app.post('/votar', (req, res) => {
  const { optionId } = req.body;
  
  if (!optionId || typeof optionId !== 'number') {
    return res.status(400).json({ error: 'Option ID is required and must be a number' });
  }
  
  const votes = readVotes();
  const option = votes.options.find(opt => opt.id === optionId);
  
  if (!option) {
    return res.status(404).json({ error: 'Option not found' });
  }
  
  // Increment vote count
  option.votes += 1;
  votes.totalVotes += 1;
  
  // Save updated votes
  writeVotes(votes);
  
  res.json({ 
    success: true, 
    message: 'Vote registered successfully',
    option: option,
    totalVotes: votes.totalVotes
  });
});

// Initialize votes on startup
initializeVotes();

// Start server
app.listen(PORT, () => {
  console.log(`TV 3.0 Interactive App running on port ${PORT}`);
  console.log(`Access the app at: http://localhost:${PORT}`);
});
