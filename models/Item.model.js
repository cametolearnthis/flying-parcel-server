const { Schema, model, default: mongoose } = require("mongoose");

const itemSchema = new Schema({
  product: {
    type: String,
    enum: [
      "Registered mail",
      "Small parcel",
      "Medium parcel",
      "Big parcel",
      "Tube",
      "Urgent parcel",
      "Bureaufax",
      "Collecting",
    ], 
    required: [true, "Please select the item"]
  },
  name: {
    type: String,
    required: [true, "You must provide a name"]
  },
  address: {
    type: String,
    required: [true, "You must provide an address"]
  },
  code: {
    type: String,
    required: [true, "You must provide the postal code"],
    trim: true
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',
    required: [true, "This item must be assigned to a delivery route"],
  },
  status: {
    type: String,
    enum: [
      "delivered",
      "not-delivered",
      "pending"
    ], 
    default: "pending",
  },
  imageUrl: String
});

module.exports = model("Item", itemSchema);
