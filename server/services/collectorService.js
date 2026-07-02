const axios = require("axios");
const Opportunity = require("../models/Opportunity");

// Remove jobs whose deadline has passed
const removeExpiredOpportunities = async () => {
    const result = await Opportunity.deleteMany({ deadline: { $lt: new Date() } });
    console.log("Expired Opportunities Removed:", result.deletedCount);
    return result.deletedCount;
};

// Remove jobs whose application link is dead (404, removed, etc.)
const removeDeadLinkOpportunities = async () => {
    const allJobs = await Opportunity.find({});
    let removedCount = 0;

    for (const job of allJobs) {
        try {
            await axios.head(job.applicationLink, { timeout: 5000 });
        } catch (error) {
            // Link is dead or unreachable — remove it
            await Opportunity.findByIdAndDelete(job._id);
            removedCount++;
        }
    }

    console.log("Dead Link Opportunities Removed:", removedCount);
    return removedCount;
};

const collectOpportunities = async () => {
    try {
        console.log("==================================");
        console.log("Starting Opportunity Collection (India - Adzuna)...");
        console.log("==================================");

        // Step 1: Clean up expired and dead-link opportunities first
        await removeExpiredOpportunities();
        await removeDeadLinkOpportunities();

        const appId = process.env.ADZUNA_APP_ID;
        const appKey = process.env.ADZUNA_APP_KEY;

        const response = await axios.get(
            "https://api.adzuna.com/v1/api/jobs/in/search/1",
            {
                params: {
                    app_id: appId,
                    app_key: appKey,
                    results_per_page: 20,
                    what: "software intern",
                },
            }
        );

        const jobs = response.data.results;
        console.log("Total Jobs Found:", jobs.length);

        let savedCount = 0;
        let skippedCount = 0;

        for (const job of jobs) {
            const alreadyExists = await Opportunity.findOne({
                title: job.title,
                company: job.company.display_name,
            });

            if (alreadyExists) {
                skippedCount++;
                continue;
            }

            const deadline = new Date();
            deadline.setDate(deadline.getDate() + 30);

            const isInternship = job.title.toLowerCase().includes("intern");

            let salaryText = "Not Disclosed";
            if (job.salary_min && job.salary_max) {
                salaryText = `₹${Math.round(job.salary_min)} - ₹${Math.round(job.salary_max)}`;
            }

            await Opportunity.create({
                title: job.title || "Untitled Position",
                company: job.company.display_name || "Unknown Company",
                location: job.location.display_name || "India",
                type: isInternship ? "Internship" : "Job",
                description: job.description
                    ? job.description.substring(0, 1000)
                    : "No description provided.",
                skills: job.category ? [job.category.label] : [],
                salary: salaryText,
                applicationLink: job.redirect_url || "https://adzuna.in",
                deadline: deadline,
            });

            savedCount++;
        }

        console.log("New Opportunities Saved:", savedCount);
        console.log("Duplicates Skipped:", skippedCount);
        console.log("==================================");

        return {
            success: true,
            totalFetched: jobs.length,
            saved: savedCount,
            skipped: skippedCount,
        };

    } catch (error) {
        console.error("Collector Error:", error.message);
        if (error.response) {
            console.error("API Response:", error.response.data);
        }
        return {
            success: false,
            message: error.message,
        };
    }
};

module.exports = { collectOpportunities };