const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Delivery = require("../models/Delivery.model");
const Item = require("../models/Item.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");




//POST A DELIVERY
router.post("/deliveries", isAuthenticated, (req, res, next) => {
  // const { delivererName, date, shift, creator } = req.body;

  const deliveryDetails = {
    date: req.body.date,
    shift: req.body.shift,
    items: req.body.items,

  }

  if (req.payload.isManager) {
    deliveryDetails.delivererName = req.body.delivererName
    deliveryDetails.creator = req.body.creator
  } else {
    deliveryDetails.delivererName = req.payload.name
    deliveryDetails.creator = req.payload._id
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

  
  if (req.payload.isManager === true) {
    Delivery.find()
    .populate("items")
    .then((allDeliveries) => res.json(allDeliveries))
    .catch((err) => {
      console.log("error getting the deliveries", err);
      res.status(500).json(err);
    });
  } else {
    Delivery.find({creator: userId})
    .populate("items")
    .then((allDeliveries) => res.json(allDeliveries))
    .catch((err) => {
      console.log("error getting the deliveries", err);
      res.status(500).json(err);
    });
  }



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

//GET LIST OF USERS
router.get("/users", isAuthenticated, (req, res, next) => {

  User.find({ isManager: false }).select('_id, name')
    .then((users) => res.status(200).json(users))

    .catch((err) => {
      console.log("error getting users from DB", err);
      res.status(500).json(err);
    });
});

//GET LIST OF USERS & SINGLE DELIVERY
router.get("/users/:deliveryId", isAuthenticated, (req, res, next) => {
  const { deliveryId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

let users

  User.find({ isManager: false }).select('_id, name')
    .then((usersList) => {
      users = usersList
      return Delivery.findById(deliveryId)
      .populate("items")
    }) 
  
    .then((deliveryDetails) => res.status(200).json( { deliveryDetails, users } ))

    .catch((err) => {
      console.log("error getting delivery from DB", err);
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
