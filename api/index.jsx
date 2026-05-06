import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

export default async function handler(req, res) {
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

  // satori로 텍스트 레이어 생성
  const svg = await satori(
    <div style={{ display: 'flex', width: '1200px', height: '500px', position: 'relative' }}>

      {/* 상단 4개 */}
      <div style={{ position: 'absolute', left: '310px', top: '66px',  fontSize: '16px', color: 'white' }}>{date}</div>
      <div style={{ position: 'absolute', left: '310px', top: '132px', fontSize: '16px', color: 'white' }}>{time}</div>
      <div style={{ position: 'absolute', left: '870px', top: '66px',  fontSize: '16px', color: 'white' }}>{loc}</div>
      <div style={{ position: 'absolute', left: '870px', top: '132px', fontSize: '16px', color: 'white' }}>{job}</div>

      {/* 세이길로스 블록 */}
      <div style={{ position: 'absolute', left: '210px', top: '256px', fontSize: '20px', color: 'white', fontWeight: 'bold' }}>{SN}</div>
      <div style={{ position: 'absolute', left: '210px', top: '284px', fontSize: '13px', color: '#cccccc' }}>{SI}</div>

      {/* 로스트 페이퍼 블록 */}
      <div style={{ position: 'absolute', left: '720px', top: '256px', fontSize: '20px', color: 'white', fontWeight: 'bold' }}>{LN}</div>
      <div style={{ position: 'absolute', left: '720px', top: '284px', fontSize: '13px', color: '#cccccc' }}>{LI}</div>

      {/* 속하지 않은자 블록 */}
      <div style={{ position: 'absolute', left: '210px', top: '414px', fontSize: '13px', color: '#cccccc' }}>{NI}</div>

      {/* 보리소프 패밀리 블록 */}
      <div style={{ position: 'absolute', left: '720px', top: '394px', fontSize: '20px', color: 'white', fontWeight: 'bold' }}>{BN}</div>
      <div style={{ position: 'absolute', left: '720px', top: '422px', fontSize: '13px', color: '#cccccc' }}>{BI}</div>

    </div>,
    {
      width: 1200,
      height: 500,
      fonts: [
        { name: 'MyFont', data: fontBuffer, weight: 400, style: 'normal' },
        { name: 'MyFont', data: fontBuffer, weight: 700, style: 'normal' },
      ],
    }
  );

  // SVG → PNG 변환 (sharp 없이 resvg만 사용)
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  const textPng = resvg.render().asPng();

  // 베이스 이미지에 합성
  const output = await sharp(imgBuffer)
    .composite([{ input: Buffer.from(textPng), top: 0, left: 0 }])
    .png()
    .toBuffer();

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-cache');
  res.end(output);
}
