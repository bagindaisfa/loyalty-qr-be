const db = require('./db');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

exports.generateQRCodes = async (tenantId, amount = 1) => {
  const insertValues = [];

  for (let i = 0; i < amount; i++) {
    const code = crypto.randomBytes(6).toString('hex'); // 12 char code
    insertValues.push({
      id: uuidv4(),
      tenant_id: tenantId,
      code,
      point_value: 1,
    });
  }

  const values = insertValues
    .map(
      (v, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`
    )
    .join(', ');

  const flatValues = insertValues.flatMap((v) => [
    v.id,
    v.tenant_id,
    v.code,
    v.point_value,
  ]);

  const query = `
    INSERT INTO qr_codes (id, tenant_id, code, point_value)
    VALUES ${values}
  `;

  await db.query(query, flatValues);

  return amount;
};

exports.generateStaticQR = async (tenantId) => {
  // Cek apakah sudah ada QR statis untuk tenant ini
  const existing = await db.query(
    `
    SELECT * FROM qr_codes 
    WHERE tenant_id = $1 AND is_used = FALSE AND expires_at IS NULL
    ORDER BY created_at ASC LIMIT 1
  `,
    [tenantId]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0]; // kembalikan QR lama
  }

  const code = `QR-${crypto.randomBytes(4).toString('hex')}`; // QR-ab12cd34
  const id = uuidv4();

  const result = await db.query(
    `
    INSERT INTO qr_codes (id, tenant_id, code, point_value)
    VALUES ($1, $2, $3, 1)
    RETURNING *
  `,
    [id, tenantId, code]
  );

  return result.rows[0];
};
