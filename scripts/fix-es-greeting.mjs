import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dest = path.join(root, 'src', 'data', 'destinations.js');
let c = fs.readFileSync(dest, 'utf8');

const start = c.indexOf('  es: (name, isCity) =>');
const fr = c.indexOf('  fr: (name, isCity) =>');
if (start < 0 || fr < 0) {
  console.error('markers not found', { start, fr });
  process.exit(1);
}

const replacement = `  es: (name, isCity) =>
    isCity
      ? \`¡Bienvenido a \${name}! Soy tu guía local de IA. Pregúntame por lugares, comida, transporte o joyas ocultas.\`
      : \`¡Bienvenido! Soy tu guía de IA para \${name}. Pregunta por ciudades, cultura o consejos de viaje.\`,
`;

c = c.slice(0, start) + replacement + c.slice(fr);
fs.writeFileSync(dest, c, 'utf8');
console.log('Spanish greeting fixed OK');
console.log(c.slice(start, start + 220));
