const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String },
  password: { type: String, required: true },  // ✅ bcrypt hashed password
  role: { type: String, required: true, enum: ["admin", "mentor", "mentee"] },
  blockedUsers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: []
  },
});

module.exports = mongoose.model("User", UserSchema);
