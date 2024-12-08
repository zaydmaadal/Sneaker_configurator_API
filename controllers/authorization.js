const jwt = require("jsonwebtoken");
const config = require("../config/orderConfig");
const User = require("../models/User");
const bcrypt = require("bcrypt");


const changePassword = (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      status: "error",
      message: "Alle velden zijn verplicht.",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      status: "error",
      message: "Het nieuwe wachtwoord en de bevestiging komen niet overeen.",
    });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({
      status: "error",
      message: "Geen toegang, token ontbreekt.",
    });
  }

  jwt.verify(token, config.passwordToken || process.env.passwordToken, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "error",
        message: "Ongeldig token.",
      });
    }

    User.findById(decoded.userId)
      .then(user => {
        if (!user) {
          return res.status(404).json({
            status: "error",
            message: "Gebruiker niet gevonden.",
          });
        }

        bcrypt.compare(oldPassword, user.password, (err, result) => {
          if (err) {
            return res.status(500).json({
              status: "error",
              message: "Er ging iets mis tijdens de validatie van het wachtwoord.",
            });
          }

          if (!result) {
            return res.status(401).json({
              status: "error",
              message: "Oud wachtwoord is onjuist.",
            });
          }

          bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            if (err) {
              return res.status(500).json({
                status: "error",
                message: "Er ging iets mis bij het hashen van het nieuwe wachtwoord.",
              });
            }

            user.password = hashedPassword;
            user.save()
              .then(result => {
                res.status(200).json({
                  status: "success",
                  message: "Wachtwoord succesvol gewijzigd.",
                });
              })
              .catch(err => {
                res.status(500).json({
                  status: "error",
                  message: "Er ging iets mis bij het opslaan van het nieuwe wachtwoord.",
                });
              });
          });
        });
      })
      .catch(err => {
        res.status(500).json({
          status: "error",
          message: "Er ging iets mis bij het ophalen van de gebruiker.",
        });
      });
  });
};


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

module.exports = { login, signup, changePassword };
