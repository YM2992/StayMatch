require('dotenv').config();

const currentTime = new Date();
console.log(`Server starting: ${currentTime}`);
// Importing required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors({ origin: '*' }));

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// import local modules
const TripAdvisorAPI = require('./Modules/TripAdvisor');
const Azure = require('./Modules/Azure');

// initialising API modules
const TripAdvisor = new TripAdvisorAPI(process.env.TRIPADVISOR_API_KEY);


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
// Azure.connectToSQL().then(() => {
//     Azure.executeQuery('SELECT * FROM TestTable').then(result => {
//         console.log('Query result:', result);
//     }).catch(err => {
//         console.error('Error executing query:', err);
//     });
// });

// Azure.connectToSQL().then(() => {
//     // Azure.executeQuery('SELECT * FROM [dbo].[User];').then(result => {
//     //     console.log('Query result:', result);
//     // }).catch(err => {
//     //     console.error('Error executing query:', err);
//     // });
//     Azure.getFromTable('[dbo].[User]').then(result => {
//         console.log('Query result:', result);
//     }).catch(err => {
//         console.error('Error executing query:', err);
//     });
// });
// Azure.connectToSQL().then(() => {
//     Azure.executeQuery(`
//         INSERT INTO [dbo].[user]
//         ([first_name], [last_name], [email], [password])
//         VALUES ('Jeag', 'HJeash', 'jeag.hjeash@domain.com', 'test123');
// `);
// });