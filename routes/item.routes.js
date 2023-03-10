const router = require("express").Router();
const mongoose = require("mongoose");
const Item = require("../models/Item.model");
const Delivery = require("../models/Delivery.model");
const isManager = require("../middleware/isManager");
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  
  res.json({ fileUrl: req.file.path });
});

//POST A NEW ITEM
router.post("/items", (req, res, next) => {
  const { product, name, address, code, deliveryId, status, imageUrl } = req.body;
  // const { creator } = req.default
  Item.create({ product, name, address, code, delivery: deliveryId, status, imageUrl })
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
router.get("/items", isAuthenticated, isManager, (req, res, next) => {
  Item.find()
    .populate("delivery")
    .then((allItems) => res.json(allItems))
    .catch((err) => {
      console.log("error getting the items", err);
      res.status(500).json(err);
    });
});


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
  // const delivery = req.params.delivery;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Item.findByIdAndRemove(itemId)
    .then((deletedItem) => {
      return Delivery.findByIdAndUpdate(deletedItem.delivery, {
        $pull: { items: deletedItem._id },
      });

    })
    .then((updatedDelivery) =>
      res.json({ message: `Item with ${itemId} was removed.`, updatedDelivery })
    )
    .catch((err) => {
      console.log("error removing item", err);
      res.status(500).json(err);
    });
});

module.exports = router;
