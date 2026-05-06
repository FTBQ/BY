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
  const [fontMedium, fontSemiBold] = await Promise.all([
    fetch('https://github.com/FTBQ/BY/blob/main/BMDOHYEON_ttf.ttf').then(r => r.arrayBuffer()),
  ]);

  // satori로 텍스트 레이어 생성
  const svg = await satori(
    <div style={{ display: 'flex', width: '1200px', height: '500px', position: 'relative' }}>

      {/* 상단 4개 */}
      <div style={{ position: 'absolute', left: '310px', top: '66px',  fontSize: '16px', color: 'white', fontWeight: 400 }}>{date}</div>
      <div style={{ position: 'absolute', left: '310px', top: '132px', fontSize: '16px', color: 'white', fontWeight: 400 }}>{time}</div>
      <div style={{ position: 'absolute', left: '870px', top: '66px',  fontSize: '16px', color: 'white', fontWeight: 400 }}>{loc}</div>
      <div style={{ position: 'absolute', left: '870px', top: '132px', fontSize: '16px', color: 'white', fontWeight: 400 }}>{job}</div>

      {/* 세이길로스 블록 */}
      <div style={{ position: 'absolute', left: '210px', top: '256px', fontSize: '20px', color: 'white', fontWeight: 600 }}>{SN}</div>
      <div style={{ position: 'absolute', left: '210px', top: '284px', fontSize: '13px', color: '#cccccc', fontWeight: 400 }}>{SI}</div>

      {/* 로스트 페이퍼 블록 */}
      <div style={{ position: 'absolute', left: '720px', top: '256px', fontSize: '20px', color: 'white', fontWeight: 600 }}>{LN}</div>
      <div style={{ position: 'absolute', left: '720px', top: '284px', fontSize: '13px', color: '#cccccc', fontWeight: 400 }}>{LI}</div>

      {/* 속하지 않은자 블록 */}
      <div style={{ position: 'absolute', left: '210px', top: '414px', fontSize: '13px', color: '#cccccc', fontWeight: 400 }}>{NI}</div>

      {/* 보리소프 패밀리 블록 */}
      <div style={{ position: 'absolute', left: '720px', top: '394px', fontSize: '20px', color: 'white', fontWeight: 600 }}>{BN}</div>
      <div style={{ position: 'absolute', left: '720px', top: '422px', fontSize: '13px', color: '#cccccc', fontWeight: 400 }}>{BI}</div>

    </div>,
    {
      width: 1200,
      height: 500,
      fonts: [
        { name: 'MyFont', data: fontMedium,   weight: 400, style: 'normal' },
        { name: 'MyFont', data: fontSemiBold, weight: 600, style: 'normal' },
      ],
    }
  );

  // SVG → PNG 변환
  const resvg = new Resvg(svg);
  const textPng = resvg.render().asPng();

  // 베이스 이미지에 합성
  const output = await sharp(imgBuffer)
    .composite([{ input: textPng, top: 0, left: 0 }])
    .png()
    .toBuffer();

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-cache');
  res.end(output);
}
