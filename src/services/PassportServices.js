import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import User from '../models/User';
import config from '../config/config';

// Create local strategy
const localOptions = { usernameField: 'phone', session: false };
const localLogin = new LocalStrategy(localOptions, (phone, password, done) => {
  // Verify this phone and password, call done with the user
  // if it is the correct phone and password
  // otherwise, call done with false

  // User.findOne({ phone, isActive: true }, (errFindUser, user) => {
  User.findOne({ phone }, (errFindUser, user) => {
    if (errFindUser) {
      return done(errFindUser);
    }
    if (!user) {
      const error = new Error('Incorrect phone or password!');
      error.name = 'IncorrectCredentials';
      return done(error);
    }

    // compare passwords - is `password` equal to user.password?
    return user.comparePassword(password, (errCompare, isMatch) => {
      if (errCompare) {
        return done(errCompare);
      }
      if (!isMatch) {
        // return done(null, false);
        const error = new Error('Incorrect phone or password!');
        error.name = 'IncorrectCredentials';
        return done(error);
      }
      if (!user.isActive) {
        // return done(null, false);
        const error = new Error("User doesn't active, ask administrator!");
        error.name = 'IncorrectCredentials';
        return done(error);
      }

      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.jwtSecret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  // User.findById(payload.sub, (err, user) => {
  User.findById(payload._id, (err, user) => {
    if (err) {
      return done(err, false);
    }

    if (user) {
      if (user.isActive) {
        done(null, user);
      } else {
        done(null, false);
      }
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
