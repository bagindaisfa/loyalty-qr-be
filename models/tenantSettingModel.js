const db = require('./db');

exports.getSettingsByTenant = async (tenantId) => {
  const res = await db.query(
    `SELECT * FROM tenant_settings WHERE tenant_id = $1`,
    [tenantId]
  );
  return res.rows[0];
};

exports.updateSettingsByTenant = async (tenantId, data) => {
  const { reward_type, point_per_rupiah, min_transaction, card_mode_enabled } =
    data;

  const res = await db.query(
    `
    UPDATE tenant_settings
    SET reward_type = $1,
        point_per_rupiah = $2,
        min_transaction = $3,
        card_mode_enabled = $4,
        updated_at = NOW()
    WHERE tenant_id = $5
    RETURNING *;
    `,
    [
      reward_type,
      point_per_rupiah,
      min_transaction,
      card_mode_enabled,
      tenantId,
    ]
  );

  return res.rows[0];
};
