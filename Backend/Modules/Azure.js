const sql = require('mssql');
const { BlobServiceClient, BlobClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");

// Azure Environment Variables
const sqlConfig = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
};
const blobConfig = {
    containerName: process.env.BLOB_CONTAINER_NAME,
    connectionString: process.env.BLOB_CONNECTION_STRING
};

// Validate environment variables
if (!sqlConfig.user || !sqlConfig.password || !sqlConfig.server || !sqlConfig.database) {
    throw new Error('Missing required SQL configuration environment variables.');
}
if (!blobConfig.containerName || !blobConfig.connectionString) {
    throw new Error('Missing required Blob configuration environment variables.');
}


// Azure wrapper start
let Azure = {}

let pool = null;
let blobServiceClient = null;

// SQL Table Storage
Azure.connectToSQL = async function () {
    try {
        pool = await sql.connect(sqlConfig);
        console.log('Connected to Azure SQL Database');
    } catch (error) {
        console.error('Error connecting to Azure SQL:', error);
        throw error;
    }
}

Azure.getFromTable = async function (tableName, columns = '*', whereClause = '') {
    try {
        const query = `SELECT ${columns} FROM ${tableName} ${whereClause}`;
        const result = await this.executeQuery(query);
        return result;
    } catch (error) {
        console.error('Error fetching data from table:', error);
        throw error;
    }
}

Azure.insertIntoTable = async function (tableName, columns, values) {
    try {
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
        console.log(`Executing query: ${query}`);

        const result = await this.executeQuery(query);
        return result;
    } catch (error) {
        console.error('Error inserting data into table:', error);
        throw error;
    }
}

Azure.executeQuery = async function (query, params = []) {
    try {
        const request = pool.request();
        params.forEach(param => request.input(param.name, param.value));
        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}


// Blob Storage
Azure.connectToBlob = async function () {
    try {
        blobServiceClient = BlobServiceClient.fromConnectionString(blobConfig.connectionString);
    } catch (error) {
        console.error('Error connecting to Azure Blob Storage:', error);
        throw error;
    }
}


Azure.uploadBlobFile = async function (blobName, filePath) {
    try {
        const containerClient = blobServiceClient.getContainerClient(blobConfig.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.uploadFile(filePath);
        console.log(`Blob "${blobName}" uploaded successfully.`);
    } catch (error) {
        throw error;
    }
}

Azure.uploadBlob = async function (blobName, content) {
    try {
        const containerClient = blobServiceClient.getContainerClient(blobConfig.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.upload(content, Buffer.byteLength(content));
        console.log(`Blob "${blobName}" uploaded successfully.`);
    } catch (error) {
        throw error;
    }
}

Azure.downloadBlob = async function (blobName) {
    try {
        const containerClient = blobServiceClient.getContainerClient(blobConfig.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const downloadResponse = await blockBlobClient.download(0);
        console.log(`Blob "${blobName}" downloaded successfully.`);
        return downloadResponse;
    } catch (error) {
        throw error;
    }
}

Azure.fetchBlob = async function (blobName) {
    try {
        const containerClient = blobServiceClient.getContainerClient(blobConfig.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const downloadResponse = await blockBlobClient.download(0);
        const downloadedContent = await Azure.streamToString(downloadResponse.readableStreamBody);
        console.log(`Blob "${blobName}" fetched successfully.`);
        return downloadedContent;
    } catch (error) {
        throw error;
    }
}

Azure.listBlobs = async function () {
    try {
        console.log('Listing blobs in container:', blobConfig.containerName);
        const containerClient = blobServiceClient.getContainerClient(blobConfig.containerName);
        const blobs = [];
        for await (const blob of containerClient.listBlobsFlat()) {
            const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);
            blobs.push({
                Name: blob.name, URL: tempBlockBlobClient.url
            });
        }
        return blobs;
    } catch (error) {
        throw error;
    }
}

Azure.streamToString = async function (readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on('data', chunk => chunks.push(chunk.toString()));
        readableStream.on('end', () => resolve(chunks.join('')));
        readableStream.on('error', reject);
    });
}

module.exports = Azure;