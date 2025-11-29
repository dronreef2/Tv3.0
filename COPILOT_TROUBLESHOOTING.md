# Guia de Troubleshooting do GitHub Copilot

## Erro: "Copilot has encountered an error. See logs for additional details"

Este documento lista as 5 causas mais comuns para este erro específico e como diagnosticar cada uma.

---

## 📍 Onde Encontrar os Logs do VS Code

Para acessar os logs do GitHub Copilot no VS Code:

### Método 1: Painel de Output
1. Abra o VS Code
2. Pressione `Ctrl+Shift+U` (Windows/Linux) ou `Cmd+Shift+U` (macOS) para abrir o painel de **Output**
3. No dropdown no canto superior direito do painel, selecione **"GitHub Copilot"** ou **"GitHub Copilot Chat"**

### Método 2: Logs do Developer Tools
1. Pressione `Ctrl+Shift+I` (Windows/Linux) ou `Cmd+Option+I` (macOS) para abrir **Developer Tools**
2. Vá para a aba **Console** para ver erros JavaScript
3. Vá para a aba **Network** para ver falhas de rede

### Método 3: Arquivo de Log
Os arquivos de log do VS Code estão localizados em:
- **Windows**: `%APPDATA%\Code\logs\`
- **macOS**: `~/Library/Application Support/Code/logs/`
- **Linux**: `~/.config/Code/logs/`

Para o Copilot especificamente, procure por logs na pasta da extensão:
- **Windows**: `%USERPROFILE%\.vscode\extensions\github.copilot-*\`
- **macOS/Linux**: `~/.vscode/extensions/github.copilot-*/`

### Método 4: Comando do VS Code
1. Pressione `Ctrl+Shift+P` (Windows/Linux) ou `Cmd+Shift+P` (macOS)
2. Digite: `Developer: Open Logs Folder`
3. Procure por arquivos relacionados ao Copilot

---

## 🔍 5 Causas Mais Comuns e Como Diagnosticar

### 1. 🌐 Problemas de DNS ou VPN/Firewall

**Sintomas:**
- Erro ao conectar ao servidor do Copilot
- Timeout nas requisições
- "Network error" nos logs

**Como Diagnosticar:**
```bash
# Teste a conectividade com os servidores do Copilot
ping copilot-proxy.githubusercontent.com
ping api.github.com

# Teste a resolução DNS
nslookup copilot-proxy.githubusercontent.com
nslookup api.github.com
```

**Soluções:**
- Desative temporariamente a VPN e teste novamente
- Verifique se seu firewall corporativo não está bloqueando:
  - `*.github.com`
  - `*.githubcopilot.com`
  - `copilot-proxy.githubusercontent.com`
- Configure exceções no firewall para portas 443 (HTTPS)
- Teste com um DNS público (8.8.8.8 ou 1.1.1.1)

**Verificação nos Logs:**
Procure por mensagens como:
- `ENOTFOUND`
- `ETIMEDOUT`
- `ECONNREFUSED`
- `network error`

---

### 2. 🔑 Token de Autenticação Expirado ou Inválido

**Sintomas:**
- Erro de autenticação nos logs
- Mensagem "401 Unauthorized"
- Copilot parou de funcionar após um período

**Como Diagnosticar:**
1. Abra o painel de Output e selecione "GitHub Copilot"
2. Procure por mensagens de autenticação/autorização
3. Verifique se sua conta GitHub está conectada corretamente

**Soluções:**
1. **Reconectar sua conta GitHub:**
   - Pressione `Ctrl+Shift+P` / `Cmd+Shift+P`
   - Digite: `GitHub Copilot: Sign Out`
   - Depois: `GitHub Copilot: Sign In`

2. **Limpar credenciais do VS Code:**
   - Pressione `Ctrl+Shift+P` / `Cmd+Shift+P`
   - Digite: `Settings Sync: Show Synced Data`
   - Remova as credenciais antigas

3. **Verificar assinatura do Copilot:**
   - Acesse https://github.com/settings/copilot
   - Confirme que sua assinatura está ativa

**Verificação nos Logs:**
Procure por:
- `401`
- `403`
- `unauthorized`
- `authentication failed`
- `token expired`

---

### 3. ⚔️ Conflito com Outras Extensões

**Sintomas:**
- Copilot funciona após desativar certas extensões
- Comportamento inconsistente
- Erros relacionados a Language Server Protocol (LSP)

**Como Diagnosticar:**
1. Inicie o VS Code em **Modo Seguro** (sem extensões):
   ```bash
   code --disable-extensions
   ```
2. Ative o Copilot manualmente e teste
3. Se funcionar, uma extensão está causando conflito

**Extensões que Frequentemente Causam Conflitos:**
- Tabnine
- Kite
- IntelliCode
- Outras extensões de autocomplete baseadas em AI
- Extensões de snippets muito agressivas

**Soluções:**
1. Desative extensões de autocomplete concorrentes
2. Verifique a ordem de ativação das extensões
3. Atualize todas as extensões para as versões mais recentes

**Verificação nos Logs:**
Procure por:
- `extension conflict`
- `LSP error`
- `completion provider`
- Erros com nomes de outras extensões

---

### 4. 🔄 Versão Desatualizada da Extensão ou VS Code

**Sintomas:**
- Copilot funcionava antes de uma atualização
- Erros de compatibilidade nos logs
- Recursos novos não funcionam

**Como Diagnosticar:**
1. Verifique a versão do VS Code: `Help > About`
2. Verifique a versão do Copilot: 
   - Vá em Extensions (`Ctrl+Shift+X`)
   - Procure "GitHub Copilot"
   - Verifique se há atualização disponível

**Soluções:**
1. **Atualizar VS Code:**
   - `Help > Check for Updates`
   - Ou baixe a versão mais recente em https://code.visualstudio.com/

2. **Atualizar a Extensão Copilot:**
   - Pressione `Ctrl+Shift+X` / `Cmd+Shift+X`
   - Procure "GitHub Copilot"
   - Clique em "Update" se disponível

3. **Reinstalar a Extensão:**
   - Desinstale o GitHub Copilot
   - Reinicie o VS Code
   - Instale novamente

**Verificação nos Logs:**
Procure por:
- `version mismatch`
- `deprecated API`
- `incompatible`

---

### 5. 🖥️ Problemas de Recursos do Sistema

**Sintomas:**
- VS Code lento ou travando
- Erros de memória nos logs
- Copilot demora muito para responder

**Como Diagnosticar:**
1. Verifique o uso de memória do VS Code:
   - `Help > Process Explorer`
   - Monitore o consumo de RAM e CPU

2. Verifique o espaço em disco disponível

3. Monitore os recursos do sistema enquanto usa o VS Code

**Soluções:**
1. **Liberar recursos:**
   - Feche projetos/pastas grandes não utilizados
   - Feche abas desnecessárias
   - Reinicie o VS Code

2. **Aumentar limites de memória:**
   Adicione ao `settings.json`:
   ```json
   {
     "files.watcherExclude": {
       "**/node_modules/**": true,
       "**/.git/objects/**": true
     }
   }
   ```

3. **Limpar cache:**
   - Feche o VS Code
   - Delete a pasta de cache:
     - Windows: `%APPDATA%\Code\Cache`
     - macOS: `~/Library/Application Support/Code/Cache`
     - Linux: `~/.config/Code/Cache`

**Verificação nos Logs:**
Procure por:
- `out of memory`
- `heap`
- `timeout`
- `process killed`

---

## 🛠️ Diagnóstico Rápido - Checklist

Execute estes passos em ordem para diagnosticar rapidamente:

- [ ] **1. Verifique a conexão de internet**
  ```bash
  ping github.com
  ```

- [ ] **2. Teste sem VPN/Proxy** (temporariamente)

- [ ] **3. Faça logout e login novamente**
  - `Ctrl+Shift+P` > `GitHub Copilot: Sign Out`
  - `Ctrl+Shift+P` > `GitHub Copilot: Sign In`

- [ ] **4. Atualize a extensão**
  - `Ctrl+Shift+X` > Procure "GitHub Copilot" > Update

- [ ] **5. Reinicie o VS Code**

- [ ] **6. Teste em modo seguro**
  ```bash
  code --disable-extensions
  ```

- [ ] **7. Verifique os logs**
  - `Ctrl+Shift+U` > Selecione "GitHub Copilot"

- [ ] **8. Reinstale a extensão** (último recurso)

---

## 📞 Suporte Adicional

Se nenhuma das soluções acima funcionar:

1. **Colete informações:**
   - Versão do VS Code
   - Versão da extensão Copilot
   - Sistema operacional
   - Logs completos do Output

2. **Reporte o problema:**
   - GitHub Issues: https://github.com/github/copilot-docs/issues
   - GitHub Support: https://support.github.com/

3. **Comunidade:**
   - GitHub Community: https://github.com/community
   - Stack Overflow: Tag `github-copilot`


