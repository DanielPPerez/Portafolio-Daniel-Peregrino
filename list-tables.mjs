// This script lists all tables in the 'public' schema of your Supabase database.
// It uses the service_role key, which should be kept secret and only used in trusted server environments.

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
function loadEnvFile(filePath) {
  const env = {};
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      // Skip empty lines and comments
      if (!line.trim() || line.startsWith('#')) continue;
      const [key, ...valueParts] = line.split('=');
      if (key === undefined) continue;
      const value = valueParts.join('=').trim();
      // Remove surrounding quotes if present
      const cleanedValue = value.replace(/^['"]|['"]$/g, '');
      env[key.trim()] = cleanedValue;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    process.exit(1);
  }
  return env;
}

const envPath = path.resolve('.env.local');
const env = loadEnvFile(envPath);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

// Construct the full Supabase URL if not already present
const url = supabaseUrl.startsWith('http') ? supabaseUrl : `https://${supabaseUrl}.supabase.co`;

if (!url || !supabaseServiceRoleKey) {
  console.error('Error: Missing Supabase URL or service role key in .env.local');
  process.exit(1);
}

const supabase = createClient(url, supabaseServiceRoleKey);

async function listTables() {
  try {
    // Query to get all tables in the 'public' schema
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (error) {
      console.error('Error fetching tables:', error);
      process.exit(1);
    }

    console.log('Tables in the public schema:');
    data.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

listTables();