var express = require('express')
    , router = express.Router()
    , passport = require('../../auth/passport')
    , User = require('../../models/user');

router.route('/')
    .post(passport.isAPIAuthenticated, function (req, res, next) {
        User.findOne({ username: req.body.username }, { require: false })
        .then(function (user) {
            // check to see if theres already a user with that email
            if (user) {
                res.send('User already exists');
            } else {

                // if there is no user with that email
                // create the user
                User.create({ username: req.body.username, password: req.body.password, email: req.body.email, user_type_id: req.body.typeID })
                .then(function (user) {
                    res.send(user.toJSON());
                })
                .catch(function (err) {
                    res.send(err.message);
                });
            }
        })
        .catch(function (err) {
            res.send(err.message);
        });
  })
  .get(passport.isAPIAuthenticated, function (req, res, next) {
      User.findAll()
      .then(function (users) {
          res.json(users.toJSON());
      })
      .catch(function (err) {
          res.send(err);
      });
  });

// Create endpoint handlers for /users/:id
router.route('/:id')
  .get(passport.isAPIAuthenticated, function (req, res, next) {
      User.findById(req.params.id, {withRelated: 'type'})      
        .then(function (user) {
            res.json(user.toJSON());
        })
        .catch(User.NotFoundError, function () {
            res.send('User not found');
        })
        .catch(function (err) {
            res.send(err.message);
        });
  })
  .put(passport.isAPIAuthenticated, function (req, res, next) {
      User.update(req.body, { id: req.params.id })
        .then(function (user) {
            res.json(user.toJSON());
        })
        .catch(function (err) {
            res.send(err.message);
        });
  })
  .delete(passport.isAPIAuthenticated, function (req, res, next) {
      User.destroy({ id: req.params.id })
        .then(function (user) {
            res.json('User with id: ' + req.params.id + ' was deleted');
        })
        .catch(function (err) {
            res.send(err.message);
        });
  });

module.exports = router;