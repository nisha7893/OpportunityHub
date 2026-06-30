const { protect } = require("../middleware/authMiddleware");
const { toggleSaveJob } = require("../controllers/opportunityController");
const express = require("express");
const router = express.Router();

router.put("/:id/save", protect, toggleSaveJob);





const {
    createOpportunity,
    getAllOpportunities,
    getSingleOpportunity,
    updateOpportunity,
    deleteOpportunity,
} = require("../controllers/opportunityController");

router.post("/", createOpportunity);
router.get("/", getAllOpportunities);
router.get("/:id", getSingleOpportunity);
router.put("/:id", updateOpportunity);
router.delete("/:id", deleteOpportunity);
module.exports = router;