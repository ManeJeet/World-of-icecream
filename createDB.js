const sqlite3 = require("sqlite3").verbose();   //creates database
const db = new sqlite3.Database("feedback.db");   //with name feedback.db

db.serialize(() => {    //script that run to create table in database
  db.run(`    
    CREATE TABLE feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      icecreamtype TEXT,
      rating INTEGER,
      feedback TEXT
    )
  `);
  console.log("Database and table created");  //once the table is created this message will print
});

db.close();
