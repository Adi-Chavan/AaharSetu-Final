const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Ensure correct model is used
const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["donor", "ngo", "volunteer","admin"].includes(role)) {     //add admin feature
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login a user
router.post("/login", (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).json({ message: info?.message || "Invalid credentials" });
    }

    req.logIn(user, async (err) => {
      if (err) return next(err);

      const loggedInUser = await User.findById(user._id).select("-password");

      res.json({
        message: "Login successful",
        user: loggedInUser,
      });
    });
  })(req, res, next);
});

// Check if user is logged in (for Navbar state)
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Logout user
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Error logging out" });

    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Error clearing session" });

      res.clearCookie("connect.sid"); // Clear session cookie
      res.json({ message: "Logged out successfully" });
    });
  });
});

module.exports = router;




// const express = require('express');
// const passport = require('passport');
// const bcrypt = require('bcryptjs');
// const User = require('../models/Donor');

// const router = express.Router();

// router.get('/login', (req, res) => res.render('login', { message: req.flash('error') }));
// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/login',
//     failureFlash: true
// }));

// router.get('/register', (req, res) => res.render('register'));
// router.post('/register', async (req, res) => {
//     const { name, email, password, role } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await new User({ name, email, password: hashedPassword, role }).save();
//     res.redirect('/login');
// });

// router.get('/dashboard', (req, res) => {
//     if (!req.isAuthenticated()) return res.redirect('/login');
//     res.render(`${req.user.role}-dashboard`, { user: req.user });
// });

// router.get('/logout', (req, res) => {
//     req.logout((err) => {
//         if (err) return next(err);
//         res.redirect('/login');
//     });
// });

// module.exports = router;