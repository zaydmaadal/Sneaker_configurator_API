const express = require("express");
const router = express.Router();
const authorization = require("../../../controllers/authorization");

router.post("/login", authorization.login);
router.post("/signup", authorization.signup);

module.exports = router;
