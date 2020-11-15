const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

let credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
let connection = mysql.createConnection(credentials);
connection.connect();

function rowToObject(row) {
    return {
        amount: row.amount,
        cateogry: row.category,
        description: row.description,
        year: row.year,
        month: row.month,
        day: row.day,
        increase: row.increase,
    };
}

// Query for getting sum spent in a specific month
app.get('/budget/sum/:month/:year', (request, response) => {
    const query = 'SELECT SUM(amount) WHERE is_deleted = 0 AND month = ? AND year = ? FROM budget';
    const params = [request.params.month, request.params.year];
    connection.query(query, params, (error, rows) => {
        response.send({
            ok: true,
            budget: rows[0], // check to make sure that this contains result
        });
    })
});

// Query for getting amount spent in a year
app.get('/budget/sum/:year', (request, response) => {
    const query = 'SELECT SUM(amount) WHERE is_deleted = 0 AND year = ? FROM budget';
    const params = [request.params.year];
    connection.query(query, params, (error, rows) => {
        response.send({
            ok: true,
            budget: rows[0], // check to make sure that this contains result
        });
    })
});

// Query for amount spent on specific categories in a month
app.get('/budget/sum/:month/:year/:category', (request, response) => {
    const query = 'SELECT SUM(amount) WHERE is_deleted = 0 AND month = ? AND year = ? GROUP BY category FROM budget';
    const params = [request.params.year];
    connection.query(query, params, (error, rows) => {
        response.send({
            ok: true,
            // budget: 
        });
    })
});

app.get('/budget/:year', (request, response) => {
    const query = 'SELECT * WHERE is_deleted = 0 AND year = ? ORDER BY month, day FROM budget';
    const params = [request.params.year];
    connection.query(query, params, (error, rows) => {
        response.send({
            ok: true,
            budget: rows.map(rowToObject),
        });
    })
});

app.post('/budget', (request, response) => {
    const query = 'INSERT INTO budget(amount, category, description, year, month, day, increase) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const params = [request.body.amount, request.body.category, request.body.description, request.body.year, request.body.month, request.body.day, request.body.increase];
    connection.query(query, params, (error, result) => {
        response.send({
            ok: true,
            id: result.insertId,
        });
    })
});


const port = 3443;
app.listen(port, () => {
    console.log(`We're live on port ${port}`);
});