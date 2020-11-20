const express = require('express');
const bodyParser = require('body-parser');

let db = require('./db')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/operations', function (req, res) {
    res.set('Access-Control-Allow-Origin', '*')
    db.get().collection('historyOperations').find().toArray(function (err, docs) {
        if (err) {
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(docs)
    })
})

app.options('*', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.send('ok');
});

app.post('/operations', function (req, res) {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    const operation = {
        date: new Date().toLocaleString(),
        operation: req.body.operation
    };
    db.get().collection('historyOperations').insert(operation, function (err, result) {
        if (err) {
            console.log(err)
            return res.sendStatus(500)
        }
        res.send(operation)
    })
})

app.delete('/operations', function (req, res) {
    db.get().collection('historyOperations').remove({}, function (err, result) {
        if (err) {
            console.log(err)
            return res.sendStatus(500)
        }
        res.sendStatus(200)
    })
})

db.connect('mongodb://localhost:27017/api', function (err) {
    if (err) {
        return console.log(err)
    }
    app.listen(3012, function () {
        console.log('My API is Working!')
    })
})