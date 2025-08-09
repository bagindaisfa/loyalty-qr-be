// routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const auth = require('../middleware/auth');

// Tenant routes
router.post(
  '/',
  auth.requireAuth,
  auth.requireRole('tenant'),
  ticketController.createTicket
);
router.get('/:tenant_id', ticketController.getTenantTickets); // Tenant lihat tiket mereka

// Admin routes
router.get(
  '/',
  auth.requireAuth,
  auth.requireRole('internal'),
  ticketController.getAllTickets
);
router.patch(
  '/:ticket_id',
  auth.requireAuth,
  auth.requireRole('internal'),
  ticketController.updateTicket
);

module.exports = router;
