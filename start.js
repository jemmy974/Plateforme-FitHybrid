import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverDir = path.join(__dirname, 'express');
const clientDir = path.join(__dirname, 'React');

const server = spawn('npm', ['run', 'dev'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true,
});

const client = spawn('npm', ['run', 'dev', '--', '--host', '0.0.0.0'], {
  cwd: clientDir,
  stdio: 'inherit',
  shell: true,
});

server.on('exit', (code) => {
  console.log(`Backend exited with code ${code}`);
  client.kill();
  process.exit(code ?? 0);
});

client.on('exit', (code) => {
  console.log(`Frontend exited with code ${code}`);
  server.kill();
  process.exit(code ?? 0);
});
