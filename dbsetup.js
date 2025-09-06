const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",       // your MySQL username
    password: "alex@elumban2",       // your MySQL password (set during installation, empty if none)
    port: 3306
});

// ✅ Connect and setup database
db.connect(err => {
    if (err) {
        console.error("❌ MySQL connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL");

    // Create database if not exists
    db.query("CREATE DATABASE IF NOT EXISTS userdb", (err) => {
        if (err) throw err;
        console.log("✅ Database ready");

        // Switch to database
        db.changeUser({ database: "userdb" }, (err) => {
            if (err) throw err;

            // Create table if not exists
            const createTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100),
                    email VARCHAR(100) UNIQUE,
                    phone VARCHAR(20),
                    password VARCHAR(255)
                )
            `;
            db.query(createTable, (err) => {
                if (err) throw err;
                console.log("✅ Users table ready");
            });
        });
    });
});

// ✅ Signup API (store user data)
app.post("/api/signup", (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
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

// ✅ Login API (check user data using email or name)
app.post("/api/login", (req, res) => {
    const { identifier, password } = req.body; // identifier can be email or name

    if (!identifier || !password) {
        return res.json({ success: false, message: "Email/Name and password are required" });
    }

    // SQL query checks if either email OR name matches the identifier
    const sql = "SELECT * FROM users WHERE (email = ? OR name = ?) AND password = ?";
    db.query(sql, [identifier, identifier, password], (err, results) => {
        if (err) {
            return res.json({ success: false, message: "Error: " + err.message });
        }
        if (results.length > 0) {
            res.json({ success: true, message: "Login successful!" });
        } else {
            res.json({ success: false, message: "Invalid credentials!" });
        }
    });
});


// ✅ Start server
app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
});
