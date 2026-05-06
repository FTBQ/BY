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

  // JSX 없이 satori 객체 방식으로 작성
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: { display: 'flex', width: '1200px', height: '500px', position: 'relative' },
        children: [
         /* 상단 4개 */
        el(date, 300, 55, 17, 'white'),
        el(time, 300, 110, 17, 'white'),
        el(loc,  780, 55, 17, 'white'),
        el(job,  780, 110, 17, 'white'),
        /* 세이길로스 */
        el(SN, 430, 195, 22, 'white', 'bold'),
        el(SI, 135, 248, 14, '#dddddd'),
        /* 로스트 페이퍼 */
        el(LN, 960, 195, 22, 'white', 'bold'),
        el(LI, 620, 248, 14, '#dddddd'),
        /* 속하지 않은자 */
        el(NI, 135, 390, 14, '#dddddd'),
        /* 보리소프 패밀리 */
        el(BN, 980, 336, 22, 'white', 'bold'),
        el(BI, 620, 390, 14, '#dddddd'),
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

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const textPng = resvg.render().asPng();

  const output = await sharp(imgBuffer)
    .composite([{ input: Buffer.from(textPng), top: 0, left: 0 }])
    .png()
    .toBuffer();

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-cache');
  res.end(output);
};

function el(content, x, y, size, color, weight = 'normal') {
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
      children: content,
    }
  };
}
