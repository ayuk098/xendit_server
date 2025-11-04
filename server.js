require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const XENDIT_KEY = process.env.XENDIT_SECRET_KEY;

app.get("/", (req, res) => {
  res.send("✅ Server Xendit siap dan berjalan di Vercel!");
});

app.post("/create-invoice", async (req, res) => {
  try {
    const { external_id, amount, payer_email, description } = req.body;

    const response = await axios.post(
      "https://api.xendit.co/v2/invoices",
      {
        external_id,
        amount,
        payer_email,
        description,
        success_redirect_url: "https://xendit-server.vercel.app/success", 
        failure_redirect_url: "https://xendit-server.vercel.app/failed"
      },
      {
        auth: {
          username: XENDIT_KEY,
          password: ""
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(" Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Gagal membuat invoice" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});

module.exports = app;
