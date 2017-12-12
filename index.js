const express = require('express'),
 	  bodyParser = require('body-parser'),
 	  cors = require('cors'),
 	  passport = require('passport'),
 	  port = process.env.PORT || 5000,
 	  app = express();

const databases = require('./databases');
const routes = require('./routes');

// Databases.
databases.mongodb();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());

app.use('/', routes);

app.listen(port, ()=>{
  console.log('🌐  API is running on port ', port);
});