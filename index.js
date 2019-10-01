// implement your API here

//imports
const express = require('express');
const dataDB = require('./data/db.js');

//create a server
const server = express();

//teach express how to read json from body this is middleware
server.use(express.json());

//request handlers
server.post('/api/users', (req, res) => {
    const userData = req.body;

    if(!userData.name || !userData.bio){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }else{
        dataDB.insert(userData)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the user to the database" });
        });
    }
});

server.get('/api/users', (req, res) => {
    dataDB.find()
    .then(users => {
        res.send(users);
    }).catch(error => {
        res.status(500).json({ error: "The users information could not be retrieved." });
    });
});




const port = 8000;
server.listen(port, () => console.log(`\n** API on port ${port} **\n`));