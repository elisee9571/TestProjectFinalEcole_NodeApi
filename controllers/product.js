const Product = require("../models/Product");

exports.createProduct = (req, res, next) => {
  const product = Product({
    imageUrl: req.body.imageUrl,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    userId: req.body.userId,
  });

  product
    .save()
    .then(() => res.status(201).json({ message: "Product Created!" })) // Created
    .catch((err) => res.status(400).json({ err })); // Bad Request
};

exports.updateProduct = (req, res, next) => {
  Product.updateOne(
    { _id: req.params.id },
    {
      _id: req.params.id,
      imageUrl: req.body.imageUrl,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      userId: req.body.userId,
    }
  )
    .then(() => res.status(200).json({ message: "Product Updated!" })) // Success
    .catch((err) => res.status(400).json({ err })); // Bad Request
};

exports.deleteProduct = (req, res, next) => {
  Product.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Product Deleted!" })) // Success
    .catch((err) => res.status(400).json({ err })); // Bad Request
};

exports.getOneProduct = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => res.status(200).json({ product })) // Success
    .catch((err) => res.status(404).json({ err })); // Not Found
};

exports.getAllProduct = (req, res, next) => {
  Product.find()
    .then((products) => res.status(200).json({ products })) // Success
    .catch((err) => res.status(400).json({ err })); // Bad Request
};
