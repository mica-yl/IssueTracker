/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const { promisify } = require('util');
const log = require('debug')('app:start-hook');// TODO rename.

const { patchRequire } = require('fs-monkey');
const solidFs = require('fs');
const { createFsFromVolume, Volume } = require('memfs');
const { ufs: hybridFs } = require('unionfs');

const tempVol = new Volume();
const tempFs = createFsFromVolume(tempVol);

const softVol = new Volume();
const softFs = createFsFromVolume(softVol);

hybridFs
  .use(solidFs)
  .use(softFs);

const webpackServerConfig = require('../webpack.server-config');
// const webpackClientConfig = require('../webpack.config');

const argWatch = (() => {
  const arg = process.argv[2];
  return ['-w', '--watch'].some((flag) => flag === arg);
})();

const serverCompiler = webpack(webpackServerConfig);
// serverCompiler.outputFileSystem = softFs;
serverCompiler.outputFileSystem = tempFs;

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

/**
 * @typedef {ReturnType<once>} onceCallBack 
 * @param {Function} f 
 * @returns 
 */
function once(f) {
  let lock = true;
  const fn = () => {
    if (lock) {
      lock = false;
      f();
    }
  };
  fn.restart = () => { lock = true; };
  return fn;
}
function runApp() {
  console.log('=====App====');
  // eslint-disable-next-line import/no-unresolved,global-require
  require('../dist/server.bundle.js');// in softFs
}
/**
 * 
 * @param {webpack.Stats} stats
 * @param {Function|onceCallBack} requireApp
 */
function dispatchApp(stats, requireApp) {
  log('build has errors ? %o', stats.hasErrors());
  if (!stats.hasErrors()) {
    log('dispaching app and requiring.');
    softVol.fromJSON(tempVol.toJSON());
    log('new volume files: %O', Object.keys(tempVol.toJSON()));
    patchRequire(hybridFs);
    requireApp();
  }
  // else {
  //   requireApp.restart();
  // }
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
/**
 * 
 * @param { webpack.Compiler & webpack.MultiCompiler} compiler
 * @param {onceCallBack} requireApp
 */
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
