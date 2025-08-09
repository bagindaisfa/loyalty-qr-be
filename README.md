# loyalty-qr-be

| Kategori | Endpoint                                   | Fungsi                   |
| -------- | ------------------------------------------ | ------------------------ |
| Claim    | `POST /api/claim/:code`                    | Klaim poin dari QR       |
| Redeem   | `POST /api/redeem`                         | Tukar poin pelanggan     |
| QR       | `POST /api/qr/static`                      | Buat QR statis           |
| Tenant   | `GET /api/tenant`                          | Lihat semua tenant       |
| Admin    | `POST /api/admin/tenant`                   | Tambah tenant baru       |
| Admin    | `GET /api/admin/tenant/:tenant_id/users`   | Daftar pelanggan tenant  |
| Admin    | `GET /api/admin/tenant/:tenant_id/history` | Histori transaksi tenant |
| User     | `GET /api/user/balance/:phone`             | Saldo pelanggan          |
| User     | `GET /api/user/history/:phone`             | Histori pelanggan        |

🔐 Endpoint yang akan kita proteksi:
Endpoint Role yang boleh akses
POST /api/admin/tenant internal
GET /api/admin/tenant/:tenant_id/users internal
GET /api/admin/tenant/:tenant_id/history internal
POST /api/qr/static internal
