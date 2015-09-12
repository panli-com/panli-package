var React = require('react');
var LoginApp = require('./login/login.jsx');

var mainCom = React.render(
        React.createElement(RegistApp, null),
    document.getElementById('app')
)