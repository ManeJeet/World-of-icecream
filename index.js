const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// it creates new sqlite3 database
const db = new sqlite3.Database('feedback.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the feedback database.');
});

app.get("/", (req, res) => {
  res.render("index", { title: "Ice Cream Feedback" });
});

app.get('/feedback', (req, res) => {  // query the database to get feedback data
  db.all('SELECT * FROM feedback', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error retrieving feedback data');
    } else {
      res.render('feedback', { title: "This is the feedback page.", rows });
    }
  });
});

app.post("/submit-feedback", (req, res) => {    //the data in from is submitted on pressing submit button
  const feedback = req.body.feedback;
  const name = req.body.name;
  const icecream = req.body.icecream;
  const rating = req.body.rating;

  console.log('Received feedback:',feedback, name, icecream, rating);

  // insert the feedback into the database in all the rows 
  db.run('INSERT INTO feedback (name, icecreamtype, rating, feedback) VALUES (?,?,?,?)', [name, icecream, rating, feedback], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error saving feedback');  //if any error 
    } else {
      res.render("thankyou", { title: "Thank You for Your Feedback", name, icecream, rating, feedback });
    }
  });
});

app.post("/search", (req, res) => {
  const { searchType } = req.body;
  const query = `SELECT * FROM feedback WHERE icecreamtype LIKE ?`;
  db.all(query, [`%${searchType}%`], (err, rows) => {
    if (err) {
      throw err;
    }
    res.render("search", {
      title: "Search Results",
      searchType,
      feedbacks: rows,
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});