const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  info: {
    type: Object,
  },

  content: {
    type: String,
  },
  ratings: {
    type: Number,
    default: 0,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  original_price: {
    type: Number,
    required: true,
  },
  current_price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  Image: {
    public_id: {
      type: String,
      //   required: true,
    },
    url: {
      type: String,
    },
  },
  sizes: {
    type: [String],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  categories: {
    type: String,
    required: true,
  },
  colors: {
    type: [String],
    required: true,
  },
  purchased: Number,

  reviews: [reviewSchema],
});

const ProductsModal = mongoose.model("Product", productSchema);

module.exports = { ProductsModal };
