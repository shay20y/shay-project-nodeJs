const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
    name: String,
    info: String,
    img_url: String,
    categories: Object,
    price: Number,
    date_created: {
        type: Date, default: Date.now
    },
    user_id: String,
})
exports.GameModel = mongoose.model("games", schema)

exports.validateGame = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(400).required(),
        info: Joi.string().min(2).max(400).required(),
        img_url: Joi.string().min(2).max(500).allow(null, ""),
        categories: Joi.Object().min(1).max(400).required(),
        price: Joi.number().min(1).max(9999).required(),
    })
    return joiSchema.validate(_reqBody)
}
