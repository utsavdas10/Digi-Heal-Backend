require('dotenv').config();
const mysql = require('mysql');
const HttpError = require('../models/http-error');

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'Digi_Heal',
});



const getUser = async (req, res, next) => {
    const email = req.params.email;

    const sql = `SELECT * FROM users WHERE email = '${email}'`;
    try {
        db.query(sql, (err, result) => {
            if (!result || result.length === 0) {
                const error = new HttpError('Could not find user for the provided email', 404);
                return next(error);
            }
            result[0].password = null;
            res.json({ 
                user: result[0]
            });
        });
    } 
    catch (err) {
        const error = new HttpError('Could not fetch user', 500);
        return next(error);
    }

};


// Define the function for handling health metrics
const getHealthMetrics = async (req, res, next) => {
    const  email  = req.params.email;

    const sql = `SELECT * FROM health_metrics WHERE email = '${email}'`;
    try {
        db.query(sql, (err, result) => {
            if (!result || result.length === 0) {
                const error = new HttpError('Could not find health metrics for the provided email', 404);
                return next(error);
            }
            res.json({ 
                health_metrics: result 
            });
        });
    } 
    catch (err) {
        const error = new HttpError('Could not fetch health metrics', 500);
        return next(error);
    }

};

    
const postHealthMetrics = async (req, res, next) => {
    const {
        email,
        height,
        weight,
        bp,
        cholesterol
    } = req.body;

    let sql = `SELECT * FROM health_metrics WHERE email = '${email}'`
    try {
        db.query(sql, (err, result) => {
            if (result.length === 0) {
                sql = `INSERT INTO health_metrics (email, height, weight, bp, cholesterol) VALUES ('${email}', '${height}', '${weight}', '${bp}', '${cholesterol}')`;
                try {
                    db.query(sql, (err, result) => {

                        if (!result || result.length === 0) {
                            const error = new HttpError('Could not post nutrition data', 404);
                            return next(error);
                        }

                        res.status(200).json({
                            message: "Health metrics posted successfully",
                            result: result
                        });
                    });
                } 
                catch (err) {
                    const error = new HttpError('Could not post health metrics', 500);
                    return next(error);
                }
            }
            else {
                sql = `UPDATE health_metrics SET height = '${height}', weight = '${weight}', bp = '${bp}', cholesterol = '${cholesterol}' WHERE email = '${email}'`;
                try {
                    db.query(sql, (err, result) => {
                        res.status(200).json({
                            message: "Health metrics posted successfully",
                            result: result
                        });
                    });
                } 
                catch (err) {
                    const error = new HttpError('Could not post health metrics', 500);
                    return next(error);
                }
            }
        });
    }
    catch (err) {
        const error = new HttpError('Could not post health metrics', 500);
        return next(error);
    }

};




// Define the function for handling nutrition data
const getNutritionData = async (req, res, next) => {
    const email  = req.params.email;

    const sql = `SELECT * FROM nutritions WHERE email = '${email}'`;
    try {
        db.query(sql, (err, result) => {
            if (!result || result.length === 0) {
                const error = new HttpError('Could not find nutrition data for the provided email', 404);
                return next(error);
            }
            res.json({ 
                nutrition_data: result 
            });
        });
    } 
    catch (err) {
        const error = new HttpError('Could not fetch nutrition data', 500);
        return next(error);
    }

};


const postNutritionData = async (req, res, next) => {
    const {
        email,
        food,
        calories,
        date,
        time
    } = req.body;


    const query = `INSERT INTO nutritions (email, food, calories, date, time) VALUES ('${email}', '${food}', '${calories}', '${date}', '${time}')`;
    try {
        db.query(query, (err, result) => {

            if (!result || result.length === 0) {
                const error = new HttpError('Could not post nutrition data', 404);
                return next(error);
            }

            res.status(200).json({
                message: "Nutrition data posted successfully",
                result: result
            });
        });
    }
    catch (err) {
        const error = new HttpError('Could not post nutrition data', 500);
        return next(error);
    }

};




// Define the function for handling workout data
const getWorkoutData = async (req, res, next) => {
    const email  = req.params.email;

    const sql = `SELECT * FROM workouts WHERE email = '${email}'`;
    try {
        db.query(sql, (err, result) => {
            if (!result || result.length === 0) {
                const error = new HttpError('Could not find workout data for the provided email', 404);
                return next(error);
            }
            res.json({ 
                workout_data: result 
            });
        });
    } 
    catch (err) {
        const error = new HttpError('Could not fetch workout data', 500);
        return next(error);
    }
    
};


const postWorkoutData = async (req, res, next) => {
    const {
        email,
        type,
        date,
        duration
    } = req.body;

    const query = `INSERT INTO workouts (email, type, date, duration) VALUES ('${email}', '${type}', '${date}', '${duration}')`;

    try {
        db.query(query, (err, result) => {

            if (!result || result.length === 0) {
                const error = new HttpError('Could not post nutrition data', 404);
                return next(error);
            }
            res.status(200).json({
                message: "Workout data posted successfully",
                result: result
            });
        });
    }
    catch (err) {
        const error = new HttpError('Could not post workout data', 500);
        return next(error);
    }

};




// Define the function for handling progress
const getProgress = async (req, res, next) => {
    const email  = req.params.email;

    const sql = `SELECT * FROM progress WHERE email = '${email}'`;
    try {
        db.query(sql, (err, result) => {
            if (!result || result.length === 0) {
                const error = new HttpError('Could not find progress for the provided email', 404);
                return next(error);
            }
            res.json({ 
                progress: result 
            });
        });
    } 
    catch (err) {
        const error = new HttpError('Could not fetch progress', 500);
        return next(error);
    }
    
};


const setGoal = async (req, res, next) => {
    let {
        email,
        name,
        goal
    } = req.body;

    goal = parseInt(goal);

    let sql = `SELECT * FROM progress WHERE email = '${email}'`
    try {
        db.query(sql, (err, result) => {
            if (result.length === 0) {
                sql = `INSERT INTO progress (email, name, goal) VALUES ('${email}', '${name}', '${goal}')`;
                try {
                    db.query(sql, (err, resu) => {

                        if (!resu || resu.length === 0) {
                            const error = new HttpError('Could not set goal', 404);
                            return next(error);
                        }

                        res.status(200).json({
                            message: "Goal set successfully",
                            result: resu
                        });
                    });
                } 
                catch (err) {
                    const error = new HttpError('Could not set goal', 500);
                    return next(error);
                }
            }
            else {
                if (result[0].current === result[0].goal) {
                    sql = `UPDATE progress SET name = '${name}', goal = '${goal}', current = '0' WHERE email = '${email}'`;
                    try {
                        db.query(sql, (err, resu) => {

                            if (!resu || resu.length === 0) {
                                const error = new HttpError('Could not update goal', 404);
                                return next(error);
                            }

                            res.status(200).json({
                                message: "Goal updated successfully",
                                result: resu
                            });
                        });
                    } 
                    catch (err) {
                        const error = new HttpError('Could not update goal', 500);
                        return next(error);
                    }
                }
                else {
                    res.status(500).json({
                        message: "Finish your current goal first"
                    });
                }
            }
        });
    }
    catch (err) {
        const error = new HttpError('Could not set/update goal', 500);
        return next(error);
    }
};


const setProgress = async (req, res, next) => {
    let {
        email,
        current
    } = req.body;

    current = parseInt(current);

    let sql = `SELECT * FROM progress WHERE email = '${email}'`
    try {
        db.query(sql, (err, result) => {
            if (result.length === 0) {
                const error = new HttpError('Goal not set', 404);
                return next(error);
            }
            else if (result[0].goal === null) {
                const error = new HttpError('Goal not set', 404);
                return next(error);
            }
            else if (result[0].current === null || result[0].current === 0) {
                if (current >= result[0].goal) {
                    sql = `UPDATE progress SET current = '${result[0].goal}' WHERE email = '${email}'`;
                    try {
                        db.query(sql, (err, resu) => {

                            if (!resu || resu.length === 0) {
                                const error = new HttpError('Could not update progress', 404);
                                return next(error);
                            }
                            res.status(200).json({
                                message: "Hoorahh! You have reached your goal! Hope you set a new one!",
                                result: resu
                            });
                        });
                    }
                    catch (err) {
                        const error = new HttpError('Could not update progress', 500);
                        return next(error);
                    }
                }
                else {
                    sql = `UPDATE progress SET current = '${current}' WHERE email = '${email}'`;
                    try {
                        db.query(sql, (err, resu) => {
                            if (!resu || resu.length === 0) {
                                const error = new HttpError('Could not set progress', 404);
                                return next(error);
                            }

                            res.status(200).json({
                                message: "Progress set successfully",
                                result: resu
                            });
                        });
                    } 
                    catch (err) {
                        const error = new HttpError('Could not set progress', 500);
                        return next(error);
                    }
                }
            }
            else {
                const new_current = result[0].current + current;
                if (new_current >= result[0].goal) {
                    const goal = result[0].goal;
                    sql = `UPDATE progress SET current = '${goal}' WHERE email = '${email}'`;
                    try {
                        db.query(sql, (err, resu) => {

                            if (!resu || resu.length === 0) {
                                const error = new HttpError('Could not update progress', 404);
                                return next(error);
                            }
                            res.status(200).json({
                                message: "Hoorahh! You have reached your goal! Hope you set a new one!",
                                result: resu
                            });
                        });
                    } 
                    catch (err) {
                        const error = new HttpError('Could not update progress', 500);
                        return next(error);
                    }
                }
                else {
                    sql = `UPDATE progress SET current = '${new_current}' WHERE email = '${email}'`;
                    try {
                        db.query(sql, (err, resu) => {
                            if (!resu || resu.length === 0) {
                                const error = new HttpError('Could not update progress', 404);
                                return next(error);
                            }
                            res.status(200).json({
                                message: "Progress updated successfully",
                                result: resu
                            });
                        });
                    } 
                    catch (err) {
                        const error = new HttpError('Could not update progress', 500);
                        return next(error);
                    }
                }
            }
        });
    }
    catch (err) {
        const error = new HttpError('Could not set/update progress', 500);
        return next(error);
    }
};




// Export the functional controller object
module.exports = {
    getUser,
    getHealthMetrics,
    postHealthMetrics,
    getNutritionData,
    postNutritionData,
    getWorkoutData,
    postWorkoutData,
    getProgress,
    setGoal,
    setProgress
}
