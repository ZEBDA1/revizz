import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' });
const output = path.resolve(root, process.argv[2] || '../revizz-github.zip');
if (!output.endsWith('.zip')) throw new Error('Indiquer un fichier de sortie .zip.');
if (existsSync(output)) throw new Error('Le fichier existe déjà. Choisir un autre nom pour conserver cet export.');
if (git(['status', '--porcelain', '--untracked-files=normal']).trim()) throw new Error('Enregistrer les modifications dans un commit avant de créer un export fidèle.');
execFileSync(process.execPath, [path.join(root, 'scripts/check-secrets.mjs')], { cwd: root, stdio: 'inherit' });
const commit = git(['rev-parse', 'HEAD']).trim();
// git archive exports this exact committed tree, without history or local files.
git(['archive', '--format=zip', '--prefix=revizz/', '--output=' + output, commit]);
console.log(JSON.stringify({ archive: output, commit, bytes: statSync(output).size, sha256: createHash('sha256').update(readFileSync(output)).digest('hex') }));
