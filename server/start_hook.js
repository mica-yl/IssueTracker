const register = require('@babel/register');
const config = require('./.babelrc.json');

const custom = {
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
};
register({ ...config, ...custom });
require('./server.ts');
