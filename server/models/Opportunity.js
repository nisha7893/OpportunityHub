const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Internship", "Job", "Hackathon"],
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Web Development",
        "App Development",
        "Data Science",
        "DevOps",
        "Software Engineering",
        "QA/Testing",
        "Other",
      ],
      default: "Other",
    },

    description: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    salary: {
      type: String,
      default: "Not Disclosed",
    },

    applicationLink: {
      type: String,
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);