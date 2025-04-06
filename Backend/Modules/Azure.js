const sql = require('mssql');

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

pool = null;

async function connectToSQL() {
    try {
        pool = await sql.connect(sqlConfig);
        console.log('Connected to Azure SQL Database');
    } catch (error) {
        console.error('Error connecting to Azure SQL:', error);
        throw error;
    }
}

async function getFromTable(tableName, columns = '*', whereClause = '') {
    try {
        const query = `SELECT ${columns} FROM ${tableName} ${whereClause}`;
        const result = await executeQuery(query);
        return result;
    } catch (error) {
        console.error('Error fetching data from table:', error);
        throw error;
    }
}

async function insertIntoTable(tableName, columns, values) {
    try {
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
        const result = await executeQuery(query);
        return result;
    } catch (error) {
        console.error('Error inserting data into table:', error);
        throw error;
    }
}

async function executeQuery(query, params = []) {
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

async function uploadBlob(blobName, content) {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.upload(content, Buffer.byteLength(content));
        console.log(`Blob "${blobName}" uploaded successfully.`);
    } catch (error) {
        console.error('Error uploading blob:', error);
        throw error;
    }
}

async function downloadBlob(blobName) {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const downloadResponse = await blockBlobClient.download(0);
        const downloadedContent = await streamToString(downloadResponse.readableStreamBody);
        console.log(`Blob "${blobName}" downloaded successfully.`);
        return downloadedContent;
    } catch (error) {
        console.error('Error downloading blob:', error);
        throw error;
    }
}

async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on('data', chunk => chunks.push(chunk.toString()));
        readableStream.on('end', () => resolve(chunks.join('')));
        readableStream.on('error', reject);
    });
}

module.exports = {
    connectToSQL,
    getFromTable,
    insertIntoTable,
    executeQuery,
    uploadBlob,
    downloadBlob,
    streamToString
};