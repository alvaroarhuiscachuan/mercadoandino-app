const express = require("express");
const os = require("os");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const app = express();
const PORT = process.env.PORT || 80;
const BUCKET_NAME = "mercadoandino-uploads-amac-01";
const REGION = "us-east-1";

const s3Client = new S3Client({ region: REGION });

app.get("/", (req, res) => {
  res.send(`MercadoAndino v1 - instancia: ${os.hostname()}\n`);
});

app.get("/health", (req, res) => {
  res.status(200).send("ok\n");
});

app.get("/api/upload-url", async (req, res) => {
  try {
    const filename = req.query.filename || `artesania-${Date.now()}.jpg`;
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `uploads/${filename}`,
      ContentType: "image/jpeg"
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    res.json({ uploadUrl: url, key: `uploads/${filename}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor MercadoAndino escuchando en el puerto ${PORT}`);
});
