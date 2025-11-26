# TV 3.0 - Sistema de Enquete Interativa para TV

## 📺 Sobre o Projeto

O TV 3.0 é um sistema completo de enquete interativa desenvolvido especificamente para TVs e dispositivos com controle remoto. O sistema permite que múltiplos usuários votem simultaneamente usando navegação por teclado (simulando controles remotos de TV) e visualizem resultados em tempo real.

## ✨ Funcionalidades

- **Interface TV-optimizada**: Design responsivo com fontes grandes e cores contrastantes
- **Navegação por teclado**: Totalmente navegável usando setas do teclado (⬆️ ⬇️)
- **Votação interativa**: Vote pressionando ENTER ou ESPAÇO
- **Resultados em tempo real**: Atualização automática a cada 5 segundos
- **Suporte multi-usuário**: Vários usuários podem votar simultaneamente
- **Persistência de dados**: Votos são salvos em arquivo JSON
- **Feedback visual**: Animações e efeitos para melhor experiência
- **Som de navegação**: Feedback sonoro para navegação (simulado)

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm

### Instalação e Execução

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/dronreef2/Tv3.0.git
   cd Tv3.0
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor**:
   ```bash
   npm start
   ```

4. **Acesse a aplicação**:
   - Abra seu navegador e vá para: `http://localhost:3000`
   - Use as setas ⬆️ ⬇️ para navegar entre as opções
   - Pressione ENTER ou ESPAÇO para votar

## 🎮 Controles

| Tecla | Ação |
|-------|------|
| ⬆️ ArrowUp | Navegar para opção anterior |
| ⬇️ ArrowDown | Navegar para próxima opção |
| ENTER | Votar na opção selecionada |
| ESPAÇO | Votar na opção selecionada |
| ESC | Fechar modal de confirmação |
| 1-5 | Selecionar opção diretamente por número |

## 🏗️ Estrutura do Projeto

```
Tv3.0/
├── backend/
│   ├── server.js          # Servidor Express com APIs
│   └── votos.json         # Armazenamento dos votos
├── frontend/
│   ├── index.html         # Interface principal
│   ├── style.css          # Estilos TV-optimizados
│   └── app.js            # Lógica de navegação e votação
├── package.json           # Configurações do projeto
└── README.md             # Este arquivo
```

## 🔧 API Endpoints

### GET `/resultados`
Retorna os resultados atuais da enquete
```json
{
  "pergunta": "Qual é o seu programa favorito na TV?",
  "opcoes": [
    {"id": 1, "texto": "Documentários", "votos": 2},
    {"id": 2, "texto": "Filmes de Ação", "votos": 1}
  ],
  "totalVotos": 3
}
```

### POST `/votar`
Registra um novo voto
```json
{
  "opcaoId": 1
}
```

## 🎨 Design TV-Friendly

- **Fontes grandes**: Texto legível à distância
- **Alto contraste**: Cores que funcionam bem em TVs
- **Navegação clara**: Indicador visual da opção ativa
- **Animações suaves**: Transições que funcionam bem em TVs
- **Layout responsivo**: Adapta-se a diferentes resoluções

## 🌐 Exposição Externa

Para permitir acesso externo, você pode usar:

### Cloudflare Tunnel
```bash
cloudflared tunnel --url http://localhost:3000
```

### ngrok
```bash
npx ngrok http 3000
```

## 🧪 Testando o Sistema

1. **Teste de navegação**: Use as setas para navegar entre opções
2. **Teste de votação**: Vote em diferentes opções e veja os resultados
3. **Teste multi-usuário**: Abra em múltiplas abas/dispositivos
4. **Teste de persistência**: Reinicie o servidor e veja se os votos foram salvos

## 📱 Compatibilidade

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ TVs com navegadores web
- ✅ Dispositivos móveis (com toque)
- ✅ Dispositivos com teclado físico

## 🔧 Personalização

### Modificar Pergunta e Opções
Edite o arquivo `backend/votos.json`:
```json
{
  "pergunta": "Sua pergunta aqui",
  "opcoes": [
    {"id": 1, "texto": "Opção 1", "votos": 0},
    {"id": 2, "texto": "Opção 2", "votos": 0}
  ],
  "totalVotos": 0
}
```

### Modificar Cores e Estilo
Edite o arquivo `frontend/style.css` para personalizar:
- Cores de fundo
- Cores de destaque
- Fontes
- Animações

## 🐛 Solução de Problemas

### Servidor não inicia
- Verifique se a porta 3000 está livre
- Execute `npm install` novamente

### Navegação não funciona
- Certifique-se de que a página tem foco
- Clique na área da enquete antes de usar o teclado

### Votos não são salvos
- Verifique as permissões de escrita na pasta `backend/`
- Verifique se o arquivo `votos.json` existe

## 📄 Licença

Este projeto está sob a licença ISC.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Se você encontrar problemas ou tiver sugestões, abra uma issue no GitHub.

---

**TV 3.0** - Desenvolvido para a experiência interativa de TV do futuro! 📺✨