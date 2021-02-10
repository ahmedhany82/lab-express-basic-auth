const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get("/login", (req, res, next) => {
    res.render("login");
  });
  
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username: username })
      .then(userFromDB => {
        if (userFromDB === null) {
          res.render('login', { message: 'Invalid credentials' });
          return;
        }
        if (bcrypt.compareSync(password, userFromDB.password)) {
          req.session.user = userFromDB;
          res.redirect('/profile');
        } else {
          res.render('login', { message: 'Invalid credentials' });
        }
      })
})


module.exports = router;