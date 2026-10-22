/**
 * VERCEL SERVERLESS API — LƯU & ĐỒNG BỘ LỜI CHÚC / XÁC NHẬN THAM DỰ (RSVP)
 * Bảo mật 2 chiều bằng chữ ký số bất đối xứng ECDSA P-256 (SHA-256):
 * 1. POST /api/rsvp: Chỉ chấp nhận lời chúc từ khách mời có chữ ký URL (sig) hợp lệ. Chặn 100% spam/giả mạo.
 * 2. GET  /api/rsvp: Chỉ trả danh sách lời chúc khi có chữ ký xác thực Chủ Nhân (từ máy Local Studio của bạn).
 */

const crypto = require('crypto');

const PUBLIC_KEY_JWK = {
  kty: 'EC',
  crv: 'P-256',
  x: '70Qw8HWOZ6jmazJeOAOT7EFfwkLydG2kUyNp1xrj7eM',
  y: 'Ix4XuJE7x95PleGXUsppjfxue77jmFKFNNnmjm2N46w'
};

// Kênh lưu trữ đám mây ngầm (chỉ tồn tại trên Server Vercel, ẩn hoàn toàn khỏi F12 của khách)
const SECRET_CLOUD_TOPIC = process.env.RSVP_CLOUD_TOPIC || 'fptu2026_bcc_rsvp_prod_7a9c4e2b8d1f6a3c5e0b9d2f';

function b64uToBytes(b64u) {
  const b64 = String(b64u || '').replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  return Buffer.from(b64 + pad, 'base64');
}

async function verifyEcdsaSignature(payloadStr, sigB64u) {
  try {
    if (!sigB64u) return false;
    const pubKey = await crypto.subtle.importKey(
      'jwk',
      PUBLIC_KEY_JWK,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify']
    );
    return await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      pubKey,
      b64uToBytes(sigB64u),
      new TextEncoder().encode(payloadStr)
    );
  } catch (_) {
    return false;
  }
}

module.exports = async (req, res) => {
  // Cho phép Local Studio (http://localhost:8088) gọi lên đọc lời chúc
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Ts, X-Admin-Sig');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // =========================================================================
  // 1. KHÁCH MỜI GỬI LỜI CHÚC & XÁC NHẬN THAM DỰ (POST /api/rsvp)
  // =========================================================================
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const name = String(body.name || '').trim().slice(0, 60);
      const note = String(body.note || '').trim().slice(0, 240);
      const sig = String(body.sig || '').trim();
      const status = body.status === 'remote' ? 'remote' : 'attending';
      const wish = String(body.wish || '').trim().slice(0, 500);

      if (!name || !wish) {
        return res.status(400).json({ ok: false, error: 'Thiếu tên hoặc lời chúc' });
      }

      // Bắt buộc phải có chữ ký số ECDSA P-256 hợp lệ từ đường dẫn mời
      const expectedMsg = `FPTU2026|${name}|${note}`;
      const verified = await verifyEcdsaSignature(expectedMsg, sig);
      if (!verified) {
        return res.status(403).json({ ok: false, error: 'Chỉ khách mời có đường dẫn chính thức mới gửi được lời chúc' });
      }

      const record = {
        name,
        status,
        wish,
        verified,
        time: Date.now()
      };

      const resp = await fetch(`https://ntfy.sh/${SECRET_CLOUD_TOPIC}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        },
        body: JSON.stringify(record)
      });

      if (!resp.ok) {
        return res.status(502).json({ ok: false, error: 'Không thể lưu lên Cloud' });
      }

      return res.status(200).json({ ok: true, record });
    } catch (err) {
      return res.status(500).json({ ok: false, error: 'Lỗi máy chủ' });
    }
  }

  // =========================================================================
  // 2. CHỦ NHÂN XEM DANH SÁCH LỜI CHÚC TỪ MÁY CÁ NHÂN (GET /api/rsvp)
  // =========================================================================
  if (req.method === 'GET') {
    try {
      const ts = String(req.headers['x-admin-ts'] || req.query.ts || '').trim();
      const adminSig = String(req.headers['x-admin-sig'] || req.query.sig || '').trim();

      const now = Date.now();
      const reqTime = Number(ts);
      if (!reqTime || Math.abs(now - reqTime) > 10 * 60 * 1000) {
        return res.status(403).json({ ok: false, error: 'Token xác thực Chủ Nhân đã hết hạn' });
      }

      const isOwner = await verifyEcdsaSignature(`FPTU2026_ADMIN_READ|${ts}`, adminSig);
      if (!isOwner) {
        return res.status(403).json({ ok: false, error: 'Từ chối truy cập: Chỉ Chủ Nhân có Private Key mới xem được lời chúc' });
      }

      const resp = await fetch(`https://ntfy.sh/${SECRET_CLOUD_TOPIC}/json?poll=1&since=all`);
      const text = await resp.text();
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

      const rsvpMap = {};
      for (const line of lines) {
        try {
          const evt = JSON.parse(line);
          if (evt && evt.event === 'message' && evt.message) {
            const data = JSON.parse(evt.message);
            if (data && data.name && data.wish) {
              const key = data.name.toLowerCase().trim();
              rsvpMap[key] = data;
            }
          }
        } catch (_) {}
      }

      return res.status(200).json({ ok: true, rsvps: rsvpMap });
    } catch (err) {
      return res.status(500).json({ ok: false, error: 'Không thể tải danh sách lời chúc' });
    }
  }

  return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
};
