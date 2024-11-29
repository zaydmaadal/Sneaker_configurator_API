const jwt = require("jsonwebtoken");
const config = require("../config/orderConfig");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const login = (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(404).json({
          status: "error",
          message: "Deze gebruiker bestaat niet. Maak een account aan.",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Er ging iets mis, probeer opnieuw.",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              username: user[0].username,
              userId: user[0]._id,
            },
            config.passwordToken || proces.env.passwordToken,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            status: "success",
            message: "Auth successful",
            token: token,
          });
        }
        res.status(401).json({
          status: "error",
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Er ging iets mis, probeer opnieuw.",
      });
    });
};

const signup = (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          status: "error",
          message: "Deze gebruiker bestaat al. Log in met je account.",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              status: "error",
              message: "Er ging iets mis, probeer opnieuw.",
            });
          } else {
            const user = new User({
              username: req.body.username,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  status: "success",
                  message: "Gebruiker succesvol aangemaakt.",
                  data: {
                    username: result.username,
                  },
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  status: "error",
                  message: "Er ging iets mis, probeer opnieuw.",
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Er ging iets mis, probeer opnieuw.",
      });
    });
};

module.exports = { login, signup };
