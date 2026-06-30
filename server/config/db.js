const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("========== MONGO URI ==========");
        console.log(process.env.MONGO_URI);
        console.log("===============================");

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ Connection Error");
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;