const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsletterController");
router.post("/subscribe", newsletterController.newsletterSubscribe);
module.exports = router;
