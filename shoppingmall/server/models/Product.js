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

// searchTerm이 걸리고 싶은 요소들 설정
productSchema.index(
  {
    title: "text",
    description: "text",
  },
  {
    weights: {
      // title을 더 중점적으로 검색
      title: 5,
      description: 1,
    },
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
