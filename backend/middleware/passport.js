const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

const User = mongoose.model('users');
const {jwtSecret} = require('../config/config');
const errorHandler = require('../utils/errorHandler');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
};

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try {
                const user = await User.findById(payload.userId, 'login, role, id');

                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }

            } catch (e) {
                errorHandler(res, e);
            }
        })
    )
}
