const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title:   { type: String, required: true },
    img:     { type: String }, // URL or path to image
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Todo', todoSchema);