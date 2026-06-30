const express = require("express");
const router = express.Router();

const { collectOpportunities } = require("../services/collectorService");

router.get("/", async (req, res) => {
    const result = await collectOpportunities();

    if (result.success) {
        res.status(200).json({
            success: true,
            message: "Sync completed",
            totalFetched: result.totalFetched,
            saved: result.saved,
            skipped: result.skipped,
        });
    } else {
        res.status(500).json({
            success: false,
            message: result.message,
        });
    }
});

module.exports = router;