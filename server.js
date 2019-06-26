const express = require('express');
const path = require('path');
const app = express();
const { models, syncAndSeed } = require('./db');
const { User } = models;

const port = process.env.PORT || 3000;

app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/users', async(req, res, next)=> {
  console.log('am i here');
  try {
    res.send(await User.findAll({
      include: [{ model: User, as: 'manager'}]
    }));
  }
  catch(ex){
    next(ex);
  }
});

app.listen(port, ()=> console.log(`listening on port ${port}`));

syncAndSeed();
