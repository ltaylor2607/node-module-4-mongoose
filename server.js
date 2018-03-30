const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/edx-course-db');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorhandler = require('errorhandler');

app.use(bodyParser.json());

app.use(logger('dev'));

app.use(errorhandler());

const Account = mongoose.model('Account', {
    name: String,
    balance: Number
});

app.get('/accounts', (req, res) => {
    Account.find((err, accounts) => {
        if (err) {
            res.status(500);
        } 
        res.status(200).send(accounts);
    });
});

app.post('/accounts', (req, res) => {
    var account = new Account(req.body);
    account.save((err) => {
        if (err) {
            res.status(500);
        }
        res.status(201).send(account._id);
    }); 
});

app.put('/accounts/:id', (req, res) => {
    const id = req.params.id;
    Account.findById(id, (err, account) => {
        if (err) {
            res.status(500);
        }
        account.update(req.body, (err) => {
            if (err) {
                res.status(500);
            }
            res.status(200).send(account);
        });
    });
});

app.delete('/accounts/:id', (req, res) => {
    const id = req.params.id;
    Account.remove({_id: id}, (err) => {
        if (err) {
            res.status(500);
        }
        console.log("Successfully deleted: " + err);
        res.status(204).send();
    });
});

app.listen(3000);