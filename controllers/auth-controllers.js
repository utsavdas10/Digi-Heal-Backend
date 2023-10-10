require('dotenv').config();

const mysql = require('mysql');
const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

// create connection to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'Digi_Heal',
});


// handle user signup
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    // insert user into database
    const user = { name, email, password};

    let sql = `SELECT * FROM users WHERE email = '${email}'`;

    try {
        db.query(sql, (err, result) => {
            if (result.length !== 0) {
                return res.status(409).json({ message: 'User already exists' });
            }
        });
    }
    catch(err) {
        const error = new HttpError('Signing up failed, please try again later', 500);
        return next(error);
    }

    try {
        db.query('INSERT INTO users SET ?', user, (err, result) => {
            if (err) {
                return res.status(500).json({ message: err });
            }

            let token;
            try{
                token = jwt.sign(
                    {userId: email},
                    process.env.JWT_KEY,
                    {expiresIn: '720h'}
                );
            }
            catch (err) {
                const error = new HttpError('Registered but failed to generate token, try logging in', 500);
                return next(error)    
            }

            return res.status(201).json({ 
                message: 'User created successfully',
                token: token
            });
        });
    }
    catch(err) {
        const error = new HttpError('Signing up failed, please try again later', 500);
        return next(error);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // fetch user from database
    try {
        db.query('SELECT * FROM users WHERE email = ?', email, (err, result) => {
            if (err) {
                return res.status(500).json({ message: err });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (result[0].password !== password) {
                return res.status(401).json({ message: 'Incorrect password' });
            }

            let token;
            try{
                token = jwt.sign(
                    {userId: email},
                    process.env.JWT_KEY,
                    {expiresIn: '720h'}
                );
            }
            catch (err) {
                const error = new HttpError('Registered but failed to generate token, try logging in', 500);
                return next(error)    
            }

            return res.status(200).json({ 
                message: 'User logged in successfully',
                token: token
            });
        });
    }
    catch(err) {
        const error = new HttpError('Logging in failed, please try again later', 500);
        return next(error);
    }
};

module.exports = { 
    signup,
    login
};
