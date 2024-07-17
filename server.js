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

app.get('/api/admins', (req, res) => {
  const sql = 'SELECT * FROM tb_admins';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/api/search', (req, res) => {
    const term = req.query.term;
    console.log('Search term:', term);
    const sql = 'SELECT * FROM tb_admins WHERE adm_nome LIKE ?';
    db.query(sql, [`%${term}%`], (err, results) => {
      if (err) throw err;
      res.send(results);
      console.log('Results:', results);
    });
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
