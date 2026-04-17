import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from './src/lib/supabaseClient.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Auth API
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  
  // Verifica se a matrícula existe
  const { data: userExists } = await supabase
    .from('users')
    .select('id')
    .eq('registration_number', login)
    .limit(1);

  if (!userExists || userExists.length === 0) {
    return res.status(401).json({ 
      success: false, 
      message: 'Servidor não cadastrado. Maiores informações no adm do SAMU' 
    });
  }

  // Verifica a senha
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('registration_number', login)
    .eq('password', password)
    .limit(1);
  
  if (users && users.length > 0) {
    const user = users[0];
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.status(401).json({ success: false, message: 'Senha incorreta' });
  }
});

app.post('/api/change-password', async (req, res) => {
  const { userId, newPassword, registration_number, professional_category } = req.body;
  
  try {
    const updateData: any = { password: newPassword, must_change_password: 0 };
    if (registration_number) updateData.registration_number = registration_number;
    if (professional_category) updateData.professional_category = professional_category;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar dados' });
  }
});

app.post('/api/verify-email', async (req, res) => {
  const { email } = req.body;
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(404).json({ success: false, message: 'Email não encontrado no sistema' });
    }
    res.json({ success: true, userId: user.id });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao verificar email' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { userId, newPassword } = req.body;
  try {
    const { error } = await supabase
      .from('users')
      .update({ password: newPassword, must_change_password: 0 })
      .eq('id', userId);

    if (error) throw error;
    res.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao alterar senha' });
  }
});

// Admin API
app.get('/api/admin/users', async (req, res) => {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, name, username, email, registration_number, professional_category, hourly_rate, is_admin, role_user, lotacao_fisica');
  res.json(users || []);
});

app.post('/api/admin/users', async (req, res) => {
  const { name, username, email, registration_number, password, professional_category, hourly_rate, is_admin, role_user, lotacao_fisica } = req.body;
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          username,
          email,
          registration_number: registration_number || null,
          password: password || 'samu192',
          professional_category: professional_category || null,
          hourly_rate: hourly_rate || 0,
          is_admin: is_admin ? 1 : 0,
          role_user: role_user || 'USER',
          lotacao_fisica: lotacao_fisica || 'samu pvh',
          must_change_password: 1
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, id: data.id });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || 'Erro ao cadastrar usuário' });
  }
});

// Extras API
app.get('/api/extras/:userId', async (req, res) => {
  const { userId } = req.params;
  const { month, year } = req.query;
  
  let query = supabase
    .from('extras')
    .select('*')
    .eq('user_id', userId);
  
  if (month && year) {
    query = query.eq('month', month).eq('year', year);
  }
  
  query = query.order('date', { ascending: false });
  
  const { data: extras, error } = await query;
  res.json(extras || []);
});

app.post('/api/extras', async (req, res) => {
  const { user_id, date, type, hours, observations, start_time, end_time, reason } = req.body;
  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  
  const { data, error } = await supabase
    .from('extras')
    .insert([
      {
        user_id,
        date,
        type,
        hours,
        observations,
        start_time,
        end_time,
        is_sent: 0,
        reason,
        month,
        year
      }
    ])
    .select()
    .single();
  
  if (error) {
    res.status(500).json({ success: false, message: error.message });
  } else {
    res.json({ success: true, id: data.id });
  }
});

app.patch('/api/extras/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const { data, error } = await supabase
    .from('extras')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
  
  res.json({ success: true, data });
});

app.patch('/api/extras/:id/toggle-sent', async (req, res) => {
  const { id } = req.params;
  
  const { data: extra, error: fetchError } = await supabase
    .from('extras')
    .select('is_sent')
    .eq('id', id)
    .single();

  if (extra) {
    const newStatus = extra.is_sent === 1 ? 0 : 1;
    const { error: updateError } = await supabase
      .from('extras')
      .update({ is_sent: newStatus })
      .eq('id', id);
      
    res.json({ success: true, is_sent: newStatus });
  } else {
    res.status(404).json({ success: false, message: 'Registro não encontrado' });
  }
});

app.delete('/api/extras/:id', async (req, res) => {
  const { id } = req.params;
  await supabase
    .from('extras')
    .delete()
    .eq('id', id);
  res.json({ success: true });
});

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
