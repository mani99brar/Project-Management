const express = require('express');
const colors = require('colors');
const cors = require('cors');
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const port = process.env.PORT || 5000;
const schema = require('./schema/schema.js');
const app = express();
const connectDB = require('./config/db');

connectDB();

app.use(cors());
app.use('/graphql',graphqlHTTP({
    schema : schema,
    graphiql:process.env.NODE_ENV === 'development'
}));



app.listen(port,console.log(`Server is running on ${port}`));