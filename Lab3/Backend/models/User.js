const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    firstName: String,
    lastName: String,
    description: String,
    imageUrl: String,
    hash: String,
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.methods.setPassword = function (password) {
    const saltRounds = 10;
    this.hash = bcrypt.hashSync(password, saltRounds);
};

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.hash);
};

UserSchema.methods.generateToken = function () {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: Math.trunc(exp.getTime() / 1000),
    }, secret);
};

UserSchema.methods.toJSON = function () {
    return {
        username: this.username,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        description: this.description,
        imageUrl: this.imageUrl,
        token: this.generateToken()
    };
};

module.exports = mongoose.model('User', UserSchema);
