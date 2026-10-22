/**
 * LUXURY GRADUATION INVITATION — FPT UNIVERSITY CẦN THƠ
 * Trải nghiệm thiệp mời sang trọng, tối giản, mượt mà dành riêng cho bạn bè
 */

(() => {
  'use strict';

  const STORAGE_KEY_RSVPS = 'fptu_grad_rsvps_v7';

  const CEREMONY = {
    title: 'Lễ Tốt Nghiệp — Đại học FPT Cần Thơ',
    cohort: 'Năm 2026',
    dateStr: 'Chủ Nhật, 25/10/2026',
    timeStr: '10:00 Sáng – 11:00 Sáng',
    school: 'Đại học FPT Cần Thơ',
    venue: 'Hội trường chính — Số 600, Nguyễn Văn Cừ nối dài, P. An Bình, Q. Ninh Kiều, TP. Cần Thơ',
    phone: '0774 889 191',
    phoneRaw: '+84774889191',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=FPT+University+Can+Tho+600+Nguyen+Van+Cu+Noi+Dai+An+Binh+Can+Tho',
    defaultProse: '“Hành trình thanh xuân và nỗ lực tại Đại học FPT Cần Thơ sắp khép lại bằng một cột mốc ý nghĩa. Mình rất mong được đón tiếp và cùng bạn lưu lại những khung hình kỷ niệm thật đẹp trong ngày đặc biệt này.”'
  };

  const WISH_PRESETS = [
    'Chúc mừng tân cử nhân FPT Cần Thơ! Chúc bạn bước sang chặng đường mới thật rực rỡ, thành công vượt bậc và luôn giữ vững đam mê!',
    'Mừng bạn tốt nghiệp! Bao đêm thức trắng chạy đồ án nay đã hái quả ngọt. Hẹn gặp sáng 25/10 chụp thật nhiều ảnh kỷ niệm nhé!',
    'Chúc mừng cột mốc đáng tự hào! Chúc dân Thiết kế + Coder ra trường dự án nào cũng mượt, sự nghiệp thăng hoa!',
    'Mừng bạn khép lại hành trình rực rỡ tại FPTU. Chúc chặng đường phía trước luôn thuận buồm xuôi gió và ngập tràn niềm vui!'
  ];

  let activeGuest = {
    name: 'Bạn của mình',
    note: '',
    sig: ''
  };

  let wishCounter = 0;

  // =========================================================================
  // 1. ÂM THANH CHIME DỊU NHẸ (WEB AUDIO API)
  // =========================================================================
  function playPleasantChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const frequencies = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6 (Hòa âm D Major thanh thoát)

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.95);
      });
    } catch (_) {}
  }

  // =========================================================================
  // 2. HIỆU ỨNG BỤI VÀNG LẤP LÁNH (ELEGANT GOLD DUST PARTICLES)
  // =========================================================================
  const canvas = document.getElementById('glitter-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  let animId = null;

  function burstGlitter(count = 38) {
    if (!canvas || !ctx) return;
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

    const palette = ['#D4AF37', '#F3E5AB', '#C5A880', '#FAF6EE', '#E2D9C8'];
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.42;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 3.5 + Math.random() * 6.5;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 2.5 + Math.random() * 3.5,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1,
        decay: 0.012 + Math.random() * 0.008
      });
    }

    if (!animId) {
      const loop = () => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.16; // gravity
          p.vx *= 0.98;
          p.alpha -= p.decay;

          if (p.alpha > 0) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });

        particles = particles.filter((p) => p.alpha > 0 && p.y < window.innerHeight);
        if (particles.length > 0) {
          animId = requestAnimationFrame(loop);
        } else {
          animId = null;
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
      };
      animId = requestAnimationFrame(loop);
    }
  }

  function showToast(message) {
    const box = document.getElementById('toast-container');
    if (!box) return;
    const el = document.createElement('div');
    el.className = 'toast-item';
    el.textContent = message;
    box.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s ease';
      setTimeout(() => el.remove(), 320);
    }, 2800);
  }

  // =========================================================================
  // 3. XÁC THỰC CHỮ KÝ SỐ ECDSA P-256 CHỐNG GIẢ MẠO / SỬA LINK (ZERO-TRUST)
  // =========================================================================
  const PUBLIC_KEY_JWK = {
    kty: 'EC',
    crv: 'P-256',
    x: '70Qw8HWOZ6jmazJeOAOT7EFfwkLydG2kUyNp1xrj7eM',
    y: 'Ix4XuJE7x95PleGXUsppjfxue77jmFKFNNnmjm2N46w'
  };

  function b64uToBytes(b64u) {
    const b64 = String(b64u || '').replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
    const bin = atob(b64 + pad);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }

  async function verifyGuestSignature(name, note, sigB64u) {
    try {
      if (!sigB64u || !window.crypto || !window.crypto.subtle) return false;
      const pubKey = await window.crypto.subtle.importKey(
        'jwk',
        PUBLIC_KEY_JWK,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['verify']
      );
      const msg = `FPTU2026|${name.trim()}|${note.trim()}`;
      const sigBytes = b64uToBytes(sigB64u);
      return await window.crypto.subtle.verify(
        { name: 'ECDSA', hash: 'SHA-256' },
        pubKey,
        sigBytes,
        new TextEncoder().encode(msg)
      );
    } catch (_) {
      return false;
    }
  }

  async function parseUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    const rawName = (params.get('to') || params.get('name') || '').trim().slice(0, 60);
    const rawNote = (params.get('note') || '').trim().slice(0, 240);
    const sig = (params.get('s') || '').trim();
    const state = params.get('state') || params.get('stage');

    if (rawName) {
      const isValid = await verifyGuestSignature(rawName, rawNote, sig);
      if (isValid) {
        activeGuest.name = rawName;
        activeGuest.note = rawNote;
        activeGuest.sig = sig;
      } else {
        // Phát hiện link tự sửa tên hoặc không có chữ ký ECDSA hợp lệ -> Chặn & đưa về mặc định
        activeGuest.name = 'Bạn của mình';
        activeGuest.note = '';
        activeGuest.sig = '';
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    } else {
      activeGuest.name = 'Bạn của mình';
      activeGuest.note = '';
      activeGuest.sig = '';
    }

    renderGuestToPage();

    if (state === 'opened' || state === 'card') {
      openInvitationImmediate();
    }
  }

  function renderGuestToPage() {
    const name = activeGuest.name;
    const envGuestEl = document.getElementById('env-guest-name');
    const cardGuestEl = document.getElementById('card-guest-name');
    const stubGuestLabel = document.getElementById('stub-guest-label');
    const proseEl = document.getElementById('card-custom-prose');

    if (envGuestEl) envGuestEl.textContent = name;
    if (cardGuestEl) cardGuestEl.textContent = name;
    if (stubGuestLabel) stubGuestLabel.textContent = name;

    if (proseEl) {
      proseEl.textContent = activeGuest.note ? `“${activeGuest.note}”` : CEREMONY.defaultProse;
    }

    document.title = `Thiệp Mời Tốt Nghiệp gửi ${name} — ĐH FPT Cần Thơ`;

    checkExistingRsvp();
  }

  // =========================================================================
  // 4. HIỆU ỨNG MỞ PHONG BÌ 3D
  // =========================================================================
  function triggerOpenEnvelope() {
    if (document.body.dataset.state === 'opened' || document.body.dataset.state === 'opening') return;
    playPleasantChime();
    burstGlitter(32);
    document.body.dataset.state = 'opening';

    setTimeout(() => {
      document.body.dataset.state = 'opened';
      const replayBtn = document.getElementById('btn-close-envelope');
      if (replayBtn) replayBtn.classList.remove('hidden');
      burstGlitter(42);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 750);
  }

  function openInvitationImmediate() {
    document.body.dataset.state = 'opened';
    const replayBtn = document.getElementById('btn-close-envelope');
    if (replayBtn) replayBtn.classList.remove('hidden');
  }

  function closeInvitation() {
    document.body.dataset.state = 'sealed';
    const replayBtn = document.getElementById('btn-close-envelope');
    if (replayBtn) replayBtn.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // 6. PHÚC ĐÁP (RSVP) & LƯU LỜI CHÚC
  // =========================================================================
  function getStoredRsvps() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_RSVPS) || '{}');
    } catch (_) {
      return {};
    }
  }

  function checkExistingRsvp() {
    const all = getStoredRsvps();
    const guestKey = activeGuest.name.toLowerCase().trim();
    const rsvp = all[guestKey];

    const formEl = document.getElementById('rsvp-form');
    const confirmedEl = document.getElementById('confirmed-rsvp-box');
    const quoteEl = document.getElementById('confirmed-wish-quote');
    const badgeEl = document.getElementById('confirmed-status-text');

    if (rsvp) {
      if (formEl) formEl.classList.add('hidden');
      if (confirmedEl) confirmedEl.classList.remove('hidden');
      if (quoteEl) quoteEl.textContent = `“${rsvp.wish}”`;
      if (badgeEl) {
        badgeEl.textContent = rsvp.status === 'attending'
          ? '✓ SẼ ĐẾN CHUNG VUI VÀO 25.10.2026'
          : '✦ ĐÃ GỬI LỜI CHÚC TỪ XA';
      }
    } else {
      if (formEl) formEl.classList.remove('hidden');
      if (confirmedEl) confirmedEl.classList.add('hidden');
    }
  }

  function initRsvpInteractions() {
    const form = document.getElementById('rsvp-form');
    const wishInput = document.getElementById('wish-input');
    const suggestBtn = document.getElementById('btn-suggest-wish');
    const editBtn = document.getElementById('btn-edit-rsvp');
    const downloadBtn = document.getElementById('btn-download-pass');

    if (suggestBtn && wishInput) {
      suggestBtn.addEventListener('click', () => {
        wishInput.value = WISH_PRESETS[wishCounter % WISH_PRESETS.length];
        wishCounter++;
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const checked = form.querySelector('input[name="attendance"]:checked');
        const status = checked ? checked.value : 'attending';
        const wish = (wishInput && wishInput.value.trim()) ? wishInput.value.trim() : WISH_PRESETS[0];

        const record = {
          name: activeGuest.name,
          status,
          wish,
          time: Date.now()
        };

        const all = getStoredRsvps();
        all[activeGuest.name.toLowerCase().trim()] = record;
        try {
          localStorage.setItem(STORAGE_KEY_RSVPS, JSON.stringify(all));
        } catch (_) {}

        // Đồng bộ lời chúc & xác nhận tham dự lên Server Vercel (/api/rsvp) kèm chữ ký ECDSA P-256
        if (activeGuest.sig) {
          fetch('/api/rsvp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: activeGuest.name,
              note: activeGuest.note || '',
              sig: activeGuest.sig,
              status,
              wish
            })
          }).catch(() => {});
        }

        playPleasantChime();
        burstGlitter(45);
        checkExistingRsvp();
        showToast('Cảm ơn bạn! Đã ghi nhận phản hồi và lời chúc.');
      });
    }

    if (editBtn) {
      editBtn.addEventListener('click', () => {
        const formEl = document.getElementById('rsvp-form');
        const confirmedEl = document.getElementById('confirmed-rsvp-box');
        if (formEl) formEl.classList.remove('hidden');
        if (confirmedEl) confirmedEl.classList.add('hidden');
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', downloadInvitationPassPng);
    }
  }

  // =========================================================================
  // 7. XUẤT ẢNH THIỆP MỜI CAO CẤP (PORTRAIT PNG KEEPSAKE)
  // =========================================================================
  async function downloadInvitationPassPng() {
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (_) {}
    }

    const all = getStoredRsvps();
    const guestKey = activeGuest.name.toLowerCase().trim();
    const rsvp = all[guestKey];

    const guestName = activeGuest.name;
    const wishText = rsvp && rsvp.wish ? rsvp.wish : WISH_PRESETS[0];
    const isAttending = !rsvp || rsvp.status === 'attending';

    // Kích thước chuẩn thiệp dọc cao cấp (1200 x 1680)
    const canvasEl = document.createElement('canvas');
    canvasEl.width = 1200;
    canvasEl.height = 1680;
    const c = canvasEl.getContext('2d');

    const SERIF = '"Newsreader", "Playfair Display", Georgia, serif';
    const SANS = '"Be Vietnam Pro", -apple-system, sans-serif';

    // 1. Nền lụa Cashmere Sáng Sang (Luminous Warm Cashmere)
    const bgGrad = c.createRadialGradient(600, 450, 120, 600, 840, 1100);
    bgGrad.addColorStop(0, '#FBF9F4');
    bgGrad.addColorStop(0.6, '#EFE8DA');
    bgGrad.addColorStop(1, '#E3D9C6');
    c.fillStyle = bgGrad;
    c.fillRect(0, 0, canvasEl.width, canvasEl.height);

    // 2. Tấm thiệp chính (Luminous Pearl Ivory)
    c.save();
    c.shadowColor = 'rgba(85, 68, 42, 0.18)';
    c.shadowBlur = 52;
    c.shadowOffsetY = 22;
    c.fillStyle = '#FFFEFA';
    c.fillRect(80, 80, 1040, 1520);
    c.restore();

    // 3. Khung viền chỉ vàng Champagne kép
    c.strokeStyle = '#B8934A';
    c.lineWidth = 2.2;
    c.strokeRect(80, 80, 1040, 1520);

    c.strokeStyle = 'rgba(184, 147, 74, 0.38)';
    c.lineWidth = 1.2;
    c.strokeRect(98, 98, 1004, 1484);

    // 4. Header cơ sở đào tạo
    c.fillStyle = '#B08A42';
    c.font = `600 16px ${SANS}`;
    c.textAlign = 'center';
    c.fillText('ĐẠI HỌC FPT CẦN THƠ · NĂM 2026', 600, 190);

    // 5. Lời mời đích danh
    c.fillStyle = '#787065';
    c.font = `500 18px ${SANS}`;
    c.fillText('TRÂN TRỌNG KÍNH MỜI BẠN', 600, 260);

    c.fillStyle = '#8B1E29';
    c.font = `italic 500 60px ${SERIF}`;
    c.fillText(guestName, 600, 336);

    // Đường gạch mảnh dưới tên
    const nameWidth = Math.min(c.measureText(guestName).width, 580);
    c.strokeStyle = 'rgba(139, 30, 41, 0.3)';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(600 - nameWidth / 2, 354);
    c.lineTo(600 + nameWidth / 2, 354);
    c.stroke();

    // 6. Tiêu đề buổi lễ
    c.fillStyle = '#1C1917';
    c.font = `500 68px ${SERIF}`;
    c.fillText('Lễ Tốt Nghiệp', 600, 460);

    c.fillStyle = '#6E665C';
    c.font = `italic 400 30px ${SERIF}`;
    c.fillText('Chủ Nhật, ngày 25 tháng 10 năm 2026', 600, 520);

    // Hoa văn phân cách
    c.strokeStyle = 'rgba(176, 138, 66, 0.38)';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(460, 570);
    c.lineTo(570, 570);
    c.moveTo(630, 570);
    c.lineTo(740, 570);
    c.stroke();
    c.fillStyle = '#B08A42';
    c.font = `14px ${SANS}`;
    c.fillText('◆', 600, 575);

    // 7. Đoạn văn tâm thư
    c.fillStyle = '#4A443D';
    c.font = `italic 400 24px ${SERIF}`;
    wrapTextCentered(
      c,
      '“Hành trình thanh xuân và nỗ lực tại Đại học FPT Cần Thơ sắp khép lại bằng một cột mốc ý nghĩa. Mình rất mong được đón tiếp bạn cùng chung vui và ghi lại những kỷ niệm đẹp trong ngày đặc biệt này.”',
      600,
      640,
      820,
      40
    );

    // 8. Hộp thông tin chi tiết
    c.fillStyle = '#F9F5EC';
    c.fillRect(160, 830, 880, 270);
    c.strokeStyle = '#E5DBC8';
    c.lineWidth = 1.2;
    c.strokeRect(160, 830, 880, 270);

    c.textAlign = 'left';
    c.fillStyle = '#B08A42';
    c.font = `600 15px ${SANS}`;
    c.fillText('THỜI GIAN & ĐỊA ĐIỂM TỔ CHỨC', 200, 880);

    c.fillStyle = '#1C1917';
    c.font = `600 22px ${SANS}`;
    c.fillText('10:00 Sáng — Chủ Nhật, 25/10/2026', 200, 922);

    c.fillStyle = '#4A443D';
    c.font = `400 19px ${SANS}`;
    c.fillText('Hội trường chính — Đại học FPT Cần Thơ', 200, 965);
    c.fillText('Số 600 Nguyễn Văn Cừ nối dài, P. An Bình, Q. Ninh Kiều, TP. Cần Thơ', 200, 1002);

    c.fillStyle = '#8B1E29';
    c.font = `600 17px ${SANS}`;
    c.fillText('Liên hệ đón tiếp: 0774 889 191 (+84 774 889 191)', 200, 1050);

    // 9. Con dấu & Lời chúc mừng
    c.fillStyle = '#FFFFFF';
    c.fillRect(160, 1140, 880, 240);
    c.strokeStyle = '#E5DBC8';
    c.lineWidth = 1.2;
    c.strokeRect(160, 1140, 880, 240);

    c.textAlign = 'center';
    c.fillStyle = isAttending ? '#1B6535' : '#8B1E29';
    c.font = `600 15px ${SANS}`;
    c.fillText(isAttending ? '✓ ĐÃ XÁC NHẬN SẼ THAM DỰ CHUNG VUI' : '✦ ĐÃ GỬI LỜI CHÚC MỪNG TỪ XA', 600, 1195);

    c.fillStyle = '#4A443D';
    c.font = `italic 400 22px ${SERIF}`;
    wrapTextCentered(c, `“${wishText}”`, 600, 1250, 800, 36);

    // 10. Chân trang
    c.fillStyle = '#8C8275';
    c.font = `500 13px ${SANS}`;
    c.fillText('THƯ MỜI LỄ TỐT NGHIỆP · ĐẠI HỌC FPT CẦN THƠ · 2026', 600, 1540);

    // Tải file ảnh
    const link = document.createElement('a');
    link.download = `Thiep-Moi-Tot-Nghiep-${guestName.replace(/\s+/g, '-')}.png`;
    link.href = canvasEl.toDataURL('image/png');
    link.click();
    showToast('Đã tải ảnh Thiệp Mời Kỷ Niệm (PNG)!');
  }

  function wrapTextCentered(ctx, text, x, startY, maxWidth, lineHeight) {
    const words = String(text || '').split(/\s+/);
    let line = '';
    let currentY = startY;

    for (let i = 0; i < words.length; i++) {
      const test = line ? `${line} ${words[i]}` : words[i];
      if (ctx.measureText(test).width > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = words[i];
        currentY += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) {
      ctx.fillText(line, x, currentY);
    }
  }

  // =========================================================================
  // 8. TẢI FILE LỊCH (.ICS)
  // =========================================================================
  function downloadIcsCalendar() {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FPTU Can Tho Graduation 2026//VN',
      'BEGIN:VEVENT',
      'UID:fptu-grad-20261025@fpt.edu.vn',
      'DTSTAMP:20261001T000000Z',
      'DTSTART:20261025T030000Z',
      'DTEND:20261025T040000Z',
      `SUMMARY:${CEREMONY.title}`,
      `DESCRIPTION:Lễ Tốt Nghiệp tại Đại học FPT Cần Thơ. Đón tiếp: ${CEREMONY.phone}`,
      `LOCATION:${CEREMONY.school}, ${CEREMONY.venue}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Le-Tot-Nghiep-FPTU-25-10-2026.ics';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã tải lịch hẹn vào điện thoại (.ics)!');
  }

  // =========================================================================
  // 8. KHỞI TẠO TƯƠNG TÁC
  // =========================================================================
  function initEvents() {
    parseUrlParameters();

    const waxBtn = document.getElementById('btn-wax-seal');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const replayBtn = document.getElementById('btn-close-envelope');
    const icsBtn = document.getElementById('btn-add-calendar');

    if (waxBtn) waxBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerOpenEnvelope();
    });

    if (envelopeWrapper) envelopeWrapper.addEventListener('click', triggerOpenEnvelope);

    if (replayBtn) replayBtn.addEventListener('click', closeInvitation);

    if (icsBtn) icsBtn.addEventListener('click', downloadIcsCalendar);

    // Chặn chuột phải & tổ hợp phím tắt DevTools (F12 / Ctrl+Shift+I / Ctrl+U)
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
      const k = e.key ? e.key.toUpperCase() : '';
      if (
        k === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C'].includes(k)) ||
        ((e.ctrlKey || e.metaKey) && k === 'U')
      ) {
        e.preventDefault();
      }
    });

    initRsvpInteractions();
  }

  if (document.getElementById('envelope-wrapper') || document.readyState !== 'loading') {
    initEvents();
  } else {
    document.addEventListener('DOMContentLoaded', initEvents);
  }
})();
