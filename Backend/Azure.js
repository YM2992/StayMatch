const sql = require('mssql');

class AzureService {
    constructor(sqlConfig, blobConfig) {
        // Initialize SQL configuration
        this.sqlConfig = sqlConfig;
        this.pool = null;
    }

    async connectToSQL() {
        try {
            this.pool = await sql.connect(this.sqlConfig);
            console.log('Connected to Azure SQL Database');
        } catch (error) {
            console.error('Error connecting to Azure SQL:', error);
            throw error;
        }
    }

    async executeQuery(query, params = []) {
        try {
            const request = this.pool.request();
            params.forEach(param => request.input(param.name, param.type, param.value));
            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    async uploadBlob(blobName, content) {
        try {
            const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.upload(content, Buffer.byteLength(content));
            console.log(`Blob "${blobName}" uploaded successfully.`);
        } catch (error) {
            console.error('Error uploading blob:', error);
            throw error;
        }
    }

    async downloadBlob(blobName) {
        try {
            const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const downloadResponse = await blockBlobClient.download(0);
            const downloadedContent = await this.streamToString(downloadResponse.readableStreamBody);
            console.log(`Blob "${blobName}" downloaded successfully.`);
            return downloadedContent;
        } catch (error) {
            console.error('Error downloading blob:', error);
            throw error;
        }
    }

    async streamToString(readableStream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on('data', chunk => chunks.push(chunk.toString()));
            readableStream.on('end', () => resolve(chunks.join('')));
            readableStream.on('error', reject);
        });
    }
}

module.exports = AzureService;