const fs = require('fs');
const csvParser = require('csv-parser');
const { parse } = require('json2csv');
const path = require('path');

const englishRegex = /^[\x00-\x7F]+$/;
const alphaRegex = /^[a-zA-Z\s]+$/;
const nameSynonyms = ['name'];
const locationSynonyms = ['location', 'city', 'place', 'destination'];
const priceSynonyms = ['price', 'cost', 'amount'];
const ratingSynonyms = ['rating', 'review', 'score'];

// ✅ STAGE 1: Refine Single File
async function refineFile(inputPath, outputPath, fileName) {
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const results = [];
    let nameKey, locationKey, priceKey, ratingKey;

    return new Promise((resolve, reject) => {
        fs.createReadStream(inputPath)
            .pipe(csvParser())
            .on('headers', (headers) => {
                const findKey = (synonyms) =>
                    headers.find(h => synonyms.some(k => h.toLowerCase().includes(k)));

                nameKey = findKey(nameSynonyms);
                locationKey = findKey(locationSynonyms);
                priceKey = findKey(priceSynonyms);
                ratingKey = findKey(ratingSynonyms);

                if (!nameKey) {
                    reject(new Error('❌ No column with "name" found.'));
                }
            })
            .on('data', (row) => {
                const name = row[nameKey]?.trim();
                const location = row[locationKey]?.trim();
                const price = row[priceKey]?.trim();
                const rating = row[ratingKey]?.trim();

                if (!name || !englishRegex.test(name) || !alphaRegex.test(name)) return;

                const cleanedRow = {
                    Name: name,
                    Location: (location && englishRegex.test(location))
                        ? location.replace(/show on map|show/gi, '').trim()
                        : '',
                    Price: (price && price.match(/\d+/)) ? parseInt(price.match(/\d+/)[0]) : '',
                    Currency: (price && price.match(/[A-Z]{3}/)) ? price.match(/[A-Z]{3}/)[0] : 'SAR',
                    Rating: (!rating || ['null', 'none'].includes(rating.toLowerCase()))
                        ? '5'
                        : (englishRegex.test(rating) ? rating : '5'),
                };

                results.push(cleanedRow);
            })
            .on('end', () => {
                if (results.length === 0) {
                    console.log(`⚠️ No valid rows written from ${fileName}`);
                    resolve();
                    return;
                }

                const csv = parse(results, {
                    fields: ['Name', 'Location', 'Price', 'Currency', 'Rating'],
                });

                const cleanFileName = fileName.includes('_')
                    ? fileName.substring(fileName.indexOf('_') + 1)
                    : fileName;

                const refinedFileName = `refined_${cleanFileName}`;
                const refinedOutputPath = path.join(outputDir, refinedFileName);

                fs.writeFileSync(refinedOutputPath, csv);
                console.log(`✅ Refined CSV saved: ${refinedOutputPath}`);
                console.log('🎉 DONE!');
                resolve();
            })
            .on('error', reject);
    });
}

module.exports = refineFile;
console.log('🎉 DONE With Stage 1 Refinement!');

// ✅ STAGE 2: Consolidate All Refined CSVs into BIG BOSS
(async () => {
    const refinedDir = path.resolve(__dirname, '../RefinedDataFiles');
    const outputDir = path.resolve(__dirname, '../finaldata');
    const outputFile = path.join(outputDir, 'BIG_BOSS_CSV.csv');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const mergedRows = [];
    const refinedFiles = fs.readdirSync(refinedDir).filter(f => f.endsWith('.csv'));

    for (const file of refinedFiles) {
        const filePath = path.join(refinedDir, file);
        const rows = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (row) => rows.push(row))
                .on('end', resolve)
                .on('error', reject);
        });

        mergedRows.push(...rows);
    }

    if (mergedRows.length === 0) {
        console.log('⚠️ No data found in RefinedDataFiles to consolidate.');
        return;
    }

    const finalCsv = parse(mergedRows, {
        fields: ['Name', 'Location', 'Price', 'Currency', 'Rating'],
    });

    fs.writeFileSync(outputFile, finalCsv);
    console.log(`📦 BIG BOSS CSV ready: ${outputFile}`);
})();
