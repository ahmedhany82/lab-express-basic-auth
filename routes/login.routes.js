const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
// const index = require('./index.routes');


router.get("/login",  (req, res, next) => {
    res.render("login");
  });
  
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if ((username === '') || (password === '')) {
        res.render('login', { message: 'A username and a password are required to login. They cannot be empty!' });
        return
    }
    User.findOne({ username: username })
      .then(userFromDB => {
        if (userFromDB === null) {
          res.render('login', { message: 'Invalid credentials' });
          return;
        }
        if (bcrypt.compareSync(password, userFromDB.password)) {
          req.session.user = userFromDB;
          res.redirect('/main');
        } else {
          res.render('login', { message: 'Invalid credentials' });
        }
      })
})


router.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  })
})

module.exports = router;