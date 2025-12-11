const app = require('./app');          // Import all middleware & routes
const setupSwagger = require('./swagger'); 
const initDatabase = require('./models/init');

const PORT = process.env.PORT || 5000;

// Initialize the database
initDatabase();

// Setup Swagger for API documentation
setupSwagger(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
