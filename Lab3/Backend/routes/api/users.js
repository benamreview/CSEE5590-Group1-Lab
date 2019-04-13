const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('../../config/passport');
const User = require('../../models/User');
const auth = require('../auth');

router.get('/user', auth.required, (req, res, next) => {
    User.findById(req.user.id).then(user => {
        if (!user) {
            return res.sendStatus(401);
        }

        return res.json({user: user.toJSON()});
    }).catch(next);
});

router.put('/user', auth.required, (req, res, next) => {
    User.findById(req.user.id).then(user => {
        if (!user) {
            return res.sendStatus(401);
        }

        // only update fields that were actually passed...
        if (typeof req.body.user.username !== 'undefined') {
            user.username = req.body.user.username;
        }
        if (typeof req.body.user.email !== 'undefined') {
            user.email = req.body.user.email;
        }
        if (typeof req.body.user.bio !== 'undefined') {
            user.bio = req.body.user.bio;
        }
        if (typeof req.body.user.image !== 'undefined') {
            user.image = req.body.user.image;
        }
        if (typeof req.body.user.password !== 'undefined') {
            user.setPassword(req.body.user.password);
        }

        return user.save().then(() => res.json({user: user.toJSON()}));
    }).catch(next);
});

router.post('/users/login', (req, res, next) => {
    console.log('req.body', req.body);
    if (!req.body.username) {
        return res.status(422).json({errors: {username: "can't be blank"}});
    }

    if (!req.body.password) {
        return res.status(422).json({errors: {password: "can't be blank"}});
    }

    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (user) {
            user.token = user.generateToken();
            return res.json({user: user.toJSON()});
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});

router.post('/users', (req, res, next) => {
    const user = new User();

    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);

    user.save().then(() => res.json({user: user.toJSON()})).catch(next);
});

module.exports = router;
