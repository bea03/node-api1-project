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

server.get(`/api/users/:id`, (req, res) => {
    const id = req.params.id;
   dataDB.findById(id)
   .then(user => {
       if(!user){
        res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
       }else{
           res.status(200).json(user);
       }
   })
   .catch(error => {
       res.status(500).json({ error: "The user information could not be retrieved." });
   });
});

server.delete(`/api/users/:id`, (req, res) => {
    const id = req.params.id;
    dataDB.remove(id)
   .then(user => {
       if(!user){
        res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
       }else{
           res.status(200).json(user);
       }
   })
   .catch(error => {
       res.status(500).json({ error: "The user could not be removed" });
   });
});

server.put(`/api/users/:id`, (req, res) => {
    const id = req.params.id;
    const changes = req.body;
   
    dataDB.update(id, changes)
    .then(user => {
        if(!user){
            res.status(404).json({
                message: "The user with the specified ID does not exist."
              });
        } else if(!changes.name || !changes.bio) {
            res.status(400).json({
                errorMessage: "Please provide name and bio for the user."
              }); 
        } else {
            res.status(200).json(changes);
        }
    })

})


const port = 8000;
server.listen(port, () => console.log(`\n** API on port ${port} **\n`));