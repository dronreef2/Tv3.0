const express = require('express');
const cors = require('cors');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const votosPath = path.join(__dirname, 'votos.json');

// Opções padrão (devem bater com as do frontend para melhor UX)
const DEFAULT_OPTIONS = ['Time A', 'Time B', 'Empate'];

// Garante arquivo de votos inicial
async function ensureVotosFile() {
  try {
    await fsp.access(votosPath, fs.constants.F_OK);
  } catch {
    const initial = {};
    for (const opt of DEFAULT_OPTIONS) initial[opt] = 0;
    await fsp.writeFile(votosPath, JSON.stringify(initial, null, 2), 'utf-8');
  }
}

async function readVotos() {
  await ensureVotosFile();
  const data = await fsp.readFile(votosPath, 'utf-8');
  return JSON.parse(data || '{}');
}

async function writeVotos(votos) {
  // Escrita simples; para alta concorrência, considerar fila ou DB
  await fsp.writeFile(votosPath, JSON.stringify(votos, null, 2), 'utf-8');
}

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'API Enquete TV 3.0',
    endpoints: {
      resultados: 'GET /resultados',
      votar: 'POST /votar { "opcao": "<string>" }'
    }
  });
});

app.get('/resultados', async (_req, res) => {
  try {
    const votos = await readVotos();
    res.json({ resultados: votos });
  } catch (err) {
    console.error('Erro ao ler votos:', err);
    res.status(500).json({ error: 'Falha ao ler resultados' });
  }
});

app.post('/votar', async (req, res) => {
  try {
    const { opcao } = req.body || {};
    if (!opcao || typeof opcao !== 'string') {
      return res.status(400).json({ error: 'Campo "opcao" é obrigatório' });
    }

    const votos = await readVotos();
    if (!Object.prototype.hasOwnProperty.call(votos, opcao)) {
      // Permite criar opção "on the fly", mas pode ser validado se quiser
      votos[opcao] = 0;
    }
    votos[opcao] += 1;
    await writeVotos(votos);

    res.json({ sucesso: true, resultados: votos });
  } catch (err) {
    console.error('Erro ao registrar voto:', err);
    res.status(500).json({ error: 'Falha ao registrar voto' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend ouvindo em http://localhost:${PORT}`);
});