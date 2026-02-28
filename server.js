require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Get all expenses (optional ?category= filter)
app.get('/api/expenses', async (req, res) => {
  let query = supabase.from('expenses').select('*').order('date', { ascending: false });

  if (req.query.category) {
    query = query.eq('category', req.query.category);
  }

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Add an expense
app.post('/api/expenses', async (req, res) => {
  const { amount, category, description, date } = req.body;

  if (!amount || !category) {
    return res.status(400).json({ error: 'Amount and category are required' });
  }

  const { data, error } = await supabase
    .from('expenses')
    .insert([{ amount: parseFloat(amount), category, description, date }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Delete an expense
app.delete('/api/expenses/:id', async (req, res) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Expense deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
