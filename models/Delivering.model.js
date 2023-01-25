const { Schema, model, default: mongoose } = require("mongoose");

const deliveringSchema = new Schema(
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
        items: [{type: mongoose.Schema.Types.ObjectId, ref: "Item",
        required: true
        }],
        warnings: String
    }
);

module.exports = model("Delivering", deliveringSchema);

