const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

require('dotenv').config(); // this loads the defined variables from .env

// Connect
const connection = (closure) => {
    return oracledb.getConnection({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_CONNECTION_STRING
    }, (err, client) => {
        if (err) return console.log(err);

        closure(client);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get movies
router.get('/movies', (req, res) => {
    connection((db) => {
        db.execute(
            `SELECT title, revenue
            FROM MOVIE
            ORDER BY revenue DESC
            FETCH FIRST 12 ROWS ONLY`,
            []
        ).then((movies) => {
            movielist = [];
            console.log(movies);
            for (let movie of movies.rows) {
                movieData = {};
                for (let i = 0; i < movies.metaData.length; i++) {
                    const datapoint = movies.metaData[i];
                    movieData[datapoint.name.toLowerCase()] = movie[i]
                }
                movielist.push(movieData)
            }
            response.data = movielist;
            res.json(response);
        })
        .catch((err) => {
            sendError(err, res);
        });
    });
});

module.exports = router;
