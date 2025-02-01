// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
require('./config/conn')
const cors = require('cors');
const routes = require('./routes/route');

//=====================================

const app = express();
app.use(cors());
// app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    try {
      res.status(200).send('Hello World');
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

// Use the routes
app.use('/api', routes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
