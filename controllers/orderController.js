const Order = require("../models/Order");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      status: "success",
      message: "Orders retrieved successfully",
      data: { orders },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        status: "fail",
        data: { message: "Order not found" },
      });
    }
    res.status(200).json({
      status: "success",
      message: `Order with id ${req.params.id} retrieved successfully`,
      data: { order },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: { order },
    });
  } catch (error) {
    res.status(409).json({
      status: "fail",
      message: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({
        status: "fail",
        data: { message: "Order not found" },
      });
    }
    res.status(200).json({
      status: "success",
      order: "Order deleted successfully",
      data: { order },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({
        status: "fail",
        data: { message: "Order not found" },
      });
    }
    res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
      data: { updatedOrder },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  deleteOrder,
  getOrderById,
  updateOrderStatus,
};
