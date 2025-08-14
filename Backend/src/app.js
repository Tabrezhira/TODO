require('dotenv').config();
require('./config/db')();
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Adjust origin as needed
app.use(express.json());
app.use(cookieParser());
const todoRoutes = require('./routes/todo');
app.use('/todos', todoRoutes);
app.use('/uploads', express.static('uploads'));

const userRoutes = require('./routes/user');


app.use('/users', userRoutes);

app.get('/', (req, res) => res.send('Hello World'));
app.listen(3000, () => console.log('Server running on port 3000'));