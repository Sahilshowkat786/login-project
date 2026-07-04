require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const User = require("./models/User.js");

const app = express();
const PORT = process.env.PORT || 3000;

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ================= MONGODB CONNECTION =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// ================= ROUTES =================

// Home page (frontend)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Test route
app.get("/test", (req, res) => {
    res.send("Backend Connected 🚀");
});

// ================= SIGNUP ROUTE =================
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // simple check (optional but useful)
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send("User already exists ❌");
        }

        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        res.send("User Registered Successfully ✅");

    } catch (error) {
        console.log(error);
        res.send("Error registering user ❌");
    }
});
// login route

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.send("User not found ❌");
        }

        if (user.password !== password) {
            return res.send("Incorrect password ❌");
        }

        res.send("Login Successful ✅");

    } catch (error) {
        console.log(error);
        res.send("Login Error ❌");
    }
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});