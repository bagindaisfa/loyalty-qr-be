// models/ticketModel.js
const db = require('./db');

exports.createTicket = async ({ tenant_id, title, message }) => {
  const result = await db.query(
    `INSERT INTO support_tickets (tenant_id, title, message)
     VALUES ($1, $2, $3) RETURNING *`,
    [tenant_id, title, message]
  );
  return result.rows[0];
};

exports.getTicketsByTenant = async (tenant_id) => {
  const result = await db.query(
    `SELECT * FROM support_tickets WHERE tenant_id = $1 ORDER BY created_at DESC`,
    [tenant_id]
  );
  return result.rows;
};

exports.getAllTickets = async () => {
  const result = await db.query(
    `SELECT st.*, t.name AS tenant_name
     FROM support_tickets st
     JOIN tenants t ON st.tenant_id = t.id
     ORDER BY st.created_at DESC`
  );
  return result.rows;
};

exports.updateTicket = async ({ ticket_id, status, assigned_to }) => {
  const result = await db.query(
    `UPDATE support_tickets
     SET status = COALESCE($2, status),
         assigned_to = COALESCE($3, assigned_to),
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [ticket_id, status, assigned_to]
  );
  return result.rows[0];
};
