const express = require("express");
const Item = require("../models/Item");

const router = express.Router();

router.get("/", async (req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json(items);
});

router.get("/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
});

router.post("/", async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: "name is required" });

  const newItem = await Item.create({ name, description });
  res.status(201).json(newItem);
});

router.put("/:id", async (req, res) => {
  const { name, description } = req.body;

  const updated = await Item.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true, runValidators: true }
  );

  if (!updated) return res.status(404).json({ message: "Item not found" });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const deleted = await Item.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Item not found" });

  res.json({ message: "Deleted successfully", id: deleted._id });
});

module.exports = router;
