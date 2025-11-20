import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

let musicPanel: vscode.WebviewPanel | undefined;
let statusBarItem: vscode.StatusBarItem;
let isEnabled = false;

export function activate(context: vscode.ExtensionContext) {
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right, 
        100
    );
    statusBarItem.text = '$(mute) sonzao cabuloso Zap Music';
    statusBarItem.tooltip = 'Clique para ativar/desativar música de fundo';
    statusBarItem.command = 'zap-theme.toggleMusic';
    statusBarItem.show();

    const toggleCommand = vscode.commands.registerCommand(
        'zap-theme.toggleMusic', 
        () => {
            if (isEnabled && musicPanel) {
                stopMusic();
                isEnabled = false;
                statusBarItem.text = '$(mute) Zap Music';
                vscode.window.showInformationMessage('🔇 Música Zap desativada (covarde!!!!)');
            } else {
                isEnabled = true;
                playBackgroundMusic(context);
                statusBarItem.text = '$(unmute) Zap Music';
                vscode.window.showInformationMessage('🎵 Música Zap ativada!');
            }
        }
    );

    const config = vscode.workspace.getConfiguration('zap-theme');
    const autoStart = config.get<boolean>('autoStartMusic', false);
    
    if (autoStart) {
        setTimeout(() => {
            vscode.commands.executeCommand('zap-theme.toggleMusic');
        }, 2000);
    }

    context.subscriptions.push(toggleCommand, statusBarItem);
}

async function playBackgroundMusic(context: vscode.ExtensionContext) {
    try {
        if (musicPanel) {
            musicPanel.reveal();
            return;
        }

        const soundsPath = path.join(context.extensionPath, 'sounds');
        
        if (!fs.existsSync(soundsPath)) {
            vscode.window.showWarningMessage('❌ Pasta "sounds/" não encontrada! Crie a pasta e adicione um arquivo MP3.');
            isEnabled = false;
            statusBarItem.text = '$(mute) Zap Music';
            return;
        }
        
        const files = fs.readdirSync(soundsPath);
        const mp3File = files.find(f => f.toLowerCase().endsWith('.mp3'));
        
        if (!mp3File) {
            vscode.window.showWarningMessage('❌ Nenhum arquivo MP3 encontrado na pasta "sounds/"!');
            isEnabled = false;
            statusBarItem.text = '$(mute) Zap Music';
            return;
        }
        
        const musicPath = path.join(soundsPath, mp3File);
        const musicUri = vscode.Uri.file(musicPath);
        
        const iconPath = path.join(context.extensionPath, 'suco.jpg');
        const iconUri = vscode.Uri.file(iconPath);
        
        const config = vscode.workspace.getConfiguration('zap-theme');
        const volume = config.get<number>('musicVolume', 0.5);
        
        musicPanel = vscode.window.createWebviewPanel(
            'zapMusicPlayer',
            '🎵 Zap Music Player',
            vscode.ViewColumn.Two,
            { 
                enableScripts: true, 
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.file(soundsPath),
                    vscode.Uri.file(context.extensionPath)
                ]
            }
        );

        musicPanel.webview.html = getWebviewContent(
            musicPanel.webview.asWebviewUri(musicUri),
            musicPanel.webview.asWebviewUri(iconUri),
            mp3File,
            musicPanel.webview.cspSource,
            volume
        );

        musicPanel.onDidDispose(() => {
            musicPanel = undefined;
            isEnabled = false;
            statusBarItem.text = '$(mute) Zap Music';
        });

    } catch (error) {
        vscode.window.showErrorMessage(`❌ Erro ao carregar música: ${error}`);
        isEnabled = false;
        statusBarItem.text = '$(mute) Zap Music';
    }
}

function getWebviewContent(
    musicUri: vscode.Uri,
    iconUri: vscode.Uri,
    fileName: string, 
    cspSource: string,
    volume: number
): string {
    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Security-Policy" 
                  content="default-src 'none'; media-src ${cspSource}; img-src ${cspSource}; script-src 'unsafe-inline'; style-src 'unsafe-inline';">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Zap Music Player</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body { 
                    background: linear-gradient(135deg, #0a1e0d 0%, #041506 100%);
                    color: #a6e3a1;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    overflow: hidden;
                }
                
                .container {
                    text-align: center;
                    padding: 40px;
                    background: rgba(10, 40, 15, 0.4);
                    border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(0, 255, 0, 0.2);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(0, 255, 0, 0.2);
                    max-width: 500px;
                    width: 90%;
                }
                
                h1 { 
                    color: #00ff00;
                    font-size: 2.5em;
                    margin-bottom: 20px;
                    text-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
                }
                
                #status {
                    font-size: 1.2em;
                    margin: 20px 0;
                    color: #a6e3a1;
                    font-weight: 500;
                }
                
                #fileName {
                    color: #a6e3a1;
                    margin: 15px 0;
                    font-size: 0.9em;
                    opacity: 0.8;
                }
                
                button {
                    padding: 15px 40px;
                    font-size: 18px;
                    background: linear-gradient(135deg, #00ff00 0%, #00aa00 100%);
                    color: #000000;
                    border: none;
                    border-radius: 50px;
                    cursor: pointer;
                    margin-top: 25px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 255, 0, 0.4);
                }
                
                button:hover { 
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 255, 0, 0.6);
                    background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
                }
                
                button:active {
                    transform: translateY(0);
                }
                
                .music-icon {
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    margin-bottom: 20px;
                    animation: pulse 2s ease-in-out infinite;
                    box-shadow: 0 0 40px rgba(0, 255, 0, 0.6);
                    border: 3px solid #00ff00;
                    object-fit: cover;
                }
                
                @keyframes pulse {
                    0%, 100% { 
                        transform: scale(1); 
                        box-shadow: 0 0 40px rgba(0, 255, 0, 0.6);
                    }
                    50% { 
                        transform: scale(1.05); 
                        box-shadow: 0 0 60px rgba(0, 255, 0, 0.8);
                    }
                }
                
                .equalizer {
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    height: 50px;
                    margin: 20px 0;
                    gap: 5px;
                }
                
                .bar {
                    width: 8px;
                    background: linear-gradient(to top, #00ff00, #a6e3a1);
                    border-radius: 4px;
                    animation: equalize 0.8s ease-in-out infinite;
                    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
                }
                
                .bar:nth-child(1) { animation-delay: 0s; }
                .bar:nth-child(2) { animation-delay: 0.1s; }
                .bar:nth-child(3) { animation-delay: 0.2s; }
                .bar:nth-child(4) { animation-delay: 0.3s; }
                .bar:nth-child(5) { animation-delay: 0.4s; }
                
                @keyframes equalize {
                    0%, 100% { height: 10px; }
                    50% { height: 40px; }
                }
                
                .hidden {
                    display: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="${iconUri}" alt="Zap Icon" class="music-icon">
                <h1>Zap Music Player</h1>
                
                <div class="equalizer" id="equalizer">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>
                
                <p id="status">⏳ Carregando música...</p>
                <p id="fileName">📁 ${fileName}</p>
                <button id="playBtn" style="display:none;">▶️ Clique para Tocar </button>
            </div>
            
            <audio id="bgMusic" loop preload="auto">
                <source src="${musicUri}" type="audio/mpeg">
            </audio>
            
            <script>
                const audio = document.getElementById('bgMusic');
                const status = document.getElementById('status');
                const playBtn = document.getElementById('playBtn');
                const equalizer = document.getElementById('equalizer');
                
                audio.volume = ${volume};
                
                audio.addEventListener('playing', () => {
                    status.textContent = '▶️ Tocando em loop...';
                    playBtn.style.display = 'none';
                    equalizer.classList.remove('hidden');
                });
                
                audio.addEventListener('pause', () => {
                    if (!audio.ended) {
                        status.textContent = '⏸️ Pausado';
                    }
                });
                
                audio.addEventListener('error', (e) => {
                    status.textContent = '❌ Erro ao carregar música';
                    status.style.color = '#f38ba8';
                    playBtn.style.display = 'block';
                    equalizer.classList.add('hidden');
                });
                
                playBtn.addEventListener('click', () => {
                    audio.play();
                });
                
                audio.play().catch(() => {
                    status.textContent = '⚠️ Clique no botão para iniciar a Sinfonia nº 1 em Dó maior, Op. 21';
                    status.style.color = '#f9e2af';
                    playBtn.style.display = 'block';
                    equalizer.classList.add('hidden');
                });
            </script>
        </body>
        </html>
    `;
}

function stopMusic() {
    if (musicPanel) {
        musicPanel.dispose();
        musicPanel = undefined;
    }
}

export function deactivate() {
    stopMusic();
}
