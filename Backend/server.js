require('dotenv').config();

const currentTime = new Date();
console.log(`Server starting: ${currentTime}`);
// Importing required modules
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));

// import local modules
const TripAdvisorAPI = require('./Modules/TripAdvisor');
const Azure = require('./Modules/Azure');

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


// API server
const routes = require('./routes').default;

routes.forEach(route => {
    app[route.method.toLowerCase()](route.path, route.handler);
});


const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


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