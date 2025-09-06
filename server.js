const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",       // your MySQL username
    password: "alex@elumban2",       // your MySQL password
    database: "userdb", // make sure this database exists
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error("❌ MySQL connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL");
});

// ✅ Signup API
app.post("/api/signup", (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!identifier || !identifier || !phone || !password) {
        return res.json({ success: false, message: "All fields are required" });
    }

    const sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, phone, password], (err) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.json({ success: false, message: "User already exists!" });
            }
            return res.json({ success: false, message: "Error: " + err.message });
        }
        res.json({ success: true, message: "User registered successfully!" });
    });
});

// ✅ Login API
app.post('/api/login', (req, res) => { 
    const { identifier, password } = req.body; 
    if (!identifier || !password) {
         return res.json({ success: false, message: "Email and password are required" }); 
        } 
        const sql = "SELECT * FROM users WHERE (email = ? OR name = ?) AND password = ?"; 
        db.query(sql, [identifier, identifier,, password], (err, results) => {
             if (err) return res.json({ success: false, message: err.message }); 
             if (results.length > 0) { res.json({ success: true, message: "Login successful!" }); 
            } else { res.json({ success: false, message: "Invalid credentials!" }); 
        } 
    }); 
});


// ✅ Fetch all users
app.get("/api/users", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) return res.json({ success: false, message: err.message });
        res.json({ success: true, users: results });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:5000`);
});
