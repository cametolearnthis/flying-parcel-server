const router = require("express").Router();
const mongoose = require("mongoose");

const Item = require("../models/Item.model");
const Delivery = require("../models/Delivery.model");

//POST A NEW ITEM
router.post("/items", (req, res, next) => {
  const { product, name, address, code, delivered, deliveryId } = req.body;

  Item.create({ product, name, address, code, delivered, delivery: deliveryId })
    .then((newItem) => {
      return Delivery.findByIdAndUpdate(deliveryId, {
        $push: { items: newItem._id },
      });
    })
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("error creating new item", err);
      res.status(500).json(err);
    });
});

//GET ALL THE ITEMS
router.get("/items", (req, res, next) => {
  Item.find()
    .populate("delivery")
    .then((allItems) => res.json(allItems))
    .catch((err) => {
      console.log("error getting the items", err);
      res.status(500).json(err);
    });
});
module.exports = router;

//GET A SINGLE ITEM
router.get("/items/:itemId", (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Item.findById(itemId)
    .populate("delivery")
    .then((item) => res.status(200).json(item))
    .catch((err) => {
      console.log("error getting item details from DB", err);
      res.status(500).json(err);
    });
});

//PUT SINGLE ITEM
router.put("/items/:itemId", (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Item.findByIdAndUpdate(itemId, req.body, { new: true })
    .then((updatedItem) => res.json(updatedItem))
    .catch((err) => {
      console.log("error updating item", err);
      res.status(500).json(err);
    });
});

//DELETE ITEM
router.delete("/items/:itemId", (req, res, next) => {
  const { itemId } = req.params;


  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  
  Item.findByIdAndRemove(itemId)
    .populate("delivery")
    .then((deliveryId) => {
        return Delivery.findByIdAndUpdate({ deliveryId: req.body._id }, { $pull: { items: deliveryId }})
    })
    .then((response) => res.json({ message: `Item with ${itemId} was removed.`, deletedItem }))
    .catch((err) => {
      console.log("error removing item", err);
      res.status(500).json(err);
    });
});

module.exports = router;
