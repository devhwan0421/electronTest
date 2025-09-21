const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;
const RENDERER_URL = process.env.RENDERER_URL || 'http://localhost:5173';

let win;

function createWindow() {
  console.log('[main] isDev =', isDev, 'RENDERER_URL =', RENDERER_URL);

  win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs'),
      sandbox: false
    }
  });

  // 로드 상태 전부 찍기
  win.webContents.on('did-start-loading', () => console.log('[main] did-start-loading'));
  win.webContents.on('did-stop-loading', () => console.log('[main] did-stop-loading'));
  win.webContents.on('did-finish-load', () => console.log('[main] did-finish-load'));
  win.webContents.on('did-fail-load', (e, code, desc, url) => {
    console.error('[main] did-fail-load', { code, desc, url });
  });
  win.webContents.on('console-message', (e, level, message) => {
    console.log('[renderer]', level, message);
  });

  if (isDev) {
    // 개발 모드: Vite dev 서버에 붙음
    win.loadURL(RENDERER_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    // 배포 모드: asar 내부의 dist/index.html을 로드
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    win.loadFile(indexPath);
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });