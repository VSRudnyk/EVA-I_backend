const passport = require('passport');
const { Strategy } = require('passport-google-oauth2');
const { User } = require('../models/users.model');

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
  process.env;

const googleParams = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL,
  passReqToCallback: true,
};

const googleCallback = async (
  req,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    const { id, email, displayName } = profile;
    const state = req.query.state || '';

    if (state.includes('https://revelint.io/widget')) {
      return done(null, {
        email,
        id,
        name: displayName,
        fromGoogle: true,
        // Add any other needed profile data
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return done(null, user);
    }
    const newUser = await User.create({
      email,
      authType: 'google',
      name: displayName,
    });
    done(null, newUser);
  } catch (error) {
    done(error);
  }
};

const googleStrategy = new Strategy(googleParams, googleCallback);

passport.use('google', googleStrategy);

module.exports = passport;
