import chokidar from 'chokidar';
import path from 'path';
import { exec } from 'child_process'; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const studentDir = path.join(__dirname, 'public', 'htmlclass', 'students');
const teacherDir = path.join(__dirname, 'public', 'htmlclass', 'teachers');
const PYTHON_COMMAND = `D:\\TTGT_Pre_Real\\TTGT_Pre_Real\\.venv\\Scripts\\python.exe smart_convert_and_rename.py`;


console.log(`[Watcher] 🤖 Начинаю наблюдение за:`);
console.log(`[Watcher] -> ${studentDir}`);
console.log(`[Watcher] -> ${teacherDir}`);
console.log('--- (Оставьте этот терминал открытым во время разработки) ---');

let timer = null;
let isRunning = false;

const runPythonScript = () => {
    if (isRunning) {
        console.log('[Watcher] Скрипт уже запущен, пропускаю...');
        return;
    }

    console.log('[Watcher] 🚀 Обнаружены изменения! Запускаю Python-скрипт...');
    isRunning = true;

    exec(PYTHON_COMMAND, { cwd: __dirname }, (error, stdout, stderr) => {
        isRunning = false;
        if (error) {
            console.error(`[Watcher] ❌ Ошибка Python-скрипта: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`[Watcher] ⚠️ Ошибка Python (stderr): ${stderr}`);
        }
        const outputLines = stdout.split('\n');
        const summary = outputLines.slice(-7).join('\n'); 
        
        console.log('[Watcher] ✅ Python-скрипт завершен.');
        console.log(summary); 
    });
};

const debounceRun = () => {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(runPythonScript, 2000); 
};

const watcher = chokidar.watch([studentDir, teacherDir], {
    ignored: /(^|[\/\\])\../, 
    persistent: true,
    ignoreInitial: false, 
});

watcher
    .on('add', debounceRun)      // Новый файл
    .on('change', debounceRun)   // Файл изменен
    .on('unlink', debounceRun);  // Файл удален 