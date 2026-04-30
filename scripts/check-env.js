#!/usr/bin/env node

/**
 * Check that all required environment variables are set
 * Run with: node scripts/check-env.js
 */

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

console.log('🔍 Checking environment variables...\n');

let allSet = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}`);
  } else {
    console.log(`❌ ${varName} - NOT SET`);
    allSet = false;
  }
});

console.log();

if (allSet) {
  console.log('✅ All environment variables are set!');
  process.exit(0);
} else {
  console.log('❌ Some environment variables are missing.');
  console.log('\n📝 Add them to:');
  console.log('   - .env.local (for local development)');
  console.log('   - Vercel dashboard → Settings → Environment Variables (for production)');
  process.exit(1);
}
