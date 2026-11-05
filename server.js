const express = require('express');
const os = require('os');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const app = express();
const port = process.env.PORT || 80;
const bucket = process.env.BUCKET || 'mercadoandino-uploads-amac-01';
const s3 = new S3Client({ region: 'us-east-1' });

app.get('/health', (req, res) => res.status(200).send('ok'));

app.get('/api/upload-url', async (req, res) => {
  try {
    const key = `uploads/${Date.now()}-archivo.jpg`;
    const command = new PutObjectCommand({ Bucket: bucket, Key: key });
    const url = await getSignedUrl(s3, command, { expiresIn: 300 });
    res.json({ uploadUrl: url, key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  const hostname = os.hostname();
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MercadoAndino - Tienda Virtual</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; background: #fdfbf7; color: #2d3748; }
    header { background: #8B1E1E; color: #fff; padding: 1.5rem; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    header h1 { margin: 0; font-size: 2.3rem; }
    .badge { background: #D97706; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; color: white; }
    .hero { text-align: center; padding: 2rem 1rem; background: #fff3e0; border-bottom: 2px solid #e0c9a6; }
    .grid { display: flex; justify-content: center; gap: 20px; padding: 2rem; flex-wrap: wrap; max-width: 1100px; margin: 0 auto; }
    .card { background: white; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); width: 220px; padding: 1.2rem; text-align: center; border-top: 5px solid #8B1E1E; }
    .icon { font-size: 3.5rem; margin-bottom: 0.5rem; }
    .price { font-weight: bold; color: #8B1E1E; font-size: 1.3rem; margin: 10px 0; }
    footer { background: #1a202c; color: #a0aec0; text-align: center; padding: 1.2rem; margin-top: 2rem; }
    .status { color: #10B981; font-weight: bold; }
  </style>
</head>
<body>
  <header>
    <h1>🦙 MercadoAndino</h1>
    <p>Tienda Oficial de Artesanías y Textiles Peruanos en la Nube</p>
  </header>
  <div class="hero">
    <h2>Catálogo Tradicional de Productos</h2>
    <p><span class="badge">Versión 1.0</span> Arquitectura Escalable con Auto Scaling y Balanceador de Carga</p>
  </div>
  <div class="grid">
    <div class="card">
      <div class="icon">🧣</div>
      <h3>Poncho Cusqueño</h3>
      <p>100% fibra de alpaca natural</p>
      <div class="price">S/ 120.00</div>
    </div>
    <div class="card">
      <div class="icon">🧶</div>
      <h3>Chullo Andino</h3>
      <p>Tejido fino tradicional</p>
      <div class="price">S/ 35.00</div>
    </div>
    <div class="card">
      <div class="icon">🏺</div>
      <h3>Torito de Pucará</h3>
      <p>Cerámica artesanal vidriada</p>
      <div class="price">S/ 45.00</div>
    </div>
    <div class="card">
      <div class="icon">🎭</div>
      <h3>Retablo Ayacuchano</h3>
      <p>Pieza artística hecha a mano</p>
      <div class="price">S/ 85.00</div>
    </div>
  </div>
  <footer>
    <p><strong>MercadoAndino v1 - instancia: ${hostname}</strong></p>
    <p>Estado del cluster: <span class="status">● Activo y Saludable</span> | Bucket S3: <code>${bucket}</code></p>
  </footer>
</body>
</html>`);
});

app.listen(port, () => console.log(`Servidor activo en el puerto ${port}`));
