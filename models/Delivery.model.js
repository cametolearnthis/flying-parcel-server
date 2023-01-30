const { Schema, model, default: mongoose } = require("mongoose");

const deliverySchema = new Schema(
    {
        delivererName: {
            type: String,
            required: [true, "Each delivery route must be assigned to a deliverer"]
        },
        date: {
            type: Date,
            required: true,
            default: Date.now()
        },
        shift: {
            type: String,
            required: true,
            enum: [
                "Morning",
                "Evening"
            ]
        },
        items: [{type: mongoose.Schema.Types.ObjectId, ref: "Item"}],
        warnings: String,
        creator:  {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'},
    }
);

module.exports = model("Delivery", deliverySchema);

