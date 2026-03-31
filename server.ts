import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('samu_pvh.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    registration_number TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    professional_category TEXT NOT NULL,
    hourly_rate REAL DEFAULT 0,
    must_change_password INTEGER DEFAULT 1,
    is_admin INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS extras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    type TEXT CHECK(type IN ('rural', 'urban')) NOT NULL,
    hours REAL NOT NULL,
    observations TEXT,
    start_time TEXT,
    end_time TEXT,
    is_sent INTEGER DEFAULT 0,
    reason TEXT,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Migration: Add must_change_password if it doesn't exist
try {
  db.prepare('ALTER TABLE users ADD COLUMN must_change_password INTEGER DEFAULT 1').run();
} catch (e) {}

try {
  db.prepare('ALTER TABLE extras ADD COLUMN start_time TEXT').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE extras ADD COLUMN end_time TEXT').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE extras ADD COLUMN is_sent INTEGER DEFAULT 0').run();
} catch (e) {}
try {
  db.prepare('ALTER TABLE extras ADD COLUMN reason TEXT').run();
} catch (e) {}

// Seed some initial data if empty
const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO users (name, registration_number, password, professional_category, hourly_rate, is_admin) VALUES (?, ?, ?, ?, ?, ?)');
  insertUser.run('Admin Teste', '123456', 'senha123', 'Enfermeiro', 50.0, 1);
  insertUser.run('João Silva', '654321', 'senha123', 'Médico', 120.0, 0);
  insertUser.run('Maria Oliveira', '111222', 'senha123', 'Condutor', 40.0, 0);

  // Seed some sample extras for the admin user
  const admin = db.prepare('SELECT id FROM users WHERE registration_number = ?').get('123456') as any;
  if (admin) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date1 = `${year}-${String(month).padStart(2, '0')}-05`;
    const date2 = `${year}-${String(month).padStart(2, '0')}-12`;
    
    const insertExtra = db.prepare('INSERT INTO extras (user_id, date, type, hours, observations, start_time, end_time, is_sent, reason, month, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    insertExtra.run(admin.id, date1, 'urban', 12, 'Plantão na base PVH', '07:00:00', '19:00:00', 0, 'Escala Regular', month, year);
    insertExtra.run(admin.id, date2, 'rural', 12, 'Plantão na base Jacy', '19:00:00', '07:00:00', 1, 'Substituição', month, year);
  }
}

const app = express();
app.use(express.json());

// Auth API
app.post('/api/login', (req, res) => {
  const { registration_number, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE registration_number = ? AND password = ?').get(registration_number, password) as any;
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.status(401).json({ success: false, message: 'Matrícula ou senha inválidos' });
  }
});

app.post('/api/change-password', (req, res) => {
  const { userId, newPassword } = req.body;
  
  try {
    db.prepare('UPDATE users SET password = ?, must_change_password = 0 WHERE id = ?').run(newPassword, userId);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao alterar senha' });
  }
});

// Admin API
app.get('/api/admin/users', (req, res) => {
  const users = db.prepare('SELECT id, name, registration_number, professional_category, hourly_rate, is_admin FROM users').all();
  res.json(users);
});

app.post('/api/admin/users', (req, res) => {
  const { name, registration_number, password, professional_category, hourly_rate, is_admin } = req.body;
  try {
    const insert = db.prepare('INSERT INTO users (name, registration_number, password, professional_category, hourly_rate, is_admin) VALUES (?, ?, ?, ?, ?, ?)');
    const result = insert.run(name, registration_number, password || 'senha123', professional_category, hourly_rate || 0, is_admin ? 1 : 0);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Matrícula já cadastrada ou erro nos dados' });
  }
});

// Extras API
app.get('/api/extras/:userId', (req, res) => {
  const { userId } = req.params;
  const { month, year } = req.query;
  
  let query = 'SELECT * FROM extras WHERE user_id = ?';
  const params: any[] = [userId];
  
  if (month && year) {
    query += ' AND month = ? AND year = ?';
    params.push(month, year);
  }
  
  query += ' ORDER BY date DESC';
  
  const extras = db.prepare(query).all(...params);
  res.json(extras);
});

app.post('/api/extras', (req, res) => {
  const { user_id, date, type, hours, observations, start_time, end_time, reason } = req.body;
  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  
  const insert = db.prepare('INSERT INTO extras (user_id, date, type, hours, observations, start_time, end_time, is_sent, reason, month, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const result = insert.run(user_id, date, type, hours, observations, start_time, end_time, 0, reason, month, year);
  
  res.json({ success: true, id: result.lastInsertRowid });
});

app.patch('/api/extras/:id/toggle-sent', (req, res) => {
  const { id } = req.params;
  const extra = db.prepare('SELECT is_sent FROM extras WHERE id = ?').get(id) as any;
  if (extra) {
    const newStatus = extra.is_sent === 1 ? 0 : 1;
    db.prepare('UPDATE extras SET is_sent = ? WHERE id = ?').run(newStatus, id);
    res.json({ success: true, is_sent: newStatus });
  } else {
    res.status(404).json({ success: false, message: 'Registro não encontrado' });
  }
});

app.delete('/api/extras/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM extras WHERE id = ?').run(id);
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
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
