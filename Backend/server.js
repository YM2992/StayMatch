require('dotenv').config();

const currentTime = new Date();
console.log(`Server starting: ${currentTime}`);
// Importing required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

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

/* Azure Blob Example */
// Azure.connectToBlob().then(() => {
//     Azure.listBlobs().then(blobs => {
//         console.log('List of blobs:', blobs);
//     }).catch(err => {
//         console.error('Error listing blobs:', err);
//     });

    // Azure.uploadBlobFile('output.csv', 'data/output.csv').then(() => {
    //     console.log('Blob uploaded successfully');
    // }).catch(err => {
    //     console.error('Error uploading blob:', err);
    // });

    // Azure.downloadBlob('output.csv').then(content => {
    //     console.log('Blob downloaded successfully:', content);
    // }).catch(err => {
    //     console.error('Error downloading blob:', err);
    // });
// });

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