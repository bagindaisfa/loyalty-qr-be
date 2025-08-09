// controllers/ticketController.js
const ticketModel = require('../models/ticketModel');

exports.createTicket = async (req, res) => {
  const tenant_id = req.user.tenant_id;
  const { title, message } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title wajib diisi.' });
  }

  try {
    const ticket = await ticketModel.createTicket({
      tenant_id,
      title,
      message,
    });
    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal membuat tiket.' });
  }
};

exports.getTenantTickets = async (req, res) => {
  const { tenant_id } = req.params;
  try {
    const tickets = await ticketModel.getTicketsByTenant(tenant_id);
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil tiket.' });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.getAllTickets();
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil semua tiket.' });
  }
};

exports.updateTicket = async (req, res) => {
  const { ticket_id } = req.params;
  const { status } = req.body;
  const assigned_to = req.user.email;

  try {
    const ticket = await ticketModel.updateTicket({
      ticket_id,
      status,
      assigned_to,
    });
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui tiket.' });
  }
};
