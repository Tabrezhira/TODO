const express = require('express');
const router = express.Router();
const multer = require('multer');
const Todo = require('../models/Todo');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

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

// Create Todo (only logged-in users)
router.post('/', authenticateJWT, upload.single('img'), async (req, res) => {
    try {
        const todo = new Todo({
            title: req.body.title,
            img: req.file ? req.file.path : undefined,
            createdBy: req.user.id 
            
        });
      
        await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read all Todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find().populate('createdBy', 'username email');
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Read single Todo
router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id).populate('createdBy', 'username email');
        if (!todo) return res.status(404).json({ error: 'Todo not found' });
        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Todo
router.put('/:id', upload.single('img'), async (req, res) => {
    try {
        const update = {
            title: req.body.title,
            createdBy: req.body.createdBy
        };
        if (req.file) update.img = req.file.path;
        const todo = await Todo.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!todo) return res.status(404).json({ error: 'Todo not found' });
        res.json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete Todo
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).json({ error: 'Todo not found' });
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;