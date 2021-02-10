const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
    const user = req.session.user
    res.render('index', { user: user});
});

const loginCheck = () => {
    return (req, res, next) => {
        if(req.session.user) {
            next();
        } else {
            res.redirect('/login');
        }
    }
}

// protected route - can only be accessed by a logged in user
router.get('/main', loginCheck(), (req, res) => {
    res.render('main');
  })

router.get('/private', loginCheck(), (req, res) => {
    res.render('private');
  })


module.exports = router;
