// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===========================
// SIGNUP
// ===========================
exports.signup = async (req, res) => {
  console.log("\n📩 [SIGNUP] Incoming request:", req.body);

  try {
    const { username, email, password, avatarLabel } = req.body;

    console.log("🔎 Checking if username exists...");
    if (await User.findOne({ username })) {
      console.log("❌ Username already exists:", username);
      return res.status(400).json({ message: "Username already exists" });
    }

    console.log("🔎 Checking if email exists...");
    if (await User.findOne({ email })) {
      console.log("❌ Email already registered:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("📝 Creating new user...");
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatarLabel
    });

    console.log("✅ User created successfully:", user._id);

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET
    );

    console.log("🎫 JWT token generated for:", user.username);

    res.status(201).json({ message: "User created", token });
  } catch (err) {
    console.log("🔥 [SIGNUP ERROR]:", err.message);
    res.status(500).json({ error: err.message });
  }
};
// ===========================
// LOGIN
// ===========================
exports.login = async (req, res) => {
  console.log("\n📩 [LOGIN] Incoming request:", req.body);

  try {
    const { emailOrUsername, password } = req.body;

    console.log(`🔎 Looking for user: ${emailOrUsername}`);
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      console.log("❌ User not found:", emailOrUsername);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("🔐 Comparing password...");
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      console.log("❌ Wrong password for user:", user.username);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ Password correct! Generating token...");
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET
    );

    console.log(`🎫 Login successful for user: ${user.username}`);

    // ✅ Ici on ajoute username dans la réponse
    res.json({
      message: "Login successful",
      token,
      avatarLabel: user.avatarLabel,
      username: user.username  // <-- ajouté
    });
  } catch (err) {
    console.log("🔥 [LOGIN ERROR]:", err.message);
    res.status(500).json({ error: err.message });
  }
};