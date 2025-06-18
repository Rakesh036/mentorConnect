const mongoose = require("mongoose");

// Load environment variables
require('dotenv').config();
// Mongoose Connection
const MONGO_URL = process.env.MONGODB_URL;

// Import seeders
const discussionSeeder = require("./discussionSeeder");
const discussionReviewSeeder = require("./discussionReviewSeeder");
const donationSeeder = require("./donationSeeder");
const groupSeeder = require("./groupSeeder");
const jobSeeder = require("./jobSeeder");
const jobReviewSeeder = require("./jobReviewSeeder");
const paymentSeeder = require("./paymentSeeder");
const quizSeeder = require("./quizSeeder");
const successSeeder = require("./successSeeder");
const successReviewSeeder = require("./successReviewSeeder");
const scheduleSeeder = require("./bookingSeeder");
const eventSeeder = require("./eventSeeder");
const mentorSeeder = require("./mentorSeeder");
const menteeSeeder = require("./menteeSeeder");

async function runSeeds() {
  try {
    console.log("🚀 Starting database seeding process...");

    // Connect to MongoDB
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("✅ Successfully connected to MongoDB");

    // Clear other collections
    console.log("🧹 Clearing existing data from collections...");
    const clearOperations = [
      { model: require("../models/discussion"), name: "Discussion" },
      { model: require("../models/discussionReview"), name: "DiscussionReview" },
      { model: require("../models/donation"), name: "Donation" },
      { model: require("../models/group"), name: "Group" },
      { model: require("../models/job"), name: "Job" },
      { model: require("../models/jobReview"), name: "JobReview" },
      { model: require("../models/payment"), name: "Payment" },
      { model: require("../models/quiz"), name: "Quiz" },
      { model: require("../models/success"), name: "Success" },
      { model: require("../models/successReview"), name: "SuccessReview" },
      { model: require("../models/mentee/mentee"), name: "Mentee" },
      { model: require("../models/mentor/mentor"), name: "Mentor" }
    ];

    for (const operation of clearOperations) {
      try {
        const result = await operation.model.deleteMany({});
        console.log(`   ✅ Cleared ${result.deletedCount} records from ${operation.name} collection`);
      } catch (error) {
        console.log(`   ❌ Failed to clear ${operation.name} collection:`, error.message);
      }
    }

    console.log("✅ All collections cleared successfully");

    // Seed in proper sequence
    const seeders = [
      { fn: mentorSeeder, name: "Mentor" },
      { fn: menteeSeeder, name: "Mentee" },
      { fn: discussionSeeder, name: "Discussion" },
      { fn: discussionReviewSeeder, name: "DiscussionReview" },
      { fn: donationSeeder, name: "Donation" },
      { fn: groupSeeder, name: "Group" },
      { fn: jobSeeder, name: "Job" },
      { fn: jobReviewSeeder, name: "JobReview" },
      { fn: paymentSeeder, name: "Payment" },
      { fn: quizSeeder, name: "Quiz" },
      { fn: successSeeder, name: "Success" },
      { fn: successReviewSeeder, name: "SuccessReview" },
      { fn: scheduleSeeder, name: "Schedule" }
    ];

    console.log("🌱 Starting seeding process...");

    for (const seeder of seeders) {
      try {
        console.log(`   📝 Running ${seeder.name} seeder...`);
        const startTime = Date.now();
        await seeder.fn();
        const endTime = Date.now();
        console.log(`   ✅ ${seeder.name} seeder completed in ${endTime - startTime}ms`);
      } catch (error) {
        console.log(`   ❌ ${seeder.name} seeder failed:`, error.message);
        console.error(`   📊 Full error details for ${seeder.name}:`, error);
        // Continue with other seeders instead of stopping
      }
    }

    console.log("🎉 Database seeding completed successfully!");

  } catch (error) {
    console.error("💥 Fatal error during seeding process:", error);
    console.error("📊 Full error stack:", error.stack);
  } finally {
    // Close MongoDB connection
    console.log("🔌 Closing MongoDB connection...");
    try {
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed successfully");
    } catch (error) {
      console.error("❌ Error closing MongoDB connection:", error.message);
    }

    console.log("🏁 Seeding process finished");
    process.exit(0);
  }
}

runSeeds();