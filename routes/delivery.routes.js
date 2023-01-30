const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Delivery = require("../models/Delivery.model");
const Item = require("../models/Item.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const isCreator = require("../middleware/isCreator");



//POST A DELIVERY
router.post("/deliveries", isAuthenticated, (req, res, next) => {
  // const { delivererName, date, shift, creator } = req.body;

  const deliveryDetails = {
    delivererName: req.body.delivererName,
    date: req.body.date,
    shift: req.body.shift,
    items: req.body.items,
    creator: req.payload._id
  }

  Delivery.create(deliveryDetails)
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("error creating new delivery", err);
      res.status(500).json(err);
    });
});

//GET ALL THE DELIVERIES
router.get("/deliveries", isAuthenticated, (req, res, next) => {

  const userId = req.payload._id;

  

  Delivery.find({creator: userId})
    .populate("items")
    .then((allDeliveries) => res.json(allDeliveries))
    .catch((err) => {
      console.log("error getting the deliveries", err);
      res.status(500).json(err);
    });
});

//GET A SINGLE DELIVERY
router.get("/deliveries/:deliveryId", isAuthenticated, (req, res, next) => {
  const { deliveryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Delivery.findById(deliveryId)
    .populate("items")
    .then((delivery) => res.status(200).json(delivery))
    .catch((err) => {
      console.log("error getting delivery details from DB", err);
      res.status(500).json(err);
    });
});

//PUT SINGLE DELIVERY
router.put("/deliveries/:deliveryId", (req, res, next) => {
  const { deliveryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Delivery.findByIdAndUpdate(deliveryId, req.body, { new: true })
    .then((updatedDelivery) => res.json(updatedDelivery))
    .catch((err) => {
      console.log("error updating item", err);
      res.status(500).json(err);
    });
});


//DELETE A DELIVERY
router.delete("/deliveries/:deliveryId", (req, res, next) => {
  const { deliveryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Delivery.findByIdAndRemove(deliveryId)
    .then((deletedDelivery) => {
      return Item.deleteMany({ _id: { $in: deletedDelivery.items } });
    })
    .then(() =>
      res.json({
        message: `Delivery with id ${deliveryId} & all associated tasks were removed successfully.`,
      })
    )
    .catch((err) => {
      console.log("error deleting delivery", err);
      res.status(500).json(err);
    });
});
module.exports = router;
