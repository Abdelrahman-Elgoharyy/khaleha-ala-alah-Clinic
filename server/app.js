const express = require('express');
const morgan = require('morgan');
const cors = require('cors');


const app = express();


const patientRouter = require('./routes/patientRoutes');

//1) middleware
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}

app.use(express.json()) // middleware is function to modify incoming requested data 
app.use(express.static(`${__dirname}/public`)); // to serve static files
app.use(cors()); // to allow all cors requests

//2) routes 

app.use('/api/v1/patients',patientRouter);
app.use('/users', require('./routes/userRoute'));


module.exports = app