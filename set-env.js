const { spawnSync } = require('child_process');

function addEnv(key, val) {
  console.log(`Adding ${key}...`);
  const result = spawnSync('npx.cmd', ['vercel', 'env', 'add', key, 'production'], {
    input: val,
    encoding: 'utf-8',
    stdio: ['pipe', 'inherit', 'inherit']
  });
  if (result.error) {
    console.error(result.error);
  }
}

addEnv('GOOGLE_CLIENT_ID', '794251293010-6jh33pstfseo7b41hshnpno5df6b9o9i.apps.googleusercontent.com');
addEnv('GOOGLE_CLIENT_SECRET', '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');
