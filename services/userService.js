const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/admin/admin");
const Mentor = require("../models/mentor/mentor");
const Mentee = require("../models/mentee/mentee");

exports.register = async ({ username, password, email, role }) => {
  try {
    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    let roleDocument;
    switch (role) {
      case "admin":
        roleDocument = new Admin({ user: user._id });
        break;
      case "mentor":
        roleDocument = new Mentor({ user: user._id });
        break;
      case "mentee":
        roleDocument = new Mentee({ user: user._id });
        break;
    }

    if (roleDocument) await roleDocument.save();

    // ✅ issue JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { user, token };
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};
