require('dotenv').config();

const currentTime = new Date();
console.log(`Server starting: ${currentTime}`);
// Importing required modules
const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
// const path = require('path');
// const app = express();

const app = express();
app.use(cors({ origin: '*' }));

// import local modules
const TripAdvisorAPI = require('./TripAdvisor');
const TripAdvisorAPIKey = process.env.TRIPADVISOR_API_KEY;
const TripAdvisor = new TripAdvisorAPI(TripAdvisorAPIKey);


// TripAdvisor.searchLocation("Jeddah").then(data => {
//     TripAdvisor.getLocationDetails(data.data[0].location_id);
// });

// const sql = require('mssql');

// const config = {
//     user: 'utssqlserverstaymatch', // better stored in an app setting such as process.env.DB_USER
//     password: 'utsstaymatchserver123$!', // better stored in an app setting such as process.env.DB_PASSWORD
//     server: 'staymatch.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
//     port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
//     database: 'StayMatch', // better stored in an app setting such as process.env.DB_NAME
//     authentication: {
//         type: 'default'
//     },
//     options: {
//         encrypt: true
//     }
// }

// /*
//     //Use Azure VM Managed Identity to connect to the SQL database
//     const config = {
//         server: process.env["db_server"],
//         port: process.env["db_port"],
//         database: process.env["db_database"],
//         authentication: {
//             type: 'azure-active-directory-msi-vm'
//         },
//         options: {
//             encrypt: true
//         }
//     }

//     //Use Azure App Service Managed Identity to connect to the SQL database
//     const config = {
//         server: process.env["db_server"],
//         port: process.env["db_port"],
//         database: process.env["db_database"],
//         authentication: {
//             type: 'azure-active-directory-msi-app-service'
//         },
//         options: {
//             encrypt: true
//         }
//     }
// */

// console.log("Starting...");
// connectAndQuery();

// async function connectAndQuery() {
//     try {
//         var poolConnection = await sql.connect(config);

//         console.log("Reading rows from the Table...");
//         var resultSet = await poolConnection.request().query(`SELECT * FROM TestTable`);

//         console.log(`${resultSet.recordset.length} rows returned.`);

//         // output column headers
//         var columns = "";
//         for (var column in resultSet.recordset.columns) {
//             columns += column + ", ";
//         }
//         console.log("%s\t", columns.substring(0, columns.length - 2));

//         // output row contents from default record set
//         resultSet.recordset.forEach(row => {
//             console.log("%s\t%s\t%s", row.TestID, row.Summary, row.PublishedTime);
//         });

//         // close connection only when we're certain application is finished
//         poolConnection.close();
//     } catch (err) {
//         console.error(err.message);
//     }
// }