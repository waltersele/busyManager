import { spawn } from 'node:child_process';

const INTERVAL_MS = 5 * 60 * 1000;

function runCheck() {
  const child = spawn('pnpm', ['check'], {
    cwd: new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'),
    shell: true,
    stdio: 'inherit',
    env: process.env,
  });
  child.on('close', (code) => {
    console.log(`[scheduler] check finished with code ${code}`);
  });
}

console.log('Web uptime scheduler — every 5 minutes');
runCheck();
setInterval(runCheck, INTERVAL_MS);
