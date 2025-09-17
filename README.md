# TV 3.0 - Aplicativo Interativo

Um protótipo de aplicativo interativo para TV 3.0 usando HTML5, CSS e JavaScript, simulando controle remoto com navegação por setas e confirmação com Enter.

![TV 3.0 App Screenshot](https://github.com/user-attachments/assets/758149c0-3125-466f-a263-60f068489096)

## Características

- **Frontend HTML5/CSS/JavaScript**: Interface adaptada para TV com design responsivo
- **Controle Remoto Simulado**: Navegação com setas do teclado e Enter para votar
- **Backend Node.js + Express**: API REST para votação e resultados
- **Armazenamento JSON**: Registro de votos em arquivo JSON local
- **Tempo Real**: Atualização automática dos resultados a cada 5 segundos
- **API REST**: Endpoints `/votar` e `/resultados`

## Requisitos

- Node.js 14+
- NPM

## Instalação e Execução

1. Clone o repositório:
```bash
git clone https://github.com/dronreef2/Tv3.0.git
cd Tv3.0
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor:
```bash
npm start
```

4. Acesse o aplicativo em: http://localhost:3000

## Uso

### Controle Remoto
- **Setas ↑↓**: Navegar entre as opções
- **Enter**: Confirmar voto na opção selecionada
- **Mouse/Touch**: Clique direto nas opções (alternativo)

### Funcionalidades
- **Votação**: Selecione uma opção e pressione Enter
- **Resultados em Tempo Real**: Atualizados automaticamente a cada 5s
- **Feedback Visual**: Confirmação de voto e animações
- **Interface TV**: Layout otimizado para exibição em televisores

## API Endpoints

### GET /resultados
Retorna os resultados atuais da votação:
```json
{
  "question": "Qual é sua opção favorita para programação de TV interativa?",
  "options": [
    {"id": 1, "text": "Jogos interativos", "votes": 5},
    {"id": 2, "text": "Enquetes em tempo real", "votes": 3}
  ],
  "totalVotes": 8
}
```

### POST /votar
Registra um voto para uma opção:
```json
{
  "optionId": 1
}
```

Resposta:
```json
{
  "success": true,
  "message": "Vote registered successfully",
  "option": {"id": 1, "text": "Jogos interativos", "votes": 6},
  "totalVotes": 9
}
```

## Estrutura do Projeto

```
Tv3.0/
├── server.js          # Servidor Express
├── package.json       # Dependências do projeto
├── votes.json         # Armazenamento de votos (gerado automaticamente)
└── public/
    ├── index.html     # Interface principal
    ├── styles.css     # Estilos para TV
    └── script.js      # Lógica do controle remoto e votação
```

## Exposição na Internet

Para permitir acesso remoto e testes com múltiplos usuários, use:

### Cloudflare Tunnel
```bash
# Instale o cloudflared
# https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/

cloudflared tunnel --url http://localhost:3000
```

### ngrok
```bash
# Instale o ngrok
# https://ngrok.com/download

ngrok http 3000
```

Ambas as ferramentas fornecerão uma URL pública que pode ser compartilhada para testes remotos seguros.

## Desenvolvimento

Para desenvolvimento com reload automático:
```bash
npm run dev
```

## Tecnologias Utilizadas

- **Backend**: Node.js, Express, CORS
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Armazenamento**: JSON file system
- **Design**: CSS Grid, Flexbox, Animações CSS

## Funcionalidades Implementadas

- ✅ Controle remoto simulado (setas + Enter)
- ✅ Interface adaptada para TV
- ✅ Sistema de votação em tempo real
- ✅ API REST para votação e resultados
- ✅ Armazenamento persistente em JSON
- ✅ Atualização automática dos resultados (5s)
- ✅ Feedback visual e confirmações
- ✅ Design responsivo
- ✅ Suporte para múltiplos usuários simultâneos

## Próximos Passos

- [ ] Implementar autenticação de usuários
- [ ] Adicionar diferentes tipos de perguntas
- [ ] Sistema de administração
- [ ] Histórico de votações
- [ ] WebSocket para atualizações em tempo real
- [ ] Temas personalizáveis