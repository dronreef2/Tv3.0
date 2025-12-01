# TV 3.0 - Enquete Interativa

🚀 **Protótipo de enquete interativa para TV 3.0** - Sistema de votação em tempo real otimizado para telas grandes de TV com navegação por teclado simulando controle remoto.

## 📋 Características

### ✨ Frontend
- **HTML5 + CSS + JavaScript** puro (sem frameworks)
- **Navegação por teclado/setas** (simula controle remoto)
- **Layout otimizado para TV** (fontes grandes, alto contraste)
- **Atualização automática** dos resultados a cada 5 segundos
- **Feedback visual** com animações e indicadores de status

### 🛠️ Backend
- **Node.js + Express** para APIs REST
- **Armazenamento em JSON** (votos.json)
- **API /votar** para enviar votos (POST)
- **API /resultados** para obter contagem (GET)
- **Suporte a múltiplos usuários** simultâneos

### 🎯 Funcionalidades
- ✅ Votação em tempo real com feedback instantâneo
- ✅ Visualização de resultados com barras de progresso animadas
- ✅ Navegação completa por teclado (↑↓ ENTER R)
- ✅ Interface responsiva para diferentes tamanhos de tela
- ✅ Indicadores de conexão e status em tempo real
- ✅ Persistência de dados em arquivo JSON

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- NPM (incluído com Node.js)

### Instalação e Execução

1. **Clone e instale dependências:**
```bash
git clone <repository-url>
cd Tv3.0
npm install
```

2. **Inicie o servidor:**
```bash
npm start
```

3. **Acesse a aplicação:**
- Interface Web: http://localhost:3000
- API de resultados: http://localhost:3000/resultados
- API de votação: http://localhost:3000/votar

## 🎮 Como Usar

### Navegação por Teclado (Controle Remoto TV)
- **↑ ↓** - Navegar pelas opções de voto
- **ENTER** - Confirmar voto na opção selecionada
- **R** - Atualizar resultados manualmente

### APIs Disponíveis

#### GET /resultados
Retorna os resultados atuais da enquete:
```json
{
  "pergunta": "Qual é o seu gênero de filme favorito para TV?",
  "opcoes": {
    "Ação": {"votos": 5, "porcentagem": 25},
    "Comédia": {"votos": 10, "porcentagem": 50}
  },
  "totalVotos": 20,
  "ultimaAtualizacao": "2025-09-17T04:55:01.790Z"
}
```

#### POST /votar
Registra um novo voto:
```bash
curl -X POST -H "Content-Type: application/json" \
     -d '{"opcao":"Ação"}' \
     http://localhost:3000/votar
```

## 🌐 Acesso Remoto via Túnel

Para permitir acesso externo ao app:

### ngrok
```bash
npm install -g ngrok
npm start
# Em outro terminal:
ngrok http 3000
```

### Cloudflare Tunnel
```bash
cloudflared tunnel --url http://localhost:3000
```

## 📁 Estrutura do Projeto

```
Tv3.0/
├── server.js           # Servidor Express com APIs
├── package.json        # Configuração do projeto Node.js
├── votos.json         # Armazenamento de dados (criado automaticamente)
├── public/            # Arquivos do frontend
│   ├── index.html     # Interface principal
│   ├── style.css      # Estilos otimizados para TV
│   └── app.js         # Lógica do cliente JavaScript
├── test/              # Testes automatizados
│   └── api.test.js    # Testes da API
├── .github/
│   └── workflows/
│       └── ci.yml     # GitHub Actions CI/CD
└── README.md          # Este arquivo
```

## 🧪 Testes

Execute os testes com:
```bash
# Inicie o servidor primeiro
npm start &

# Execute os testes
npm test
```

## 🔧 GitHub Actions

O projeto inclui CI/CD com GitHub Actions que:
- Executa em Node.js 18.x e 20.x
- Instala dependências
- Executa testes
- Testa as APIs
- Verifica vulnerabilidades de segurança

## 📝 Licença

Este projeto está sob a licença ISC.