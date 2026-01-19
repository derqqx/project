require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const itemsRouter = require("./routes/items");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/items", itemsRouter);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start:", err.message);
    process.exit(1);
  });
