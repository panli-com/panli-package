/**
 * Created by Administrator on 2015/9/14.
 */
var React = require('react');
var LoginApp = require('./login.js');
var RegisterApp = require('./register.js');

var mainCom = React.render(
    <LoginApp />,
    document.getElementById('app')
)