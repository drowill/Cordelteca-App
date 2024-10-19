const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cordelteca'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

app.get('/api/cordeis', (req, res) => {
  const sql = 'SELECT * FROM tb_cordeis';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/api/search', (req, res) => {
    const term = req.query.term;
    console.log('Search term:', term);
    const sql = 'SELECT * FROM tb_cordeis WHERE cor_titulo LIKE ? OR cor_autor LIKE ? OR cor_capa LIKE ?';
    db.query(sql, [`%${term}%`], (err, results) => {
      if (err) throw err;
      res.send(results);
      console.log('Results:', results);
    });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM tb_users WHERE usr_username = ? AND usr_password = ?';
  connection.query(query, [username, password], (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: 'Erro no servidor' });
    } else if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Credenciais inválidas' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
