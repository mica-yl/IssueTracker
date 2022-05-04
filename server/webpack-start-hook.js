/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const { promisify } = require('util');

const solidFs = require('fs');
const { fs: softFs } = require('memfs');
const { patchRequire } = require('fs-monkey');
const { ufs: hybridFs } = require('unionfs');

const webpackConfig = require('../webpack.server-config');

const compiler = webpack(webpackConfig);
compiler.outputFileSystem = softFs;

const ls = (path, fs = softFs) => {
  fs.readdir(path, (err, files) => {
    if (err) {
      return console.error(err);
    }
    files.forEach(file => {
      console.log(file);
    });
  });
};
// /**
//  * @type {webpack.Stats}
//  *  */
// const stats = await promisify(compiler.run.bind(compiler))();
// const exit = await promisify(compiler.close.bind(compiler))();
// console.log(stats.toString({ colors: true }));
// if (!stats.hasErrors()) {
//   hybridFs
//     .use(SolidFs)
//     .use(softFs);
//   patchRequire(hybridFs);
//   console.log('=====App====');
//   require('../dist/server.bundle.js');
// }

promisify(compiler.run.bind(compiler))()
  .then((/** @type {webpack.Stats} */ stats) => {
    promisify(compiler.close.bind(compiler))()
      .catch((closeErr) => (closeErr ? console.log('Compiler Close Error : ', closeErr) : 0));

    console.log(stats.toString({ colors: true }));

    if (!stats.hasErrors()) {
      hybridFs
        .use(solidFs)
        .use(softFs);
      patchRequire(hybridFs);
      console.log('=====App====');
      // eslint-disable-next-line import/no-unresolved,global-require
      require('../dist/server.bundle.js');// in softFs
    }
  }).catch(console.error);

/* sources
https://webpack.js.org/api/node/
https://github.com/streamich/fs-monkey/blob/master/docs/api/patchRequire.md
https://github.com/streamich/unionfs
https://github.com/streamich/memfs/blob/HEAD/docs/reference.md
*/
