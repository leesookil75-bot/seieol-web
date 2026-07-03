// 바로청소 → 텔레그램 알림 (Vercel 무료 서버리스 함수)
// 환경변수 필요: TELEGRAM_TOKEN, TELEGRAM_CHAT_ID  (Vercel 프로젝트 설정에 등록)
module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ ok: false, reason: 'method' }); return; }

  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) { res.status(200).json({ ok: false, reason: 'not-configured' }); return; }

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};

  const cat = b.category || '요청';
  const addr = b.address || '위치 미입력';
  const rno = b.receiptNo || '';
  const photos = b.photoCount ? `\n📷 사진 ${b.photoCount}장` : '';
  const map = (b.lat && b.lng) ? `\n📍 https://maps.google.com/?q=${b.lat},${b.lng}` : '';
  const text =
    `🔔 새 청소요청\n\n` +
    `▪ 유형 : ${cat}\n` +
    `▪ 위치 : ${addr}${map}${photos}\n` +
    `▪ 접수번호 : ${rno}\n\n` +
    `▶ 관리자 화면 : https://seieol-web.vercel.app/baro/admin.html`;

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true })
    });
    const j = await r.json();
    res.status(200).json({ ok: j.ok === true });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e) });
  }
};
