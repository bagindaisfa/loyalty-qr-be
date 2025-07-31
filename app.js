const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const qrRoutes = require('./routes/qrRoutes');
const claimRoutes = require('./routes/claimRoute');
// const userRoutes = require('./routes/userRoutes');

app.use('/api/qr', qrRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/claim', claimRoutes);

module.exports = app;
