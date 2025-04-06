const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema'); // Assuming you have a GraphQL schema defined
const database = require('./database/postgres'); // Assuming you have a database setup

const app = express();

// Initialize the database
database.InitDB().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  credentials: true // Allow cookies to be sent
}));

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true // Enable GraphiQL for testing queries
}));

// Start the server
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});