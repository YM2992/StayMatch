# StayMatch
A hotel and accommodation finder.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
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

## Running

### Full Application
To run both the frontend and backend concurrently:
```
npm start
```

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

## Technologies Used
- **Frontend**: React, TailwindCSS, Vite
- **Backend**: Node.js, Express
- **Database**: Microsoft SQL Server (via `mssql` package)
- **Other Tools**: Puppeteer, Cheerio, Axios, JSON utilities
- **Azure Services**: Azure Blob Storage, Azure Identity