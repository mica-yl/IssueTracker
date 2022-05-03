const webpack = require('webpack');
const { Volume, createFsFromVolume } = require('memfs');
const { patchRequire } = require('fs-monkey');
const webpackConfig = require('../webpack.server-config');
const { ufs: hybridFs } = require('unionfs');
const SolidFs = require('fs');


const vol = new Volume();
const fs = createFsFromVolume(vol);
const ls = (path, fs = fs) => {
  fs.readdir(path, (err, files) => {
    if (err) {
      return console.error(err);
    }
    files.forEach(file => {
      console.log(file);
    });
  });
}

hybridFs.use(fs).use(SolidFs);

const compiler = webpack(webpackConfig);
compiler.outputFileSystem = fs;
compiler.run((err, stats) => {
  if (err) {
    console.log('Failed !');
    console.error(err);
    return;
  }
  compiler.close((closeErr) => closeErr ? console.log('Compiler Close Error : ', closeErr) : 0);
  // ls('.', ufs);
  // patchRequire(fs);
  console.log(stats.toString({ colors: true }));
  patchRequire(hybridFs);
  console.log('=====App====');
  require('../dist/server.bundle.js');
});