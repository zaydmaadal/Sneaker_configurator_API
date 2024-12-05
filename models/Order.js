const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  outsideColor: {
    type: String,
    required: true,
  },
    lacesColor: {
    type: String,
    required: true,
  },
  soleColor: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
