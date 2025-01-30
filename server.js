// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('./config/conn')
const routes = require('./routes/route');


const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send("Hello !")
});

// Use the routes
app.use('/api', routes);

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
