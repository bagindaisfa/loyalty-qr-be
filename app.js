const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const qrRoutes = require('./routes/qrRoutes');
const claimRoutes = require('./routes/claimRoute');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const redeemRoutes = require('./routes/redeemRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const authRoutes = require('./routes/authRoutes');
const tenantAdminRoutes = require('./routes/tenantAdminRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

app.use('/api/tickets', ticketRoutes);
app.use('/api/tenant-admin', tenantAdminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/redeem', redeemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/user', userRoutes);
app.use('/api/claim', claimRoutes);

module.exports = app;
