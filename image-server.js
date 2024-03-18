const express = require('express');
const fs = require('fs').promises;
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 8090;

app.use(cors());

// 이미지를 리사이징하고 base64로 인코딩하여 응답하는 미들웨어
app.get('/image-server/profiles/:filename/:size', async (req, res) => {
  const { filename } = req.params;
  const { size } = parseInt(req.params);
  const imagePath = path.join(__dirname, 'profiles', filename);
  const extension = path.extname(imagePath).toLowerCase();

  try {
    //이미지 리사이징
    const resizedImageBuffer = await sharp(imagePath)
      .resize(size, size) // 리사이징할 크기 지정
      .toBuffer();

    // 이미지를 base64로 인코딩
    const base64Image = resizedImageBuffer.toString('base64');


    // 응답 보내기
    res.json({
      contentType: `image/${extension}`,
      data: base64Image
    });
  } catch (err) {
    console.log(err);
    // 이미지 처리 중 에러가 발생한 경우
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
