const express = require("express");
const mongoose = require("mongoose");
const Item = require("../models/Item");

const router = express.Router();

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/items — retrieve all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/items/:id — retrieve item by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    return res.status(200).json(item);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/items — create a new item
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    // basic validation
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "name is required" });
    }

    const created = await Item.create({
      name: name.trim(),
      description: typeof description === "string" ? description : ""
    });

    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/items/:id — full update (replace fields)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    // For PUT we expect full object (at least required fields)
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ message: "name is required for full update" });
    }

    const updated = await Item.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: typeof description === "string" ? description : ""
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Item not found" });

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/items/:id — partial update (only provided fields)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ message: "name must be a non-empty string" });
      }
      updates.name = name.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({ message: "description must be a string" });
      }
      updates.description = description;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updated = await Item.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ message: "Item not found" });

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/items/:id — delete an item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const deleted = await Item.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });

    // 204: no content
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
