const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
const PORT = process.env.PORT || 3306;
require('dotenv').config();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
const db = mysql.createConnection({
    host:process.env.HOST_NAME,
    user:process.env.USER_NAME,
    password:process.env.PASSWORD,
    database:process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL');
});

// Routes
// Home Page
app.get('https://smartwallet.onrender.com/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Transactions Page

// Add a new transaction
app.post('https://smartwallet.onrender.com/transactions', (req, res) => {
    const { accountType, amount, transactionType, category, subcategory } = req.body;
    const query = `INSERT INTO transaction (accountType, amount, transactionType, category, subcategory, date)
                   VALUES (?, ?, ?, ?, ?, NOW())`;
    db.query(query, [accountType, amount, transactionType, category, subcategory], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding transaction', error: err });
        }
        res.json({ message: 'Transaction added successfully' });
    });
});

// Retrieve all transactions grouped by account
app.get('https://smartwallet.onrender.com/transactions', (req, res) => {
    const query = `SELECT accountType, transactionType, SUM(amount) AS totalAmount
                   FROM transaction
                   GROUP BY accountType, transactionType
                   ORDER BY accountType, transactionType`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching transactions', error: err });
        }
        res.json(results);
    });
});

// Retrieve all individual transactions
app.get('https://smartwallet.onrender.com/transactions/all', (req, res) => {
    const query = 'SELECT * FROM transaction ORDER BY date DESC';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching transactions', error: err });
        }
        res.json(results);
    });
});


// Reports Page (by date range)
app.get('https://smartwallet.onrender.com/reports', (req, res) => {
    const { startDate, endDate } = req.query;
    const query = 'SELECT * FROM transaction WHERE date BETWEEN ? AND ?';
    db.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }
        res.json(results);
    });
});

// Get all categories and subcategories
app.get('https://smartwallet.onrender.com/categories', (req, res) => {
    const query = 'SELECT DISTINCT category, subcategory FROM transaction ORDER BY category, subcategory';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching categories', error: err });
        }
        res.json(results);
    });
});

// Add a new transaction with category and subcategory
app.post('https://smartwallet.onrender.com/transactions', (req, res) => {
    const { accountType, amount, transactionType, category, subcategory } = req.body;
    const query = `INSERT INTO transaction (accountType, amount, transactionType, category, subcategory, date)
                   VALUES (?, ?, ?, ?, ?, NOW())`;
    db.query(query, [accountType, amount, transactionType, category, subcategory], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding transaction', error: err });
        }
        res.json({ message: 'Transaction added successfully' });
    });
});

// Retrieve transactions grouped by category
app.get('https://smartwallet.onrender.com/transactions/by-category', (req, res) => {
    const query = `
        SELECT category, subcategory, SUM(amount) AS totalAmount, transactionType
        FROM transaction
        GROUP BY category, subcategory, transactionType
        ORDER BY category, subcategory
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching transactions by category', error: err });
        }
        res.json(results);
    });
});


// Budget Page

// Set a budget
app.post('https://smartwallet.onrender.com/budget', (req, res) => {
    const { mlimit } = req.body;
    const query = 'INSERT INTO budget (mlimit) VALUES (?) ON DUPLICATE KEY UPDATE mlimit = VALUES(mlimit)';
    db.query(query, [mlimit], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error setting budget', error: err });
        }
        res.json({ message: 'Budget updated successfully' });
    });
});

// Check budget notification
app.get('https://smartwallet.onrender.com/budget/notification', (req, res) => {
    const budgetQuery = 'SELECT mlimit FROM budget ORDER BY id DESC LIMIT 1';
    const spendingQuery = 'SELECT SUM(amount) AS totalSpending FROM transaction WHERE transactionType = "expense"';

    db.query(budgetQuery, (err, budgetResults) => {
        if (err) return res.status(500).json({ message: 'Error fetching budget', error: err });
        const mlimit = budgetResults[0]?.mlimit || 0;

        db.query(spendingQuery, (err, spendingResults) => {
            if (err) return res.status(500).json({ message: 'Error fetching spending', error: err });
            const totalSpending = spendingResults[0]?.totalSpending || 0;
            const notify = totalSpending > mlimit;
            res.json({ mlimit, totalSpending, notify });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
