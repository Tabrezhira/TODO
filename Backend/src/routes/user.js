const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');



// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered',user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login (normal)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Login successful', token,user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

// JWT middleware
function authenticateJWT(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = user;
        next();
    });
}

// Admin-only middleware
async function adminOnly(req, res, next) {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Admin access only' });
    next();
}

// Block user route (admin only)
router.post('/block/:id', authenticateJWT, adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isBlocked: true },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User blocked', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Make user admin (admin only)
router.post('/make-admin/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isAdmin: true },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User is now admin', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove admin rights (admin only)
router.post('/remove-admin/:id', authenticateJWT, adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isAdmin: false },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User is no longer admin', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin route
router.get('/admin', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) return res.status(403).json({ error: 'Access denied' });
        res.json({ message: 'Welcome, admin!', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users (admin only)
router.get('/all', authenticateJWT, adminOnly, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Check user login status
router.get('/me', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;