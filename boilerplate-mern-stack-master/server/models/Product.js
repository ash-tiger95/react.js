const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      maxLength: 50,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    continents: {
      type: Number,
      default: 1,
    },
    images: {
      type: Array,
      default: [],
    },
    sold: {
      type: Number,
      maxLength: 100,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
