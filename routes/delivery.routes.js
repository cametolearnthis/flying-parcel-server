const router = require("express").Router();
const mongoose = require("mongoose");

const Delivery = require("../models/Delivery.model");
const Item = require("../models/Item.model");


router.post('/deliveries', (req, res, next) => {
    const { date, shift } = req.body;

    Delivery.create({ date, shift, items: [] })
        .then(response => res.json(response))
        .catch((err) => {
            console.log("error creating new delivery", err);
            res.status(500).json(err);
          });
})



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