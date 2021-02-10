const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get("/signup", (req, res, next) => {
    res.render("signup");
})

router.post('/signup', (req, res) => {

    const { username, password } = req.body;
    console.log(username, password);

    if (password.length < 8) {
      return res.render('signup', { message: 'Your password has to be at least 8 characters!' });
    }
    if (username === '') {
      res.render('signup', { message: 'Username cannot be empty!' });
      return
    }
    User.findOne({ username: username })
      .then(userFromDB => {
        if (userFromDB !== null) {
          res.render('signup', { message: 'Username is already taken. Please choose a different one!' });
        } 
        else {
          const salt = bcrypt.genSaltSync();
          const hash = bcrypt.hashSync(password, salt)

          User.create({ username: username, password: hash })
            .then(userFromDB => {
              console.log(userFromDB);
              res.redirect('/');
            })
        }
      })
      .catch(err => {
        console.log("Error while finding the user in the database: ", err);
      })
  })

module.exports = router;