const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../Models/User");

// Function to register
exports.register = async (req, res) => {
  try {
    const { fName, lName, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fName,
      lName,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Explicitly fetch isAdmin (along with password, email, id)
    const user = await User.findOne({
      where: { email },
      attributes: ["id", "email", "password", "isAdmin"], // <-- added isAdmin here
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin }, // ✅ include isAdmin
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
    console.log("Generated Token:", jwt.decode(token)); // Should now include isAdmin
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.userInfo = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ user: null, error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "fName", "lName", "email", "isAdmin"],
    });

    if (!user) {
      return res.status(404).json({ user: null, error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(401).json({ user: null, error: "Invalid token" });
  }
};
