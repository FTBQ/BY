const sharp = require('sharp');

module.exports = async (req, res) => {
  const {
    date='', time='', loc='', job='',
    SN='', SI='', LN='', LI='', NI='', BN='', BI=''
  } = req.query;

  // 이미지 다운로드
  const imgRes = await fetch('https://raw.githubusercontent.com/FTBQ/BY/refs/heads/main/ST.png');
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());

  // SVG 텍스트 레이어 생성
  const svg = `
  <svg width="1200" height="500" xmlns="http://www.w3.org/2000/svg">
    <style>
      text { font-family: Arial, sans-serif; fill: white; }
    </style>

    <!-- 상단 4개 -->
    <text x="310" y="85"  font-size="17">${escXml(date)}</text>
    <text x="310" y="155" font-size="17">${escXml(time)}</text>
    <text x="950" y="85"  font-size="17">${escXml(loc)}</text>
    <text x="950" y="155" font-size="17">${escXml(job)}</text>

    <!-- 세이길로스 블록 -->
    <text x="270" y="290" font-size="22" font-weight="bold">${escXml(SN)}</text>
    <text x="270" y="320" font-size="14" fill="#dddddd">${escXml(SI)}</text>

    <!-- 로스트 페이퍼 블록 -->
    <text x="870" y="290" font-size="22" font-weight="bold">${escXml(LN)}</text>
    <text x="870" y="320" font-size="14" fill="#dddddd">${escXml(LI)}</text>

    <!-- 속하지 않은자 블록 -->
    <text x="270" y="470" font-size="14" fill="#dddddd">${escXml(NI)}</text>

    <!-- 보리소프 패밀리 블록 -->
    <text x="870" y="440" font-size="22" font-weight="bold">${escXml(BN)}</text>
    <text x="870" y="470" font-size="14" fill="#dddddd">${escXml(BI)}</text>
  </svg>`;

  const svgBuffer = Buffer.from(svg);

  // sharp로 이미지 위에 SVG 합성
  const output = await sharp(imgBuffer)
    .composite([{ input: svgBuffer, top: 0, left: 0 }])
    .png()
    .toBuffer();

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-cache');
  res.end(output);
};

function escXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
