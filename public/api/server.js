const express = require('express');
const mysql = require('mysql');
const mysqlcredentials = require('./mysqlcreds.js');
const cors = require('cors');
const PORT = process.env.PORT || 3001;

const server = express();
const db = mysql.createConnection(mysqlcredentials);

server.use(cors());
server.use(express.json());

server.get('/api/groceries', (req, res) => {
    db.connect(() => {
        const query = 'SELECT * FROM `grocery`';

        db.query(query, (error, result) => {
            const output = {
                success: false
            };

            if(!error){
                output.success = true;
                output.data = result;
            } else {
                output.error = error;
            }

            res.send(output);
        });
    });
});

server.post('/api/groceries', (req, res) => {
    const {item, store, unit_price, unit} = req.body;
    const output = {
        success: false
    };

    if(item === undefined || store === undefined || unit_price === undefined || unit === undefined){
        output.error = 'Error: a field is blank';
        res.send(output);
        return;
    }

    db.connect(() => {
        const query = 'INSERT INTO `grocery` SET `completed` = 0, `item`= ?, `store`= ?, `unit_price`= ?, `unit`= ?, `added`=NOW()';

        db.query(query, [item, store, unit_price, unit], (error, result) => {
            if(!error){
                output.success = true;
                output.new_id = result.insertId;
            } else {
                output.error = error;
            }

            res.send(output);
        });
    });
});

server.put('/api/groceries', (req, res) => {
    const {id, item, store, unit_price, unit} = req.body;
    const output = {
        success: false
    };

    if(item === undefined || store === undefined || unit_price === undefined || unit === undefined) {
        output.error = 'Error: a field is blank';
        res.send(output);
        return;
    } else if(id === undefined) {
        output.error = 'Error: must provide an id to update';
        res.send(output);
        return;
    }

    db.connect(() => {
        const query = 'UPDATE `grocery` SET `item`= ?, `store`= ?, `unit_price`= ?, `unit`= ? WHERE `id` =' + id;

        db.query(query, [item, store, unit_price, unit], (error, result) => {
            if(!error){
                output.success = true;
            } else {
                output.error = error;
            }

            res.send(output);
        });
    });
});

server.put('/api/checkbox', (req, res) => {
    const {id, completed} = req.body;
    const output = {
        success: false
    };

    if(completed === undefined){
        output.error = 'Error: checkbox not found';
        res.send(output);
        return;
    } else if(id === undefined) {
        output.error = 'Error: must provide an id to update';
        res.send(output);
        return;
    }

    db.connect(() => {
        const query = 'UPDATE `grocery` SET `completed`=' + completed + ' WHERE `id` =' + id;

        db.query(query, (error, result) => {
            if(!error){
                output.success = true;
            } else {
                output.error = error;
            }

            res.send(output);
        });
    });
});

server.delete('/api/groceries/:grocery_id', (req, res) => {
    const {grocery_id} = req.params;
    const output = {
        success: false
    };

    if(grocery_id === undefined){
        output.error = 'Error: must provide an id to delete';
        res.send(output);
        return;
    }

    db.connect(() => {
        const query = 'DELETE FROM `grocery` WHERE `id`=' + req.params.grocery_id;

        db.query(query, (error, result) => {
            if(!error){
                output.success = true;
            } else {
                output.error = error;
            }

            res.send(output);
        });
    });
});

server.listen(PORT, ()=>{
    console.log('carrier has arrived on port', PORT);
});
