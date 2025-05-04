const fs = require('fs');
const axios = require('axios');
const csvParser = require('csv-parser');
const { parse } = require('json2csv');
const path = require('path');

// Synonyms for automatic column detection
const nameSynonyms     = ['name'];
const locationSynonyms = ['location', 'city', 'place', 'destination'];
const priceSynonyms    = ['price', 'cost', 'amount'];
const ratingSynonyms   = ['rating', 'review', 'score'];

// Helper regexes
const englishRegex = /^[\x00-\x7F]+$/;
const alphaRegex   = /^[A-Za-z\s]+$/;

module.exports = async function refineCSV() {
  try {
    // Define paths under backend/data
    const projectRoot = path.resolve(__dirname, '..');
    const blobDir    = path.join(projectRoot, 'data', 'blob');
    const refinedDir = path.join(projectRoot, 'data', 'refined');
    const finalDir   = path.join(projectRoot, 'data', 'finaldata');

    // Ensure directories exist
    [refinedDir, finalDir].forEach(dir => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    // STAGE 1: Refine each CSV in blob
    const sourceFiles = fs.readdirSync(blobDir).filter(f => f.endsWith('.csv'));
    if (sourceFiles.length === 0) {
      console.log('⚠️ No CSV files found in blob folder to refine.');
      return;
    }

    for (const file of sourceFiles) {
      console.log(`🔄 Refining ${file}...`);
      const inputPath = path.join(blobDir, file);
      const rows      = [];
      let nameKey, locationKey, priceKey, ratingKey;
      let breakfastKey, freeCancelKey, noPrepaymentKey;

      await new Promise((resolve, reject) => {
        fs.createReadStream(inputPath)
          .pipe(csvParser())
          .on('headers', headers => {
            const findKey = syns => headers.find(h => syns.some(s => h.toLowerCase().includes(s)));
            nameKey     = findKey(nameSynonyms);
            locationKey = findKey(locationSynonyms);
            priceKey    = findKey(priceSynonyms);
            ratingKey   = findKey(ratingSynonyms);
            breakfastKey    = headers.find(h => h.toLowerCase().includes('breakfast'));
            freeCancelKey   = headers.find(h => h.toLowerCase().includes('free cancellation'));
            noPrepaymentKey = headers.find(h => h.toLowerCase().includes('no prepayment'));
            if (!nameKey) reject(new Error(`No "name" column in ${file}`));
          })
          .on('data', row => {
            const rawName = row[nameKey]?.trim();
            if (!rawName || !englishRegex.test(rawName) || !alphaRegex.test(rawName)) return;

            // Base columns
            const Name   = rawName;
            const rawLoc = row[locationKey]?.trim() || '';
            const Location = englishRegex.test(rawLoc)
              ? rawLoc.replace(/show on map|show/gi, '').trim()
              : '';

            // Price conversion AUD → SAR
            const rawPrice   = row[priceKey]?.trim() || '';
            const priceMatch = rawPrice.match(/\d+(?:\.\d+)?/);
            const basePrice  = priceMatch ? parseFloat(priceMatch[0]) : 0;
            const Price      = parseFloat((basePrice * 2.39).toFixed(2));
            const Currency   = 'SAR';

            // Rating: extract first number, one decimal place
            const rawRating    = row[ratingKey]?.trim() || '';
            const ratingMatch  = rawRating.match(/[0-9]+(?:\.[0-9]+)?/);
            const parsedRating = ratingMatch ? parseFloat(ratingMatch[0]) : 5.0;
            const Rating       = parsedRating.toFixed(1);

            // Extras with defaults
            const RoomType          = row['Room Type']?.trim() || 'N/A';
            const BedInfo           = row['Bed Info']?.trim()  || 'N/A';
            const BreakfastIncluded = breakfastKey && row[breakfastKey].toString().toUpperCase()==='YES' ? 'YES' : 'NO';
            const FreeCancellation  = freeCancelKey && row[freeCancelKey].toString().toUpperCase()==='YES' ? 'YES' : 'NO';
            const NoPrepayment      = noPrepaymentKey && row[noPrepaymentKey].toString().toUpperCase()==='YES' ? 'YES' : 'NO';

            rows.push({
              Name,
              Location,
              Price,
              Currency,
              Rating,
              'Room Type': RoomType,
              'Bed Info': BedInfo,
              'Breakfast included': BreakfastIncluded,
              'Free cancellation': FreeCancellation,
              'No Prepayment': NoPrepayment
            });
          })
          .on('end', resolve)
          .on('error', reject);
      });

      if (rows.length === 0) {
        console.log(`⚠️ No valid rows in ${file}, skipped.`);
        continue;
      }

      // Write refined file
      const fields = [
        'Name','Location','Price','Currency','Rating',
        'Room Type','Bed Info','Breakfast included',
        'Free cancellation','No Prepayment'
      ];
      const csvOutput = parse(rows, { fields });
      const outName   = `R_${file}`;
      const outPath   = path.join(refinedDir, outName);
      fs.writeFileSync(outPath, csvOutput);
      console.log(`✅ Refined CSV saved: ${outPath}`);
    }

    console.log('🎉 Stage 1 complete: All files refined to refined folder.');

    // STAGE 2: Merge all refined CSVs
    const refinedFiles = fs.readdirSync(refinedDir).filter(f => f.endsWith('.csv'));
    const mergedRows   = [];

    for (const file of refinedFiles) {
      const filePath = path.join(refinedDir, file);
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', row => mergedRows.push(row))
          .on('end', resolve)
          .on('error', reject);
      });
    }

    if (mergedRows.length > 0) {
      const mergeFields = Object.keys(mergedRows[0]);
      const mergedCsv   = parse(mergedRows, { fields: mergeFields });
      const mergedPath  = path.join(finalDir, 'merged_finaldata.csv');
      fs.writeFileSync(mergedPath, mergedCsv);
      console.log(`✅ Merged CSV saved: ${mergedPath}`);
    } else {
      console.log('⚠️ No refined files to merge into finaldata.');
    }

    console.log('🎉 Stage 2 complete: merged_finaldata.csv created in finaldata folder.');
  }
  catch (err) {
    console.error('🛑 Error in refineCSV.js:', err.message);
  }
};
