const express = require('express');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDb() {
  await db.read();
  db.data ||= { products: [
    { id: 1, title: 'Blue T-shirt', price: 19.99 },
    { id: 2, title: 'Coffee Mug', price: 7.5 },
    { id: 3, title: 'Notebook', price: 3.99 }
  ], users: [{ id:1, username:'alice', password: 'pass' }] };
  await db.write();
}
initDb();

app.get('/products', async (req, res) => {
  await db.read();
  res.json(db.data.products || []);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  await db.read();
  const user = (db.data.users || []).find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, user: { id: user.id, username: user.username } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
