# find-config-up

[![Powered by Immowelt](https://img.shields.io/badge/powered%20by-immowelt-yellow.svg?colorB=ffb200)](https://stackshare.io/immowelt-group/)
[![Greenkeeper badge](https://badges.greenkeeper.io/ImmoweltGroup/find-config-up.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/ImmoweltGroup/find-config-up.svg?branch=master)](https://travis-ci.org/ImmoweltGroup/find-config-up)
[![Dependency Status](https://david-dm.org/ImmoweltGroup/find-config-up.svg)](https://david-dm.org/ImmoweltGroup/find-config-up)
[![devDependency Status](https://david-dm.org/ImmoweltGroup/find-config-up/dev-status.svg)](https://david-dm.org/ImmoweltGroup/find-config-up#info=devDependencies&view=table)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Resolve your packages configuration from a `.*rc` or `package.json` file with a given property up the file-tree.

## Install

```sh
$ npm install find-config-up
```

or

```sh
$ yarn add find-config-up
```

## API
#### Getting started
```js
const findConfigUp = require('find-config-up');

(async function() {
  //
  // Tries to find a `.myfancyrc` up the tree and merges it with the defaults,
  // if no file was found it falls back to resolving a `package.json` up the tree
  // with a `my-fancy-package` property defined.
  //
  // If none of the above was successful, the defaults will be returned.
  //
  const config = await findConfigUp({
    rawConfigFileName: '.myfancyrc',
    packageJsonProperty: 'my-fancy-package',
    defaults: {}
  });

  console.log(config);
})()
```

#### Options
##### `rawConfigFileName: string` (Optional)
The file name of your preffered `.rc` file, e.g. `.babelrc`, which should be resolved up the file-system tree.

##### `packageJsonProperty: string`
The property name which should be resolved in the `package.json` files up the file-system tree.

##### `defaults: Object`
The defaults which will be recursively merged with the results from the file-system.

##### `cwd: string` (Optional)
A custom current working directory, falls back to `process.cwd()`.

## Contributing
See the `CONTRIBUTING.md` file at the root of the repository.

## Licensing
See the `LICENSE` file at the root of the repository.
