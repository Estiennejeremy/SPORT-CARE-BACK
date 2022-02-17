const LocalStrategy = require ('passport-local').Strategy;
const bcrypt = require ('bcryptjs');
const user_model = require('./src/models/users.model');


function initialize (passport) {
    var user
    const authenticateUser = async (email, password, done) => {
         try {
            user = await user_model.findOne({email: email})
            if (user == null) {
                return done(null, false, { message: 'No user with that email' })
            }
          } catch (e) {
            return done (e)
          }
        
        try {
            if (await bcrypt.compare( password, user.password )) {
                return done (null, user)
            } else {
                return done (null, false, { message: 'Invalid password' })
            }
        } catch (e) {
            return done (e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
      return done(null, user)
    })
}


module.exports = initialize