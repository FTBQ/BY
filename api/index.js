const { createCanvas, loadImage, registerFont } = require('@napi-rs/canvas');

module.exports = async (req, res) => {
  const { date='', time='', loc='', job='', SN='', SI='', LN='', LI='', NI='', BN='', BI='' } = req.query;

  // 이미지 로드
  const baseImg = await loadImage('https://github.com/FTBQ/BY/blob/main/ST.png?raw=true');

  const canvas = createCanvas(1200, 500);
  const ctx = canvas.getContext('2d');

  // 배경 이미지 그리기
  ctx.drawImage(baseImg, 0, 0, 1200, 500);

  // 공통 텍스트 설정
  ctx.fillStyle = '#ffffff';

  // 상단 4개
  ctx.font = '17px sans-serif';
  ctx.fillText(date, 310, 85);
  ctx.fillText(time, 310, 155);
  ctx.fillText(loc,  950, 85);
  ctx.fillText(job,  950, 155);

  // 세이길로스 블록
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(SN, 270, 290);
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#dddddd';
  ctx.fillText(SI, 270, 320);

  // 로스트 페이퍼 블록
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(LN, 870, 290);
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#dddddd';
  ctx.fillText(LI, 870, 320);

  // 속하지 않은자 블록
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#dddddd';
  ctx.fillText(NI, 270, 470);

  // 보리소프 패밀리 블록
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(BN, 870, 440);
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#dddddd';
  ctx.fillText(BI, 870, 470);

  // PNG로 반환
  const buffer = await canvas.encode('png');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-cache');
  res.end(buffer);
};
