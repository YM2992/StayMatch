const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const kaggleDatasets = [
//   'ghidaqahtan/booking-hotels',
//   'asafarji/saudi-arabia-bookingcom-2021',
//   'aalaqeel/saudi-hotels-in-bookingcom',
//   'moayadmagadmi/saudi-arabia-bookingcom',
];

const downloadKaggleData = () => {
  const downloadPath = path.resolve(__dirname, '../data');

  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath, { recursive: true });
  }

  const downloadNext = (index) => {
    if (index >= kaggleDatasets.length) return;

    const dataset = kaggleDatasets[index];
    const command = `kaggle datasets download -d ${dataset} -p ${downloadPath} --unzip --force`;

    console.log(`\n📥 Starting download for: ${dataset}`);

    // Spinner animation
    const spinnerFrames = ['|', '/', '-', '\\'];
    let spinnerIndex = 0;
    const spinner = setInterval(() => {
      process.stdout.write(`\r⏳ Downloading ${dataset} ${spinnerFrames[spinnerIndex++ % spinnerFrames.length]}`);
    }, 100);

    exec(command, (error, stdout, stderr) => {
      clearInterval(spinner);
      process.stdout.write(`\r✅ Download complete for ${dataset}                      \n`);

      if (error) {
        console.error(`❌ Error downloading ${dataset}: ${error.message}`);
        return downloadNext(index + 1); // Move to next dataset
      }

      if (stderr) {
        console.warn(`⚠️ stderr: ${stderr}`);
      }

      console.log(`✅ Kaggle dataset downloaded:\n${stdout}`);

      // Rename all CSV files to start with "fetched_"
      fs.readdir(downloadPath, (err, files) => {
        if (err) {
          console.error('❌ Failed to read download directory:', err);
          return downloadNext(index + 1);
        }

        files
          .filter(f => f.endsWith('.csv'))
          .forEach(file => {
            const originalPath = path.join(downloadPath, file);
            const newFileName = `fetched_${file}`;
            const newPath = path.join(downloadPath, newFileName);

            if (!file.startsWith('fetched_')) {
              fs.renameSync(originalPath, newPath);
              console.log(`📦 Downloaded: ${file} → ${newFileName}`);
            } else {
              console.log(`ℹ️ File already prefixed: ${file}`);
            }
          });

        // Proceed to next dataset
        downloadNext(index + 1);
      });
    });
  };

  downloadNext(0); // Start downloading first dataset
};

module.exports = downloadKaggleData;
