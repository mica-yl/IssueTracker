const config=require('./.babelrc.json');
require("@babel/register")(config);
require('./server.js');