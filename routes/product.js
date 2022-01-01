const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const productCtrl = require("../controllers/product");
const auth = require("../middleware/auth");

router.post("/", auth, productCtrl.createProduct);
router.put("/:id", auth, productCtrl.updateProduct);
router.delete("/:id", auth, productCtrl.deleteProduct);
router.get("/:id", auth, productCtrl.getOneProduct);
router.get("/", auth, productCtrl.getAllProduct);
router.post("/findProducts", auth, productCtrl.findProducts);

module.exports = router;
