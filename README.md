# nvm-auto-switch

A npm to auto switch nvm current based on package.json engines

## Installation

This package is not currently published to npm, but you can still use it by installing it directly from GitHub:

`npm install git+https://github.com/athul/nvm-auto-switch.git`

## Usage

In order to use this package, you'll need to include a "node" property in the "engines" object of your project's `package.json` file. For example:

jsonCopy code

`{   "name": "my-node-project",   "version": "1.0.0",   "engines": {     "node": "14.x"   },   "dependencies": {     "nvm-auto-switch": "git+https://github.com/athul/nvm-auto-switch.git"   } }`

Then, in your project's root directory, simply require the `nvm-auto-switch` package:

`require('nvm-auto-switch')();`

This will read the "node" version from your project's `package.json` file and use nvm to switch to that version of node.

## API

### loadNodeVersionFromPackageJson()

This function reads the "node" version from your project's `package.json` file and uses nvm to switch to that version of node. It also prints warnings to the console if the version is not compatible with nvm or has special characters.

`const loadNodeVersionFromPackageJson = require('nvm-auto-switch');  loadNodeVersionFromPackageJson();`

## Tests

Run the tests using the following command:

`npm test`

## Dependencies

This package depends on the following npm modules:

-   chalk
-   fs
-   semver

## License

MIT
