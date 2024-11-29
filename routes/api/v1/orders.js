const express = require("express");
const router = express.Router();
const orderController = require("../../../controllers/orderController");
const checkAuth = require("../../../middleware/check-auth");

router.get("/", orderController.getAllOrders);

router.get("/:id", orderController.getOrderById);

router.post("/", orderController.createOrder);

router.delete("/:id", checkAuth, orderController.deleteOrder);

router.put("/:id", checkAuth, orderController.updateOrderStatus);

module.exports = router;
