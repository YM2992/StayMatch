require('dotenv').config();


const currentTime = new Date();
console.log(`Server starting: ${currentTime}`);
// Importing required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Middleware for parsing request bodies
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// import local modules
const TripAdvisorAPI = require('./Modules/TripAdvisor');
const Azure = require('./Modules/Azure');
const Util = require('./Modules/Util');
const hotelHandler = require('./Handlers/hotelHandler');
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
    await new Promise((resolve, reject) => {
        fs.readdir(uploadDir, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                reject(err);
                return;
            }
            const uploadPromises = files.map(file => {
                const filePath = `${uploadDir}/${file}`;
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
    
    // Download all blobs from Azure Blob Storage to Backend/blobDataFiles
    await Azure.listBlobs().then(async blobs => {
        for (const blob of blobs) {
            try {
                const content = await Azure.fetchBlob(blob.Name);
                const filePath = `Backend/blobDataFiles/blob_${blob.Name}`;
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
    
    
    // Insert dummy data into the Azure SQL database
    // const dummyData = [
    //     {
    //         name: 'الوادي للوحدات السكنية',
    //         location: 'Riyadh Al Khabra Show on map',
    //         price: 200,
    //         beds: '2 single beds',
    //         room_type: 'Deluxe Twin Room',
    //         rating: 8.5
    //     },
    //     {
    //         name: 'فندق سوار',
    //         location: 'Sīdī Ḩamzah Show on map',
    //         price: 145,
    //         beds: '2 single beds',
    //         room_type: 'Small Twin Room',
    //         rating: 8.6
    //     },
    //     {
    //         name: 'Golden Dakhil',
    //         location: 'Qabāʼ Show on map',
    //         price: 100,
    //         beds: '1 extra-large double bed',
    //         room_type: 'Economy Double Room',
    //         rating: 7.3
    //     }
    // ];

    // try {
    //     const columns = ['name', 'location', 'price', 'beds', 'room_type', 'rating'];
    //     await hotelHandler.insertHotels(dummyData);
    //     console.log('Dummy data inserted successfully:', dummyData);
    // } catch (err) {
    //     console.error('Error inserting dummy data:', err);
    // }
    
    // Load the data from refinedFiles to the SQL database
    const refinedFiles = fs.readdirSync(refinedDir).filter(file => file.endsWith('.csv'));
    for (const file of refinedFiles) {
        const filePath = `${refinedDir}/${file}`;
        const csvData = fs.readFileSync(filePath, 'utf8');
        const rows = csvData.split('\n').filter(row => row.trim() !== '');
        const headers = rows[0].split(',').map(header => header.replace(/"/g, ''));

        const entries = rows.slice(1).map(row => {
            const values = row.split(',').map(value => value.replace(/"/g, ''));
            return headers.reduce((obj, header, index) => {
                obj[header.trim()] = values[index]?.trim();
                return obj;
            }, {});
        }).filter(entry => !Object.values(entry).some(value => value === null || value === undefined || value === ''));

        // Apply development/testing limit of 20 entries
        const limitedEntries = entries.slice(0, 20);

        if (limitedEntries.length > 0) {
            for (const entry of limitedEntries) {
                try {
                    // Check if the hotel already exists by name
                    const query = `SELECT * FROM Hotel WHERE name = @name`;
                    const params = [{ name: 'name', type: 'NVarChar', value: entry.name }];
                    const existingHotel = await Azure.executeQuery(query, params);

                    if (existingHotel.length > 0) {
                        // Update the existing hotel
                        const updateQuery = `
                            UPDATE Hotels
                            SET location = @location, price = @price, beds = @beds, room_type = @room_type, rating = @rating
                            WHERE name = @name
                        `;
                        const updateParams = [
                            { name: 'location', type: 'NVarChar', value: entry.location },
                            { name: 'price', type: 'Float', value: entry.price },
                            { name: 'beds', type: 'NVarChar', value: entry.beds },
                            { name: 'room_type', type: 'NVarChar', value: entry.room_type },
                            { name: 'rating', type: 'Float', value: entry.rating },
                            { name: 'name', type: 'NVarChar', value: entry.name }
                        ];
                        await Azure.executeQuery(updateQuery, updateParams);
                        console.log(`Updated hotel: ${entry.name}`);
                    } else {
                        // Insert as a new hotel
                        const insertQuery = `
                            INSERT INTO Hotel (name, location, price, beds, room_type, rating)
                            VALUES (@name, @location, @price, @beds, @room_type, @rating)
                        `;
                        const insertParams = [
                            { name: 'name', type: 'NVarChar', value: entry.name },
                            { name: 'location', type: 'NVarChar', value: entry.location },
                            { name: 'price', type: 'Float', value: entry.price },
                            { name: 'beds', type: 'NVarChar', value: entry.beds },
                            { name: 'room_type', type: 'NVarChar', value: entry.room_type },
                            { name: 'rating', type: 'Float', value: entry.rating }
                        ];
                        await Azure.executeQuery(insertQuery, insertParams);
                        console.log(`Inserted new hotel: ${entry.name}`);
                    }
                } catch (err) {
                    console.error(`Error processing entry for ${entry.name}:`, err);
                }
            }
        } else {
            console.warn(`No valid entries to process from ${file}`);
        }
    }
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