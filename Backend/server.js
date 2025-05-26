require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes').default;

// Initialize Express app
const app = express();

// Middleware for parsing request bodies
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register routes
routes.forEach(route => {
    app[route.method.toLowerCase()](route.path, route.handler);
});

// Start the server
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Application server is running on port ${PORT}`);
});

// Connect to Azure SQL
const Azure = require('./Modules/Azure');
Azure.connectToSQL()
    .catch(err => console.error('Failed to connect to Azure SQL:', err));