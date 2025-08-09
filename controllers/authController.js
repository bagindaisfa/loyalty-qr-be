const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

exports.register = async (req, res) => {
  const { email, password, role, tenant_id } = req.body;

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ message: 'Email, password, dan role wajib diisi.' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await authModel.createAdmin(email, hash, role, tenant_id);
    res.status(201).json({ message: 'Admin berhasil dibuat.', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal membuat akun admin.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await authModel.findByEmail(email);
    if (!admin)
      return res.status(401).json({ message: 'Email tidak ditemukan.' });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: 'Password salah.' });

    const token = jwt.sign(
      {
        id: admin.id,
        role: admin.role,
        tenant_id: admin.tenant_id,
        email: admin.email,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal login.' });
  }
};
