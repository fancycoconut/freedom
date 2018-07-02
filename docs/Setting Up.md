# Setting Up
This document goes through a list of steps to setup react, webpack, babel etc..

## Webpack
We need to add webpack to your project.

v4.11.1 was used at the time of this document.
```
// Using npm
npm install --save-dev webpack
npm install --save-dev webpack@<version>

// Using yarn
yarn add webpack --dev
yarn add webpack@<version> --dev

// V4 onwards requires the CLI
npm install --save-dev webpack-cli
yarn add webpack-cli --dev
```

Next add a webpack configuration file: webpack.config.js
```javascript
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
```

https://medium.com/a-beginners-guide-for-webpack-2/webpack-loaders-css-and-sass-2cc0079b5b3a

## React
https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658
https://www.robinwieruch.de/minimal-react-webpack-babel-setup/

## Jasmine & Karma
https://medium.com/@grrowl/testing-react-with-jasmine-and-karma-using-webpack-and-babel-18fc268f066a

## MongoDB
https://gist.github.com/subfuzion/9630872
https://alicoding.com/how-to-start-mongodb-automatically-when-starting-your-mac-os-x/
Auto launch mongodb on startup on mac:
ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgents
 brew services list | grep mongodb
$ brew services start mongodb
$ brew services stop mongodb

https://medium.com/of-all-things-tech-progress/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359

http://mongoosejs.com/docs/
https://stackoverflow.com/questions/7948789/mongodb-mongod-complains-that-there-is-no-data-db-folder