require('dotenv').config();
const express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    api = require('./api'),
    statusCode = require('./api/lib/httpStatusCodes'),
    bodyParser = require('body-parser'),
    path = require('path'),
    morgan = require('morgan'),
    Cloudant = require('@cloudant/cloudant'),
    crypto = require('crypto'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

const user = process.env.CLOUDANT_USER,
    pw = process.env.CLOUDANT_PW,
    client = Cloudant({ account: user, password: pw }),
    database = client.use('chatbot_admins');

const app = express();

let sessionConfiguration = {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 3600000 }
};

if (process.env.ENVIRONMENT !== 'prod')
    sessionConfiguration.cookie.secure = false;

app.use(session(sessionConfiguration));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

passport.use(new LocalStrategy(
    (username, password, done) => {
        password = crypto.createHash('md5').update(password).digest('hex');
        database.find({
            selector: {
                email: username
            }
        }, (err, result) => {
            if (err) return done(null, false, {
                message: 'Error while authenticating.'
            });
            if (result.docs.length === 1) {
                if (!result.docs[0].active)
                    return done(null, false, {
                        message: 'User does not have an active account.'
                        });
                if (result.docs[0].password !== password)
                    return done(null, false, {
                        message: 'Invalid password.'
                        });
                return done(null, result.docs[0]);
            }
            return done(null, false, {
                message: 'Invalid credentials.'
            });
        })
    }
));

passport.serializeUser(function (user, done) {
    return done(null, user._id);
});

passport.deserializeUser(function (userId, done) {
    database.get(userId, (err, user) => {
        if (err) return done(err, null);
        return done(null, user);
    });
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.post('/login',
    passport.authenticate('local'),
    function (req, res) {
        let attachments = Object.keys(req.user._attachments);
        res.cookie('_id', req.user._id);
        res.cookie('username', req.user.user.name);
        res.cookie('surname', req.user.user.surname);
        res.cookie('photo', attachments[0]);
        return res.status(statusCode.OK)
            .json({ message: 'Login completed successfully' });
    }
);

app.post('/logout', function (req, res) {
    res.cookie('_id', '');
    res.cookie('username', '');
    res.cookie('surname', '');
    res.cookie('photo', '');
    req.logout();
    return res.status(statusCode.OK)
        .json({ message: 'Logout completed successfully' });
});

app.use('/api', AuthenticatedorNot, api);

app.get('*', (req, res) => {
    return res.status(statusCode.NOT_FOUND)
        .json({ ERROR: `Oops... I don't have this page!` });
})

app.listen(process.env.PORT, () =>
    console.log(`Server listening at port ${process.env.PORT}`)
);

function AuthenticatedorNot(req, res, next) {
    if (req.url === '/v1/admins/reset') return next();
    if (req.url === '/v1/admins/' && req.method === 'POST') return next();
    if (req.isAuthenticated()) return next();
    res.cookie('_id', '');
    res.cookie('username', '');
    res.cookie('surname', '');
    return res.status(statusCode.UNAUTHORIZED)
        .json({ message: 'You must log in to use the app' });
}
