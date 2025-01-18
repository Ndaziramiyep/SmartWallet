const  express = require("express");
const mysql = require("mysql");

const app=express();

app.get('/', (req,res) =>{
res.send("Hello Everyone!");
});

const Port =process.env.port || 8080;
app.listen(Port, () =>{
console.log(`app is running on http://localhost:${Port}`)
 }
);