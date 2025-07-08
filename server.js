const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite'));

// Initialize tables
const initSql = `
CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,
    name TEXT NOT NULL,
    FOREIGN KEY(player_id) REFERENCES players(id)
);
CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,
    item TEXT NOT NULL,
    FOREIGN KEY(player_id) REFERENCES players(id)
);`;

// run each command separately due to sqlite limitations
initSql.trim().split(';').forEach(cmd => {
  const statement = cmd.trim();
  if(statement){
    db.run(statement);
  }
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

// Players endpoints
app.get('/players', (req, res) => {
  db.all('SELECT * FROM players', (err, rows) => {
    if(err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/players', (req, res) => {
  const {name} = req.body;
  if(!name) return res.status(400).json({error: 'Name required'});
  db.run('INSERT INTO players(name) VALUES(?)', [name], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.status(201).json({id: this.lastID, name});
  });
});

app.get('/players/:id', (req, res) => {
  db.get('SELECT * FROM players WHERE id = ?', [req.params.id], (err, row) => {
    if(err) return res.status(500).json({error: err.message});
    if(!row) return res.status(404).json({error: 'Not found'});
    res.json(row);
  });
});

app.put('/players/:id', (req, res) => {
  const {name} = req.body;
  if(!name) return res.status(400).json({error: 'Name required'});
  db.run('UPDATE players SET name = ? WHERE id = ?', [name, req.params.id], function(err){
    if(err) return res.status(500).json({error: err.message});
    if(this.changes === 0) return res.status(404).json({error: 'Not found'});
    res.json({id: parseInt(req.params.id,10), name});
  });
});

app.delete('/players/:id', (req, res) => {
  db.run('DELETE FROM players WHERE id = ?', [req.params.id], function(err){
    if(err) return res.status(500).json({error: err.message});
    if(this.changes === 0) return res.status(404).json({error: 'Not found'});
    res.status(204).end();
  });
});

// Characters endpoints
app.get('/characters', (req, res) => {
  db.all('SELECT * FROM characters', (err, rows) => {
    if(err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/characters', (req, res) => {
  const {player_id, name} = req.body;
  if(!name) return res.status(400).json({error: 'Name required'});
  db.run('INSERT INTO characters(player_id, name) VALUES(?, ?)', [player_id, name], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.status(201).json({id: this.lastID, player_id, name});
  });
});

app.get('/characters/:id', (req, res) => {
  db.get('SELECT * FROM characters WHERE id = ?', [req.params.id], (err, row) => {
    if(err) return res.status(500).json({error: err.message});
    if(!row) return res.status(404).json({error: 'Not found'});
    res.json(row);
  });
});

app.put('/characters/:id', (req, res) => {
  const {player_id, name} = req.body;
  if(!name) return res.status(400).json({error: 'Name required'});
  db.run('UPDATE characters SET player_id = ?, name = ? WHERE id = ?', [player_id, name, req.params.id], function(err){
    if(err) return res.status(500).json({error: err.message});
    if(this.changes === 0) return res.status(404).json({error: 'Not found'});
    res.json({id: parseInt(req.params.id,10), player_id, name});
  });
});

app.delete('/characters/:id', (req, res) => {
  db.run('DELETE FROM characters WHERE id = ?', [req.params.id], function(err){
    if(err) return res.status(500).json({error: err.message});
    if(this.changes === 0) return res.status(404).json({error: 'Not found'});
    res.status(204).end();
  });
});

// Wishlist endpoints
app.get('/wishlist', (req, res) => {
  db.all('SELECT * FROM wishlist', (err, rows) => {
    if(err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/wishlist', (req, res) => {
  const {player_id, item} = req.body;
  if(!item) return res.status(400).json({error: 'Item required'});
  db.run('INSERT INTO wishlist(player_id, item) VALUES(?, ?)', [player_id, item], function(err){
    if(err) return res.status(500).json({error: err.message});
    res.status(201).json({id: this.lastID, player_id, item});
  });
});

app.get('/wishlist/:id', (req, res) => {
  db.get('SELECT * FROM wishlist WHERE id = ?', [req.params.id], (err, row) => {
    if(err) return res.status(500).json({error: err.message});
    if(!row) return res.status(404).json({error: 'Not found'});
    res.json(row);
  });
});

app.put('/wishlist/:id', (req, res) => {
  const {player_id, item} = req.body;
  if(!item) return res.status(400).json({error: 'Item required'});
  db.run('UPDATE wishlist SET player_id = ?, item = ? WHERE id = ?', [player_id, item, req.params.id], function(err){
    if(err) return res.status(500).json({error: err.message});
    if(this.changes === 0) return res.status(404).json({error: 'Not found'});
    res.json({id: parseInt(req.params.id,10), player_id, item});
  });
});

app.delete('/wishlist/:id', (req, res) => {
  db.run('DELETE FROM wishlist WHERE id = ?', [req.params.id], function(err){
    if(err) return res.status(500).json({error: err.message});
    if(this.changes === 0) return res.status(404).json({error: 'Not found'});
    res.status(204).end();
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

