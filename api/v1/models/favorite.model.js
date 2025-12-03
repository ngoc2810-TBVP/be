const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ]
    },
    {
        timestamps: true
    }
);

const Favorite = mongoose.model("Favorite", favoriteSchema, "favorites");

module.exports = Favorite;
