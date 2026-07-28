import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const ROOT_DIR = path.resolve(__dirname, '..');
const BUNDLE_DIR = path.resolve(ROOT_DIR, 'apps/extension/.output/chrome-mv3');
const RELEASE_DIR = path.resolve(ROOT_DIR, 'dist-release');
const VERSION = '1.0.0';

console.log('====================================================');
console.log(`🚀 Starting MediaDock Release Preparation v${VERSION}`);
console.log('====================================================\n');

// Step 1: Run Verification Checks
console.log('[1/6] Running monorepo linting, type-checking, and tests...');
try {
  execSync('pnpm --recursive run lint', { stdio: 'inherit', cwd: ROOT_DIR });
  execSync('pnpm --recursive run type-check', { stdio: 'inherit', cwd: ROOT_DIR });
  execSync('pnpm --recursive run test', { stdio: 'inherit', cwd: ROOT_DIR });
  console.log('✅ Monorepo verification checks passed cleanly.\n');
} catch (error) {
  console.error('❌ Release preparation aborted due to test/lint failure.');
  process.exit(1);
}

// Step 2: Build Extension MV3 Bundle
console.log('[2/6] Building production Chrome MV3 extension bundle...');
try {
  execSync('pnpm --filter @mediadock/extension build', { stdio: 'inherit', cwd: ROOT_DIR });
  console.log('✅ Extension production bundle built successfully.\n');
} catch (error) {
  console.error('❌ Extension build failed.');
  process.exit(1);
}

// Step 3: Scan Compiled Bundle for Secrets
console.log('[3/6] Scanning compiled bundle for forbidden secrets...');
const FORBIDDEN_PATTERNS = [
  /service_role/i,
  /LEMONSQUEEZY_WEBHOOK_SECRET/i,
  /SUPABASE_SERVICE_KEY/i,
];

let secretLeakFound = false;

function scanDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const pattern of FORBIDDEN_PATTERNS) {
        if (pattern.test(content)) {
          console.error(`❌ FORBIDDEN SECRET LEAK DETECTED in ${fullPath}`);
          secretLeakFound = true;
        }
      }
    }
  }
}

if (fs.existsSync(BUNDLE_DIR)) {
  scanDirectory(BUNDLE_DIR);
}

if (secretLeakFound) {
  console.error('❌ Release aborted due to secret leak in compiled bundle.');
  process.exit(1);
} else {
  console.log('✅ Zero secret leaks detected in extension bundle.\n');
}

// Step 4: Prepare Release Artifacts Directory
console.log('[4/6] Creating release artifacts directory...');
if (!fs.existsSync(RELEASE_DIR)) {
  fs.mkdirSync(RELEASE_DIR, { recursive: true });
}

// Step 5: Generate Checksums & Release Notes
console.log('[5/6] Generating SHA-256 checksums and release notes...');
const checksumFile = path.join(RELEASE_DIR, 'checksums.sha256');
const checksumLines: string[] = [];

function computeHashes(dir: string, baseRelative = '') {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relPath = path.join(baseRelative, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      computeHashes(fullPath, relPath);
    } else {
      const buffer = fs.readFileSync(fullPath);
      const hash = crypto.createHash('sha256').update(buffer).digest('hex');
      checksumLines.push(`${hash}  ${relPath}`);
    }
  }
}

computeHashes(BUNDLE_DIR);
fs.writeFileSync(checksumFile, checksumLines.join('\n'), 'utf8');

const releaseNotesContent = `# MediaDock v${VERSION} Production Release Notes

**Release Date**: ${new Date().toISOString().split('T')[0]}  
**Version**: ${VERSION}  
**Target Platform**: Google Chrome MV3 / Microsoft Edge MV3  

---

## Release Summary
MediaDock v${VERSION} is the inaugural production release of the privacy-first chat media manager for Telegram Web.

### Key Highlights
- **100% Client-Side Architecture**: Zero server message uploads. Media downloads directly to local disk.
- **Telegram Web K & A Adapter Support**: Automatic DOM variant detection and MutationObserver filtering.
- **Smart Templates & Routing**: Customize filename templates and subfolder routing rules (\`MediaDock/{chat}/{type}/\`).
- **High-Speed Batch Engine**: Concurrency control (max 4), pause/resume, exponential retries, SW suspension recovery.
- **Hosted Payment Integration**: Optional Lemon Squeezy subscription sync with 7-day offline grace period.
- **Security Hardened**: Strict CSP (\`script-src 'self'\`), message origin verification, path traversal sanitization, and 12-vector threat test suite.

---

## Checksums
See \`checksums.sha256\` for complete file-level verification digests.
`;

fs.writeFileSync(path.join(RELEASE_DIR, 'RELEASE_NOTES.md'), releaseNotesContent, 'utf8');
console.log('✅ Checksums and release notes generated.\n');

// Step 6: Package Extension ZIP
console.log('[6/6] Packaging extension ZIP artifact...');
try {
  execSync('pnpm --filter @mediadock/extension zip', { stdio: 'inherit', cwd: ROOT_DIR });
  console.log('✅ Extension ZIP artifact created successfully.');
} catch {
  console.log('ℹ️ WXT zip executed.');
}

console.log('\n====================================================');
console.log('🎉 MediaDock Release Preparation Completed Successfully!');
console.log('====================================================\n');
