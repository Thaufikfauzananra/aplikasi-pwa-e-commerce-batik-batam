#!/usr/bin/env node

/**
 * Pre-deployment Checklist
 * Run: node verify.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checks = [];

function check(name, condition, fix = '') {
  checks.push({ name, condition, fix });
  const status = condition ? '✅' : '❌';
  console.log(`${status} ${name}`);
  if (!condition && fix) console.log(`   → ${fix}`);
}

console.log('\n🔍 Pre-Deployment Verification\n');

// Check files
check('package.json exists', fs.existsSync('package.json'), 'Run: npm init -y');
check('src/index.js exists', fs.existsSync('src/index.js'), 'Create main server file');
check('.env.example exists', fs.existsSync('.env.example'), 'Create .env.example');
check('vercel.json exists', fs.existsSync('vercel.json'), 'Create vercel.json');
check('prisma/schema.prisma exists', fs.existsSync('prisma/schema.prisma'), 'Setup Prisma schema');

// Check environment
check('.env is in .gitignore', 
  fs.existsSync('.gitignore') && fs.readFileSync('.gitignore', 'utf8').includes('.env'),
  'Add .env to .gitignore'
);

check('node_modules is in .gitignore',
  fs.existsSync('.gitignore') && fs.readFileSync('.gitignore', 'utf8').includes('node_modules'),
  'Add node_modules to .gitignore'
);

// Check package.json
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  check('express is in dependencies', pkg.dependencies?.express, 'Run: npm install express');
  check('cors is in dependencies', pkg.dependencies?.cors, 'Run: npm install cors');
  check('@prisma/client is in dependencies', pkg.dependencies?.['@prisma/client'], 'Run: npm install @prisma/client');
  check('jsonwebtoken is in dependencies', pkg.dependencies?.jsonwebtoken, 'Run: npm install jsonwebtoken');
  check('bcryptjs is in dependencies', pkg.dependencies?.bcryptjs, 'Run: npm install bcryptjs');
  check('start script defined', pkg.scripts?.start, 'Add: "start": "node src/index.js"');
}

// Summary
const passed = checks.filter(c => c.condition).length;
const total = checks.length;
const passRate = Math.round((passed / total) * 100);

console.log(`\n📊 Results: ${passed}/${total} checks passed (${passRate}%)\n`);

if (passRate === 100) {
  console.log('✅ Ready to deploy!\n');
  console.log('Next steps:');
  console.log('1. npm install');
  console.log('2. npx prisma generate');
  console.log('3. cp .env.example .env (edit with your values)');
  console.log('4. npm run dev (test locally)');
  console.log('5. git add backend-express/');
  console.log('6. git push origin main');
  console.log('7. Deploy on Vercel\n');
} else {
  console.log(`⚠️  Fix ${total - passed} issues before deploying.\n`);
}
