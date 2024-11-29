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

app.get('/api/recent', (req, res) => {
  const sql = 'SELECT * FROM tb_cordeis WHERE cor_id < 11';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/api/search', (req, res) => {
    const term = req.query.term;
    console.log('Search term:', term);
    if (!term) {
      return res.status(400).json({ message: 'Parâmetro de busca é necessário' });
    }
    const sql = 'SELECT * FROM tb_cordeis WHERE cor_titulo LIKE ? OR cor_autor LIKE ? OR cor_capa LIKE ?';
    const searchParam = `%${term}%`;
    db.query(sql, [searchParam, searchParam, searchParam], (err, results) => {
      if (err) throw err;
      res.send(results);
      console.log('Results:', results);
    });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
