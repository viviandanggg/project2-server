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

function rowToStatementObject(row) {
    return {
        id: row.id,
        amount: row.amount,
        category: row.category,
        description: row.description,
        year: row.year,
        month: row.month,
        day: row.day,
        increase: row.increase,
    };
}

function rowToSumObject(row) {
    return {
        sum: row.sum,
    };
}
/*
// Query for getting sum spent in a specific month
app.get('/statements/sum/:month/:year', (request, response) => {
    const query = 'SELECT SUM(amount) WHERE is_deleted = 0 AND month = ? AND year = ? FROM budget';
    const params = [request.params.month, request.params.year];
    connection.query(query, params, (error, rows) => {
        response.send({
            ok: true,
            statements: rows[0], // check to make sure that this contains result
        });
    })
});

// Query for getting amount spent in a year
app.get('/statements/sum/:year', (request, response) => {
    const query = 'SELECT SUM(amount) WHERE is_deleted = 0 AND year = ? FROM budget';
    const params = [request.params.year];
    connection.query(query, params, (error, rows) => {
        response.send({
            ok: true,
            statements: rows[0], // check to make sure that this contains result
        });
    })
});

// Query for amount spent on specific categories in a month
app.get('/statements/sum/:month/:year/:category', (request, response) => {
    const query = 'SELECT SUM(amount) WHERE is_deleted = 0 AND month = ? AND year = ? GROUP BY category FROM budget';
    const params = [request.params.year];
    connection.query(query, params, (error, rows) => {
        response.send({
            ok: true,
            // statement: 
        });
    })
});
*/

app.get('/statements/sum/:year', (request, response) => {
    const query = 'SELECT deposit - withdrawal as "sum" FROM (SELECT SUM(amount) as withdrawal FROM budget WHERE increase=0 AND is_deleted = 0 AND year=?) as a, (SELECT SUM(amount) as deposit FROM budget WHERE increase=1 AND is_deleted = 0 AND year=?) as b';
    const params = [request.params.year, request.params.year];
    connection.query(query, params, (error, rows) => {
        response.send({
            ok: true,
            budget: rows.map(rowToSumObject),
        });
    })
});

app.get('/statements/:year', (request, response) => {
    const query = 'SELECT * FROM budget WHERE is_deleted = 0 AND year = ? ORDER BY month DESC, day DESC, id DESC';
    const params = [request.params.year];
    connection.query(query, params, (error, rows) => {
        response.send({
            ok: true,
            budget: rows.map(rowToStatementObject),
        });
    })
});

app.post('/statements', (request, response) => {
    const query = 'INSERT INTO budget(amount, category, description, year, month, day, increase) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const params = [request.body.amount, request.body.category, request.body.description, request.body.year, request.body.month, request.body.day, request.body.increase];
    connection.query(query, params, (error, result) => {
        response.send({
            ok: true,
            id: result.insertId,
        });
    })
});

app.patch('/statements/:id', (request, response) => {
    const query = "UPDATE budget SET amount = ?, category =?, description =?, year = ?, month = ?, day = ?, increase = ? WHERE id = ?";
    const params = [request.body.amount, request.body.category, request.body.description, request.body.year, request.body.month, request.body.day, request.body.increase, request.params.id];
    connection.query(query, params, (error, result) => {
        response.send({
            ok: true,
        });
    })
});

app.delete('/statements/:id', (request, response) => {
    const query = "UPDATE budget SET is_deleted = 1 WHERE id = ?";
    const params = [request.params.id];
    connection.query(query, params, (error, result) => {
        response.send({
            ok: true,
        });
    })
});

const port = 3443;
app.listen(port, () => {
    console.log(`We're live on port ${port}`);
});
