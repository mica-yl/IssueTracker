import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import HelloWorld from './HelloWorld';

const contentNode = document.getElementById('root');

ReactDOM.render(<HelloWorld />, contentNode);

if (module.hot) {
  module.hot.accept();
}
