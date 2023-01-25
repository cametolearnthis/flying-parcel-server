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


module.exports = router;