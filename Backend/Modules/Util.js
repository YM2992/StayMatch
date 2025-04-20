const converter = require('json-2-csv');
const fs = require('fs').promises;
const path = require('path');

/**
 * Converts a JSON array or a single JSON object to a CSV string.
 * @param {Array<Object>|Object} jsonData - The JSON data to convert. Can be an array of objects or a single object.
 * @param {Object} [options={}] - Optional configuration for the conversion.
 * @returns {Promise<string>} - A promise that resolves to the resulting CSV string.
 * @throws {Error} - Throws an error if the input data is not valid or if the conversion fails.
 */
async function jsonToCsv(jsonData, options = {}) {
    try {
        if (!Array.isArray(jsonData) && typeof jsonData === 'object') {
            jsonData = [jsonData]; // Wrap single object in an array
        }
        if (!Array.isArray(jsonData)) {
            throw new Error('Input data must be an array of objects');
        }
        return await converter.json2csv(jsonData, options);
    } catch (error) {
        throw new Error(`Error converting JSON to CSV: ${error.message}`);
    }
}

/**
 * Converts a JSON array or a single JSON object to a CSV string and saves it to a file.
 * @param {Array<Object>|Object} jsonData - The JSON data to convert. Can be an array of objects or a single object.
 * @param {string} filePath - The file path where the CSV should be saved.
 * @param {Object} [options={}] - Optional configuration for the conversion.
 * @returns {Promise<void>} - A promise that resolves when the file has been successfully written.
 * @throws {Error} - Throws an error if the input data is not valid or if the conversion or file writing fails.
 */
async function jsonToCsvFile(jsonData, filePath, options = {}) {
    try {
        const csvData = await jsonToCsv(jsonData, options);
        const directory = path.dirname(filePath);
        await fs.mkdir(directory, { recursive: true }); // Ensure directory exists
        await fs.writeFile(filePath, csvData, 'utf8');
    } catch (error) {
        throw new Error(`Error saving CSV to file: ${error.message}`);
    }
}

module.exports = { jsonToCsv, jsonToCsvFile };