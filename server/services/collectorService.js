const axios = require("axios");
const Opportunity = require("../models/Opportunity");

// ==================================================
// Whitelist: only these companies (or close matches) are accepted
// ==================================================
const TOP_COMPANIES = [
    // FAANG / Global tech giants
    "Google", "Microsoft", "Amazon", "Meta", "Apple", "Adobe", "Netflix",
    "Oracle", "IBM", "Intel", "Nvidia", "Salesforce", "SAP", "Cisco",
    "VMware", "ServiceNow", "Qualcomm", "Dell", "HP", "Uber", "Airbnb",

    // Finance / Banking / Fintech giants
    "Mastercard", "Visa", "JPMorgan", "JP Morgan", "Goldman Sachs",
    "Morgan Stanley", "American Express", "Barclays", "Deutsche Bank",
    "HSBC", "Citi", "Citibank", "PayPal", "Paytm", "PhonePe", "Razorpay",
    "CRED", "Groww", "Zerodha", "BharatPe", "Upstox", "Cashfree", "Pine Labs",
    "Juspay", "Standard Chartered", "ANZ", "Wells Fargo", "Fidelity",
    "BlackRock", "State Street", "Northern Trust", "Synchrony", "UBS",
    "Credit Suisse", "Nomura", "Societe Generale", "Nasdaq",

    // Indian IT services / consulting
    "TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra", "Accenture",
    "Cognizant", "Capgemini", "Deloitte", "EY", "PwC", "KPMG",
    "LTIMindtree", "Mindtree", "L&T Infotech", "L&T Technology",
    "Persistent Systems", "Mphasis", "Hexaware", "Cyient", "Zensar",
    "Sonata Software", "Coforge", "Birlasoft", "Tata Elxsi", "Quest Global",
    "GlobalLogic", "EPAM", "Publicis Sapient", "Virtusa", "NTT Data",
    "DXC Technology", "Fujitsu", "Hitachi", "Nagarro", "Endava",
    "Grid Dynamics", "Synechron", "Xoriant", "ThoughtWorks", "Atos",
    "UST Global", "Happiest Minds", "Newgen", "Ramco Systems", "Larsen & Toubro",

    // Indian unicorns / top startups
    "Flipkart", "Swiggy", "Zomato", "Ola", "Myntra", "Meesho",
    "Zepto", "Nykaa", "PolicyBazaar", "Freshworks", "Zoho",
    "InMobi", "Urban Company", "Delhivery", "Lenskart", "CarDekho",
    "Dream11", "Unacademy", "Byju", "PhysicsWallah", "upGrad",
    "Postman", "BrowserStack", "Chargebee", "Darwinbox", "Innovaccer",
    "Rippling", "Amagi", "Sprinklr", "Gupshup", "Whatfix", "Hasura",
    "MindTickle", "Springworks", "CleverTap", "MoEngage", "Netcore",
    "WebEngage", "Uniphore", "Yellow.ai", "Haptik", "Observe.AI",
    "Fractal Analytics", "Mu Sigma", "LatentView", "Tiger Analytics",
    "ZS Associates", "Course5 Intelligence", "Games24x7", "Nazara",
    "MPL", "Zupee", "MakeMyTrip", "Yatra", "Cleartrip", "Ixigo",
    "Licious", "Rebel Foods", "Dunzo", "Bigbasket", "Grofers", "Blinkit",
    "Cure.fit", "Cult.fit", "Pharmeasy", "1mg", "Practo", "Vedantu",
    "Toppr", "WhiteHat Jr", "Simplilearn", "Great Learning",

    // Semiconductor / Hardware / Product companies
    "Samsung", "Sony", "LG", "Bosch", "Siemens", "Schneider Electric",
    "MediaTek", "Texas Instruments", "Analog Devices", "Skyworks",
    "Marvell", "Cadence", "Synopsys", "Mentor Graphics", "ARM",
    "Renesas", "STMicroelectronics", "NXP Semiconductors", "Infineon",
    "AMD", "Broadcom", "Micron", "Western Digital", "Seagate",
    "Arista Networks", "F5 Networks", "Nokia", "Ericsson", "Philips",
    "ABB", "Emerson", "Caterpillar", "John Deere", "Ford", "General Motors",
    "Continental", "Harman", "Visteon", "Honeywell", "GE",

    // Global SaaS / Product companies
    "Walmart", "Target", "Atlassian", "GitHub", "GitLab",
    "Stripe", "Shopify", "LinkedIn", "Twitter", "X Corp", "Snapchat",
    "IOHK", "Bloomberg", "Reuters", "Nutanix", "Juniper Networks",
    "Palo Alto Networks", "Akamai", "Autodesk", "Intuit", "Workday",
    "Splunk", "Palantir", "Databricks", "Snowflake", "MongoDB", "Elastic",
    "Confluent", "HashiCorp", "Twilio", "Okta", "Cloudflare", "Datadog",
    "PagerDuty", "Zendesk", "HubSpot", "Slack", "Zoom", "DocuSign",
    "Coupa", "Anaplan", "Asana", "Notion", "Figma", "Canva", "Grammarly",
    "Dropbox", "Box", "Pinterest", "Reddit", "Discord", "Spotify",
    "ByteDance", "TikTok", "Booking.com", "Expedia",
];

// Check if a company name matches (contains) anything in the whitelist
const isTopCompany = (companyName) => {
    if (!companyName) return false;
    const normalized = companyName.toLowerCase();
    return TOP_COMPANIES.some((name) => normalized.includes(name.toLowerCase()));
};

// ==================================================
// Category detection based on job title keywords
// ==================================================
const detectCategory = (title) => {
    const t = title.toLowerCase();

    if (
        t.includes("web") || t.includes("frontend") || t.includes("front-end") ||
        t.includes("backend") || t.includes("back-end") || t.includes("full stack") ||
        t.includes("fullstack") || t.includes("react") || t.includes("angular") ||
        t.includes("node") || t.includes("django") || t.includes("php") ||
        t.includes("mern") || t.includes("laravel")
    ) {
        return "Web Development";
    }

    if (
        t.includes("android") || t.includes("ios") || t.includes("mobile") ||
        t.includes("flutter") || t.includes("react native") || t.includes("kotlin") ||
        t.includes("swift")
    ) {
        return "App Development";
    }

    if (
        t.includes("data scientist") || t.includes("data analyst") ||
        t.includes("machine learning") || t.includes(" ml ") || t.includes("data engineer") ||
        t.includes("artificial intelligence") || t.includes(" ai ") || t.includes("data science")
    ) {
        return "Data Science";
    }

    if (
        t.includes("devops") || t.includes("sre") || t.includes("site reliability") ||
        t.includes("cloud engineer") || t.includes("infrastructure") || t.includes("kubernetes")
    ) {
        return "DevOps";
    }

    if (
        t.includes("qa ") || t.includes("tester") || t.includes("quality assurance") ||
        t.includes("sdet") || t.includes("test engineer")
    ) {
        return "QA/Testing";
    }

    if (
        t.includes("software engineer") || t.includes("software developer") ||
        t.includes("sde") || t.includes("swe")
    ) {
        return "Software Engineering";
    }

    return "Other";
};

// ==================================================
// Cleanup helpers
// ==================================================
const removeExpiredOpportunities = async () => {
    const result = await Opportunity.deleteMany({ deadline: { $lt: new Date() } });
    console.log("Expired Opportunities Removed:", result.deletedCount);
    return result.deletedCount;
};

const removeDeadLinkOpportunities = async () => {
    const allJobs = await Opportunity.find({});
    let removedCount = 0;

    for (const job of allJobs) {
        try {
            await axios.head(job.applicationLink, { timeout: 5000 });
        } catch (error) {
            await Opportunity.findByIdAndDelete(job._id);
            removedCount++;
        }
    }

    console.log("Dead Link Opportunities Removed:", removedCount);
    return removedCount;
};

const removeUnknownCompanyOpportunities = async () => {
    const result = await Opportunity.deleteMany({ company: "Unknown Company" });
    console.log("Old Unknown Company Entries Removed:", result.deletedCount);
    return result.deletedCount;
};

const removeNonWhitelistedOpportunities = async () => {
    const allJobs = await Opportunity.find({});
    let removedCount = 0;

    for (const job of allJobs) {
        if (!isTopCompany(job.company)) {
            await Opportunity.findByIdAndDelete(job._id);
            removedCount++;
        }
    }

    console.log("Non-Whitelisted Company Entries Removed:", removedCount);
    return removedCount;
};

// ==================================================
// Adzuna
// ==================================================
const extractAdzunaCompany = (job) => {
    if (job.company?.display_name && job.company.display_name.trim() !== "") {
        return job.company.display_name.trim();
    }
    const match = job.title?.match(/\bat\s+([A-Z][A-Za-z0-9&.\s]{2,40})$/);
    if (match) return match[1].trim();
    return null;
};

const ADZUNA_KEYWORDS = [
    "software intern",
    "internship",
    "web developer intern",
    "sde intern",
    "software developer",
    "software engineer",
];

const collectFromAdzuna = async () => {
    let savedCount = 0;
    let skippedCount = 0;

    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    for (const keyword of ADZUNA_KEYWORDS) {
        try {
            for (let page = 1; page <= 2; page++) {
                const response = await axios.get(
                    `https://api.adzuna.com/v1/api/jobs/in/search/${page}`,
                    {
                        params: {
                            app_id: appId,
                            app_key: appKey,
                            results_per_page: 20,
                            what: keyword,
                        },
                    }
                );

                const jobs = response.data.results || [];
                console.log(`Adzuna [${keyword} - page ${page}] Jobs Found:`, jobs.length);

                for (const job of jobs) {
                    const companyName = extractAdzunaCompany(job);

                    if (!companyName || !isTopCompany(companyName)) {
                        skippedCount++;
                        continue;
                    }

                    const isInternship = job.title.toLowerCase().includes("intern");

                    let salaryText = "Not Disclosed";
                    if (job.salary_min && job.salary_max) {
                        salaryText = `₹${Math.round(job.salary_min)} - ₹${Math.round(job.salary_max)}`;
                    }

                    const alreadyExists = await Opportunity.findOne({
                        title: job.title,
                        company: companyName,
                    });

                    if (alreadyExists) {
                        skippedCount++;
                        continue;
                    }

                    const deadline = new Date();
                    deadline.setDate(deadline.getDate() + 30);

                    await Opportunity.create({
                        title: job.title || "Untitled Position",
                        company: companyName,
                        location: job.location?.display_name || "India",
                        type: isInternship ? "Internship" : "Job",
                        category: detectCategory(job.title || ""),
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
            }
        } catch (error) {
            console.error(`Adzuna Collector Error [${keyword}]:`, error.message);
            if (error.response) console.error("Adzuna API Response:", error.response.data);
        }
    }

    return { savedCount, skippedCount };
};

// ==================================================
// Jooble
// ==================================================
const JOOBLE_KEYWORDS = [
    "software intern",
    "internship",
    "web developer intern",
    "sde intern",
    "frontend intern",
    "backend intern",
    "software engineer",
];

const collectFromJooble = async () => {
    let savedCount = 0;
    let skippedCount = 0;

    const apiKey = process.env.JOOBLE_API_KEY;

    for (const keyword of JOOBLE_KEYWORDS) {
        try {
            const response = await axios.post(
                `https://jooble.org/api/${apiKey}`,
                {
                    keywords: keyword,
                    location: "India",
                }
            );

            const jobs = response.data.jobs || [];
            console.log(`Jooble [${keyword}] Jobs Found:`, jobs.length);

            for (const job of jobs) {
                const companyName = job.company && job.company.trim() !== "" ? job.company.trim() : null;

                if (!companyName || !isTopCompany(companyName)) {
                    skippedCount++;
                    continue;
                }

                const isInternship = job.title.toLowerCase().includes("intern");

                const alreadyExists = await Opportunity.findOne({
                    title: job.title,
                    company: companyName,
                });

                if (alreadyExists) {
                    skippedCount++;
                    continue;
                }

                const deadline = new Date();
                deadline.setDate(deadline.getDate() + 30);

                await Opportunity.create({
                    title: job.title || "Untitled Position",
                    company: companyName,
                    location: job.location || "India",
                    type: isInternship ? "Internship" : "Job",
                    category: detectCategory(job.title || ""),
                    description: job.snippet
                        ? job.snippet.replace(/<[^>]*>/g, "").substring(0, 1000)
                        : "No description provided.",
                    skills: [],
                    salary: job.salary || "Not Disclosed",
                    applicationLink: job.link || "https://jooble.org",
                    deadline: deadline,
                });

                savedCount++;
            }
        } catch (error) {
            console.error(`Jooble Collector Error [${keyword}]:`, error.message);
            if (error.response) console.error("Jooble API Response:", error.response.data);
        }
    }

    return { savedCount, skippedCount };
};

// ==================================================
// Main collector
// ==================================================
const collectOpportunities = async () => {
    try {
        console.log("==================================");
        console.log("Starting Opportunity Collection (India - Adzuna + Jooble, Whitelisted)...");
        console.log("==================================");

        await removeExpiredOpportunities();
        await removeDeadLinkOpportunities();
        await removeUnknownCompanyOpportunities();
        await removeNonWhitelistedOpportunities();

        const adzunaResult = await collectFromAdzuna();
        const joobleResult = await collectFromJooble();

        const totalSaved = adzunaResult.savedCount + joobleResult.savedCount;
        const totalSkipped = adzunaResult.skippedCount + joobleResult.skippedCount;

        console.log("Adzuna -> Saved:", adzunaResult.savedCount, "Skipped:", adzunaResult.skippedCount);
        console.log("Jooble -> Saved:", joobleResult.savedCount, "Skipped:", joobleResult.skippedCount);
        console.log("Total New Opportunities Saved:", totalSaved);
        console.log("Total Skipped:", totalSkipped);
        console.log("==================================");

        return {
            success: true,
            saved: totalSaved,
            skipped: totalSkipped,
        };

    } catch (error) {
        console.error("Collector Error:", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

module.exports = { collectOpportunities };