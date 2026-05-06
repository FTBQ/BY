const satori = require('satori').default;
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');

module.exports = async (req, res) => {
  const {
    date='', time='', loc='', job='',
    SN='', SI='', LN='', LI='', NI='', BN='', BI=''
  } = req.query;

  // 베이스 이미지
  const imgRes = await fetch('https://raw.githubusercontent.com/FTBQ/BY/refs/heads/main/ST.png');
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());

  // 폰트 로드
  const fontBuffer = await fetch(
    'https://github.com/FTBQ/BY/raw/refs/heads/main/BMDOHYEON_ttf.ttf'
  ).then(r => r.arrayBuffer());

  // ===== 좌표 기준값 =====
  const LEFT_A = 270;
  const LEFT_B = 870;

  const TOP_HEADER = 68;
  const HEADER_GAP = 70;

  const BLOCK_TITLE_GAP = 40;

  // ===== SVG 생성 =====
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '500px',
          position: 'relative'
        },
        children: [
          // 상단
          el(date, 310, TOP_HEADER, 17),
          el(time, 310, TOP_HEADER + HEADER_GAP, 17),
          el(loc,  950, TOP_HEADER, 17),
          el(job,  950, TOP_HEADER + HEADER_GAP, 17),

          // 세이길로스
          el(SN, LEFT_A, 268, 22, 'white', 'bold'),
          el(SI, LEFT_A, 268 + BLOCK_TITLE_GAP, 14, '#dddddd'),

          // 로스트 페이퍼
          el(LN, LEFT_B, 268, 22, 'white', 'bold'),
          el(LI, LEFT_B, 268 + BLOCK_TITLE_GAP, 14, '#dddddd'),

          // 속하지 않은자
          el(NI, LEFT_A, 458, 14, '#dddddd'),

          // 보리소프 패밀리
          el(BN, LEFT_B, 418, 22, 'white', 'bold'),
          el(BI, LEFT_B, 418 + BLOCK_TITLE_GAP, 14, '#dddddd'),
        ]
      }
    },
    {
      width: 1200,
      height: 500,
      fonts: [
        { name: 'MyFont', data: fontBuffer, weight: 400, style: 'normal' },
        { name: 'MyFont', data: fontBuffer, weight: 700, style: 'normal' },
      ],
    }
  );

  // SVG → PNG
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const textPng = resvg.render().asPng();

  // 합성
  const output = await sharp(imgBuffer)
    .composite([{ input: Buffer.from(textPng), top: 0, left: 0 }])
    .png()
    .toBuffer();

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-cache');
  res.end(output);
};

// ===== 텍스트 엘리먼트 =====
function el(content, x, y, size, color = 'white', weight = 'normal') {
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        left: x + 'px',
        top: y + 'px',
        fontSize: size + 'px',
        color: color,
        fontWeight: weight,
        fontFamily: 'MyFont',
        whiteSpace: 'nowrap',
      },
      children: content || '',
    }
  };
}
