const express = require("express");
const router = express.Router();
const logger = require("../utils/logger")("referralRouter"); // Specify logger label
const emailService = require("../services/emailService");
const Job = require("../models/job");
const Mentee = require("../models/mentee/mentee");

// GET route to render referral form with dynamic mentees and job data
router.get("/:jobId/refer", async (req, res) => {
    try {
      const { jobId } = req.params;
  
      // Fetch job details and populate the owner field
      const job = await Job.findById(jobId).populate("owner");
      if (!job) {
        return res.status(404).send("Job not found");
      }
  
      // Verify that req.user is populated correctly
      const mentor = req.user; // Assumes authentication middleware adds req.user
      if (!mentor) {
        return res.status(401).send("Unauthorized: Mentor details not found");
      }
  
      // Fetch mentees and populate the user field
      const mentees = await Mentee.find({}).populate("user"); // Adjust query logic as needed
  
      const data = {
        jobId: job._id,
        ownerName: job.owner?.username || "N/A", // Default to "N/A" if owner name is missing
        mentorName: mentor.username || "N/A", // Default to "N/A" if mentor name is missing
        mentees: mentees.map((mentee) => ({
          _id: mentee._id,
          name: mentee.user?.username || "N/A", // Default to "N/A" if mentee name is missing
          profileLink: mentee.user?.profileLink || `mentee/profile/${mentee.user._id}`,
        })),
      };
  
      console.log("Data sent to EJS file...");
      console.log(data);
  
      res.render("jobReferFormWithAllMentee", data);
    } catch (error) {
      logger.error("Error fetching referral form data:", error);
      res.status(500).send("Failed to load referral form.");
    }
  });
  

// POST route to handle referral submission
router.post("/:jobId/refer", async (req, res) => {
  const { jobId } = req.params;
  const { ownerName, mentorName, mentee } = req.body;

  console.log("Received request:", req.body);

  try {
    // Fetch job details
    const job = await Job.findById(jobId).populate("owner");
    console.log("Fetched job details:", job);

    if (!job) {
      console.error("Job not found.");
      return res.status(404).send("Job not found");
    }

    // Fetch mentee details
    const menteeDetails = await Mentee.findById(mentee).populate("user");
    console.log("Fetched mentee details:", menteeDetails);

    if (!menteeDetails) {
      console.error("Mentee not found.");
      return res.status(404).send("Mentee not found");
    }

    // Construct email message for the job owner
    const jobOwnerEmail = job.owner.email; // Adjust field based on your User schema
    const menteeName = menteeDetails.user ? menteeDetails.user.username : "N/A";
    const menteeEmail = menteeDetails.user ? menteeDetails.user.email : null; // Adjust field based on your schema
    console.log(".......................................");
    console.log(menteeEmail);
    console.log(menteeDetails);
    const ownerMessage = `
      Hi ${ownerName},
      
      I, ${mentorName}, would like to refer a mentee for the job titled "${job.title}".
      
      Mentee Details:
      - Name: ${menteeName}
      - Profile Link: mentee/profile/${menteeDetails.user ? menteeDetails.user._id : "N/A"}
      
      Please consider their profile for the position.
      
      Best regards,
      ${mentorName}
    `;
    console.log("Constructed email message for job owner:", ownerMessage);

    // Send email to the job owner
    const ownerEmailResult = await emailService.sendMailToOneUser(
      jobOwnerEmail,
      `Referral for Job: ${job.title}`,
      ownerMessage
    );
    console.log("Email sent successfully to job owner:", jobOwnerEmail);

    // Construct email message for the mentee
    if (menteeEmail) {
      const menteeMessage = `
        Hi ${menteeName},
        
        I, ${mentorName}, have referred you for the job titled "${job.title}" at ${job.companyName}.
        
        Best of luck! Let me know if you have any questions or need further assistance.
        
        Regards,
        ${mentorName}
      `;
      console.log("Constructed email message for mentee:", menteeMessage);

      // Send email to the mentee
      const menteeEmailResult = await emailService.sendMailToOneUser(
        menteeEmail,
        `You have been referred for a job: ${job.title}`,
        menteeMessage
      );
      console.log("Email sent successfully to mentee:", menteeEmail);
    } else {
      console.warn("Mentee email not available. Skipping email to mentee.");
    }

    // Log the referral in the database
    job.refer.push({
      fromMentor: req.user._id, // Assumes req.user contains logged-in mentor's ID
      mentee: menteeDetails._id,
    });
    console.log("Added referral to job document:", {
      fromMentor: req.user._id,
      mentee: menteeDetails._id,
    });

    await job.save();
    console.log("Job document updated successfully.");

    res.status(200).send("Referral email sent successfully to both job owner and mentee.");
  } catch (error) {
    console.error("Error during referral process:", error);
    logger.error("Error sending referral email:", error);
    res.status(500).send("Failed to send referral email.");
  }
});

router.post('/:jobId/refer/accept', (req,res)=>{
  res.send("Welcome");    
});
  

module.exports = router;