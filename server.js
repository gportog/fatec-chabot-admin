require('dotenv').config();
const express = require('express'),
    api = require('./api'),
    statusCode = require('./api/lib/httpStatusCodes'),
    bodyParser = require('body-parser'),
    path = require('path');
    morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api', api);

app.get('*', (req, res) => {
    res.status(statusCode.NOT_FOUND)
        .json({ ERROR: "Oops... I don't have this page!" })
})

app.listen(process.env.PORT, () =>
    console.log(`Server listening at port ${process.env.PORT}`)
);
