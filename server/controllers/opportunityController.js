const Opportunity = require("../models/Opportunity");

// Create Opportunity
const createOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.create(req.body);

        res.status(201).json({
            success: true,
            message: "Opportunity created successfully",
            data: opportunity,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get All Opportunities (Search Support)
const getAllOpportunities = async (req, res) => {
    try {
        const { search, location, type, category } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        if (type) {
            query.type = type;
        }

        if (category) {
            query.category = category;
        }

        const opportunities = await Opportunity.find(query);

        res.status(200).json({
            success: true,
            count: opportunities.length,
            data: opportunities,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get Single Opportunity
const getSingleOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: "Opportunity not found",
            });
        }

        res.status(200).json({
            success: true,
            data: opportunity,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Update Opportunity
const updateOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: "Opportunity not found",
            });
        }

        const updatedOpportunity = await Opportunity.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Opportunity updated successfully",
            data: updatedOpportunity,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Delete Opportunity
const deleteOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: "Opportunity not found",
            });
        }

        await Opportunity.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Opportunity deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const toggleSaveJob = async (req, res) => {
    try {
        const User = require("../models/User");
        const user = await User.findById(req.userId);
        const jobId = req.params.id;

        const alreadySaved = user.savedJobs.includes(jobId);

        if (alreadySaved) {
            user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
        } else {
            user.savedJobs.push(jobId);
        }

        await user.save();

        res.status(200).json({ success: true, saved: !alreadySaved });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
module.exports = {
    createOpportunity,
    getAllOpportunities,
    getSingleOpportunity,
    updateOpportunity,
    deleteOpportunity,
    toggleSaveJob,

};