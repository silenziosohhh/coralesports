import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());

const targets = ['.next', '.next-build'];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function rmWithRetries(absolutePath) {
  const maxAttempts = 8;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      fs.rmSync(absolutePath, { recursive: true, force: true, maxRetries: 0, retryDelay: 0 });
      return;
    } catch (err) {
      const code = err && typeof err === 'object' ? err.code : undefined;
      const retriable = code === 'ENOTEMPTY' || code === 'EBUSY' || code === 'EPERM' || code === 'EACCES';
      if (!retriable || attempt === maxAttempts) throw err;
      await sleep(50 * attempt);
    }
  }
}

for (const target of targets) {
  const absolutePath = path.join(projectRoot, target);
  if (!fs.existsSync(absolutePath)) continue;

  await rmWithRetries(absolutePath);
}
