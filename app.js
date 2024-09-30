// app.js

const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// Create or connect to the SQLite database
const db = new sqlite3.Database(':memory:'); // Use in-memory database for testing

// Initialize the database table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      icecreamtype TEXT,
      rating INTEGER,
      feedback TEXT
    )
  `);
});

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Ice Cream Feedback" });
});

app.get('/feedback', (req, res) => {
  db.all('SELECT * FROM feedback', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error retrieving feedback data');
    } else {
      res.render('feedback', { title: "Feedback Page", rows });
    }
  });
});

app.post("/submit-feedback", (req, res) => {
  const { name, icecream, rating, feedback } = req.body;
  db.run(
    'INSERT INTO feedback (name, icecreamtype, rating, feedback) VALUES (?,?,?,?)',
    [name, icecream, rating, feedback],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error saving feedback');
      } else {
        res.render("thankyou", { title: "Thank You", name, icecream, rating, feedback });
      }
    }
  );
});

app.post("/search", (req, res) => {
  const { searchType } = req.body;
  const query = 'SELECT * FROM feedback WHERE icecreamtype LIKE ?';
  db.all(query, [`%${searchType}%`], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error searching feedback');
    } else {
      res.render("search", {
        title: "Search Results",
        searchType,
        feedbacks: rows,
      });
    }
  });
});

module.exports = app;