# 🚀 Guia de Desenvolvimento - Zap Theme

## 📋 Pré-requisitos

- Node.js instalado (versão 18 ou superior)
- Visual Studio Code

## 🛠️ Setup do Projeto

### 1. Instalar Dependências

```bash
npm install
```

Isso instalará:
- `@types/vscode` - Tipos TypeScript para API do VS Code
- `@types/node` - Tipos TypeScript para Node.js
- `typescript` - Compilador TypeScript

### 2. Adicionar Arquivo MP3

Coloque qualquer arquivo `.mp3` na pasta `sounds/`:

```
Zap/
├── sounds/
│   └── sua-musica.mp3   <-- Adicione aqui!
```

**Dicas:**
- Qualquer arquivo MP3 funciona
- Arquivos menores carregam mais rápido
- Nome do arquivo não importa (é detectado automaticamente)

### 3. Compilar o TypeScript

```bash
npm run compile
```

Ou compile automaticamente ao salvar:

```bash
npm run watch
```

### 4. Testar a Extensão

1. Pressione **F5** no VS Code
2. Uma nova janela do VS Code abrirá com a extensão carregada
3. Na nova janela:
   - Vá em **File > Preferences > Color Theme** e selecione **"Zap"**
   - Clique no botão **"🎵 Zap Music"** na barra de status
   - O player abrirá em um painel

### 5. Ver Logs de Debug

Abra o **Debug Console** (Ctrl+Shift+Y) para ver logs detalhados:

```
🎵 Extensão Zap ativada!
✅ Status bar item criado
📁 Caminho da pasta sounds: ...
🎵 Arquivo MP3 encontrado: sua-musica.mp3
✅ Player de música iniciado com sucesso!
```

## 🎯 Estrutura do Projeto

```
Zap/
├── src/
│   └── extension.ts           # Código principal da extensão
├── themes/
│   └── zap-color-theme.json   # Definição de cores do tema
├── sounds/
│   └── *.mp3                  # Arquivos de música
├── out/
│   └── extension.js           # TypeScript compilado
├── package.json               # Configuração da extensão
├── tsconfig.json              # Configuração do TypeScript
└── README.md                  # Documentação
```

## 🧪 Como Testar

### Teste Básico
1. F5 para abrir janela de teste
2. Ativar tema Zap
3. Clicar no botão de música
4. Verificar se o painel abre

### Teste com Logs
1. Abrir Debug Console
2. Verificar logs de ativação
3. Testar toggle de música
4. Verificar logs de play/pause

### Teste de Configurações
1. Ir em Settings (Ctrl+,)
2. Procurar "zap"
3. Ajustar volume (0.0 a 1.0)
4. Testar autostart

## 📦 Publicar no Marketplace

### 1. Instalar VSCE

```bash
npm install -g @vscode/vsce
```

### 2. Criar Conta

- Acesse [Visual Studio Marketplace](https://marketplace.visualstudio.com/manage)
- Crie uma conta de publisher
- Gere um Personal Access Token no Azure DevOps

### 3. Atualizar Publisher

Edite o `package.json`:

```json
"publisher": "seu-username"
```

### 4. Publicar

```bash
vsce publish
```

## 🔧 Comandos Úteis

```bash
# Compilar
npm run compile

# Compilar em modo watch
npm run watch

# Empacotar como VSIX
vsce package

# Instalar localmente o VSIX
code --install-extension zap-theme-0.0.1.vsix
```

## 🐛 Troubleshooting

### Música não toca?
- ✅ Verifique se há arquivo MP3 na pasta `sounds/`
- ✅ Veja os logs no Debug Console
- ✅ Clique no botão manual se autoplay falhar
- ✅ Teste com outro arquivo MP3

### Erro de compilação?
```bash
# Limpar e recompilar
rm -rf out/
npm run compile
```

### Tema não aparece?
- ✅ Verifique se compilou (`npm run compile`)
- ✅ Reinicie a janela de teste (Ctrl+R)
- ✅ Veja se há erros no console

### Botão não aparece na barra de status?
- ✅ Verifique logs de ativação
- ✅ Confirme que a extensão foi ativada
- ✅ Recarregue a janela

## 📝 Notas de Desenvolvimento

### Content Security Policy
O webview usa CSP restritiva para segurança:
- `media-src`: Permite carregar arquivos de áudio
- `script-src 'unsafe-inline'`: Necessário para scripts inline
- `style-src 'unsafe-inline'`: Necessário para estilos inline

### Webview Persistence
- `retainContextWhenHidden: true` - Mantém música tocando em background
- O painel continua ativo mesmo quando minimizado

### Status Bar Item
- Posição: Right alignment
- Prioridade: 100
- Ícones: `$(mute)` e `$(unmute)` (Codicons do VS Code)

## 🎨 Customização

### Mudar Cores do Tema
Edite `themes/zap-color-theme.json`

### Mudar Volume Padrão
Edite `package.json`:
```json
"zap-theme.musicVolume": {
  "default": 0.5  // Mude aqui (0.0 a 1.0)
}
```

### Habilitar Autostart
```json
"zap-theme.autoStartMusic": {
  "default": true  // Mude para true
}
```

## 📚 Recursos

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Webview API](https://code.visualstudio.com/api/extension-guides/webview)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
