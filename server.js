const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const _dirname = path.dirname("")
const buildpath = path.join(_dirname , "build");

app.use(express.static(buildpath))

app.get("/", function(req, res){
  res.sendFile(
    path.join(__dirname, "build/index.html"),
    function(err){
      if(err){
        res.status(500).send(err);
      }
    }
  );
})

const db = mysql.createConnection({
  host: 'bannerdb.ct0goc86eovt.eu-north-1.rds.amazonaws.com',
  user: 'root',
  password: 'tejam500',
  database: 'tejadb'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

app.get('/api/banner-settings', (req, res) => {
  db.query('SELECT * FROM bannerdetails ORDER BY id DESC LIMIT 1', (err, results) => {
    if (err) throw err;
    res.json(results[0] || {});
  });
});

app.post('/api/banner-settings', (req, res) => {
  const { description, timer, link } = req.body;
  const query = `INSERT INTO bannerdetails (description, timer, link) VALUES (?, ?, ?)`;
  db.query(query, [description, timer, link], (err, results) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
