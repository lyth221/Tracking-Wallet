module.exports = (app, http) => {

    // Get information from html forms
    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    // modify builtin js obj prototype
    require('./lib/string')(app);
    
};