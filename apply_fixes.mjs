#!/usr/bin/env node
/** Apply KoletPay frontend fixes to the `the-frontend` branch. */
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, unlinkSync, readdirSync, rmdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const bundle = dirname(fileURLToPath(import.meta.url));
const repo = resolve(process.argv[2] || '.');
const file = (relative) => join(repo, relative);
function fail(message) { console.error(message); process.exit(1); }
function read(relative) { return readFileSync(file(relative), 'utf8'); }
function write(relative, content) {
  const target = file(relative);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, 'utf8');
}
if (!existsSync(file('src/lib/store.tsx'))) {
  fail(`Could not find src/lib/store.tsx in ${repo}. Check out the-frontend branch and run from the project root.`);
}
const updates = [
  'src/app/dashboard/page.tsx',
  'src/app/invoices/new/page.tsx',
  'src/app/reports/page.tsx',
];
for (const relative of updates) {
  const target = file(relative);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(bundle, relative), target);
  console.log(`Wrote ${relative}`);
}
const oldReport = 'src/app/reports/pages.tsx';
if (existsSync(file(oldReport))) {
  unlinkSync(file(oldReport));
  console.log(`Removed obsolete ${oldReport}`);
}
const shell = 'src/components/Shell.tsx';
if (existsSync(file(shell))) {
  const before = read(shell);
  const after = before
    .replaceAll('Link href="/" className="brand"', 'Link href="/dashboard" className="brand"')
    .replaceAll('Link href="/" className="brand compact"', 'Link href="/dashboard" className="brand compact"');
  if (after !== before) {
    write(shell, after);
    console.log('Updated logo links in Shell.tsx');
  }
}
// Phase 2 replaces the login page, so this is only an optional Phase 1 demo link.
const login = 'src/app/login/page.tsx';
if (existsSync(file(login))) {
  const before = read(login);
  const anchor = '</form>\n\n          <p className="auth-footer">';
  if (!before.includes('Explore demo workspace')) {
    if (before.includes(anchor)) {
      write(login, before.replace(anchor, `</form>

          <Link href="/dashboard" className="btn block" style={{ marginTop: 14 }}>
            Explore demo workspace
          </Link>
          <p className="small" style={{ textAlign: "center", marginTop: 8 }}>
            Demo only — no sign-in or backend connection is required.
          </p>

          <p className="auth-footer">`));
      console.log('Added optional demo dashboard entry to login');
    } else {
      console.log('Skipped optional login edit: expected text not found');
    }
  }
}
const typo = 'src/app/resgister/page.tsx';
const register = 'src/app/register/page.tsx';
if (existsSync(file(typo)) && existsSync(file(register))) {
  if (readFileSync(file(typo)).equals(readFileSync(file(register)))) {
    unlinkSync(file(typo));
    if (readdirSync(dirname(file(typo))).length === 0) rmdirSync(dirname(file(typo)));
    console.log('Removed duplicate /resgister route');
  } else {
    console.log('Kept /resgister because it differs from /register; inspect manually');
  }
}
console.log('\nFinished. Run npm run typecheck && npm run build.');
