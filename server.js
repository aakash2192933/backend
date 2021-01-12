require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Replace with your connection string
const connString = process.env.CONNECTION_STRING;

mongoose.connect(connString, 
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    poolSize: 10,
  }
);

//routes
app.use('/user', require('./api/user/routes/userRoutes'));
app.use('/jsonPatch', require('./api/jsonPatch/routes/jsonPatchRoutes'));
app.use('/imageOperations', require('./api/imageOperations/routes/imageOperationsRoutes'));

mongoose.connection.on('error', (mongoErr) => {
    process.stdout.write(`MongoDB Error: - ${mongoErr}\n`);
    process.exit(1);
});

mongoose.connection.on('connected', () => {
    app.listen(port, (err) => {
      if (err) {
        process.stdout.write(`Error : ${err}\n`);
        process.exit(-1);
      } else {
        process.stdout.write(`Server is running on port: ${port}\n`);
      }
    });
});