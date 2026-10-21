import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { parseEnv } from 'node:util';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' });
// Check tracked files and additions; ignored local files never enter an export.
const files = [...new Set(git(['ls-files', '--cached', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean))];
const secrets = [];
for (const name of readdirSync(root)) {
  if (!/^(?:\.env(?:\..+)?|\.dev\.vars(?:\..+)?)$/.test(name) || name.endsWith('.example')) continue;
  const values = parseEnv(readFileSync(path.join(root, name), 'utf8'));
  for (const [key, value] of Object.entries(values)) {
    if (/(?:KEY|TOKEN|SECRET|PASSWORD|ACCOUNT_ID)$/.test(key) && value.trim().length >= 12) secrets.push(Buffer.from(value.trim()));
  }
}
const forbidden = /(?:^|\/)(?:\.git|node_modules|\.sites-runtime|\.wrangler|dist|qa)(?:\/|$)|(?:^|\/)\.env(?:\.|$)|(?:^|\/)\.dev\.vars(?:\.|$)|\.(?:log|zip|tar\.gz)$/;
const credential = /\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{20,}|gsk_[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/;
const findings = [];
for (const name of files) {
  if (name !== '.env.example' && forbidden.test(name)) findings.push(`${name} : fichier local ou sensible`);
  const file = path.join(root, name);
  if (!existsSync(file)) continue;
  const data = readFileSync(file);
  if (secrets.some(secret => data.includes(secret)) || credential.test(data.toString('utf8'))) findings.push(`${name} : identifiant confidentiel détecté`);
}
if (findings.length) {
  console.error('Publication bloquée. Retirer ces fichiers ou identifiants du code :\n' + findings.join('\n'));
  process.exit(1);
}
console.log(`Vérification des secrets réussie : ${files.length} fichiers, aucun identifiant connu détecté.`);
