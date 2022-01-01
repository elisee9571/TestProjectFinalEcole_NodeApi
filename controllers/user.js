const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const User = require("../models/User");
const Product = require("../models/Product");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = User({
        speudo: req.body.speudo,
        email: req.body.email,
        password: hash,
      });

      user
        .save()
        .then(() => res.status(201).json({ message: "User Created!" })) // Created
        .catch((err) => res.status(400).json({ err })); // Bad Request
    })
    .catch((err) => res.status(500).json({ err })); // Server
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "User Not Found!" }); // Unauthorized
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Password Inexact!" }); // Unauthorized
          }

          req.session.user = user;
          req.session.token = jwt.sign(
            { userId: req.session.user._id },
            "TOKEN_SECRET",
            {
              expiresIn: "24h",
            }
          );

          res.status(200).json({
            userId: req.session.user._id,
            token: req.session.token,
          }); // Success
        })
        .catch((err) => res.status(500).json({ err })); // Server
    })
    .catch((err) => res.status(500).json({ err })); // Server
};

exports.getProfil = (req, res, next) => {
  User.findOne({ _id: req.session.user._id })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "User Not Found!" }); // Unauthorized
      }
      Product.find({ userId: new RegExp(req.session.user._id, "i") })
        .then((products) => {
          res.status(200).json({
            user: {
              _id: user._id,
              speudo: user.speudo,
              email: user.email,
            },
            products: products,
          });
        })
        .catch((err) => res.status(400).json({ err })); //Bad Request
    }) //Success
    .catch((err) => res.status(400).json({ err })); //Bad Request
};

// To improve for sercurity users on then()
exports.findUsers = (req, res, next) => {
  User.find({ speudo: new RegExp(req.body.speudo, "i") })
    .then((users) => res.status(200).json({ users })) // Success
    .catch((err) => res.status(400).json({ err })); // Bad Request
};

exports.updateProfil = (req, res, next) => {
  User.updateOne(
    { _id: req.session.user._id },
    {
      _id: req.body.user._id,
      speudo: req.body.speudo,
      email: req.body.email,
    }
  )
    .then(() => res.status(200).json({ message: "Profil Updated!" })) // Success
    .catch((err) => res.status(400).json({ err })); // Bad Request
};

exports.newPassword = (req, res, next) => {
  User.findOne({ _id: req.session.user._id })
    .then(() => {
      bcrypt
        .hash(req.body.newPassword, 10)
        .then((hash) => {
          User.updateOne(
            { _id: req.session.user._id },
            {
              _id: req.body.user._id,
              password: hash,
            }
          )
            .then(() => res.status(200).json({ message: "Password Updated!" })) // Success
            .catch((err) => res.status(400).json({ err })); // Bad Request
        })
        .catch((err) => res.status(500).json({ err })); // Server
    })
    .catch((err) => res.status(400).json({ err })); // Bad Request
};

exports.updatePassword = (req, res, next) => {
  User.findOne({ _id: req.session.user._id })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "User Not Found!" }); // Unauthorized
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Password Inexact!" }); // Unauthorized
          }
          User.findOne({ _id: req.session.user._id })
            .then(() => {
              bcrypt
                .hash(req.body.newPassword, 10)
                .then((hash) => {
                  User.updateOne(
                    { _id: req.session.user._id },
                    {
                      _id: req.body.user._id,
                      password: hash,
                    }
                  )
                    .then(() =>
                      res.status(200).json({ message: "Password Updated!" })
                    ) // Success
                    .catch((err) => res.status(400).json({ err })); // Bad Request
                })
                .catch((err) => res.status(500).json({ err })); // Server
            })
            .catch((err) => res.status(400).json({ err })); // Bad Request
        })
        .catch((err) => res.status(400).json({ err })); // Bad Request
    })
    .catch((err) => res.status(400).json({ err })); // Bad Request
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (!err) {
      return res.status(200).json({ message: "Logout!" }); // Success
    } else {
      return res.status(400).json({ err }); // Bad Request
    }
  });
};
