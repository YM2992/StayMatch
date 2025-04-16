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
const Util = require('./Modules/Util');
const downloadKaggleData = require('./Modules/fetchKaggleData');

// initialising API modules
const TripAdvisor = new TripAdvisorAPI(process.env.TRIPADVISOR_API_KEY);


// API server
const routes = require('./routes').default;
const fs = require('fs');

routes.forEach(route => {
    app[route.method.toLowerCase()](route.path, route.handler);
});


const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// Create directories if they don't exist
const uploadDir = 'Backend/data';
const downloadDir = 'Backend/blobDataFiles';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created directory: ${uploadDir}`);
} else {
    console.log(`Directory already exists: ${uploadDir}`);
}
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
    console.log(`Created directory: ${downloadDir}`);
} else {
    console.log(`Directory already exists: ${downloadDir}`);
}


async function main() {
    // Connect to Azure SQL and Blob Storage
    await Azure.connectToSQL();
    await Azure.connectToBlob();

    // Download Kaggle dataset and TripAdvisor data to Backend/data
    downloadKaggleData();
    await TripAdvisor.downloadTripAdvisorData(uploadDir);
    
    // Upload all Backend/data files to Azure Blob Storage
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
        files.forEach(file => {
            const filePath = `${uploadDir}/${file}`;
            Azure.uploadBlobFile(file, filePath).then(() => {
                console.log(`File ${file} uploaded successfully`);
            }).catch(err => {
                console.error(`Error uploading file ${file}:`, err);
            });
        });
    });
    
    // Download all blobs from Azure Blob Storage to Backend/blobDataFiles
    Azure.listBlobs().then(blobs => {
        blobs.forEach(blob => {
            Azure.fetchBlob(blob.Name).then(content => {
                const filePath = `Backend/blobDataFiles/${blob.Name}`;
                fs.writeFile(filePath, content, (err) => {
                    if (err) {
                        console.error(`Error saving blob ${blob.Name} to file:`, err);
                    } else {
                        console.log(`Blob ${blob.Name} saved to file: ${filePath}`);
                    }
                });
            });
        });
        console.log('List of blobs:', blobs);
    }).catch(err => {
        console.error('Error listing blobs:', err);
    });
    
    // Refine the data
    
    
    // Load the data to the SQL database
}

main().catch(err => {
    console.error('Error in main function:', err);
});



/* TripAdvisor API usage example */
// TripAdvisor.searchLocation("Jeddah").then(async data => {
//     const locationDetails = await TripAdvisor.getLocationDetails(data.data[0].location_id);
    
//     await Util.jsonToCsvFile(locationDetails, 'data/tripadvisor.csv', {
//         header: true,
//         delimiter: ',',
//         quote: '"',
//         eol: '\n',
//         columns: [
//             'location_id',
//             'name',
//             'address_obj.street1',
//             'address_obj.street2',
//             'address_obj.city',
//             'address_obj.state',
//             'address_obj.country'
//         ]
//     }).then(() => {
//         console.log('CSV file created successfully');
//     }).catch(err => {
//         console.error('Error creating CSV file:', err);
//     });
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