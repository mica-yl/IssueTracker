/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const { promisify } = require('util');

const solidFs = require('fs');
const { fs: softFs } = require('memfs');
const { patchRequire } = require('fs-monkey');
const { ufs: hybridFs } = require('unionfs');

const webpackServerConfig = require('../webpack.server-config');
// const webpackClientConfig = require('../webpack.config');

const argWatch = (() => {
  const arg = process.argv[2];
  return ['-w', '--watch'].some((flag) => flag === arg);
})();

const serverCompiler = webpack(webpackServerConfig);
serverCompiler.outputFileSystem = softFs;

// const clientCompiler = webpack(webpackClientConfig);
// clientCompiler.outputFileSystem = softFs;

const ls = (path, fs = softFs) => {
  fs.readdir(path, (err, files) => {
    if (err) {
      return console.error(err);
    }
    files.forEach((file) => {
      console.log(file);
    });
  });
};
const print = (stats) =>
  (stats ? console.log(stats.toString({ colors: true })) : console.log(stats));

function once(f) {
  let lock = true;
  return () => {
    if (lock) {
      lock = false;
      f();
    }
  };
}
function runApp() {
  console.log('=====App====');
  // eslint-disable-next-line import/no-unresolved,global-require
  require('../dist/server.bundle.js');// in softFs
}

function dispatchApp(stats, requireApp) {
  if (!stats.hasErrors()) {
    hybridFs
      .use(solidFs)
      .use(softFs);
    patchRequire(hybridFs);
    requireApp();
  }
}

function run(compiler, requireApp) {
  promisify(compiler.run.bind(compiler))()
    .then((/** @type {webpack.Stats} */ stats) => {
      promisify(compiler.close.bind(compiler))()
        .catch((closeErr) => (closeErr ? console.log('Compiler Close Error : ', closeErr) : 0));

      print(stats);
      (async () => dispatchApp(stats, requireApp))();
    }).catch(console.error);
}

function watch(compiler, requireApp) {
  const requireAppOnce = once(requireApp);
  compiler.watch(
    {},
    (err, watchStats) => {
      print(watchStats);
      dispatchApp(watchStats, requireAppOnce);
    },
  );
}
if (argWatch) {
  watch(serverCompiler, runApp);
} else {
  run(serverCompiler, runApp);
}

// module.exports = { watch, run };
/* sources
https://webpack.js.org/api/node/
https://github.com/streamich/fs-monkey/blob/master/docs/api/patchRequire.md
https://github.com/streamich/unionfs
https://github.com/streamich/memfs/blob/HEAD/docs/reference.md
*/
