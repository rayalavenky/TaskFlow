const mongoose = require("mongoose");
const dns = require("dns");

// Node picks up 127.0.0.1 as the DNS server on this machine, which refuses
// queries and breaks mongodb+srv:// lookups. Force public resolvers instead.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

module.exports = connectDB;