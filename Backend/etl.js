require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { spawn } = require('child_process');

// Import local modules
const Azure = require('./Modules/Azure');
const TripAdvisorAPI = require('./Modules/TripAdvisor');
const downloadKaggleData = require('./Modules/fetchKaggleData');
const refineCSV = require('./Modules/refineCSV');

// Global flags
const AZURE_ENABLED = true;

// Initialize TripAdvisor API
const TripAdvisor = new TripAdvisorAPI(process.env.TRIPADVISOR_API_KEY);


// Create directories if they don't exist
const extractedDir = 'Backend/data/extracted';
const blobDir = 'Backend/data/blob';
const refinedDir = 'Backend/data/refined';
const finalDir = 'Backend/data/finaldata';

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

// Python scraper
function runBookingScraper() {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, 'Modules', 'booking_scraper.py');// compute the absolute path to booking_scraper.py
        const scraper = spawn('py', [scriptPath], { stdio: 'inherit' });

        scraper.on('error', err => {
            console.error('Failed to start booking_scraper.py:', err);
            reject(err);
        });

        scraper.on('close', code => {
            if (code === 0) {
                console.log('✅ booking_scraper.py finished successfully');
                resolve();
            } else {
                reject(new Error(`booking_scraper.py exited with code ${code}`));
            }
        });
    });
}

async function main() {
    /* Connections */
    // Connect to Azure SQL and Blob Storage
    await Azure.connectToSQL();
    await Azure.connectToBlob();

    /* EXTRACT */
    // Download Kaggle dataset and TripAdvisor data to Backend/data
    downloadKaggleData();
    await TripAdvisor.downloadTripAdvisorData('Backend/data/extracted');

    // call the Python booking scraper 
    console.log('🚀 Launching booking_scraper.py …');
    try {
        await runBookingScraper();
    } catch (err) {
        console.error('🛑 booking scraper failed:', err);
    }

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

    /* TRANSFORM */
    // Refine/transform the data
    const inputDir = AZURE_ENABLED ? 'Backend/data/blob' : 'Backend/data/extracted';
    const outputDir = 'Backend/data/refined';

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

    /* LOAD */
    // Load the data to the SQL database
    console.log('Loading data into SQL database...');
    try {
        const rows = [];
        const columns = [];
        const finalCsvPath = path.join(finalDir, 'merged_finaldata.csv');
        const stream = fs.createReadStream(finalCsvPath).pipe(csv());
        const tableName = 'Hotel';
        const batchSize = 100; // Number of rows per batch

        // Read CSV file and collect rows
        for await (const row of stream) {
            if (columns.length === 0) {
                // Extract column names from the first row
                Object.keys(row).forEach(col => columns.push(col));
            }
            rows.push(row);
        }

        console.log(`Loaded ${rows.length} rows from ${finalCsvPath}`);

        // Insert or update rows into the SQL table in batches
        for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);

            for (const row of batch) {
                const values = columns.map(col => `'${row[col].replace(/'/g, "''")}'`); // escape single quotes in values
                const updateSet = columns.map(col => `${col} = '${row[col].replace(/'/g, "''")}'`).join(', '); // escape single quotes in values

                // Inserts the row in the SQL table
                // Updates the row if a hotel with the same name already exists
                const query = `
                    MERGE INTO ${tableName} AS Target
                    USING (SELECT ${values.map((v, idx) => `${v} AS ${columns[idx]}`).join(', ')}) AS Source
                    ON Target.name = Source.name
                    WHEN MATCHED THEN
                        UPDATE SET ${updateSet}
                    WHEN NOT MATCHED THEN
                        INSERT (${columns.join(', ')})
                        VALUES (${values.join(', ')});
                `;

                await Azure.executeQuery(query);
            }

            console.log(`Processed batch ${i / batchSize + 1} of ${Math.ceil(rows.length / batchSize)}`);
        }

        console.log(`Successfully loaded all data into table: ${tableName}`);
    } catch (err) {
        console.error('Error loading CSV to SQL:', err);
    }
}

// Ensure the script is only run via `npm run etl`
if (require.main === module) {
    main().catch(err => {
        console.error('ETL process failed:', err);
        process.exit(1);
    });
} else {
    console.log('etl.js can only be run via "npm run etl".');
}