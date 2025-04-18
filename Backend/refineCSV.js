const fs = require('fs');
const path = require('path');
const axios = require('axios');
const csvParser = require('csv-parser');
const { parse } = require('json2csv');

const inputDir = path.join(__dirname, 'blobDataFiles');
const outputDir = path.join(__dirname, 'RefinedDataFiles');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const englishRegex = /^[\x00-\x7F]+$/;

// Async wrapper so we can await inside .on('data')
async function refineFile(inputPath, outputPath, fileName) {
    const results = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(inputPath)
            .pipe(csvParser())
            .on('data', async (row) => {
                let name = row.name?.trim();
                if (!name) return;

                // Translate if not English
                if (!englishRegex.test(name)) {
                    try {
                        const res = await axios.post('https://libretranslate.de/translate', {
                            q: name,
                            source: 'auto',
                            target: 'en',
                            format: 'text'
                        });
                        name = res.data.translatedText;
                        console.log(`🌐 Translated: "${row.name}" → "${name}"`);
                    } catch (err) {
                        console.error(`❌ Failed to translate "${name}": ${err.message}`);
                        return;
                    }
                }

                results.push({
                    name: name,
                    location: row.location || row.city || '',
                    price: row.price ? `${row.price} SAR` : '',
                    beds: row.beds || '',
                    room_type: row.room_type || '',
                    rating: row.rating || row.stars || '',
                });
            })
            .on('end', () => {
                if (results.length === 0) {
                    console.log(`⚠️ No rows written from ${fileName}`);
                    resolve();
                    return;
                }

                const csv = parse(results, {
                    fields: ['name', 'location', 'price', 'beds', 'room_type', 'rating'],
                });

                fs.writeFileSync(outputPath, csv);
                console.log(`✅ Refined CSV saved: ${outputPath}`);
                resolve();
            })
            .on('error', reject);
    });
}

(async () => {
    try {
        const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.csv'));

        for (const file of files) {
            const inputPath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, `refined_${file}`);
            await refineFile(inputPath, outputPath, file);
        }
    } catch (err) {
        console.error('🔥 Error refining CSVs:', err);
    }
})();
