# TV 3.0 - Enquete Interativa

Protótipo funcional de aplicação interativa para TV 3.0 com enquetes em tempo real. Esta aplicação simula a navegação típica de Smart TVs, utilizando setas do teclado para navegação e Enter para confirmação.

## 🎯 Características

- **Navegação estilo TV**: Use setas (↑↓←→) e Enter para interagir
- **Tempo real**: Resultados atualizados automaticamente a cada 5 segundos
- **Backend REST**: API Node.js + Express com CORS habilitado
- **Armazenamento simples**: Dados persistidos em arquivo JSON
- **Design moderno**: Interface TV 3.0 com gradientes e animações
- **Flexível**: Suporte a diferentes backends via parâmetro `?api=`

## 📁 Estrutura do Projeto

```
tv-enquete/
├── package.json              # Dependências e scripts
├── backend/
│   ├── server.js             # Servidor Express
│   └── votos.json           # Armazenamento de votos
├── frontend/
│   ├── index.html           # Interface principal
│   ├── style.css            # Estilos TV 3.0
│   └── app.js               # Lógica de navegação e polling
└── README.md                # Este arquivo
```

## 🚀 Instalação e Execução

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar o servidor
```bash
npm start
```

O backend estará disponível em `http://localhost:3000`

### 3. Acessar o frontend
Abra `frontend/index.html` diretamente no navegador ou sirva via servidor web:

```bash
# Opção 1: Abrir diretamente
open frontend/index.html

# Opção 2: Usando Python (recomendado)
cd frontend
python3 -m http.server 8080
# Acesse: http://localhost:8080

# Opção 3: Usando Node.js (npx)
cd frontend
npx serve .
```

## 🎮 Como Usar

### Navegação no Frontend
- **Setas ↑↓**: Navegar entre opções
- **Setas ←→**: Navegar entre opções (alternativo)
- **Enter**: Confirmar voto na opção selecionada
- **Automático**: Resultados atualizam a cada 5 segundos

### Conectar a Backend Remoto
Para usar um backend hospedado (ngrok, Cloudflare Tunnel, etc.):

```
http://localhost:8080?api=https://sua-url.ngrok.app
```

Exemplo com ngrok:
```bash
# Terminal 1: Executar backend
npm start

# Terminal 2: Expor backend via ngrok
ngrok http 3000

# Usar a URL do ngrok no frontend:
# http://localhost:8080?api=https://abc123.ngrok.app
```

## 🛠 API Endpoints

### GET /
Informações básicas da API
```json
{
  "status": "ok",
  "message": "API Enquete TV 3.0",
  "endpoints": {
    "resultados": "GET /resultados",
    "votar": "POST /votar { \"opcao\": \"<string>\" }"
  }
}
```

### GET /resultados
Obter resultados atuais
```json
{
  "resultados": {
    "Time A": 5,
    "Time B": 3,
    "Empate": 1
  }
}
```

### POST /votar
Registrar um voto
```bash
curl -X POST http://localhost:3000/votar \
  -H "Content-Type: application/json" \
  -d '{"opcao": "Time A"}'
```

Resposta:
```json
{
  "sucesso": true,
  "resultados": {
    "Time A": 6,
    "Time B": 3,
    "Empate": 1
  }
}
```

## 🌐 Exposição Externa

### Com ngrok
```bash
# Instalar ngrok (https://ngrok.com/)
npm install -g ngrok

# Executar backend
npm start

# Em outro terminal, expor porta 3000
ngrok http 3000

# Usar a URL gerada no frontend:
# ?api=https://abc123.ngrok.app
```

### Com Cloudflare Tunnel
```bash
# Instalar cloudflared
# Documentação: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/

# Executar backend
npm start

# Criar tunnel
cloudflared tunnel --url http://localhost:3000

# Usar a URL gerada no frontend
```

## 🎨 Personalização

### Alterar Opções de Voto
Edite ambos os arquivos para manter sincronismo:

**backend/server.js**:
```javascript
const DEFAULT_OPTIONS = ['Opção 1', 'Opção 2', 'Opção 3'];
```

**frontend/app.js**:
```javascript
const opcoes = ['Opção 1', 'Opção 2', 'Opção 3'];
```

### Alterar Pergunta
**frontend/app.js**:
```javascript
const pergunta = 'Sua pergunta aqui?';
```

### Alterar Intervalo de Polling
**frontend/app.js**:
```javascript
// Polling a cada 3 segundos (em vez de 5)
setInterval(buscarResultados, 3000);
```

## 🔧 Desenvolvimento

### Estrutura de Dados
Os votos são armazenados em `backend/votos.json`:
```json
{
  "Time A": 10,
  "Time B": 7,
  "Empate": 2
}
```

### CORS
O backend possui CORS habilitado para permitir requisições de qualquer origem. Para produção, configure domínios específicos.

### Tratamento de Erros
- Conexão falha: Frontend continua funcionando, mostra erro temporário
- Arquivo corrompido: Backend recria `votos.json` automaticamente
- Opção inexistente: Backend cria nova opção automaticamente

## 📱 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões modernas)
- **Devices**: Desktop, Smart TVs, tablets
- **Teclados**: Físicos e virtuais com suporte a setas
- **Node.js**: v14+ recomendado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja arquivo LICENSE para detalhes.

---

**Desenvolvido para TV 3.0** 📺✨