#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Running Vercel Deployment Blocker Audit...\n');
console.log('='.repeat(60));

let hasErrors = false;
let hasWarnings = false;

// Helper function to run commands
function runCommand(command, description, options = {}) {
  const { optional = false, showOutput = false } = options;
  
  console.log(`\n📋 ${description}...`);
  try {
    const output = execSync(command, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: showOutput ? 'inherit' : 'pipe'
    });
    console.log(`✅ ${description} - PASSED`);
    return { success: true, output };
  } catch (error) {
    if (optional) {
      console.warn(`⚠️  ${description} - SKIPPED (optional)`);
      hasWarnings = true;
    } else {
      console.error(`❌ ${description} - FAILED`);
      if (error.stdout) console.error(error.stdout);
      if (error.stderr) console.error(error.stderr);
      hasErrors = true;
    }
    return { success: false, error };
  }
}

// 1. Check package.json
console.log('\n📦 Step 1: Validating package.json...');
try {
  const packageJsonPath = join(rootDir, 'package.json');
  if (!existsSync(packageJsonPath)) {
    console.error('❌ package.json not found');
    hasErrors = true;
  } else {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    // Check Node version
    if (!packageJson.engines?.node) {
      console.warn('⚠️  Warning: No Node version specified in engines');
      hasWarnings = true;
    } else {
      console.log(`✅ Node version specified: ${packageJson.engines.node}`);
    }
    
    // Check build script
    if (!packageJson.scripts?.build) {
      console.error('❌ No build script found in package.json');
      hasErrors = true;
    } else {
      console.log(`✅ Build script found: ${packageJson.scripts.build}`);
    }
    
    // Check required dependencies
    const requiredDeps = ['react', 'react-dom', 'next'];
    const missing = requiredDeps.filter(dep => 
      !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
    );
    
    if (missing.length > 0) {
      console.error(`❌ Missing required dependencies: ${missing.join(', ')}`);
      hasErrors = true;
    } else {
      console.log('✅ All required dependencies present');
    }
  }
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
  hasErrors = true;
}

// 2. Check TypeScript configuration
console.log('\n⚙️  Step 2: Validating TypeScript configuration...');
try {
  const tsconfigPath = join(rootDir, 'tsconfig.json');
  if (!existsSync(tsconfigPath)) {
    console.warn('⚠️  tsconfig.json not found (skipping TypeScript checks)');
    hasWarnings = true;
  } else {
    const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));
    console.log('✅ tsconfig.json found and valid');
    
    // Check for strict mode
    if (tsconfig.compilerOptions?.strict) {
      console.log('✅ Strict mode enabled');
    } else {
      console.warn('⚠️  Consider enabling strict mode for better type safety');
      hasWarnings = true;
    }
  }
} catch (error) {
  console.error('❌ Error reading tsconfig.json:', error.message);
  hasErrors = true;
}

// 3. Check environment variables documentation
console.log('\n🔐 Step 3: Checking environment variables...');
const envExamplePath = join(rootDir, '.env.example');
const envLocalPath = join(rootDir, '.env.local');

if (!existsSync(envExamplePath)) {
  console.warn('⚠️  .env.example not found - consider documenting required env vars');
  hasWarnings = true;
} else {
  console.log('✅ .env.example found');
}

if (!existsSync(envLocalPath)) {
  console.warn('⚠️  .env.local not found - ensure env vars are set in Vercel');
  hasWarnings = true;
}

// 4. Run TypeScript type check
runCommand(
  'npx tsc --noEmit',
  'TypeScript type check',
  { showOutput: false }
);

// 5. Run production build
console.log('\n🏗️  Step 5: Running production build (this may take a while)...');
console.log('='.repeat(60));
runCommand(
  'npm run build',
  'Production build',
  { showOutput: true }
);

// 6. Check build output
console.log('\n📊 Step 6: Analyzing build output...');
const nextDir = join(rootDir, '.next');
if (!existsSync(nextDir)) {
  console.error('❌ .next directory not found - build may have failed');
  hasErrors = true;
} else {
  console.log('✅ .next directory created successfully');
}

// 7. Summary
console.log('\n' + '='.repeat(60));
console.log('\n📋 AUDIT SUMMARY\n');

if (hasErrors) {
  console.error('❌ AUDIT FAILED - Deployment blockers found!');
  console.error('\nPlease fix the errors above before deploying to Vercel.');
  console.error('Review the Vercel Deployment Blocker Audit Guide for solutions.\n');
  process.exit(1);
} else if (hasWarnings) {
  console.warn('⚠️  AUDIT PASSED WITH WARNINGS');
  console.warn('\nDeployment should succeed, but consider addressing warnings.');
  console.warn('Review the warnings above to improve code quality.\n');
  process.exit(0);
} else {
  console.log('✅ AUDIT PASSED - PROJECT IS READY FOR VERCEL DEPLOYMENT!');
  console.log('\nAll checks passed successfully.');
  console.log('Your project is ready to deploy to Vercel.\n');
  process.exit(0);
}
