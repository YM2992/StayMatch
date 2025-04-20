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
const refineCSV = require('./Modules/refineCSV');

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
const extractedDir = 'Backend/data/extracted';
const blobDir = 'Backend/data/blob';
const refinedDir = 'Backend/data/refined';

if (!fs.existsSync(extractedDir)) {
    fs.mkdirSync(extractedDir, { recursive: true });
    console.log(`Created directory: ${extractedDir}`);
}
if (!fs.existsSync(blobDir)) {
    fs.mkdirSync(blobDir, { recursive: true });
    console.log(`Created directory: ${blobDir}`);
}
if (!fs.existsSync(refinedDir)) {
    fs.mkdirSync(refinedDir, { recursive: true });
    console.log(`Created directory: ${refinedDir}`);
}


async function main() {
    // Connect to Azure SQL and Blob Storage
    await Azure.connectToSQL();
    await Azure.connectToBlob();

    // Download Kaggle dataset and TripAdvisor data to Backend/data
    downloadKaggleData();
    await TripAdvisor.downloadTripAdvisorData(extractedDir);
    
    // Upload all Backend/data files to Azure Blob Storage
    await new Promise((resolve, reject) => {
        fs.readdir(extractedDir, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                reject(err);
                return;
            }
            const uploadPromises = files.map(file => {
                const filePath = `${extractedDir}/${file}`;
                return Azure.uploadBlobFile(file, filePath)
                    .then(() => {
                        console.log(`File ${file} uploaded successfully`);
                    })
                    .catch(err => {
                        console.error(`Error uploading file ${file}:`, err);
                        throw err;
                    });
            });
            Promise.all(uploadPromises)
                .then(() => resolve())
                .catch(reject);
        });
    });
    
    // Download all blobs from Azure Blob Storage to Backend/data/blob
    await Azure.listBlobs().then(async blobs => {
        for (const blob of blobs) {
            try {
                const content = await Azure.fetchBlob(blob.Name);
                const filePath = `Backend/data/blob/blob_${blob.Name}`;
                await fs.promises.writeFile(filePath, content);
                console.log(`Blob ${blob.Name} saved to file: ${filePath}`);
            } catch (err) {
                console.error(`Error processing blob ${blob.Name}:`, err);
            }
        }
        console.log('List of blobs:', blobs);
    }).catch(err => {
        console.error('Error listing blobs:', err);
    });
    
    // Refine the data

    const path = require('path');

    const inputDir = blobDir;
    const outputDir = refinedDir;

    (async () => {
        try {
            const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.csv'));
    
            for (const file of files) {
                const inputPath = path.join(inputDir, file);
                const outputPath = path.join(outputDir, `refined_${file}`);
                await refineCSV(inputPath, outputPath, file);
            }
        } catch (err) {
            console.error('🔥 Error refining CSVs:', err);
        }
    })();
    
    
    
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