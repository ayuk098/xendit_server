require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());


const XENDIT_KEY = process.env.XENDIT_SECRET_KEY;

// Tes server
app.get("/", (req, res) => {
  res.send("✅ Server Xendit siap dan berjalan di Vercel!");
});


app.post("/create-invoice", async (req, res) => {
  try {
    const { external_id, amount, payer_email, description } = req.body;

    // Panggil API Xendit
    const response = await axios.post(
      "https://api.xendit.co/v2/invoices",
      {
        external_id,
        amount,
        payer_email,
        description,
        // Redirect ke domain vercel kamu
        success_redirect_url: "https://xendit-server.vercel.app/success",
        failure_redirect_url: "https://xendit-server.vercel.app/failed",
      },
      {
        auth: {
          username: XENDIT_KEY,
          password: "",
        },
      }
    );

    // Kirim balik data invoice ke frontend
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Gagal membuat invoice" });
  }
});


app.get("/success", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Pembayaran Berhasil</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            text-align: center;
            margin-top: 80px;
            color: #2d3436;
          }
          h1 { color: #00b894; }
          button {
            background: #00b894;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <h1>✅ Pembayaran Berhasil!</h1>
        <p>Terima kasih! Transaksi kamu telah dikonfirmasi.</p>
        <button onclick="window.close()">Tutup Halaman</button>
      </body>
    </html>
  `);
});

app.get("/failed", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Pembayaran Gagal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            text-align: center;
            margin-top: 80px;
            color: #2d3436;
          }
          h1 { color: #d63031; }
          button {
            background: #d63031;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <h1>❌ Pembayaran Gagal</h1>
        <p>Terjadi kesalahan saat memproses transaksi.</p>
        <button onclick="window.close()">Tutup Halaman</button>
      </body>
    </html>
  `);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});

module.exports = app;
