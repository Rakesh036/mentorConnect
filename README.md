# MentorConnect Platform

A platform connecting mentors and mentees for professional guidance and learning.

## 🚀 Setup Instructions

### 1. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
# Uncomment ONE of the following MongoDB URLs:
MONGODB_URL=mongodb://localhost:27017/mentorconnect
# MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mentorconnect

# Storage Configuration
# Uncomment ONE of the following storage types:
STORAGE_TYPE=local
# STORAGE_TYPE=cloudinary

# If using Cloudinary, add these credentials:
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

# Other Required Environment Variables
PORT=3000
SESSION_SECRET=your_session_secret
```

### 2. Installation

```bash
# Install dependencies
npm install

# Seed the database with initial data
npm run seed

# Start the development server
npm run dev
```

## 💻 Available Scripts

- `npm run dev` - Start the development server with nodemon
- `npm run seed` - Run database seeders

## 🤝 Mentor-Mentee Connection Flow

### 1. Connection Request
- Mentee can send a connection request to a mentor
- Mentor receives the request and can accept/reject it

### 2. Session Booking
1. After connection is accepted, mentee can:
   - View mentor's available schedule
   - Select an available time slot
   - Complete payment for the session

### 3. Chat Session
- Chat is only available during the booked time slot
- Messages can be exchanged between mentor and mentee
- Chat functionality is automatically disabled after the session ends

## 💼 Job Section Features

### Role-Based Actions
- **Refer Button**: Only visible to mentors who are not the job owner
- **Apply Button**: Only visible to mentees
- Job owner can manage their posted jobs (edit/delete)

## 💰 Donation System

### Transparent Donation Tracking
- **Transaction ID**: 
  - Visible only to the donor
  - Shows as "****" to other users
- **Donation Amount**: 
  - Visible to all users for transparency
  - Shows donor's ID for accountability
- **Donation History**: 
  - Accessible to all users
  - Maintains transparency while protecting sensitive information

## 🔒 Security Features
- Secure authentication using Passport.js
- Session management with express-session
- MongoDB connection with proper error handling
- File upload security with multer

## 🛠️ Tech Stack
- Node.js & Express.js
- MongoDB with Mongoose
- EJS for templating
- Socket.IO for real-time chat
- Passport.js for authentication
- Cloudinary for cloud storage
- Winston for logging

## 🔮 Future Development Plans

### Phase 1: Frontend Migration
- Convert current EJS templates to modern frontend framework
- Primary candidates:
  - Next.js (for better SEO and server-side rendering)
  - React (for enhanced user experience)
- Benefits:
  - Better state management
  - Improved performance
  - Enhanced user interface
  - Better code organization
  - Easier maintenance

### Phase 2: Feature Enhancements
- Implement real-time notifications
- Add video calling capabilities
- Enhanced analytics dashboard
- Mobile application development

## 📝 Notes
- Make sure to have MongoDB running locally if using local database
- For production, use MongoDB Atlas URL
- Choose either local storage or Cloudinary based on your needs
- All sensitive credentials should be kept in .env file 