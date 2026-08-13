import fs from 'fs';
import path from 'path';

const root = new URL('../', import.meta.url).pathname;
const source = path.join(root, 'apps/dawn-3d/dist');
const target = path.join(root, 'apps/web/public/dawn-3d-app');
fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });
fs.cpSync(source, target, { recursive: true });
console.log(`Synced ${source} -> ${target}`);
