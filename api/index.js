const sharp = require('sharp');

module.exports = async (req, res) => {
  const {
    date='', time='', loc='', job='',
    SN='', SI='', LN='', LI='', NI='', BN='', BI=''
  } = req.query;

  const imgRes = await fetch('https://raw.githubusercontent.com/FTBQ/BY/refs/heads/main/ST.png');
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());

  // 한글 깨짐 방지: 유니코드 직접 인코딩
  function toSvgText(str) {
    return String(str).split('').map(c => {
      const code = c.charCodeAt(0);
      if (code > 127) return `&#${code};`;
      return c
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }).join('');
  }

  const svg = `<svg width="1200" height="500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&amp;display=swap');
        text { font-family: 'Noto Sans KR', Arial, sans-serif; fill: white; }
      </style>
    </defs>

    <!-- 상단: Date, Time, Loc, Job -->
    <text x="310" y="82"  font-size="16">${toSvgText(date)}</text>
    <text x="310" y="148" font-size="16">${toSvgText(time)}</text>
    <text x="870" y="82"  font-size="16">${toSvgText(loc)}</text>
    <text x="870" y="148" font-size="16">${toSvgText(job)}</text>

    <!-- 세이길로스 블록 -->
    <text x="210" y="272" font-size="20" font-weight="bold">${toSvgText(SN)}</text>
    <text x="210" y="300" font-size="13" fill="#cccccc">${toSvgText(SI)}</text>

    <!-- 로스트 페이퍼 블록 -->
    <text x="720" y="272" font-size="20" font-weight="bold">${toSvgText(LN)}</text>
    <text x="720" y="300" font-size="13" fill="#cccccc">${toSvgText(LI)}</text>

    <!-- 속하지 않은자 블록 -->
    <text x="210" y="430" font-size="13" fill="#cccccc">${toSvgText(NI)}</text>

    <!-- 보리소프 패밀리 블록 -->
    <text x="720" y="410" font-size="20" font-weight="bold">${toSvgText(BN)}</text>
    <text x="720" y="438" font-size="13" fill="#cccccc">${toSvgText(BI)}</text>
  </svg>`;

  const output = await sharp(imgBuffer)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-cache');
  res.end(output);
};
