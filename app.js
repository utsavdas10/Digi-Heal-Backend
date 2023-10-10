const express = require('express');
const app = express();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'utsavdas10',
    database: 'Digi_Heal',
    insecureAuth : true
});


const HttpError = require('./models/http-error');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth-routes');
const functionalRoutes = require('./routes/functional-routes');


// Body parser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow access to any domain
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    ); // Allow these headers
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); // Allow these methods
    next();
});


// Routes middleware initialization
app.use('/api/auth', authRoutes );
app.use('/api/functional', functionalRoutes );


// Page not found middleware
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error; 
});

// Error handling middleware
app.use((error, req, res, next) => {
    // Checking if the response has already been sent
    if(res.headerSent){
        return next(error);
    }
    // Sending the error
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});

const port = process.env.PORT || 8000;

connection.connect((err) => {
    if (err) throw err;
    app.listen(port, () => {
        console.log('Your app listening on port 8000!');
        }
    );
}); 
