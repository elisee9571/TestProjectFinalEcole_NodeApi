const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const productCtrl = require("../controllers/product");
const auth = require("../middleware/auth");

router.post("/", auth, productCtrl.createProduct);
router.put("/:id", auth, productCtrl.updateProduct);
router.delete("/:id", auth, productCtrl.deleteProduct);
router.get("/:id", productCtrl.getOneProduct);

router.get("/", productCtrl.getAllProduct);
router.post("/findProducts", productCtrl.findProducts);

module.exports = router;
