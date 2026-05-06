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
          // 상단 4개
          el(date, 310, 66,  16, 'white'),
          el(time, 310, 132, 16, 'white'),
          el(loc,  870, 66,  16, 'white'),
          el(job,  870, 132, 16, 'white'),
          // 세이길로스
          el(SN, 210, 256, 20, 'white', 'bold'),
          el(SI, 210, 284, 13, '#cccccc'),
          // 로스트 페이퍼
          el(LN, 720, 256, 20, 'white', 'bold'),
          el(LI, 720, 284, 13, '#cccccc'),
          // 속하지 않은자
          el(NI, 210, 414, 13, '#cccccc'),
          // 보리소프 패밀리
          el(BN, 720, 394, 20, 'white', 'bold'),
          el(BI, 720, 422, 13, '#cccccc'),
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
