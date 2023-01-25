const { Schema, model } = require("mongoose");

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
  },
  name: {
    String,
    required: [true, "You must provide a name"],
  },
  address: {
    String,
    required: [true, "You must provide an address"],
  },

  code: {
    String,
    required: [true, "You must provide the postal code"],
    trim: true,
    
  }
});

module.exports = model("Item", itemSchema);
