const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");

dotenv.config();

const connectDB = require("./config/db");
connectDB();

const opportunityRoutes = require("./routes/opportunityRoutes");
const authRoutes = require("./routes/authRoutes");
const syncRoutes = require("./routes/syncRoutes");
const { collectOpportunities } = require("./services/collectorService");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sync", syncRoutes);

app.get("/", (req, res) => {
    res.send("OpportunityHub API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    console.log("Running initial sync on startup...");
    collectOpportunities();

    cron.schedule("0 */6 * * *", () => {
        console.log("Scheduled sync triggered (every 6 hours)...");
        collectOpportunities();
    });

    console.log("Auto-sync scheduled to run every 6 hours.");
});