# StayMatch
A hotel and accommodation finder.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
  - [Environment Configuration](#environment-configuration)
- [Running](#running)
  - [Full Application](#full-application)
  - [ETL Process](#etl-process)
- [Technologies Used](#technologies-used)

## Getting Started

### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [Python](https://www.python.org/) (v3.8 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [pip](https://pip.pypa.io/en/stable/) (Python package manager)

### Installing
1. Clone the repository:
   ```
   git clone https://github.com/YM2992/StayMatch.git
   cd StayMatch
   ```

2. Install npm packages:
   ```
   npm install
   ```

3. Install Python packages:
   ```
   pip install -r requirements.txt
   ```

### Environment Configuration
- Links
  - [TripAdvisor API](https://tripadvisor-content-api.readme.io/reference/overview)
  - [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)
  - [Kaggle API](https://www.kaggle.com/docs/api)

1. **Set up `config.env`:**
   Create a file named `config.env` in the root directory and add the following environment variables:
   ```
   TRIPADVISOR_API_KEY="your_tripadvisor_api_key"
   SERVER_PORT=8000
   SQL_USER="your_sql_user"
   SQL_PASSWORD="your_sql_password"
   SQL_SERVER="your_sql_server"
   SQL_PORT=1433    # Keep default unless changed
   SQL_DATABASE="your_sql_database"
   BLOB_CONNECTION_STRING="your_azure_blob_connection_string"
   BLOB_CONTAINER_NAME="your_blob_container_name"
   JWT_SECRET="your_jwt_secret"
   ```

   Replace the placeholder values with your actual credentials.

1. **Set up `kaggle.json`:**
   - Download your `kaggle.json` file from your Kaggle account:
     1. Go to your Kaggle account settings.
     2. Scroll down to the "API" section and click "Create New API Token."
     3. A file named `kaggle.json` will be downloaded.
   - Place the `kaggle.json` file in the root directory.

   Ensure the file is accessible and contains the correct API credentials in the format:
    ```json
    {
      "username": "your_kaggle_username",
      "key": "your_kaggle_api_key"
    }
    ```

## Running

### Full Application
To run both the frontend and backend concurrently:
```
npm start
```

This command will start the React frontend and the Express backend server. The frontend will be accessible at [`http://localhost:5173`](http://localhost:5173) and the backend API at `http://localhost:ENV.SERVER_PORT` or defaulted to [`http://localhost:3000`](http://localhost:3000).

Please navigate to the frontend URL [http://localhost:5173](http://localhost:5173) in your web browser to access the application.

### ETL Process
To run the ETL process for scraping and storing data:
```
npm run etl
```

### Analysis Python Script
To run the analysis script:
```
python Backend/Modules/analysis.py
```
> **Note:** Ensure you have already run the ETL process before executing the analysis script.

## Technologies Used
- **Frontend**: React, TailwindCSS, Vite
- **Backend**: Node.js, Express
- **Database**: Microsoft SQL Server (via `mssql` package)
- **Other Tools**: Puppeteer, Cheerio, Axios, JSON utilities
- **Azure Services**: Azure Blob Storage, Azure Identity