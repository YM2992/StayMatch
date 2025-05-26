 
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Replace with your target dataset and file
const kaggleDataset = 'asafarji/saudi-arabia-bookingcom-2021'; // e.g. 'username/dataset-name'
const datasetFile = 'winemag-data_first150k.csv'; // file inside the dataset

const downloadKaggleData = () => {
    const kaggleConfigDir = path.join(__dirname, '../../');
    console.log(`Setting KAGGLE_CONFIG_DIR to: ${kaggleConfigDir}`);
    process.env.KAGGLE_CONFIG_DIR = kaggleConfigDir;

    const command = `kaggle datasets download -d ${kaggleDataset} -p ./Backend/data/extracted --unzip --force`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error downloading dataset: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ stderr: ${stderr}`);
            return;
        }

        console.log(`✅ Kaggle dataset downloaded:\n${stdout}`);

        const filePath = path.join(__dirname, 'Backend/data/extracted', datasetFile);
        if (fs.existsSync(filePath)) {
            console.log(`✅ File saved locally at: ${filePath}`);
        } else {
            console.error('❌ File not found after download. Please check the dataset and filename.');
        }
    });
  }

// Make sure data dir exists
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

module.exports = downloadKaggleData;