const { Schema, model, default: mongoose } = require("mongoose");

const deliverySchema = new Schema(
    {
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
        warnings: String
    }
);

module.exports = model("Delivery", deliverySchema);

