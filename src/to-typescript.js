/* eslint-disable camelcase */
/* eslint-disable no-console */
const { spawn } = require('child_process');
const { readdir } = require('fs');

const [from, to] = ['tsx', 'jsx']
  .reverse();

readdir('.', (err, files) => {
  if (!err) {
    files.filter((fname) => fname.endsWith(`.${from}`))
      .map((f) => f.split('.'))
      .map(([name, ext]) => [`${name}.${ext}`, `${name}.${to}`])
      .forEach(function gitRename([oldName, newName]) {
        console.log(`git mv ${oldName} ${newName}`);
        // const rename = spawn('git', ['mv', oldName, newName], { detached: true });
        // // console.log(rename.spawnargs);
        // rename.on('close', (code) => {
        //   if (code === 0) {
        //     console.log(`${oldName} -> ${newName}`);
        //   } else {
        //     console.error(`[exit] ${oldName} -> ${newName} : ${code}`);
        //   }
        // });
      });
  } else {
    console.error(err);
  }
});
