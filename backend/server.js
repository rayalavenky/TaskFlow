require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const validateEnv = require("./config/env");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Validate environment variables
    validateEnv();

    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);

    process.exit(1);
  }
};

startServer();