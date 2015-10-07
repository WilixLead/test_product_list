/**
 * Created by Aloyan Dmitry on 06.10.2015
 */
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var user = require('./models/user.js');

module.exports = function(app){
    passport.use(new localStrategy(
        function(username, password, done) {
            user.findOne({ username: username }, function(err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));

    app.post('/login', passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
    }));
}