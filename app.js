const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wallet',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL');
});

// Routes
// Render home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Add a transaction
app.post('/transactions', (req, res) => {
    const { accountType, amount, transactionType, category, subcategory } = req.body;
    const query = 'INSERT INTO transactions (accountType, amount, transactionType, category, subcategory, date) VALUES (?, ?, ?, ?, ?, NOW())';
    db.query(query, [accountType, amount, transactionType, category, subcategory], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.redirect('/transactions');
    });
});

// Get all transactions
app.get('/transactions', (req, res) => {
    const query = 'SELECT * FROM transactions';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json(results);
    });
});

// Generate report by date range
app.get('/reports', (req, res) => {
    const { startDate, endDate } = req.query;
    const query = 'SELECT * FROM transactions WHERE date BETWEEN ? AND ?';
    db.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json(results);
    });
});

// Set budget
app.post('/budget', (req, res) => {
    const { limit } = req.body;
    const query = 'INSERT INTO budget (limit) VALUES (?) ON DUPLICATE KEY UPDATE limit = VALUES(limit)';
    db.query(query, [limit], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.redirect('/budget');
    });
});

// Check budget notification
app.get('/budget/notification', (req, res) => {
    const budgetQuery = 'SELECT limit FROM budget ORDER BY id DESC LIMIT 1';
    const spendingQuery = 'SELECT SUM(amount) as totalSpending FROM transactions WHERE transactionType = "expense"';

    db.query(budgetQuery, (err, budgetResults) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        const budget = budgetResults[0]?.limit || 0;

        db.query(spendingQuery, (err, spendingResults) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            const totalSpending = spendingResults[0]?.totalSpending || 0;
            const notify = totalSpending > budget;
            res.json({ notify, budget, totalSpending });
        });
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
