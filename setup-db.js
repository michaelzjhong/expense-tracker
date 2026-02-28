require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function setupDatabase() {
  console.log('Creating expenses table...');

  const { error } = await supabase.rpc('exec_sql', {
    query: `
      CREATE TABLE IF NOT EXISTS expenses (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        amount NUMERIC(10, 2) NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });

  if (error) {
    console.error('Could not create table via RPC.');
    console.log('\nPlease create the table manually in the Supabase SQL Editor:');
    console.log('Go to: https://app.supabase.com → your project → SQL Editor\n');
    console.log(`CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amount NUMERIC(10, 2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`);
    console.log('\nThen enable Row Level Security and add a policy:');
    console.log(`ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON expenses FOR ALL USING (true) WITH CHECK (true);`);
  } else {
    console.log('Table created successfully!');
  }
}

setupDatabase();
