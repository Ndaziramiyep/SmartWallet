const  express = require("express");
const mysql = require("mysql");

const app=express();
// database
CREATE DATABASE wallet;

USE wallet;

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    accountType VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transactionType ENUM('income', 'expense') NOT NULL,
    category VARCHAR(255),
    subcategory VARCHAR(255),
    date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE budget (
    id INT AUTO_INCREMENT PRIMARY KEY,
    limit DECIMAL(10, 2) NOT NULL
);





app.get('/', (req,res) =>{
res.send("Hello Everyone!");
});

const Port =process.env.port || 8080;
app.listen(Port, () =>{
console.log(`app is running on http://localhost:${Port}`)
 }
);