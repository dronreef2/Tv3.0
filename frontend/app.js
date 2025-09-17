(function () {
  // Detecta API backend a partir do query param ?api=..., senão usa localhost:3000
  const apiFromQuery = new URLSearchParams(location.search).get('api');
  const API_BASE = (apiFromQuery && apiFromQuery.replace(/\/+$/, '')) || 'http://localhost:3000';

  const pergunta = 'Quem vai ganhar o jogo?';
  const opcoes = ['Time A', 'Time B', 'Empate']; // Ajuste aqui se quiser outras opções

  const perguntaEl = document.getElementById('pergunta');
  const opcoesEl = document.getElementById('opcoes');
  const statusEl = document.getElementById('status');
  const graficoEl = document.getElementById('grafico');
  const totaisEl = document.getElementById('totais');

  let selectedIndex = 0;
  let ultimoResultados = {};

  function renderOpcoes() {
    perguntaEl.textContent = pergunta;
    opcoesEl.innerHTML = '';
    opcoes.forEach((nome, idx) => {
      const li = document.createElement('li');
      li.className = 'opcao' + (idx === selectedIndex ? ' selected' : '');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', idx === selectedIndex ? 'true' : 'false');
      li.tabIndex = -1;

      const left = document.createElement('span');
      left.className = 'nome';
      left.textContent = nome;

      const hint = document.createElement('span');
      hint.className = 'hint';
      hint.textContent = idx === selectedIndex ? 'Pressione Enter para votar' : '';

      li.appendChild(left);
      li.appendChild(hint);
      opcoesEl.appendChild(li);
    });
  }

  function updateSelection(newIndex) {
    const items = [...document.querySelectorAll('.opcao')];
    if (!items.length) return;
    selectedIndex = (newIndex + items.length) % items.length;
    items.forEach((el, idx) => {
      const sel = idx === selectedIndex;
      el.classList.toggle('selected', sel);
      el.setAttribute('aria-selected', sel ? 'true' : 'false');
      const hint = el.querySelector('.hint');
      if (hint) hint.textContent = sel ? 'Pressione Enter para votar' : '';
    });
  }

  function showStatus(msg, isError = false) {
    statusEl.textContent = msg;
    statusEl.style.color = isError ? 'var(--danger)' : 'var(--muted)';
  }

  async function votar() {
    const opcaoEscolhida = opcoes[selectedIndex];
    if (!opcaoEscolhida) return;

    showStatus('Registrando voto...');
    try {
      const res = await fetch(`${API_BASE}/votar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opcao: opcaoEscolhida })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Falha na requisição');
      }

      const data = await res.json();
      showStatus(`Voto registrado para "${opcaoEscolhida}"!`);
      setTimeout(() => showStatus(''), 3000);
      
      // Atualiza resultados imediatamente
      if (data.resultados) {
        ultimoResultados = data.resultados;
        renderResultados();
      }
    } catch (err) {
      console.error('Erro ao votar:', err);
      showStatus(`Erro: ${err.message}`, true);
      setTimeout(() => showStatus(''), 5000);
    }
  }

  async function buscarResultados() {
    try {
      const res = await fetch(`${API_BASE}/resultados`);
      if (!res.ok) throw new Error('Falha ao buscar resultados');
      
      const data = await res.json();
      ultimoResultados = data.resultados || {};
      renderResultados();
    } catch (err) {
      console.error('Erro ao buscar resultados:', err);
      // Silencioso para polling - não mostra erro na UI constantemente
    }
  }

  function renderResultados() {
    const entries = Object.entries(ultimoResultados);
    if (!entries.length) {
      graficoEl.innerHTML = '<p style="color: var(--muted);">Nenhum voto ainda</p>';
      totaisEl.textContent = '';
      return;
    }

    const total = entries.reduce((sum, [, count]) => sum + count, 0);
    const maxVotos = Math.max(...entries.map(([, count]) => count));

    graficoEl.innerHTML = '';
    entries.forEach(([nome, count]) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      
      const fill = document.createElement('div');
      fill.className = 'fill';
      const porcentagem = maxVotos > 0 ? (count / maxVotos) * 100 : 0;
      const porcentagemTotal = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
      
      fill.style.width = `${porcentagem}%`;
      fill.textContent = `${nome}: ${count} (${porcentagemTotal}%)`;
      
      bar.appendChild(fill);
      graficoEl.appendChild(bar);
    });

    totaisEl.textContent = `Total de votos: ${total}`;
  }

  // Event listeners para navegação estilo TV
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        updateSelection(selectedIndex - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        updateSelection(selectedIndex + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        updateSelection(selectedIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        updateSelection(selectedIndex + 1);
        break;
      case 'Enter':
        e.preventDefault();
        votar();
        break;
    }
  });

  // Inicialização
  function init() {
    renderOpcoes();
    buscarResultados();
    
    // Polling de resultados a cada 5 segundos
    setInterval(buscarResultados, 5000);
    
    showStatus(`Conectado ao backend: ${API_BASE}`);
    setTimeout(() => showStatus(''), 3000);
  }

  // Inicia quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();