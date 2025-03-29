require('dotenv').config();

const currentTime = new Date();
console.log(`Server starting: ${currentTime}`);
// Importing required modules
const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
// const path = require('path');

const app = express();
app.use(cors({ origin: '*' }));

// import local modules
const TripAdvisorAPI = require('./TripAdvisor');
const Azure = require('./Azure');

// initialising API modules
const TripAdvisor = new TripAdvisorAPI(process.env.TRIPADVISOR_API_KEY);
const AzureService = new Azure({
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}, {});


/* TripAdvisor API usage example */
// TripAdvisor.searchLocation("Jeddah").then(data => {
//     TripAdvisor.getLocationDetails(data.data[0].location_id);
// });

/* Azure API usage example */
// AzureService.connectToSQL().then(() => {
//     AzureService.executeQuery('SELECT * FROM TestTable').then(result => {
//         console.log('Query result:', result);
//     }).catch(err => {
//         console.error('Error executing query:', err);
//     });
// });